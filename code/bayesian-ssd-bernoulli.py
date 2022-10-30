from pathlib import Path

import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt


IMGDIR = Path("../images/bayesian-ssd-bernoulli")
IMGDIR.mkdir(exist_ok=True)


# Bayesian sample size determination for Bernoulli trials

def indicator(k, n, alpha, theta_t, lambda_):
    a = k + lambda_[0]
    b = n - k + lambda_[1]
    return stats.beta.cdf(theta_t, a, b) < alpha

def beta(n, theta_t, alpha, mu, lambda_):
    k = np.arange(n + 1)
    bb = stats.betabinom.pmf(k, n, mu[0], mu[1])
    ind = indicator(k, n, alpha, theta_t, lambda_)
    return np.sum(bb * ind)

def large_bias():
    mu = 10, 3

    plt.figure(dpi=200)

    theta = np.linspace(0, 1, 201)
    pdf = stats.beta.pdf(theta, mu[0], mu[1])

    plt.plot(theta, pdf)
    plt.fill_between(theta, pdf, alpha=0.3)

    plt.xlabel(r"Bias $\theta_0$")
    plt.ylabel(r"$P_\mu(\theta_0)$")
    plt.title(f"Data generation prior with $\mu_1 = {mu[0]}$ and $\mu_2 = {mu[1]}$")

    plt.tight_layout()
    plt.savefig(IMGDIR / 'large-bias-data-generation-prior.png', bbox_inches='tight')

    plt.figure(dpi=200)

    alpha = 0.05
    theta_t = 0.5
    lambda_ = 1, 1

    nn = range(1, 101)
    betas = [beta(n, theta_t, alpha, mu, lambda_) for n in nn]

    plt.plot(nn, betas, 'o', alpha=0.5)
    plt.axhline(0.80, linestyle="--", color="black", alpha=0.5)

    plt.xlabel(r"Sample size $N$")
    plt.ylabel(r"$\beta$")
    plt.title(r"Proportion of simulations with $P(\theta > 0.5) > 0.95$")

    plt.tight_layout()
    plt.savefig(IMGDIR / 'large-bias-power.png', bbox_inches='tight')


def small_bias():
    mu = 51000, 49000

    plt.figure(dpi=200)

    theta = np.linspace(0, 1, 701)
    pdf = stats.beta.pdf(theta, mu[0], mu[1])

    plt.plot(theta, pdf)
    plt.fill_between(theta, pdf, alpha=0.3)
    plt.axvline(0.50, linestyle="--", color="black", alpha=0.3)

    plt.xlabel(r"Bias $\theta_0$")
    plt.ylabel(r"$P_\mu(\theta_0)$")
    plt.title(f"Data generation prior with $\mu_1 = {mu[0]}$ and $\mu_2 = {mu[1]}$")

    plt.tight_layout()
    plt.savefig(IMGDIR / 'small-bias-data-generation-prior.png', bbox_inches='tight')

    plt.figure(dpi=200)

    alpha = 0.05
    theta_t = 0.5
    lambda_ = 1, 1

    nn = range(1, 50001, 100)
    betas = [beta(n, theta_t, alpha, mu, lambda_) for n in nn]

    plt.plot(nn, betas, 'o', alpha=0.5)
    plt.axhline(0.80, linestyle="--", color="black", alpha=0.5)

    plt.xlabel(r"Sample size $N$")
    plt.ylabel(r"$\beta$")
    plt.title(r"Proportion of simulations with $P(\theta > 0.5) > 0.95$")

    plt.tight_layout()
    plt.savefig(IMGDIR / 'small-bias-power.png', bbox_inches='tight')


def posterior_grid():
    nmax = 10
    fig = plt.figure(figsize=(8, 8), dpi=200)
    gs = fig.add_gridspec(ncols=2, nrows=nmax//2, hspace=0, wspace=0)
    axs = gs.subplots(sharex=True)

    for n in range(1, nmax+1):
z        theta = np.linspace(0, 1, 201)
        lambda1, lambda2 = 1, 1
        ax = axs[(n-1) % 5, (n-1)// 5]
        n_above_threshold = 0
        for k in range(n+1):
            a = k + lambda1
            b = n - k + lambda2
            color = "gray"
            if stats.beta.cdf(0.5, a, b) < 0.05:
                n_above_threshold += 1
                color = "C0"
            ax.plot(theta, stats.beta.pdf(theta, a, b), color=color, alpha=0.7)
            ax.fill_between(theta, stats.beta.pdf(theta, a, b), color=color, alpha=0.1)
        ax.tick_params(left=None)
        ax.set_yticks([])
        ax.set_ylim(None, stats.beta.pdf(0, lambda1, n+lambda2) * 1.2)
        ax.text(0.3, 0.7, f"$n = {n}$\n{n_above_threshold} above threshold", transform=ax.transAxes)
        ax.set_xlabel(r"bias $\theta$")

    fig.suptitle("Posteriors for increasing sample sizes")

    fig.tight_layout()
    plt.savefig(IMGDIR / 'posteriors-vs-sample-size.png', bbox_inches='tight')


    # zoomed-in successful proportion vs sample size
    mu = 10, 3
    alpha = 0.05
    theta_t = 0.5
    lambda_ = 1, 1

    plt.figure(dpi=200)

    nn = range(1, 12)
    betas = [beta(n, theta_t, alpha, mu, lambda_) for n in nn]

    plt.plot(nn, betas, 'o-', alpha=0.5)
    plt.axhline(0.80, linestyle="--", color="black", alpha=0.5)

    plt.xlim(0.5, 10.5)
    plt.ylim(None, 1.05)
    plt.xlabel(r"Sample size $N$")
    plt.ylabel(r"$\beta$")
    plt.title(r"Proportion of simulations with $P(\theta > 0.5) > 0.95$")

    plt.tight_layout()
    plt.savefig(IMGDIR / 'power-zoom.png', bbox_inches='tight')


if __name__ == '__main__':
    large_bias()
    small_bias()
    posterior_grid()
