from typing import Tuple, Optional
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt # type: ignore


IMGDIR = Path("../images/legendre")

@dataclass
class LegendreAxesConfig:
    xlim1: Tuple[float, float] = (-2.7, 2.7)
    ylim1: Tuple[float, float] = (-2.7, 2.7)
    xlim2: Tuple[float, float] = (-2.7, 2.7)
    ylim2: Tuple[float, float] = (-2.7, 2.7)
    fontsize: int = 16
    dpi: int = 150


def setup_legendre_axes(config: Optional[LegendreAxesConfig] = None):
    config = config if config else LegendreAxesConfig()

    fig, ax = plt.subplots(ncols=2, nrows=1, figsize=(9.5,5), dpi=config.dpi)
    ax1, ax2 = ax

    ax1.set_xlim(*config.xlim1)
    ax1.set_ylim(*config.ylim1)
    ax1.spines['right'].set_visible(False)
    ax1.spines['top'].set_visible(False)
    ax1.text(.97, -.10, 'x', fontsize=config.fontsize, transform=ax1.transAxes)
    ax1.text(-.10, .97, 'f', fontsize=config.fontsize, transform=ax1.transAxes)

    ax2.set_xlim(*config.xlim2)
    ax2.set_ylim(*config.ylim2)
    ax2.spines['right'].set_visible(False)
    ax2.spines['top'].set_visible(False)
    ax2.text(0.97, -0.10, 'p', fontsize=config.fontsize, transform=ax2.transAxes)
    ax2.text(-0.10, 0.97, 'g', fontsize=config.fontsize, transform=ax2.transAxes)

    return fig, ax1, ax2


def parabola_one_tangent():
    fig, ax1, ax2 = setup_legendre_axes()
    x = np.linspace(-5, 5, 101)

    ax1.axhline(0, color="lightgrey")
    ax1.axvline(0, color="lightgrey")

    color = plt.cm.viridis(0.7)
    p, g = 2, 1
    ax1.plot(x, x**2, 'k')
    ax1.plot(x, p*x - g, color=color)
    ax1.plot([1], [1], 'o', color=color)

    ax2.axhline(0, color="lightgrey")
    ax2.axvline(0, color="lightgrey")
    ax2.plot([p], [g], 'o', color=color)
    
    plt.tight_layout()
    plt.savefig(IMGDIR / 'parabola-one-tangent.png', bbox_inches='tight')


def duality():
    fig, ax1, ax2 = setup_legendre_axes()

    x = np.linspace(-5, 5, 101)

    # x-f (left) plot
    ax1.axhline(0, color="lightgrey")
    ax1.axvline(0, color="lightgrey")

    alphas = np.linspace(0, 1, 5)
    for alpha in alphas:
        x0 = -1 + 2*alpha
        p = 2*x0
        g = p*x0 - x0**2
        ax1.plot(x, p*x - g, color=plt.cm.viridis(alpha), alpha=0.8)
    ax1.plot(x, x**2, 'k')
    
    for alpha in alphas:
        x0 = -1 + 2*alpha
        ax1.plot([x0], [x0**2], 'o', color=plt.cm.viridis(alpha))

    # p-g (right) plot
    ax2.axhline(0, color="lightgrey")
    ax2.axvline(0, color="lightgrey")

    ax2.plot(x, x**2/4, 'k')

    for alpha in alphas:
        x0 = -1 + 2*alpha
        p = 2*x0
        g = p*x0 - x0**2
        ax2.plot([p], [g], 'o', color=plt.cm.viridis(alpha))
    
    plt.tight_layout()
    plt.savefig(IMGDIR / 'duality.png', bbox_inches='tight')


def tangent_triangle():
    xx = np.linspace(-5, 5, 101)

    fig = plt.figure(figsize=(5, 5), dpi=250)

    plt.axhline(0, color="lightgrey")
    plt.axvline(0, color="lightgrey")

    x, f = 1, 1
    p, g = 2, 1
    plt.plot(xx, p*xx - g, color=plt.cm.viridis(.99))
    plt.plot(xx, xx**2, 'k')
    plt.plot([0, x, x, 0], [-g, -g, f, -g], color=plt.cm.viridis(0.7))
    plt.plot([x], [f], 'o', color=plt.cm.viridis(.99))

    pad = 0.05
    plt.text(x/2, -g, "$x$", va="top")
    plt.text(x + pad, -g/2, "$g$", ha="left")
    plt.text(x + pad, f/2, "$f$", ha="left")
    
    plt.text(-0.6, -0.4, r"slope $p = \dfrac{f+g}{x}$", ha="center")
    
    plt.xlim(-1.3, 1.7)
    plt.ylim(-1.5, 1.5)

    plt.tight_layout()
    plt.savefig(IMGDIR / 'tangent-triangle.png', bbox_inches='tight')


