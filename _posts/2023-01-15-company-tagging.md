---
layout: post
title: "Company tagging"
published: true
mathjax: true
draft: true
---

Let's say you are an analyst and you want to know the fraction of companies
which discuss carbon emissions in their public documents. How would you do it?

## Background

The naive way: assemble a team of analysts to read all public documents from
the universe of companies and make a determination of whether carbon emissions
is discussed. If any paragraph in the set of documents published by a company
discusses carbon emissions, then the analyst would add that company to the
tally. At the end, divide the tally by the total number of companies to arrive
the desired proportion.

In reality, you're interested in multiple topics, from methane emissions to
diversity initiatives to new funding, so the number of topics you want to tally
up are in the hundreds. Combined with the size of the universe of documents
(tens of thousands), the manual approach translates to millions of paragraphs
which need to be scanned for hundreds of topics. Building a machine learning
pipeline seems like a good idea: use a model to tag each paragraph as relevant
or irrelevant to a given topic, then aggregate those binary tags together to
make a per-company determination.

There is one big hurdle to building ML pipelines for tagging text: the problem
is extremely imbalanced. The probability of any given paragraph being relevant
to a topic is usually less than 1%, and often less than 0.1%. One way I've seen
these problems solved is with a two-step pipeline: a rule-based search query to
to select *candidate* paragraphs, followed by a deep learning model which
performs paragraph-by-paragraph text classification. These output binary labels
are then aggregated to make a company-level determination.

The problem I want to discuss is this: the model isn't 100% accurate and this
causes bias in the paragraph-level tagging which rolls up to the company-level
determination, ultimately affecting the top-line number of the fraction of
companies discussing a given topic. For example, if a given company has 10
candidate paragraphs which pass the search query, mistagging any one paragraph
as positive when it is in fact negative would cause that company to be tagged
as positive for discussion the topic. How can we mitigate this bias?

## Problem Formulation and Solution

Let's set up some notation. For a given company, let $$Y \in {0, 1}$$ be the
ground truth of whether a given topic is discussed. Let $$X_n \in {0, 1}$$ be
the ground truth of whether each of the $$n = 1 \ldots N$$ candidate paragraphs
discuss the target topic. Combining the paragraph-level labels together via
disjunction gives the company-level label:

$$ Y = X_1 \cup X_2 \cup \ldots \cup X_N $$

The predictions by the model we'll denote with a hat: $$\hat{X}_n$$.

When developing the model, we can score its performance by measuring the number
of true-positives, false-positives, false-negatives and true-negatives on a
test set of data labeled by the best human subject matter experts. Normalizing
these numbers, we get the probability distribution $$P(X, \hat{X})$$.

The problem is as follows: given that we observe the model predicting
$$\hat{X}_1, \hat{X}_2, \ldots, \hat{X}_N$$ on the set of $$N$$ candidates
paragraphs, what is the probability that the true $$Y = 1$$?

The derivation is straightforward algebra:

$$ P(Y = 1 \vert \hat{X}_1, \ldots, \hat{X}_N) = 1 - P(Y = 0 \vert \hat{X}_1, \ldots, \hat{X}_N) $$

There is only one way that $$Y = 0$$: all the paragraphs must have a negative
label as well.

$$ Y = X_1 \cup \ldots \cup X_N = 0 \implies X_1 = 0, \ldots, X_N = 0 $$

Substituting this into the previous expression:

$$
\begin{split}
  &= 1 - P(X_1 = 0, \ldots, X_N = 0 \vert \hat{X}_1, \ldots, \hat{X}_N) \\
  &= 1 - P(X_1 = 0 \vert \hat{X}_1) \cdots P(X_N = 0 \vert \hat{X}_N)
\end{split}
$$

The assumption made in decomposing the joint probability is that the paragraph
labels are independent. This isn't necessarily true, as you could imagine that
if we find that a company discusses a specific topic in one paragraph, the
other paragraphs may be more likely to also discuss that topic. I'll return to
the question of determining the degree of independence between paragraphs at
the end.

If we also assume that the paragraphs are identically distributed, which is a
reasonable assumption, the product of conditional probabilities can broken down
into two sets of factors: those where $$\hat{X}_n = 0$$ and those where
$$\hat{X}_n = 1$$. Let $$0 \leq K \leq N$$ be the number of paragraphs which
the model marks as positive. The probability that a company discusses a topic
is:

$$ P(Y = 1 \vert N, K)
  = 1 - P(X = 0 \vert \hat{X} = 1)^K \, P(X = 0 \vert \hat{X} = 0)^{N - K} $$

We know all the components on the right hand side since we know the full joint
distribution $$P(X, \hat{X})$$ from the confusion matrix.

What we are after is the fraction of companies out of a universe of $$M$$
companies which discuss a topic given the model predictions on the full set of
candidate paragraphs:

$$
\begin{multline}
\mathbb{E}(Y_1 + Y_2 + \ldots + Y_M \vert \{\hat{X}_{1n}\}, \{\hat{X}_{2n}\}, \ldots, \{\hat{X}_{Mn}\}) \\
  = P(Y_1 = 1 \vert \{\hat{X}_{1n}\}) + P(Y_2 = 1 \vert \{\hat{X}_{2n}\}) + \ldots + P(Y_M = 1 \vert \{\hat{X}_{Mn}\})
