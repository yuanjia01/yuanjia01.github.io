from pathlib import Path

import numpy as np
from scipy import stats
import matplotlib.pyplot as plt


IMGDIR = Path("../images/company-tagging")


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
    plt.xlabel("number of candidate paragraphs")
    plt.ylabel("proportion of companies")
    plt.savefig(IMGDIR / 'zipf.png', bbox_inches='tight')


if __name__ == '__main__':
    Path.mkdir(IMGDIR, exist_ok=True)
    bounded_zipf_pmf()
