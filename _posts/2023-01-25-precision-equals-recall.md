---
layout: post
title: "When precision equals recall"
published: true
mathjax: true
---

For many of you who are machine learning practitioners, I know precision and
recall are metrics you know like the back of your hand for evaluating
classification models. I thought I'd run across most things related to
precision and recall, but I recently encountered something surprising (at least
to me!)

Here's the statement:

> When the precision and recall of a classifier are equal, the predicted
> prevalence equals the ground truth prevalence.

"What?" you say.

Let the statistics nerd in me explain.

## The problem setup: text spam classification

Let's say you've built a spam classifier for text messages. Digging around
the web, I found that every month, Americans send roughly 200 billion text
messages. What fraction of those are spam?

I happen to know the answer is about 5% (again, because you believe everything
you read on the internet).

However, your spam classifier isn't perfect. One way to report its performance
is to compute its confusion matrix on a test set with ground truth labels. Here
is an example on a set of 1000 text messages:

|                 | $$X = 1$$ | $$X = 0$$ |
| --------------- | --------- | --------- |
| $$\hat{X} = 1$$ | TP = 40   | FP = 10   |
| $$\hat{X} = 0$$ | FN = 10   | TN = 940  |

Here $$X$$ stands for the ground truth label and $$\hat{X}$$ is the
classifier's prediction. If you applied your spam classifier to those 200
billion text messages, would its estimated prevalence of spam be biased
relative to the ground truth of 5%, and if so, by how much?

## Relating the predicted and true prevalences

In the above example, assuming the test set is a random sample from the corpus
of texts, the predicted prevalence can be computed by tallying up the number of
samples predicted as true $$\hat{X} = 1$$:

$$ \mathrm{predicted\,\,prevalence} = \frac{\mathrm{TP} + \mathrm{FP}}{1000} = 5\% $$

The true prevalence can be computed by tallying up the samples which are
condition positive:

$$ \mathrm{true\,\,prevalence} = \frac{\mathrm{TP} + \mathrm{FN}}{1000} = 5\% $$

In this case, the prevalences are equal.

Why?

Because the confusion matrix is symmetric.

A symmetric confusion matrix means $$\mathrm{FP} = \mathrm{FN}$$ and it also
implies the precision $$p$$ and recall $$r$$ are equal. You can see that by
examining the usual formulas:

$$
\begin{align}
  p &= \frac{\mathrm{TP}}{\mathrm{TP} + \mathrm{FP}} \\
  r &= \frac{\mathrm{TP}}{\mathrm{TP} + \mathrm{FN}}
\end{align}
$$

If the precision and recall are equal, then the confusion matrix is symmetric,
which implies the predicted and true prevalences are equal. There is no bias in
the predicted prevalence.

## General relation between predicted and true prevalences

There's a simple relationship between the predicted prevalence
$$\mathbb{E}(\hat{X})$$ and the true prevalence $$\mathbb{E}(X)$$. In the
binary case, the prevalence is equal to the expected value because:

$$
\begin{split}
  \mathbb{E}(X) &= \sum_X X\,P(X) \\
  &= P(X = 1) \\
  &= \mathrm{prevalence}
\end{split}
$$

One way to derive the relationship is to take a probabilistic view of the
confusion matrix. In our concrete realization of the confusion matrix, divide
by the total number of elements $$N = 1000$$ and think of the entries (which
now lie in $$[0, 1]$$) as probabilities:

|                 | $$X = 1$$                        | $$X = 0$$                        |
| --------------- | -------------------------------- | -------------------------------- |
| $$\hat{X} = 1$$ | $$P(X = 1, \hat{X} = 1) = 0.04$$ | $$P(X = 0, \hat{X} = 1) = 0.01$$ |
| $$\hat{X} = 0$$ | $$P(X = 1, \hat{X} = 0) = 0.01$$ | $$P(X = 0, \hat{X} = 0) = 0.94$$ |

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

$$ \boxed{\mathbb{E}(\hat{X}) = \frac{r}{p} \cdot \mathbb{E}(X)} $$

This tells us how to convert between the prevalences of the classifier and the
ground truth.

In the case where the precision and recall are the same, we indeed find that
the prevalences are equal: $$ \mathbb{E}(\hat{X}) = \mathbb{E}(X) $$.
