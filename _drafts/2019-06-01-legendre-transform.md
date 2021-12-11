---
layout: post
title: "Legendre Transforms"
published: true
mathjax: true
---

Remember the formula for a line with slope $$a$$ and $$y$$-intercept (negative)
$$b$$?

$$y = ax - b$$

Each pair of numbers $$(a, b)$$ uniquely specifies a line. The line $$y = x$$
in the $$x$$-$$y$$ plane is represented by the point $$(1, 0)$$ in the
$$a$$-$$b$$ plane. Similarly, the line $$y = 1$$ maps to the point $$(a, b) = (0, -1)$$.

![](/images/legendre/abxy2.png)

Consider a (convex) curve in the $$x$$-$$y$$ plane. Map all of its tangent
lines to the $$a$$-$$b$$ plane.

![](/images/legendre/abxy-curves.png)

That *dual* curve in the $$a$$-$$b$$ plane is the Legendre transform: it is
(minus) the intercepts $$b$$ of the tangent lines plotted as a function of the
slopes $$a$$.

To develop the Legendre transform mathematically, denote an arbitrary convex
function by $$F(x)$$. Its tangent line at $$x$$ will have a slope equal to the
derivative $$dF(x)/dx \equiv p(x)$$ and intercept $$x \cdot p(x) - F(x)$$.

[PUT DIAGRAM HERE]

The Legendre transform is this intercept, but as a function of the slope $$p$$.
We invert the equation $$p(x) = dF(x) / dx$$ to get $$x(p)$$ to get the
Legendre transform:

\\[ G(p) \equiv x(p) \cdot p - F(x(p)) \\]

The reason for the minus sign in front of the intercept in $$y = ax - b$$
becomes clear: in this convention, the formula for the Legendre transform is
symmetric:

\\[ F(x) + G(p) = x p \\]

The symmetry makes clear that the Legendre transform of $$G(p)$$ is $$F(x)$$ as
well: the transform is its own inverse.

Note this is a slight abuse of notation as there is only one independent
variable: either $$x = x(p)$$ or $$p = p(x)$$.

If working with physical quantities, this equation tells us that the Legendre
transform $$G(p)$$ will have the same units as the original function $$F(x)$$
and that $$x$$ and $$p$$ have conjugate units, in that their product has the
same units of $$F$$ and $$G$$.


## Plan

Questions:

- What is the Legendre transform intuitively?

- How is the Legendre transform expressed mathematically? How are the supremum
  and $$G + F = xy$$ expressions related?

- What are useful mathematical properties of the Legendre transform? Why is the
  Legendre transform an involution?

- How does Legendre transforms relate to derivatives and conjugate pairs? What
  about units?

- What's wrong with using $$F(x(p))$$, where $$p = dF(x)/dx$$?

- Why is there a convexity constraint?

- What is the differential form of the Legendre transform? How does it relate
  to integration by parts or the product rule?

- Ex: Hamiltonian mechanics

  - Why does the Legendre transform show up?

- Ex: Thermodynamics:

  - Why does the Legendre transform show up? How is this related to Laplace
    transforms?

  - How do Legendre transforms relate to the Gibb's construction?

  - What is the physical meaning of the Legendre transforms? What is the
    Helmholtz "free" energy?

  - How are Legendre transforms related to entropy maximization and free energy
    minimization?

- Ex: classical mechanics

  - What does the Legendre transform of a potential $$V(x)$$ mean?

  - Both have units of energy: what energy is it?


Writer's notes:

- Show, don't tell. Sentences like "The legendre transform is so fundamental
  that it is one of those ideas which have many viewpoints, each of which
  highlights one aspect of the idea" are fluff and convey little information.
  Instead, get straight to the point by asking a question, then immediately
  answering it.

- Directly introduce new ideas. Introducing ideas by pointing to how current
  teaching screws it up complicates the exposition. The student needs to
  mentally jump through two steps rather than one.

## OLD

The Legendre transform is one of those mathematical techniques which physics
textbooks pull out with little explanation and intuition. Most physics students
encounter it in classical mechanics, where it's used to connect the Lagrangian
$$L(\dot{q}, q)$$ to the Hamiltonian $$H(p, q)$$, and in thermodynamics, where
it yields the relation between the internal energy $$E$$ and other
thermodynamic potentials like the free energy or enthalpy.

But why is the Legendre transform $$G(p)$$ of a function $$F(x)$$ defined by
$$G \equiv px - F$$? How exactly is $$p$$ the derivative of $$F$$? What even is
the independent variable here? And if you got all that, could someone explain
the geometric intuition behind the Legendre transform?

