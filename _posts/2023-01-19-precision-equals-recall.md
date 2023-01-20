---
layout: post
title: "When precision equals recall"
published: true
mathjax: true
draft: true
---

For many of you who are machine learning practitioners, I know precision and
recall are metrics you know like the back of your hand for evaluating
classification models. I thought I'd run across most things related to
precision and recall, but I recently encountered something surprising and
counterintuitive (at least to me!)

Here's the statement:

> When the precision and recall of a classifier are equal, the predicted
> prevalence equals the ground truth prevalence.

"What?" you say.

Let the nerd in me explain.

## Why is this weird?

Let's say you're building a spam classifier: for each email, the output is a
binary label $$X = 1$$ if the message is spam, and $$X = 0$$ otherwise. While a
customer cares about whether each email is correctly classified as spam or not,
someone maintaining the system may want to know what proportion of emails are
spam, meaning $$\mathbb{E}(X)$$.

The usual way of quantifying the performance of a classifier is to compute the
confusion matrix. Here's a concrete example:

|                 | $$X = 1$$ | $$X = 0$$ |
| --------------- | --------- | --------- |
| $$\hat{X} = 1$$ | TP = 30   | FP = 20   |
| $$\hat{X} = 0$$ | FN = 10   | TN = 40   |

And here are the usual formulas for the precision $$p$$ and recall $$r$$:

$$
\begin{align}
  p &= \frac{\mathrm{TP}}{\mathrm{TP} + \mathrm{FP}} \\
  r &= \frac{\mathrm{TP}}{\mathrm{TP} + \mathrm{FN}}
\end{align}
$$

But there's another way to look at the confusion matrix: in terms of
probabilities. Divide the confusion matrix by the total number of elements $$N
= 100$$ and think of the entries (which now lie in $$[0, 1]$$) as
probabilities:

|                 | $$X = 1$$                       | $$X = 0$$                       |
| --------------- | ------------------------------- | ------------------------------- |
| $$\hat{X} = 1$$ | $$P(X = 1, \hat{X} = 1) = 0.3$$ | $$P(X = 0, \hat{X} = 1) = 0.2$$ |
| $$\hat{X} = 0$$ | $$P(X = 1, \hat{X} = 0) = 0.1$$ | $$P(X = 0, \hat{X} = 0) = 0.4$$ |

From this viewpoint, precision and recall are:

$$
\begin{align}
  p &= \frac{P(X = 1, \hat{X} = 1)}{P(\hat{X} = 1)} \\
  r &= \frac{P(X = 1, \hat{X} = 1)}{P(X = 1)}
\end{align}
$$

Divide one by the other, and we arrive at the relationship we seek:

$$ \frac{r}{p} = \frac{P(\hat{X} = 1)}{P(X = 1)} = \frac{\mathbb{E}(\hat{X})}{\mathbb{E}(X)} $$

or

$$ \mathbb{E}(\hat{X}) = \frac{r}{p} \cdot \mathbb{E}(X) $$

In the case where the precision and recall are equal, we indeed find that the
prevalences are equal: $$ \mathbb{E}(\hat{X}) = \mathbb{E}(X) $$. $$\square$$


## Mathematical derivation

For the mathematically-minded, the quantities we want to compute are the ground
truth prevalence

$$ \mathbb{E}(X) = \sum_X X P(X) = P(X = 1) $$

and the predicted prevalence

$$ \mathbb{E}(\hat{X}) = P(\hat{X} = 1) $$

We want to show that if the precision $$p$$ equals the recall $$r$$, then
$$\mathbb{E}(\hat{X}) = \mathbb{E}(X)$$.

To start, we write out precision and recall in terms of probabilities:

$$
\begin{align}
  p &= P(X = 1 \vert \hat{X} = 1) \\
  r &= P(\hat{X} = 1 \vert X = 1)
\end{align}
$$

The goal is to relate $$P(\hat{X} = 1)$$ to $$P(X = 1)$$ in terms of $$p$$ and
$$r$$. Expand out the predicted prevalence:

$$ P(\hat{X} = 1) = P(\hat{X} = 1, X = 1) + P(\hat{X} = 1, X = 0) $$

The first term can be written in terms of the recall:

$$ P(\hat{X} = 1, X = 1) = P(\hat{X} = 1 \vert X = 1) P(X = 1) = r \, P(X = 1) $$

The second term can be written in terms of the precision:

$$
\begin{split}
  P(\hat{X} = 1, X = 0) &= P(X = 0 \vert \hat{X} = 1) P(\hat{X} = 1) \\
  &= \left(1 - P(X = 1 \vert \hat{X} = 1)\right) P(\hat{X} = 1) \\
  &= (1 - p) P(\hat{X} = 1)
\end{split}
$$

All the multi-variable probabilities drop out in the equation for the predicted
prevalence:

$$ P(\hat{X} = 1) = r \, P(X = 1) + (1 - p) P(\hat{X} = 1) $$

Gathering like terms, the final relation becomes

$$ P(\hat{X} = 1) = \frac{r}{p} \, P(X = 1) $$

When $$p = r$$, we get $$P(\hat{X} = 1) = P(X = 1)$$, or equivalently,
$$\mathbb{E}(\hat{X}) = \mathbb{E}(X)$$. $$\square$$