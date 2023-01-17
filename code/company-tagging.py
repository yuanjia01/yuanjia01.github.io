from pathlib import Path

import numpy as np
from scipy import stats
import matplotlib.pyplot as plt


IMGDIR = Path("../images/company-tagging")


# Truncated power law distribution

def bounded_zipf_rv(a=1.3, loc=-1, Nmax=50):
    x = np.arange(0, Nmax + 1)
    weights = (x - loc) ** (-a)
    weights /= weights.sum()
    return stats.rv_discrete(name='bounded_zipf', values=(x, weights))

def bounded_zipf_pmf():
    fig = plt.figure(figsize=(8, 6), dpi=100)
    fig.set_facecolor('white')

    Nmax = 50
    zipf = bounded_zipf_rv(Nmax=Nmax)

    N = np.arange(0, Nmax + 1)
    plt.bar(N, zipf.pmf(N))
    plt.text(35, 0.30, r'$p(N) = (N + 1)^{-1.3}$')

    plt.xlabel("number of candidate paragraphs")
    plt.ylabel("proportion of companies")
    plt.title("Bounded Zipf's law with $N_\mathrm{max} = 50$")
    plt.savefig(IMGDIR / 'zipf.png', bbox_inches='tight')


# Bias due to model errors vs precision-recall gap

def EY0(Nmax, prevalence, bounded_zipf=bounded_zipf_rv()):
    N = np.arange(Nmax + 1)
    return 1 - np.sum(bounded_zipf.pmf(N) * stats.binom.pmf(0, N, prevalence))

def EYpred(Nmax, cm, bounded_zipf=bounded_zipf_rv()):
    tp, fp, fn, tn = cm
    P00 = tn/(tn+fp)
    P01 = fn/(tp+fn)
    prevalence = (tp + fn) / (tp + fp + fn + tn)

    PKh0 = 1
    for N in np.arange(Nmax + 1):
        K = np.arange(N + 1)
        PKh0 -= np.sum(stats.binom.pmf(K, N, prevalence) * P01**K * P00**(N-K)) * bounded_zipf.pmf(N)
    return PKh0

def napr_to_cm(n, prevalence, precision, recall):
    a, p, r = prevalence, precision, recall
    tp = a * r * n
    fp = a * r * (1-p) * n / p
    fn = a * (1-r) * n
    tn = n - tp - fp - fn
    if tn < 0:
        raise ValueError("Invalid confusion matrix.")
    return (tp, fp, fn, tn)

def bias_vs_prec_recall_diff():
    fig = plt.figure(figsize=(8, 6), dpi=100)
    fig.set_facecolor('white')

    plt.axhline(0, linestyle='--', alpha=0.4, color='k')
    plt.axvline(0, linestyle='--', alpha=0.4, color='k')

    Nmax = 50
    p0 = 0.85                   # average of precision and recall
    n = 100
    deltas = np.linspace(-0.15, 0.15, 15)

    for prevalence in np.linspace(0.1, 0.6, 6):
        EY = []
        EYp = []
        for delta in deltas:
            precision = p0 + delta
            recall = p0 - delta
            cm = napr_to_cm(n, prevalence, precision, recall)
            EY.append(EY0(Nmax, prevalence))
            EYp.append(EYpred(Nmax, cm))

        plt.plot(2 * deltas, np.asarray(EYp) - np.asarray(EY),
                 label=round(prevalence, 1),
                 color=plt.cm.viridis(prevalence))

    plt.legend()
    plt.text(-0.28, -0.05, f"(precision + recall) / 2 = {p0}")
    plt.xlabel("precision - recall")
    plt.ylabel(r"bias = $\mathbb{E}(\hat{Y}) - \mathbb{E}(Y)$")
    plt.title("Bias vs. precision-recall difference, for prevalences from 0.1 to 0.6")
    plt.savefig(IMGDIR / 'bias.png', bbox_inches='tight')


if __name__ == '__main__':
    Path.mkdir(IMGDIR, exist_ok=True)
    bounded_zipf_pmf()
    bias_vs_prec_recall_diff()