[//]: Motivate the post by appealing to frustration and common misconceptions of Legendre transforms
[//]: Have a picture as early on as possible

## Let's start with geometry

Lines to be precise. Remember this formula for a line with slope $$a$$ and
$$y$$-intercept $$b$$?

$$y = ax + b$$

Here is the first key idea: each line in the 2d plane can be uniquely
identified by a pair of numbers $$(a, b)$$. For example, the point $$(1, 0)$$
in the $$a$$-$$b$$ plane represents the line $$y = x$$ in the $$x$$-$$y$$ plane:

![](/images/legendre/abxy1.png)

The point $$(a, b) = (0, 1)$$ represents the line $$y = 1$$:

![](/images/legendre/abxy2.png)

If we consider the set of points forming an arc, then we get a bundle of lines:

![](/images/legendre/abxy-arc.png)

Examining the bundle of lines, you may notice that they behave like the set of
tangent lines to a curve. Maybe the arc in $$a$$-$$b$$ space relates to the
curve in $$x$$-$$y$$ space in some way.

![](/images/legendre/abxy-curves.png)

That relationship can be made precise: we've wandered upon the idea of duality.

## Tangent lines and duality

Let's formalize the idea of duality.

Tangent lines to be precise. Suppose you have a convex function (the reason for
the restriction will become clear in a moment). Here's one:

![F(x)](/images/legendre/fx.png)

The legendre transform is so fundamental that it is one of those ideas which
have many viewpoints, each of which highlights one aspect of the idea.

* Geometric: areas, supporting hyperplanes
* Units of conjugate variables

The basic idea is to rewrite a function $$F(x)$$ with the independent variable $$x$$ replaced by the derivative $$p(x) = dF(x)/dx$$. You want to do this without any loss of information, meaning you must be able to take your new function $$G(p)$$ and reconstruct $$F(x)$$.

The naive way would be to simply invert the relationship for $$p$$ to get $$x(p)$$ and plug it into the formula for $$F$$, giving $$F(x(p))$$. However, this approach results in a loss of information.

Let's work out an example in 1d: suppose our function is $$F(x) = x^2 + 1$$.

[Explain the mathematics of the transform, provide an intuition of how it works]

![area-interpretation](/images/legendre/area.png)

[Provide sample mathematical examples]

[Provide explanation of how they are used in physics and the physical meaning of the Legendre transform]


## Resources

[Clare Yu notes](https://ps.uci.edu/~cyu/p115B/class.html): lectures 13-16.

[Zia AJP article](https://doi.org/10.1119/1.3119512)

[Munger](https://www.aapt.org/docdirectory/meetingpresentations/SM14/Mungan-Poster.pdf):
mathematical exposition based on product rule

[StackExchange](https://physics.stackexchange.com/questions/4384/physical-meaning-of-legendre-transformation):
nice graphical representation of $$F + G = xy$$ and requirement of maintaining
variational principles under change of conjugate variable pairs.

[Manton](https://jmanton.wordpress.com/2010/11/21/introduction-to-the-legendre-transform/):
dense math, maybe not useful.

[Fast Legendre transform](https://www.mia.uni-saarland.de/Teaching/NAIA07/naia07_h3_slides.pdf): viewpoint from image analysis

[Supporting hyperplane](https://en.wikipedia.org/wiki/Supporting_hyperplane)

[Deserno](https://www.andrew.cmu.edu/course/33-765/pdf/Legendre.pdf):
mathematical exposition noting information content of functions

[Notes on canonical
ensemble](https://ocw.mit.edu/courses/physics/8-044-statistical-physics-i-spring-2013/readings-notes-slides/MIT8_044S13_Canonical.pdf)

[Adiabatic processes for ideal
gas]("https://phys.libretexts.org/Bookshelves/University_Physics/Book%3A_University_Physics_(OpenStax)/Map%3A_University_Physics_II_-_Thermodynamics_Electricity_and_Magnetism_(OpenStax)/03%3A_The_First_Law_of_Thermodynamics/3.07%3A_Adiabatic_Processes_for_an_Ideal_Gas")

[Entropy changes in an ideal gas](https://web.mit.edu/16.unified/www/FALL/thermodynamics/notes/node40.html)

[Heat capacities of gases](http://www.hep.fsu.edu/~berg/teach/phy2048/1202.pdf): notes for constant volume vs. constant pressure

[P-v-T](https://physicscourses.colorado.edu/phys4230/phys4230_fa13/equationOFstateFigsWeb.pdf):
PvT diagrams for models of gases with varying degrees of realism

[Canonical
ensemble](https://itp.uni-frankfurt.de/~gros/Vorlesungen/TD/9_Canonical_ensemble.pdf):
formulas for ideal gas in microcanonical and canonical ensembles

[Free
energy](https://scholar.harvard.edu/files/schwartz/files/8-freeenergy.pdf):
lecture notes providing concrete worked example of Helmholtz free energy for
system with a spring connected to a gas piston.

[Zia Legendre transform presentation](http://www.gatsby.ucl.ac.uk/tea/tea_archive/attached_files/Gatsby%20TeaTalk%20-%20Legendre%20Transform.pdf)
