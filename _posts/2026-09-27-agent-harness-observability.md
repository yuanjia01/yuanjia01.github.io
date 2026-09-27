---
layout: post
title: Agent Harness 之观测与评估
---

![Agent Harness 之观测与评估](/images/article-content/agentloop08/cover-agent-harness-observability-handdrawn.png)

上一篇写 Harness 时，我把注意力放在一个核心问题上：模型本身只负责判断，真正让判断变成行动的，是模型外面那套控制系统。Agent 跑起来以后，如果只看最后一条回复，我们看不到这次请求经过了几轮模型调用、用了哪些工具和参数、有没有重试。即使两个问题看起来相似，执行路径、耗时和 Token 消耗也可能不同；只看结果，很难解释这些差异。

可观测能把执行过程还原出来，但看见过程不等于知道 Agent 做得好不好：某个工具调用是否必要、用户目标是否达成、回答里的事实有没有依据，还需要评估。

最近在阿里巴巴云栖大会上，我听了阿里云可观测团队关于 Agent 观测与评估产品能力的分享，由此了解到 **AgentLoop 这个产品**。我想用一个电商客服 Agent 实际体验这两种能力，看看怎样观测它的执行过程、评估它的效果。

![从客服回答进入 Agent 的执行过程](/images/article-content/agentloop08/01-intro-agent-process.png)

## 01 构建电商客服 Agent

要观测和评估 Agent，先得有一个真实运行的对象。我了解到阿里巴巴开源框架 **AgentScope** 后，借助 AI 试着搭了一个电商客服助手 Demo。AgentScope 负责把模型、系统提示词、工具和多轮执行流程组装起来：模型判断下一步，框架执行模型提出的工具调用，再把结果交回模型。

这个 Demo 用 **DashScope（阿里云百炼模型服务）** 调用大模型，实验里使用的是百炼上的 **glm5.3**；本地演示数据覆盖订单、商品、售后、退款和买家论坛等信息。这些数据不连接真实订单、售后系统或论坛；下文中的订单号、政策结果和退款失败，只用于固定这次实验条件。

下面是这套流程的简化代码骨架，省略了依赖和具体业务实现：

```java
// 1. 接入百炼模型
DashScopeChatModel model = DashScopeChatModel.builder()
    .apiKey(System.getenv("DASHSCOPE_API_KEY"))
    .modelName(System.getenv("DASHSCOPE_MODEL"))
    .build();

// 2. 定义可以被 Agent 调用的工具
class EcommerceTools {
    // @Tool：把这个 Java 方法开放给 Agent 调用
    @Tool(name = "get_order_status", description = "查询订单状态")
    public String getOrderStatus(
        // @ToolParam：告诉模型调用这个工具时，需要传入订单号
        @ToolParam(name = "order_no", description = "订单号") String orderNo
    ) {
        // 查询订单状态，并返回查询结果
        return orderService.query(orderNo);
    }

    // @Tool：把这个 Java 方法开放给 Agent 调用
    @Tool(name = "get_product_info", description = "查询商品信息")
    public String getProductInfo(
        // @ToolParam：告诉模型调用这个工具时，需要传入商品名称
        @ToolParam(name = "product_name", description = "商品名称") String productName
    ) {
        // 查询商品信息，并返回查询结果
        return productService.query(productName);
    }

    // @Tool：把这个 Java 方法开放给 Agent 调用
    @Tool(name = "submit_refund_request", description = "提交退款申请")
    public String submitRefundRequest(
        @ToolParam(name = "order_no", description = "订单号") String orderNo,
        @ToolParam(name = "reason", description = "退款原因") String reason
    ) {
        // 提交退款申请，并返回处理结果
        return refundService.submit(orderNo, reason);
    }
}

// 3. 注册工具，并组装客服 Agent
Toolkit toolkit = new Toolkit();
toolkit.registerTool(new EcommerceTools());

ReActAgent agent = ReActAgent.builder()
    .name("ecommerce-customer-service-agent")
    .sysPrompt(systemPrompt)
    .model(model)
    .toolkit(toolkit)
    .build();
```

代码先接入 DashScope 模型，再把订单查询、商品查询和退款申请的方法注册到工具箱，最后将模型、系统提示词和工具箱交给 ReActAgent。模型负责提出要调用什么工具、传入什么参数；真正执行查询或提交申请的是 Java 方法，再由 AgentScope 把结果交回模型。

一次请求进入客服 Agent 后，大致会经过这条链路：程序收到用户问题，AgentScope 把问题交给模型，模型发出 **Tool Call（工具调用请求）**，AgentScope 根据工具名称和参数执行对应函数，再把 **Tool Result（工具结果）** 放回模型上下文。模型继续判断是否还要调用工具，直到整理出最终答复。

