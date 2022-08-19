---
layout: post
title: "Bayesian sample size determination for Bernoulli trials"
published: true
mathjax: true
draft: true
---

I'm going to pose to you a contrived question: let's say someone hands you a
coin that may or may not be unfair. How many times do you need to flip it to
confidently determine whether it's biased towards heads?

It's contrived because I've never come across a biased coin in real life. Maybe
it's because I haven't looked hard enough. \*shrug\* Regardless, it's an example of the
more general problem of *sample size determination* as applied to Bernoulli
trials.

I'll use the coin flipping example in this post, but here are two realistic
problems that are equivalent:

1. How many impressions do I need to serve to determine whether my new ad
   reaches a target conversion threshold of 2.5%?

2. How many positive test samples do I need to feed my classifier to confirm
   whether its recall is greater than 70%?

Inspired by Keith Goldfeld's
[post](https://www.rdatagen.net/post/2021-06-01-bayesian-power-analysis/),
we're going to solve this using Bayesian inference, and do enough math to
simplify the equations so that the can be computed on a laptop.

## Probability of probabilities

The end result will be an equation for the probability that we're confident
whether the coin is biased towards heads.

Aside: what does the word "confident" mean in this context? Keep reading to
find out.

A key input to the equation is the number of times $$N$$ we choose to flip the
coin. Intuitively, the equation should tell us that if we flip the coin only a
few times, the probability that we can confidently proclaim the coin to be
biased should be low. Conversely, a large number of flips means the probability
that we can confidently determine biased-ness is higher.

Another piece of intuition: the smaller the actual bias of the coin, the lower
the probability we'll be able to detect whether the coin is unfair.

The output to the equation is a probability, and we can motivate it by
reasoning through simulation:

1. Since we don't know *a priori* the bias of the coin, make a guess of its
   distribution by defining a *data generation prior* $$P_\mu(\theta_0)$$ and
   sample a possible bias $$\theta_0$$ from $$P_\mu$$.

2. Flip the biased coin $$\theta_0$$ a fixed number of times $$N$$ to generate
   the data $$\mathcal{D}_N = (k, N-k)$$, where $$k$$ is the number of heads
   and $$N-k$$ is the number of tails. In other words, sample $$\mathcal{D}_N$$
   from the likelihood $$P(\mathcal{D}_N \vert \theta_0)$$.

3. Given the data $$\mathcal{D}_N$$, compute the probability that the estimated
   bias $$\theta$$ exceeds some threshold $$\theta_t$$ by using the posterior
   $$P_\lambda(\theta > \theta_t \vert \mathcal{D}_N)$$. For checking whether
   the coin is biased towards heads, set $$\theta_t = 0.5$$. Note: an input to
   the posterior is a *data analysis prior* $$P_\lambda(\theta)$$, which I'll
   discuss below.

4. If the probability is greater than $$1 - \alpha$$, which is our *confidence*
   level, add one to a running tally $$T$$. Often, $$\alpha$$ is set to
   $$0.05$$, so that we are $$95\%$$ confident.

5. Repeat steps 1-4 $$M$$ times, and report the probability $$T/M = \beta$$ at
   the end. The quantity $$\beta$$ is the proportion of experiments which would
   result in a confident determination of the fairness of the coin.

To convert the simulation procedure into an equation, chain steps 2, 3 and 4
together:

$$ \sum_{\mathcal{D}_N} P_\lambda(\theta > \theta_t \vert \mathcal{D}_N) \,
   P(\mathcal{D}_N \vert \theta_0) > 1 - \alpha $$

When wrapped with the indicator function $$\mathbb{1}(\cdot)$$, this is the
binary quantity we take the expected value of in steps 1 and 5, meaning:

$$ \int_0^1 d\theta_0 \, P_\mu(\theta_0) \, \mathbb{1}\left(
   \sum_{\mathcal{D}_N} P_\lambda(\theta > \theta_t \vert \mathcal{D}_N) \,
   P(\mathcal{D}_N \vert \theta_0) > 1 - \alpha \right) = \beta$$

It looks complicated, but we'll break down each factor in this post. I want to
note a few things:

* Operationally, it's a one-dimensional definite integral. This means we have a
  chance at numerically evaluating it.

* The left hand side is a function of three quantities: the number of data
  points $$N$$, the threshold $$\theta_t$$, a confidence level $$\alpha$$. The
  right hand side is the proportion of successful experiments $$\beta$$. If we
  input three of these four variables, our code should be able to solve for the
  fourth.

* There are two parameters $$\lambda$$ and $$\mu$$ characterizing the prior
  distributions.

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
    ss = np.sum(beta.cdf(theta0, a, b) * binom.pmf(k, n, p))
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

![posterior 10 samples](/images/bayesian-ssd-bernoulli/posterior-10-samples.png)

If we had observed more data, say $$N = 100$$ with the same proportion of heads
$$k = 60$$, the distribution becomes narrower, because our uncertainty is
smaller:

![posterior 100 samples](/images/bayesian-ssd-bernoulli/posterior-100-samples.png)

With the posterior in hand, let's go back to our main question: how many times
do you need to flip a possibly unfair coin to determine whether it's biased
towards heads? Translated into math:

$$ $$

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

I'll start by pasting the final equation we'll arrive at:

$$ P_\mu(P_{\lambda,N}(\theta > \theta_t) \geq 1-\alpha) = \int_0^1 d\theta_0 \,
   P_\mu(\theta_0) \, \mathbb{1}\left(P_{\lambda,N}(\theta > \theta_t | \theta_0) \geq 1
   - \alpha \right) $$