\end{multline}
$$

Applying our expression for each term in the sum over probabilities:

$$ = M - \sum_{m=1}^{M} P(X = 0 \vert \hat{X} = 1)^{K_m} \, P(X = 0 \vert \hat{X} = 0)^{N_m - K_m} $$

where $$N_m$$ is the number of candidate paragraphs and $$K_m$$ is the number
of paragraphs predicted as positive by the model, for the $$m$$th company. This
is the formula we will implement.

## Example

For a synthetic example, let's say the distribution of the number of candidate
paragraphs $$N$$ follows a power-law, truncated to a max of 50 paragraphs.

![](/images/company-tagging/zipf.png)

For each $$N$$, the number of paragraphs tagged as positive $$K$$ is uniform
random with probability $$0.5$$. We will also need the confusion matrix, from
which we compute the conditional probabilities:

$$ P(X = 0 \vert \hat{X} = 1) = \frac{\text{FP}}{\text{TP} + \text{FP}} $$

$$ P(X = 0 \vert \hat{X} = 0) = \frac{\text{TN}}{\text{TN} + \text{FN}} $$

For example, if we evaluate the model on a set of 250 data points and find that
$$\text{TP} = 135$$, $$\text{FP} = 15$$, $$\text{FN} = 20$$, and $$\text{TN} =
80$$, the probabilities are

$$ P(X = 0 \vert \hat{X} = 1) = 0.1 $$

$$ P(X = 0 \vert \hat{X} = 0) = 0.8 $$

This is a decent model, in that the precision is 0.9 and the recall is 0.87,
giving $$F_1 = 0.89$$.

With these numbers, we can generate a synthetic dataset for a universe of $$M =
1000$$ companies. First, we'll implement Zipf's law, but truncated to a max of
$$N_\text{max} = 50$$ paragraphs since the tail is too long for our purposes:

```python
import numpy as np
from scipy import stats

# bounded power law distribution
Nmax = 50
loc = -1
a = 1.3

x = np.arange(0, Nmax+1)
weights = (x - loc) ** (-a)
weights /= weights.sum()
bounded_zipf = stats.rv_discrete(name='bounded_zipf', values=(x, weights))
```

TKTKTK

## Notes

Here's an implementation of a simplified simulation where each company has
exactly 1 paragraph. I'm clearly making a mistake somewhere because the
corrected expectation rate isn't equal to the original ground truth rate. In
fact, the correction causes the expected rate to drift even further away from
the ground truth value.

```python
import numpy as np
from scipy import stats

# number of companies
M = 1000000

# number of paragraphs per company
N = np.ones(M, dtype='int64')  # for now, all companies have 1 paragraph

# number of relevant (positive) paragraphs per company
K = stats.binom.rvs(N, 0.5)

# ground truth fraction of companies which discuss topic
EY = np.sum(K > 0)
print(f"{EY} / {M} = {EY / M:.2f} companies discuss the topic")

# quality of classifier (confusion matrix)
tp, fp, fn, tn = 135, 15, 20, 80
# tp, fp, fn, tn = 135, 15, 0, 100
# tp, fp, fn, tn = 4, 1, 1, 4

p01 = fp / (tp + fp)
p00 = tn / (fn + tn)
print(f"P(true = 0 | pred = 1) = {p01}, P(true = 0 | pred = 0) = {p00}")

print(f"precision = {tp / (tp + fp):.2f}, "
      f"recall = {tp / (tp + fn):.2f}, "
      f"F1 = {2*tp / (2*tp + fp + fn):.2f}")

# introduce errors based on classifier quality
Kpred = stats.binom.rvs(K, tp/(tp+fn)) + stats.binom.rvs(N-K, fp/(tn+fp))

# preview first 10 samples
print("    N =", N[:10])
print("    K =", K[:10])
print("Kpred =", Kpred[:10])

# ground truth and jittered expectations
print(f"E(Y)  = {np.sum(K > 0)} / {M} = {np.sum(K > 0) / M}")
print(f"E(Y*) = {np.sum(Kpred > 0)} / {M} = {np.sum(Kpred > 0) / M}")

# corrected expectation value (should equal ground truth)
EYp = M - np.sum(p01**Kpred * p00**(N-Kpred))
print(f"E(Y)  = {EYp:.0f} / {M} = {EYp / M}")

# output
# 499083 / 1000000 = 0.50 companies discuss the topic
# P(true = 0 | pred = 1) = 0.1, P(true = 0 | pred = 0) = 0.8
# precision = 0.90, recall = 0.87, F1 = 0.89
#     N = [1 1 1 1 1 1 1 1 1 1]
#     K = [1 1 1 1 1 0 1 0 0 1]
# Kpred = [1 0 1 1 0 1 0 0 0 1]
# E(Y)  = 499083 / 1000000 = 0.499083
# E(Y*) = 514037 / 1000000 = 0.514037
# E(Y)  = 559826 / 1000000 = 0.5598259
```