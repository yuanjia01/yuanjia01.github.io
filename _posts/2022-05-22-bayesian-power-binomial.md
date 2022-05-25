---
layout: post
title: "Bayesian sample size determination for Bernoulli trials"
published: true
mathjax: true
draft: true
---

How many times do you need to flip a possibly unfair coin to determine whether
it's biased towards heads? This problem sounds contrived, but it's a case of a
more general problem of *sample size determination* as applied to Bernoulli
trials.

Here are two realistic problems that are slight variations of the above: How
many ad impressions do I need to serve to conclude that one ad is better than
another? How many test samples do I need to determine my that the precision of
my classifier is greater than a threshold?

Inspired by Keith Goldfeld's
[post](https://www.rdatagen.net/post/2021-06-01-bayesian-power-analysis/),
we're going to solve this using Bayesian inference, and hopefully not require a
computing cluster to do it.

## Where we're going

Let's begin at the end. This is the final form we'll arrive at:

$$ P_\mu(P_{\lambda,N}(\theta > \theta_0) \geq 1-\alpha) = \int d\pi \,
   P_\mu(\pi) \, \mathbb{1}\left(P_{\lambda,N}(\theta > \theta_0 | \pi) \geq 1
   - \alpha \right) $$

It may look complicated, but we'll build up to this formula in this post, one
step at a time. A few comments:

* Operationally, it's a one-dimensional integral over the probability
  distribution $$P_\mu(\pi)$$ constrained to the domain where the indicator
  function $$\mathbb{1}(\cdot)$$ is equal to unity. This means we have a chance
  at numerically evaluating it.

* The left hand side is a function of five variables: number of data points
  $$N$$, the threshold $$\theta_0$$, a confidence level $$\alpha$$, and two
  shape parameters $$\lambda$$ and $$\mu$$ characterizing prior distributions.
  These will be the inputs to our code.

The integrand factor with the indicator function is

$$ \mathbb{1} \left( P_{\lambda,N}(\theta > \theta_0 | \pi) \geq 1 - \alpha
   \right) = H \left( \alpha - \sum_{\text{H} = 1}^N I(\theta_0;
   \text{H}+\lambda_1, \text{T}+\lambda_2) \, \text{Bin}(\text{H}; N, \pi)
   \right) $$

A few comments on this expression:

* The core of the expression is a sum over the binomial distribution
  $$\text{Bin}$$ weighted by $$I(\theta_0)$$, which is the CDF of the beta
  distribution (also known as the regularized beta function). This means we can
  evaluate it numerically.

* The entire sum is wrapped in $$H$$, the Heaviside step function.

To show that the jumble of formulas actually isn't that complicated, here's the
implementation we will arrive at:

```python
import numpy as np
from scipy.stats import beta, binom
from scipy import integrate

def func(n: int, theta0: float, p: float, alpha: float, lambda_: tuple = (1, 1)):
    k = np.arange(n+1)
    a = k + lambda_[0]
    b = n - k + lambda_[1]
    ss = np.sum(np.exp(beta.logcdf(theta0, a, b) + binom.logpmf(k, n, p)))
    return alpha - ss

def integrand(p, n, theta0, alpha, lambda_, mu):
    return np.heaviside(func(n, theta0, p, alpha, lambda_), 0.5) * beta.pdf(p, mu[0], mu[1])

n, theta0, alpha, lambda_, mu = 250, 0.70, 0.05, (1, 1), (10, 2)
integrate.quad(integrand, 0, 1, args=(n, theta0, alpha, lambda_, mu))
```

It's quite short, and only takes half a second to run on my old 2018 Macbook
Air!

Let's get started.

## Bayesian inference

We'll call the unknown parameter to be estimated $$\theta$$. This is the bias
of the coin, the conversion rate of an ad, or the precision of a classifier.

The threshold the parameter must surpass we'll call $$\theta_0$$. For the coin
problem, it's $$0.5$$.

How would we solve this problem via brute force simulations?

1. Sample $$\pi$$ from a data generation prior $$P_\mu(\pi)$$.
2. Sample data $$\mathcal{D}$$ from the likelihood $$P(\mathcal{D} \vert \pi)$$.
3. Compute the probability $$P_\lambda(\theta > \theta_0 \vert \mathcal{D})$$.
4. If the probability is greater than $$1-\alpha$$, add one to a running tally $$K$$.
5. Repeat steps 1-4 $$N$$ times, and report $$K/N$$ at the end.

The dataset $$\mathcal{D}_N = (\text{H}, \text{T})$$ consists of the number of
heads and the number of tails $$\text{T}$$. The total number of trials is $$N =
\text{H} + \text{T}$$. In the following, we'll use either $$(N, \text{H})$$ or
$$(\text{H}, \text{T})$$ to parameterize the dataset, whichever is more
convenient.

Most of the components we can work out (semi)-analytically:

$$ P_\lambda(\theta|\mathcal{D}_N) = \text{Beta}(\theta; \text{H} + \lambda_1, \text{T} + \lambda_2) $$

$$ P(\mathcal{D}_N|\pi) = \text{Bin}(\text{H}; N, \pi) $$

