---
layout: post
title: "Bessel's correction"
published: true
mathjax: true
---

THIS LINE OF REASONING IS INCORRECT (AFAIK)

Where does the funny factor of $$(N-1)$$ come from in the formula for the sample variance?

Let's say you have a sample of $$N$$ data points $$X_j$$, where $$j$$ runs from
$$1$$ to $$N$$. How would you estimate the true population mean $$\mu$$? By
computing the sample mean:

$$\bar{X} = \frac{1}{N} \sum_{j = 1}^{N} X_j$$

What about estimating the population variance $$\sigma^2$$? It is defined as
the expected value of the squared residual from the population mean. Compute
the sample variance: start by taking each data point $$X_j$$ and subtract it
from an estimate of the population mean.

Since $$X_j$$ is already used as the data point in the residual, the estimate
of the mean is the average over all the data points *excluding* $$X_j$$:

$$\text{mean for }j\text{th residual} = \frac{X_1 + \ldots + X_{j-1} + X_{j+1} + \ldots + X_N}{N - 1}$$

This is origin of the $$(N-1)$$ factor. We need to exclude $$X_j$$ so that the
mean in the residual is independent from the data point $$X_j$$, leaving only
$$(N-1)$$ terms to average over.

The rest is algebra. This mean can be written as $$(N\bar{X} - X_j)/(N-1)$$ and
the formula for the sample variance is:

$$s^2 = \frac{1}{N}\sum_{j = 1}^{N} \left( X_j - \frac{N\bar{X} - X_j}{N-1} \right)^2$$

You might be tempted to compute $$(X_j - \bar{X})^2$$ for each data point, then
average over all of them.

But that's not quite right. Why?

Because $$X_j$$ is doing double duty: it is the data point under consideration
and also appears in the sample mean $$\bar{X}$$. You can see it by expanding
out the residual:

$$X_j - \bar{X} = \frac{(X_j - X_1) + (X_j - X_2) + \ldots + (X_j - X_{j-1}) + 0 + (X_j - X_{j+1}) + \ldots + (X_j - X_N)}{N}$$
