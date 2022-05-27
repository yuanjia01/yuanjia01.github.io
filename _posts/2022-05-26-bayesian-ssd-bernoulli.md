---
layout: post
title: "Bayesian sample size determination for Bernoulli trials"
published: true
mathjax: true
draft: true
---

How many times do you need to flip a possibly unfair coin to determine whether
it's biased towards heads? This problem formulation is contrived--I've never
come across a biased coin in real life--but it's an example of the more general
problem of *sample size determination* as applied to Bernoulli trials.

Here are two realistic problems that are equivalent to the above: How many
impressions do I need to serve to determine whether my new ad reaches my
conversion threshold of 2.5%? How many positive test samples do I need to feed
my classifier to confirm whether its recall is greater than 70%?

Inspired by Keith Goldfeld's
[post](https://www.rdatagen.net/post/2021-06-01-bayesian-power-analysis/),
we're going to solve this using Bayesian inference, and hopefully not require a
computing cluster to do it...because math.

## Where we're going

I'm going to begin at the end and paste here the final form we'll arrive at:

$$ P_\mu(P_{\lambda,N}(\theta > \theta_0) \geq 1-\alpha) = \int_0^1 d\pi \,
   P_\mu(\pi) \, \mathbb{1}\left(P_{\lambda,N}(\theta > \theta_0 | \pi) \geq 1
   - \alpha \right) $$

It looks complicated, but we'll build up to this formula in this post, one
step at a time. I want to note a few things:

* Operationally, it's a one-dimensional definite integral. This means we have a
  chance at numerically evaluating it.

* The left hand side is a function of five variables: number of data points
  $$N$$, the threshold $$\theta_0$$, a confidence level $$\alpha$$, and two
  shape parameters $$\lambda$$ and $$\mu$$ characterizing prior distributions.
  These will be the inputs to our code.

The factor in the integrand with the indicator function is

$$ \mathbb{1} \left( P_{\lambda,N}(\theta > \theta_0 | \pi) \geq 1 - \alpha
   \right) = H \left( \alpha - \sum_{k = 0}^N I(\theta_0; k+\lambda_1,
   N-k+\lambda_2) \, \text{Bin}(k; N, \pi) \right) $$

In this formula:

* The core of the expression is a sum over the binomial distribution
  $$\text{Bin}$$ weighted by coefficients $$I(\theta_0)$$, which is the CDF of
  the beta distribution (also known as the regularized beta function). This is
  a finite sum and we can evaluate it numerically.

* The entire sum is wrapped in $$H$$, the Heaviside step function.

I'll also paste here the Python implementation we'll arrive at:

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

## Bayes theorem

Suppose you already flipped the coin $$N$$ times and you observed $$k$$ heads.
What does this data $$\mathcal{D} = (N, k)$$ tell you about the probability
distribution of the bias $$\theta$$ of the coin? Use Bayes theorem!

$$ P_\lambda(\theta|\mathcal{D}) \propto P(\mathcal{D}|\theta) P_\lambda(\theta) $$

The posterior is proportional to the likelihood multiplied by the prior, and
the symbol $$\lambda$$ represents the parameters of the prior distribution. The
likelihood is a binomial distribution:

$$ P(\mathcal{D}|\theta) = \text{Bin}(k; N, \theta) = \binom{N}{k}
   \theta^{k} (1-\theta)^{N-k} $$

To make calculations tractable, we'll use a conjugate prior to the binomial
distribution: the beta distribution.

$$ P_\lambda(\theta) = \text{Beta}(\theta; \lambda_1, \lambda_2) = \frac{1}{B(\lambda_1, \lambda_2)}
   \theta^{\lambda_1-1} (1-\theta)^{\lambda_2-1} $$

I'm using $$\lambda$$ as shorthand for both $$\lambda_1$$ and $$\lambda_2$$.
Working through the math gives:

$$ P_\lambda(\theta|\mathcal{D}) = \text{Beta}(\theta; k + \lambda_1, N - k +
   \lambda_2) $$

What does this posterior distribution look like? First, we specify a prior
belief: let's make the most conservative assumption that before we observed any
data, we believed the bias of the coin could be anywhere between $$0$$ and
$$1$$ uniformly, namely a uniform prior of $$\lambda_1 = \lambda_2 = 1$$. For
$$N = 10$$ coin flips and $$k = 6$$ heads, the posterior is roughly bell-shaped
centered around $$\theta = 0.6$$:

[IMAGE]

If we had observed more data, say $$N = 100$$ with the same proportion of heads
$$k = 60$$, the distribution becomes narrower, because our uncertainty is
smaller:

[IMAGE]

We want to know the probability the coin is biased towards heads, meaning
$$P(\theta > \theta_0)$$ with the threshold $$\theta_0 = 0.5$$. For this, we
choose a confidence, say 95%, which we only want a probability $$\alpha =
0.05$$ of not meeting the


If the threshold we want to meet is $$\theta_0 = 0.7$$ and we want to be
95% confident of meeting that threshold

But, how do we decide what sample size $$N$$ to select when we don't know what
the number of heads $$k$$ will be?

## Chicken and the egg


## Notes

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