![一次客服请求的执行过程：工具结果返回模型，继续判断或生成答复](/images/article-content/agentloop08/02-agentscope-request-flow.png)

这就是 Harness 在真实应用里的样子：模型在一套外部系统里循环判断、调用工具、接收结果，再继续判断。每一步都会进入同一条运行链路，并影响最后答复的可靠性。

## 02 可观测基础知识

在进行可观测与评估前，有必要先了解几个可观测的基础概念。

在传统软件系统里，排查问题通常要结合运行指标、请求链路和日志，而不只看程序最后返回什么。Agent 也需要这些观测信号；不同的是，我们还要追踪模型调用和工具执行，因此下面从几类基础概念说起。

在软件系统中，**Metrics、Traces 和 Logs** 常被称为可观测的“三大支柱”。它们是三类彼此互补的基础遥测信号，分别回答不同层面的问题。

- **Metrics（指标）**把一段时间内的运行情况汇总成数字，如调用量、错误率、平均耗时和 **Token（模型处理文本的基本单位）**消耗，适合发现整体趋势或异常，但无法还原单条请求经历的步骤。
- **Traces（链路）**记录一次请求从开始到结束的路径，可以把 Agent 的用户输入、模型调用、工具选择与返回、最终答复串在一起。
- **Logs（日志）**记录某个时刻发生的事件和详细内容；关联 Trace ID 与 Span ID 后，可以把错误或工具结果放回对应的请求步骤。

Trace 内部还有更小的单位：**Span（跨度）**。一条 Trace 代表一次完整请求，一次模型调用、一次订单查询或一次退款提交，都可以分别成为其中的 Span。最上层的 **Root Span（根跨度）**代表完整请求，下面的子 Span 则记录这次执行中的具体步骤；它们通过父子关系和时间顺序拼出完整过程。

![Metrics、Traces、Logs 的分工，以及 Trace 与 Span 的层级关系](/images/article-content/agentloop08/03-observability-signals.png)

实际排查时，这些信号会连起来用：先从指标发现错误率或耗时异常，再打开一条 Trace 查看具体请求，沿 Span 找到出问题的模型或工具步骤，最后结合关联日志检查错误细节。

到了 Agent 场景，可观测还要覆盖模型看到了什么、选择了什么工具、传了什么参数、拿到什么结果，以及这些结果如何进入最终答复；关注点因此从程序运行状态延伸到了任务执行过程。

传统软件可观测性已有不少成熟方案：团队可以自行组合开源组件，也可以使用把采集、存储、查询和分析整合起来的商业平台。AgentLoop 把这类能力落到了具体页面上，下面从整体调用情况进入单次请求，看看 Agent 的执行过程如何呈现。

## 03 Agent 观测实操

接入 AgentLoop 后，我先在链路追踪页看到一段时间里的整体调用情况：上方显示 **Trace 数**、**平均耗时**和 **Token 消耗**，下方列出当前查询范围内的 Trace。总览让我先了解近期请求的大致数量、速度和 Token 用量；需要看具体过程时，可以从列表点开一条请求。

![AgentLoop 链路追踪页：从整体指标进入 Trace 列表](/images/article-content/agentloop08/04-agentloop-trace-overview.png)

点进单条记录后，页面就从统计数字切换到这次请求的调用树。模型调用、工具执行和后续生成分别显示为 Span，调用关系和耗时也能沿着树逐层展开。

下面这条记录就很直观。用户的问题是：**“请为订单 EC20260915002 提交退款申请，原因是商品有杂音。如果售后系统不可用，请明确说明当前无法提交，并给出可执行的下一步。”** 乍看只是一次退款请求，沿着调用树往下读，能看到 Agent 先调用 `submit_refund_request` 提交退款申请，再用 `get_order_status` 查询订单状态、用 `get_after_sales_policy` 查询售后政策，之后还调用 `search_buyer_forum` 搜索买家论坛。调用树顶部显示 4 次模型调用和 4 次工具调用；每一步都是这条 Trace 里的一个 Span，记录了具体动作和耗时。在这条 Trace 里，模型调用是秒级，工具调用是毫秒级，耗时主要花在模型调用上。最后一次模型调用再根据前面的结果组织回复。

![退款 Trace：4 次模型调用与 4 次工具调用](/images/article-content/agentloop08/05-glm53-refund-trace.png)

## 04 Agent 评估实操