def legendre_supremum():
    config = LegendreAxesConfig(
        xlim1=(-0.5, 1.2),
        ylim1=(-0.5, 1.2),
        xlim2=(-0.35, 1.35),
        ylim2=(-0.35, 1.35),
    )
    fig, ax1, ax2 = setup_legendre_axes(config)

    # x-f (left) plot
    ax1.axhline(0, color="lightgrey")
    ax1.axvline(0, color="lightgrey")

    x = np.linspace(-3, 3, 101)
    ax1.plot(x, x**2, color=plt.cm.viridis(0.7))
    ax1.plot(x, x)
    ax1.plot(x, x - 0.25, "--", color='grey')
    dy = 0.01
    ax1.plot([0, 0], [0 - dy, -0.25 + dy], color="C1")
    ax1.plot([0.5, 0.5], [0.5 - dy, 0.25 + dy], color="C1")
    
    ax1.set_xticks([-0.5, 0, 0.5, 1])
    ax1.set_yticks([-0.5, 0, 0.5, 1])

    # p-g (right) plot
    ax2.axhline(0, color="lightgrey")
    ax2.axvline(0, color="lightgrey")

    p = 1
    ax2.plot(x, p*x - x**2, color=plt.cm.viridis(0.1))
    ax2.plot([0.5, 0.5], [0 + dy, 0.25 - dy], color="C1")
    ax2.text(.2, 1, "$px - f(x)$   for fixed $p$")
    
    ax2.set_xticks([0, 0.5, 1])
    ax2.set_yticks([0, 0.5, 1])

    plt.tight_layout()
    plt.savefig(IMGDIR / 'legendre-supremum.png', bbox_inches='tight')


def translate_up():
    fig, ax1, ax2 = setup_legendre_axes()

    x = np.linspace(-5, 5, 101)

    # x-f (left) plot
    ax1.axhline(0, color="lightgrey")
    ax1.axvline(0, color="lightgrey")

    alphas = np.linspace(0, 1, 5)
    for alpha in alphas:
        ax1.plot(x, x**2 + alpha, color=plt.cm.viridis(alpha))
    
    # p-g (right) plot
    ax2.axhline(0, color="lightgrey")
    ax2.axvline(0, color="lightgrey")

    for alpha in alphas:
        ax2.plot(x, x**2/4 - alpha, color=plt.cm.viridis(alpha))
    
    plt.tight_layout()
    plt.savefig(IMGDIR / 'translate-up.png', bbox_inches='tight')


def translate_right():
    fig, ax1, ax2 = setup_legendre_axes()

    x = np.linspace(-5, 5, 101)

    # x-f (left) plot
    ax1.axhline(0, color="lightgrey")
    ax1.axvline(0, color="lightgrey")

    alphas = np.linspace(0, 1, 5)
    for alpha in alphas:
        ax1.plot(x, (x - alpha)**2, color=plt.cm.viridis(alpha))
    
    # p-g (right) plot
    ax2.axhline(0, color="lightgrey")
    ax2.axvline(0, color="lightgrey")

    for alpha in alphas:
        ax2.plot(x, x**2/4 + x*alpha, color=plt.cm.viridis(alpha))
    
    plt.tight_layout()
    plt.savefig(IMGDIR / 'translate-right.png', bbox_inches='tight')


