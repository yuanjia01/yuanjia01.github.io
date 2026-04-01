---
layout: post
title: "Run Your Own Cloud..."
date: 2026-04-01
tags: [GreenCloud, nodes, self-hosted, infrastructure, computing]
---

One of the questions that has come up repeatedly as GreenCloud has evolved is a simple one:

"Can I run GreenCloud workloads on hardware that I own?"

The answer is YES!. 

The work to support that is now in a shape that is worth explaining properly.

That includes a practical route for people working on Windows hardware too. GreenCloud can run under WSL2 when WSL2 is configured as a Linux container host.

This first post is intentionally high level. I want to introduce the direction of travel, explain what has changed in broad terms, and set out why it matters. After this, I'll follow up with three more 'practical' updates covering how to add your own 'node' to GreenCloud and how the model works in practice.

It is important to say clearly what changed and what did not.

GreenCloud did not need a brand new node registration system to get here. We already had the ability for nodes to register with the platform, authenticate themselves, and connect back to the dispatcher. 

That part of the plumbing has existed for a long time.

What was missing was a reliable way for the platform to understand ownership and execution intent. In other words, when a customer wants a workload to run on their own capacity, how do we make sure that it is routed to their node, and not just dropped somewhere into a broader pool?

That is the real piece of work that has now landed.

The first step was on the function side. Functions gained explicit execution modes so that a workload can say what kind of capacity it expects. Instead of the older, looser split between privileged and non-privileged execution, the platform now works with a clearer model: `Privileged`, `Self Hosted`, and `Shared`.

Before going any further, it is worth saying plainly what each of those means:

- `Self Hosted` means the workload is intended to run on nodes owned and provided by the customer.
- `Privileged` means the workload runs on trusted GreenCloud-managed capacity used for privileged or platform-controlled work.
- `Shared` means the workload runs on general shared GreenCloud nodes rather than on a customer-owned node.

That might sound like a small internal change, but it matters a great deal. 

It means that software can be marked as intended for customer-owned infrastructure rather than relying on broader assumptions.

The next step was to carry that intent all the way through task creation. 

When a task is created, the platform now passes the function's execution mode together with the owning user ID into the dispatcher. That owner information is what makes the model useful in practice. Without it, "Self Hosted" would still risk meaning little more than "not part of the main pool."

With that information in place, scheduling becomes much more precise.

If some GreenCloud software is marked as `Self Hosted`, the scheduler now looks for nodes owned by that specific user and marked for self-hosted execution. If none are available, the scheduler does not silently fall back to shared or privileged capacity. That behaviour is deliberate. If a workload is meant to run on your infrastructure, it should run on your infrastructure or not run at all.

That gives us a much cleaner promise to make to customers.

Later work refined the model even further by introducing explicit node kinds throughout the system. Nodes are now treated as `Privileged`, `Self Hosted`, or `Shared` in a more formal way, both in the wire format and in persistence. That makes node creation, validation, and matching much easier to reason about and much less dependent on legacy flags and implied behaviour.

We also took care not to break older nodes in the process. Backwards compatibility matters when you are evolving infrastructure software, so legacy capability fields are still understood and older records can still be normalised into the newer model as they reconnect and subscribe.

For users, the outcome is straightforward.

GreenCloud is moving toward a model where you can contribute your own capacity and have the platform target it intentionally. That is useful if you want stronger control over where work runs, tighter alignment with your own security expectations, or a practical route to making use of compute you already own.

It also helps us separate concerns much more cleanly. Shared platform capacity remains shared. Privileged system work remains privileged. Customer-owned execution can now be treated as a first-class option in its own right.

This is an important step for where GreenCloud is heading next.

We have been thinking hard about cost, security, performance, and ownership. Allowing people to run their own nodes on GreenCloud is not just a feature for the sake of it. It is part of a broader belief that modern compute should be more flexible, more transparent, and less dependent on the idea that every workload belongs in somebody else's cloud.

Since launching GreenCloud and proving that the technology works, we spent twelve months looking for funding without success. We are still continuing anyway.

That is one of the strengths of GreenCloud. It is able to keep moving forward without needing to shut down simply because investment did not arrive. Unlike many start ups that become entirely dependent on the next funding round, GreenCloud can continue to build, continue to support customers, and continue to prove its value in the real world.

There is more to do, of course. The hard work in infrastructure is never just the first version of a feature, but getting the model right so that everything built on top of it behaves predictably.

This change gives us that foundation.

In the next three updates I will break the subject down properly:

1. Creating a Green Cloud account
2. Adding a Node to your account
3. Executing on your own Node

For now, this post is the introduction. 

GreenCloud can now treat customer-owned nodes as a deliberate execution target, that opens up a genuinely exciting next stage for the platform. 

This work has not only strengthened GreenCloud itself, it has also pushed our thinking forward and create the new product, GreenCloud-Business more on that in due course ;) 
