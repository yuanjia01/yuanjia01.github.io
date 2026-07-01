---
layout: default
title: Home
---

<section class="hero">
    <span class="zh"><h1>成都七中北美校友会</h1></span>
    <span class="en"><h1>CDQZ Alumni Association<br>North America</h1></span>
    <p class="zh">墨池洗砚，四海同心。</p>
    <p class="en">Inkstone washed in the Mo Pool, hearts united across the world.</p>
    <a href="#join" class="cta-button zh">加入我们</a>
    <a href="#join" class="cta-button en">Join Us</a>
    <a href="http://lu.ma/cdqz" class="cta-button">活动日历 / Events</a>
</section>

<div class="features">
    <div class="feature-card">
        <img src="/assets/images/network.svg" alt="Network Icon">
        <h3 class="zh">校友网络</h3>
        <h3 class="en">Alumni Network</h3>
        <p class="zh">建立强大的校友联系网络，促进职业发展与合作机会</p>
        <p class="en">Build a strong alumni network to foster career development and collaboration</p>
    </div>
    
    <div class="feature-card">
        <img src="/assets/images/events.svg" alt="Events Icon">
        <h3><a href="http://lu.ma/cdqz"><span class="zh">活动聚会</span><span class="en">Events</span></a></h3>
        <p class="zh">定期组织线上线下活动，重温校园情谊</p>
        <p class="en">Regular online and in-person events to reconnect with fellow alumni</p>
    </div>
    
    <div class="feature-card">
        <img src="/assets/images/mentorship.svg" alt="Mentorship Icon">
        <h3 class="zh">经验分享</h3>
        <h3 class="en">Mentorship</h3>
        <p class="zh">资深校友经验分享，帮助新生代校友发展</p>
        <p class="en">Senior alumni sharing insights to support the next generation</p>
    </div>

    <div class="feature-card">
        <img src="/assets/images/network.svg" alt="Donation Icon">
        <h3><a href="/donation"><span class="zh">支持校友会</span><span class="en">Support Us</span></a></h3>
        <p class="zh">通过 Zelle 或公司配捐支持校友会运营，助力更多校友活动</p>
        <p class="en">Support our operations via Zelle or corporate matching to enable more alumni events</p>
    </div>

</div>

<section class="recent-posts">
    <div class="container">
        <h2 class="zh">校友活动</h2>
        <h2 class="en">Alumni Events</h2>
        <div class="posts-grid">
            <iframe
              src="https://lu.ma/embed/calendar/cal-T6Ukwd9haQqyPCA/events"
              width="100%"
              height="450"
              frameborder="0"
              style="border: 1px solid #bfcbda88; border-radius: 4px;"
              allowfullscreen=""
              aria-hidden="false"
              tabindex="0"
            ></iframe>
        </div>
        <div class="view-all">
            <a href="http://lu.ma/cdqz" class="cta-button-secondary zh">查看所有活动，订阅日历</a>
            <a href="http://lu.ma/cdqz" class="cta-button-secondary en">View All Events &amp; Subscribe</a>
        </div>
    </div>
</section>

<section class="recent-posts">
    <div class="container">
        <h2 class="zh">最新博文</h2>
        <h2 class="en">Latest Posts</h2>
        <div class="posts-grid">
            {% for post in site.posts limit:3 %}
            <div class="post-card">
                <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
                <div class="post-date">{{ post.date | date: "%Y年%m月%d日" }}</div>
                <div class="post-excerpt">
                    {{ post.excerpt | strip_html | truncatewords: 30 }}
                </div>
                <a href="{{ post.url | relative_url }}" class="read-more zh">阅读更多 →</a>
                <a href="{{ post.url | relative_url }}" class="read-more en">Read More →</a>
            </div>
            {% endfor %}
        </div>
        <div class="view-all">
            <a href="/blog" class="cta-button-secondary zh">查看所有文章</a>
            <a href="/blog" class="cta-button-secondary en">View All Posts</a>
        </div>
    </div>
</section>

<section id="join" class="join-section">
    <div class="container">
        <h2 class="zh">加入我们 - 请填写<a href="https://forms.gle/6FrMWwHEKqK4EcJn9" target="_blank">校友登记表</a></h2>
        <h2 class="en">Join Us — Fill out the <a href="https://forms.gle/6FrMWwHEKqK4EcJn9" target="_blank">Alumni Registration Form</a></h2>
        <div class="join-content">
            <div class="join-grid">
                <div class="contact-card">
                    <p class="note zh">我们会尽快通过微信或邮件联系您，请注意查收</p>
                    <p class="note en">We'll reach out via WeChat or email as soon as possible. Please check your inbox.</p>
                    <div class="faq-mini">
                        <p class="zh"><strong>常见问题：</strong></p>
                        <p class="en"><strong>FAQ:</strong></p>
                        <ul class="zh">
                            <li>校友会完全免费，不收取任何会费</li>
                            <li>欢迎所有在北美的七中校友（包括在读学生）</li>
                            <li>定期举办线上线下活动</li>
                        </ul>
                        <ul class="en">
                            <li>Membership is completely free — no dues required</li>
                            <li>Open to all CDQZ alumni in North America, including current students</li>
                            <li>Regular online and in-person events</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
