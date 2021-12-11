---
layout: post
title: "Krippendorff's alpha"
published: true
mathjax: true
---

Where does the funny factor of $$n/(n-1)$$ come from in the definition of
Krippendorff's alpha?

As machine learning engineers, a big part of our task is to build datasets
which capture the human knowledge we want to transfer into a machine learning
model. Since we're either paying good money for annotators, or cajoling
colleagues to label the data, we want to know the quality of the labels
collected. Broadly, there are three dimensions to consider: accuracy (are the
labels correct?), reliability (do the annotators agree with one another?), and
stability (does an annotator label in the same way over time?). Krippendorff's
alpha is one metric for reliability.

Measures of inter-annotator agreement frequently assume the following form:

$$ \text{agreement} = 1 - \frac{\text{observed disagreement}}{\text{expected disagreement}} $$

Why this form and not simply percent agreement? Percent agreement is 1 for
perfect agreement and 0 for perfect disagreement, which is as statistically
unlikely as perfect agreement! Percent agreement ignores the likelihood
annotators would agree by chance, and as a result, is not comparable across
datasets with differing levels of imbalance.

Normalizing inter-annotator agreement measures by chance creates a scale where
1 is perfect agreement, 0 is agreement equal to that expected by chance, and
negative values imply correlated disagreements. The various flavors of
inter-annotator agreement measures differ in what goes in the "expected
disagreement" denominator.

![](/images/krippendorff/krippendorff-2004-fig1.png)

Krippendorff lists 7 different versions of inter-annotator agreement metrics:

![](/images/krippendorff/krippendorff-2004-fig2.png)

What's the expected disagreement for two annotators creating binary labels? Let
$$X_i \in \{0, 1\}$$ denote the label of the $$i$$th item produced by the   
average annotator. For binary labels, we have

$$ X_i \sim \text{Bernoulli}(p) $$

where $$p$$ is the probability that an annotator labels 1.

What is the probability two annotators disagree if they are randomly producing
labels? The probability of 1 from the first annotator is $$p$$, the probability
of 0 from the second annotator is $$(1-p)$$, and since the probabilities are
symmetric for the opposite case:

$$ \text{expected disagreement} = 2 \, p \, (1-p) $$

How do we estimate this quantity from the observed data? Naively, one would use

$$ \text{expected disagreement} = 2 \, \bar{X} \, (1 - \bar{X}) $$

where $$\bar{X} = (1/n) \sum_i^n X_i $$. This is the definition of Scott's
$$pi$$.

However, this formula is a biased estimator for the expected disagreement.
Krippendorff's alpha corrects for this by including a factor of $$n/(n-1)$$,
similar to Bessel's correction for estimating the population variance.

Let's work out expected value of $$\bar{X} \, (1 - \bar{X})$$:

$$
\begin{align}
  \mathbb{E} \, \bar{X} \, (1 - \bar{X}) &= p - \frac{1}{n^2} \sum_{ij} \mathbb{E}\,X_i X_j \\
  &= p - \frac{1}{n^2}\left( n(n-1) p^2 + n(p^2 + \sigma^2) \right)
\end{align}
$$

We used the fact that for the $$n(n-1)$$ terms where $$i \neq j$$,
$$\mathbb{E}\,X_i X_j = \mathbb{E}\, X_i \cdot \mathbb{E}\, X_j = p^2$$ because
we assume sequential labels are independent. For the $$n$$ terms where $$i =
j$$, we use the definition of the variance $$\sigma^2 = \mathbb{E} X_i^2 -
p^2$$.

Simplifying the expression, we get

$$ \mathbb{E} \, \bar{X} \, (1 - \bar{X}) = p \, (1-p) - \frac{\sigma^2}{n} $$

where is very close to what we want, except for the pesky $$\sigma^2 / n$$
term. But for a Bernoulli variable, we know that $$\sigma^2 = p(1-p)$$! That
means

$$ \mathbb{E} \, \bar{X} \, (1 - \bar{X}) = \left(1 - \frac{1}{n}\right) p \, (1-p) $$

so the unbiased estimator for $$2\, p \, (1-p)$$ is

$$ \text{expected disagreement} = 2 \, \frac{n}{n-1} \, \mathbb{E} \, \bar{X} \, (1 - \bar{X}) $$

Now it's clear where that factor of $$n/(n-1)$$ comes from. The correction
matters when the number of labels is small.
