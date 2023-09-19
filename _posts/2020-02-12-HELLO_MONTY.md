---
layout: post
title: I'll take door number three Monty; would you like to switch?
Description: Simple Probability Simulation
---

Starting in 1963 a popular game show called Let's Make a Deal aired with host Monty Hall. The general premise is that there are three doors from which the contestant can choose from. Behind one of the doors is a lavish prize while the other two have zonks or joke prizes. After the contestant chooses their door Monty reveals a zonk behind one of the other two doors and allows the contestant to switch doors if they think the other one contains the prize. The question is should the contestant switch doors? Did their odds increase when the other door was eliminated? Is it all just random?

Well... yes, they should switch. In this post I am going to walk you through the math of this unintuitive solution, and then perform a simulation to show you it's not witchcraft.

### Probability, I hardly know her
First we need to make a few assumptions about how prizes are distributed amongst the doors. We'll assume each game is independent of the other and each door has an equal chance of having the prize behind it. Furthermore let's denote events that door 1 contains the prize, door 2 contains the prize, and door 3 contains the prize as A, B, and C. Thats is:
    $A = Door 1 contains the prize\\
     B = Door 2 contains the prize\\
     C = Door 3 contains the prize\\
     P(A) = P(B) = P(C) = \frac{1}{3}$