def legendre_exponential():
    config = LegendreAxesConfig(
        xlim1=(-3.5, 1.5),
        ylim1=(-1.5, 3.5),
        xlim2=(-0.5, 4.5),
        ylim2=(-1.5, 3.5),
    )
    fig, ax1, ax2 = setup_legendre_axes(config)

    x = np.linspace(-4, 2, 101)

    # x-f (left) plot
    ax1.axhline(0, color="lightgrey")
    ax1.axvline(0, color="lightgrey")

    ax1.plot(x, np.exp(x), color=plt.cm.viridis(0))
    
    # p-g (right) plot
    ax2.axhline(0, color="lightgrey")
    ax2.axvline(0, color="lightgrey")

    x = np.linspace(0.0001, 5, 201)
    ax2.plot(x, x * np.log(x) - x, color=plt.cm.viridis(0.7))
    
    plt.tight_layout()
    plt.savefig(IMGDIR / 'legendre-exponential.png', bbox_inches='tight')


def legendre_logarithm():
    config = LegendreAxesConfig(
        xlim1=(-0.5, 4.5),
        ylim1=(-1.5, 3.5),
        xlim2=(-0.5, 4.5),
        ylim2=(-1.5, 3.5),
    )
    fig, ax1, ax2 = setup_legendre_axes(config)

    x = np.linspace(1e-5, 5, 201)

    # x-f (left) plot
    ax1.axhline(0, color="lightgrey")
    ax1.axvline(0, color="lightgrey")

    ax1.plot(x, np.log(x), color=plt.cm.viridis(0))
    
    # p-g (right) plot
    ax2.axhline(0, color="lightgrey")
    ax2.axvline(0, color="lightgrey")

    x = np.linspace(1e-5, 5, 201)
    ax2.plot(x, np.log(x) + 1, color=plt.cm.viridis(0.7))
    
    plt.tight_layout()
    plt.savefig(IMGDIR / 'legendre-logarithm.png', bbox_inches='tight')


def legendre_circle():
    config = LegendreAxesConfig(
        xlim1=(-2.5, 2.5),
        ylim1=(-2.5, 2.5),
        xlim2=(-2.5, 2.5),
        ylim2=(-2.5, 2.5),
    )
    fig, ax1, ax2 = setup_legendre_axes(config)

    # x-f (left) plot
    ax1.axhline(0, color="lightgrey")
    ax1.axvline(0, color="lightgrey")

    x = np.linspace(-1, 1, 101)
    ax1.plot(x, np.sqrt(1 - x**2), color=plt.cm.viridis(0))
    ax1.plot(x, -np.sqrt(1 - x**2), color=plt.cm.viridis(0))
    
    # p-g (right) plot
    ax2.axhline(0, color="lightgrey")
    ax2.axvline(0, color="lightgrey")

    p = np.linspace(-3, 3, 201)
    ax2.plot(p, -np.sqrt(1 + p**2), color=plt.cm.viridis(0.7))
    ax2.plot(p, np.sqrt(1 + p**2), color=plt.cm.viridis(0.7))
    
    plt.tight_layout()
    plt.savefig(IMGDIR / 'legendre-circle.png', bbox_inches='tight')


def legendre_double_well():
    # Legendre transform for a non-convex function
    # Ex: the double-well potential

    config = LegendreAxesConfig(
        xlim1=(-1.5, 1.5),
        ylim1=(-1.0, 2.0),
        xlim2=(-1.5, 1.5),
        ylim2=(-1.0, 2.0),
    )
    fig, ax1, ax2 = setup_legendre_axes(config)

    # x-f (left) plot
    ax1.axhline(0, color="lightgrey")
    ax1.axvline(0, color="lightgrey")

    x = np.linspace(-2, 2, 201)
    f = x**4 - x**2
    p = 4 * x**3 - 2*x
    ax1.plot(x, f, color=plt.cm.viridis(0))

    ax1.set_xticks([-1, 0, 1])
    ax1.set_yticks([0, 1])
    
    # p-g (right) plot
    ax2.axhline(0, color="lightgrey")
    ax2.axvline(0, color="lightgrey")

    ax2.plot(p, p*x - f, color=plt.cm.viridis(0.7))
    
    ax2.set_xticks([-1, 0, 1])
    ax2.set_yticks([0, 1])
    
    plt.tight_layout()
    plt.savefig(IMGDIR / 'legendre-double-well.png', bbox_inches='tight')


with plt.xkcd():
    # parabola_one_tangent()
    # duality()
    # tangent_triangle()
    # legendre_supremum()
    # translate_up()
    # translate_right()
    # legendre_exponential()
    # legendre_logarithm()
    # legendre_circle()
    legendre_double_well()