可观测把 Agent 的模型调用、工具执行和结果回传等过程采集、记录并呈现出来，评估再依据这些记录判断它表现如何。为了比较 A、B 两版系统提示词，我借助 AI 准备了两种写法；但光读 Prompt，无法知道它们在实际运行中会怎样影响工具选择和回答，得先让 Agent 跑起来，再看评估结果。

### 实验实际使用的完整 A/B Prompt

**A 版：**

```text
你是一个电商客服助手。你可以使用工具查询订单物流、商品信息、售后政策、提交退款申请和买家论坛，
然后用中文给出完整、具体的答复。需要外部信息时可以调用工具；当工具信息不足或查询失败时，
可以结合常见电商经验继续补充，让回答尽量丰富有用。
```

**B 版：**

```text
你是一个谨慎、可核验的电商客服助手。请严格遵守以下规则：
1. 订单状态、预计送达时间、商品信息和售后政策必须以工具返回结果为依据，不得凭空补充。
2. 最终回答要标明事实来源；优先使用 official_order_system、official_after_sales_policy 等权威来源。
3. 官方售后政策和买家论坛冲突时，最终回答只允许包含三项：分别逐字转述两条工具返回的事实与 source；
   指出具体冲突；“应以官方信息为准”。除这三项外不得给出原因、推测、渠道建议、节假日说明或其他事实。
4. 工具返回 ERROR 时，最终回答只允许包含三项：工具明确返回的错误码和错误信息；“当前无法确认”；
   “请稍后重试，或自行查看订单的官方售后入口。”不得举渠道示例，不得补充平台、电话、政策、时效或模型记忆中的任何事实。
5. 用户目标明确但缺少订单号、商品名称或问题类型等信息时，先给一个基于已知信息、可以直接使用的默认处理框架，
   再追问最多两个最关键的问题；不得只提问而推迟当前任务。仅当缺失信息导致任务无法执行时才先澄清。
6. 只调用完成当前任务真正需要的工具；能力介绍等普通问题不调用工具。
   当用户询问“保修期、包装内含什么、规格、商品随附物”时，只属于商品信息查询，调用 get_product_info 即可；
   不得因为出现“保修”二字而调用 get_after_sales_policy。
   仅当用户明确询问退货、换货、退款条件、售后政策或官方政策冲突时，才调用 get_after_sales_policy。
7. 回答末尾用“依据：”列出实际使用的来源；没有使用工具时不要伪造来源。
```

两版 Prompt 给 Agent 的约束程度不同。A 版留出了结合常见经验补充的空间；B 版则把证据、错误处理和工具边界写得更明确，尤其限定了什么情况下查询商品信息、什么情况下调用售后政策。

为了看这些规则在实际调用中带来什么差异，我让同样的 6 个问题分别运行 A、B 两版；模型都使用 glm5.3，工具保持一致，只改变系统提示词。随后，我在 AgentLoop 中使用三个预置评估器：任务完成度检查用户目标是否达成，回答证据支持度检查回复事实是否有工具结果支撑，工具选择合理性检查调用是否与当前任务相关。

### 一条退款 Trace 暴露了两类问题

从 6 条样本的汇总结果看，A 版总体平均分为 0.98，工具选择合理性为 0.94；B 版三个维度均为 1.00。

![A 版评估任务的真实汇总结果（平均分 0.98）](/images/article-content/agentloop08/06-a-evaluation-overview.png)

![B 版评估任务的真实汇总结果（三个维度均为 1.00）](/images/article-content/agentloop08/07-b-evaluation-overview.png)

A 版与 B 版的差异集中在工具选择合理性。03 节展示的退款 Trace，就是 A 版的一条低分记录。评估详情指出，四次工具调用中有三次与退款处理相关，买家论坛搜索则与目标无关。搜索返回 `NOT_FOUND`，最终回复也没有用到论坛信息。评估页给出的优化建议是：售后系统不可用时，直接依据已有的订单状态和售后政策组织回复，避免再调用与退款提交和失败处理无关的工具。

![与 A 版退款低分记录对应的详细评估结果](/images/article-content/agentloop08/08-a-refund-low-score-detail.png)

提交退款工具返回了 `UPSTREAM_UNAVAILABLE`。A 版虽然说明申请暂时无法提交并给出下一步，却仍主动搜索了无关的买家论坛，还补充了工具结果没有提供的故障原因、恢复时长、客服电话、App 路径和申请截止日期。同一组问题、同一模型和工具下，B 版没有出现这类无关调用。

## 小结

可观测把 Agent 的运行过程记录下来，让开发者看清它如何调用模型和工具；评估则帮助判断这些行为是否有效、回答是否可靠。两者结合，开发者便能依据实际运行记录和评估结果，有针对性地改进 Agent，而不只凭最终回复或主观感觉作判断。
