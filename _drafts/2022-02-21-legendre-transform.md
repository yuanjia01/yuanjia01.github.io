---
layout: post
title: "What is the Legendre Transform?"
published: true
mathjax: true
---

The Legendre transform is one of those mathematical techniques which physics
textbooks pull out with little explanation and intuition. If you were a physics
student, you may have encountered it in thermodynamics, where it is used to
relate the internal energy of a system to other thermodynamic potentials like
the free energy or enthalpy. Or maybe you came across the Legendre transform in
classical mechanics as the link between the Lagrangian and the Hamiltonian.

As compared to more common operations like derivatives and integrals, or even
other transforms like the Fourier transform, I found the Legendre transform
more opaque and less intuitive. If someone presented you a function $$f(x)$$,
and stated that the Legendre transform $$g$$ is defined as $$g = px - f$$, you
might ask, "but why?"

You might be told that $$p$$ is the derivative of $$f$$, but again, why?

What even is the independent variable in this formula?

And if the formulas weren't frustrating enough, what is the intuition behind the
Legendre transform anyway?

My goal with this post is to share a clear exposition of what the Legendre
transform is, as well as why it is the right way to describe the deep
connection between energy, temperature and entropy.

Let's get started.

[//]: Motivate the post by appealing to frustration and common misconceptions of Legendre transforms
[//]: Have a picture as early on as possible

## Curves and tangent lines

I'll start by posing a seemingly unrelated problem to you, but it contains all
the intuition you'll need to understand Legendre transforms:

> If I give you a curve in the $$x$$-$$y$$ plane, how would you describe its
> tangent lines?

Here is a concrete example: say the curve is the parabola $$f(x) = x^2$$. Pick
a point on the parabola, say $$(1, 1)$$, and draw the tangent line:

![](/images/legendre/parabola-one-tangent.png)

One way to describe this particular tangent line is by its slope and
$$y$$-intercept, which are $$2$$ and $$-1$$ respectively. It's formula is 

$$y = 2x - 1$$

Take another point on the parabola, say $$(\frac{1}{2}, \frac{1}{4})$$ and
again draw the tangent line. Its slope is $$1$$, and the $$y$$-intercept is
$$-\frac{1}{4}$$, so the formula for this second tangent line is

$$y = x - \frac{1}{4}$$

Imagine repeating this process for a bunch of points on the curve and
tabulating the slopes, which I'll call $$p$$, and for reasons I'll explain
further down, the *negative* of the $$y$$-intercepts $$g$$. The result is a
table like this:

| $$x$$ | $$f$$ | $$p$$ | $$g$$ |
| ----- | ----- | ----- | ----- |
|    -1 |     1 |    -2 |     1 |
|  -1/2 |   1/4 |    -1 |   1/4 |
|     0 |     0 |     0 |     0 |
|   1/2 |   1/4 |     1 |   1/4 |
|     1 |     1 |     2 |     1 |

Just as we have plotted $$f$$ against $$x$$, we can construct a new function
$$g(p)$$ by plotting the intercepts $$g$$ against the slopes $$p$$:

![](/images/legendre/duality.png)

This new curve of the intercepts vs. slopes is the Legendre transform. That's
it!

> The Legendre transform of a function is the negative $$y$$-intercepts of
> its tangent lines plotted against their slopes.

A neat property of the Legendre transform is that it contains all the
information of the original function, but encoded in terms of different
variables $$p$$ and $$g$$. In fact, the curve we constructed is an example of a
[dual curve](https://en.wikipedia.org/wiki/Dual_curve), which is an idea from
the field of projective geometry: plane curves can be described equally well as
a set of points or as a set of corresponding tangent lines.

Now you can answer the original question posed: if I give you a curve, the
Legendre transform is a complete description of its tangent lines.

In the above example, the function $$g(p)$$ looks suspiciously like a parabola
as well. How would you compute the Legendre transform algebraically?

## From curves to equations

Rephrasing the question in with some mathematical notation, given a function
$$f(x)$$ with independent variable $$x$$, what is the procedure to compute the
Legendre transform $$g(p)$$, where the independent variable $$p$$ ranges over
the slopes of the tangent lines?

The trick is to consider the right triangle formed by the points on the
function $$f$$ and the negative $$y$$-intercept $$g$$:

![](/images/legendre/tangent-triangle.png)

Adding up the length of the two vertical line segments, the height of the
triangle is $$f+g$$. The width is $$x$$. The slope $$p$$ of the triangle is

$$p = \frac{f + g}{x}$$

which when rearranged gives a beautifully symmetric formula:

$$f + g = p x$$

You'll notice that if you swap $$f \leftrightarrow g$$ and $$x \leftrightarrow
p$$, the formula remains unchanged. This means that if you apply the Legendre
transform twice, you'll get back the original function: the transform is its
own inverse, an
[involution](https://en.wikipedia.org/wiki/Involution_(mathematics)).

Now you see the reason we worked with negative $$y$$-intercept: if we had used
the regular $$y$$-intercept, the triangle height would have been $$f - g$$, and
the Legendre transform so defined would not be an involution.

One other property to note is that if they were phyiscal quantities, the
Legendre transform $$g$$ must have the same units as $$f$$. For example, if
$$f$$ had units of energy, then $$g$$ must also be some transformed measure of
energy. Likewise, the product $$p x$$ must also have units of energy. [How does
this relate to $$p$$ and $$x$$ being conjugate variables? What's the definition
of a conjugate variable and what physical process do they represent?]

Finally, solving for $$g$$, we get

$$g = p x - f$$

While this formula makes sense in terms of segment lengths of the triangle,
what is lost is the notion of what is the independent variable. Since the
Legendre transform is a function of the tangent line slopes, what we do is the
following: given the input $$f(x)$$

1. Find the tangent line slopes by taking the derivative $$p(x) = \frac{df(x)}{dx}$$
2. Invert this equation to get $$x(p) = \left(\frac{df}{dx}\right)^{-1}(p)$$
3. Insert into the expression $$p x - f(x)$$ to eliminate $$x$$ in favor of $$p$$

In summary, this is the prescription for finding the Legendre transform:

> $$ g(p) = p \, x(p) - f(x(p))$$
>
> $$\text{where } x(p) \text{ is obtained by inverting } p(x) = \frac{df(x)}{dx}$$

Now we can answer the question of whether the Legendre transform of $$f(x) =
x^2$$ is also a parabola:

1. The derivative $$p(x) = 2x$$
2. The original coordinate in terms of the derivative is $$x(p) = p / 2$$
3. The Legendre transform is $$g(p) = p \cdot p/2 - (p/2)^2 = p^2 / 4$$

Yes, it's a parabola! Also, you can check that applying the transform again to
$$g(p) = p^2/4$$ will recover the original function, showing that the transform
is an involution.

Before we move on, I want to show one other way to compute the Legendre
transform that involves maximization, which turns out to be related to
something that is always maximized in Nature (hint, it has to do with the
second law of thermodynamics).

Going back to the plot of our curve (solid green), pick a value of the slope
$$p$$ and draw the line $$y = px$$ passing through the origin (solid blue).
Then draw the tangent line with slope $$p$$ (dotted grey). The vertical
distance between the two lines is the $$y$$-intercept $$g$$. Here's the key
point: as we slide along the plot horizontally, the signed distance from the
curve $$f(x)$$ to the line $$y = px$$ reaches a maximum at the tangent point
(orange segment) and is exactly equal to the $$y$$-intercept $$g$$.

Put another way, if we plot $$px - f(x)$$ as a function of $$x$$, its maximum
value is $$g$$.

![](/images/legendre/legendre-supremum.png)

This gives us a second definition for the Legendre transform:

$$\boxed{g(p) = \max_x \{p\,x - f(x)\} \quad \text{for }f(x)\text{ convex up}}$$

Operationally, when calculating the maximum over $$x$$, we'll end up computing
the derivative of the argument $$p\,x - f(x)$$ and setting it to zero, which
gives $$p = f'(x)$$ as before.

It turns out the definition changes if the function is concave down to $$g(p) =
\min_x \{p\,x - f(x)\}$$.

## Visual examples and curves which get us in trouble

Let's have some fun: I've worked out the Legendre transform in some common
cases to give you a sense of how it behaves. Taking a function and translating
the curve upwards shifts the Legendre transform an equal amount downwards:

![](/images/legendre/translate-up.png)

Translating the original curve to the right shifts the Legendre transform to
the left and downwards on a diagonal:

![](/images/legendre/translate-right.png)

Moving away from parabolas, the transform of the exponential function $$e^x$$
is only defined for $$p > 0$$ because the slopes of the tangent lines are all
positive.

![](/images/legendre/legendre-exponential.png)

The transform of the (natural) logarithm is again a logarithm:

![](/images/legendre/legendre-logarithm.png)

And for a fun one, the Legendre transform of a circle $$f(x) = \pm
\sqrt{1-x^2}$$ is the hyperbola $$g(p) = \mp \sqrt{1+p^2}$$:

![](/images/legendre/legendre-circle.png)

The top half of the circle corresponds to the bottom branch of the hyperbola,
and vice versa.

I've been careful to choose curves that have well-behaved transforms. What
kinds of curves have poorly-behaved Legendre transforms? Because the
independent variable $$p$$ in the transform is the slope of the tangent lines,
you might guess that a function $$f(x)$$ that is non-convex might behave poorly
because multiple points have tangent lines with the same slope. Here's an
example: a double well.

![](/images/legendre/legendre-double-well.png)

The Legendre transform (technically the
[Legendre-Fenchel](https://en.wikipedia.org/wiki/Convex_conjugate) transform in
this more general case) becomes multi-valued. The two minima in $$f(X)$$ map
onto the "X" crossing at the origin in $$g(p)$$ while the two cusps or "horns"
in the transform correspond to the two points where $$f$$ changes concavity.

As an aside, transforms of non-convex functions are related to convex hulls and
the [Maxwell construction](https://en.wikipedia.org/wiki/Maxwell_construction),
but to avoid these complexities, we'll deal only with convex or concave
functions going forward.

## Differentials and potentials

Behavior of differentials:

$$df = p \, dx \quad \text{where } p = \frac{df}{dx}$$

What about the differential of $$g$$?

$$dg = x\,dp + p \frac{dx}{dp} - \frac{df}{dx} \frac{dx}{dp}$$

The last two terms cancel, and we find

$$dg = x\,dp$$

Point is the slope of the Legendre transform is the original independent
variable $$x$$.

In classical mechanics, a common question we want to know is "when an object is
at some position $$x$$, what is the force $$F$$ acting on it?" For example,
when a mass attached to a spring is stretched to a displacement $$x$$ away from
its equilibrium position, what is the force $$F$$ will the mass experience? One
way to answer this question is with the potential energy $$V(x)$$: taking its
derivative with respect to $$x$$ tells us the force:

$$ F(x) = -\frac{dV(x)}{dx} $$

For the case of a spring with spring constant $$k$$, the potential energy is
$$V(x) = kx^2/2$$ and the force is $$F(x) = -kx$$, which is Hooke's law.

What if we wanted to invert the question: "when an object is experiencing a
force $$F$$, what is its position $$x$$?" The easy answer would be to invert
the equation between force and position, which in the case of the spring,
gives:

$$ x(F) = -F/k $$

But what if we wanted a potential "energy" which is a function of the force
$$F$$ and whose derivative gives us the position? This is the
Legendre transform of $$V(x)$$:

$$ dW = -x dF $$

Going back to differentials, what happens when we have a function $$f(x,y)$$ of
multiple variables and transform just one of them?

$$df = p\,dx + q\,dy$$

$$dg = x\,dp - q\,dy$$

The second term acquires a minus sign. The spectator variables aren't left
alone (why is this important?). Example:

$$f(x, y) = x^2 + y^2$$

$$g(p, y) = \frac{p^2}{4} - y^2$$

We went from a paraboloid to a hyperbolic paraboloid. Again, why is this
important?

$$df + dg = p\,dx + x\,dp$$

An interesting property of the Legendre transform is that the derivatives of
$$f(x)$$ and $$g(p)$$ are inverses of one another.

![area-interpretation](/images/legendre/area.png)

[Relationship with Laplace transform via saddle point]

# Maximizing entropy

For students of thermodynamics, you may remember being introduced to a quantity
called the Helmholtz free energy, $$F = E - TS$$, and being told it is the
Legendre transform of the energy $$E$$. What does this quantity physically
measure and why is it related to energy by a Legendre transform?

What is entropy? Define entropy: it's the number of states compatible with
macroscopic constraints. Empirically, it's also a ratio of heat flow to
temperature. Consider bringing up entropy tables.

Assume the 2nd law of thermodynamics: that a system will evolve in such a way
to maximize it's entropy.

Given the classic set up of a system $$A$$ and a much bigger reservoir $$B$$,
what division of energy between the two parts maximizes entropy? Imagine we
start off with all the energy in $$B$$ and none in $$A$$. No energy in $$A$$
means its contribution to the entropy is zero, so

$$S_\text{tot} = S_B(E_\text{tot})$$

As we allow energy $$E$$ to flow from $$B$$ to $$A$$, the entropy of $$B$$ will
decrease while the entropy of $$A$$ increases.

$$S_\text{tot}(E, E_\text{tot}) = S_A(E) + S_B(E_\text{tot} - E)$$

How much does the entropy of $$B$$ decrease by? Taylor expand:

$$S_B(E_\text{tot} - E) \approx S_B(E_\text{tot}) - E \left. \frac{\partial S_B}{\partial E} \right|_{E = E_\text{tot}}$$

We call the slope of the reservoir's entropy $$\beta(E)$$, the inverse temperature.

$$\Delta S_\text{tot}(E) = S_A(E) - E \, \beta(E)$$

Where $$\Delta S_\text{tot}(E) = S_\text{tot}(E, E_\text{tot}) -
S_B(E_\text{tot})$$. The right hand side is the Legendre transform of the
entropy of $$A$$.

Because for a big system, its entropy is nearly linear in the energy, the
maximization of total entropy leads to the Legendre transform.

$$\Delta S_\text{tot}(\beta) = S_A(E(\beta)) - E(\beta) \, \beta$$

The Legendre transform of the entropy tells us how much the entropy will be
produced when bringing the system from absolute zero to $$T = 1 / \beta$$.

What does the Helmholtz free energy physically correspond to? The quantity
$$\beta F$$ is the total amount of entropy produced when bringing the system
from absolute zero to its final equilibrium temperature when placed in contact
with the resevoir.

Why is it's slope something we feel as hot and cold? Think about if we felt
total energy instead of temperature: we'd find the Earth unbearable.

Why are thermodynamic conventions different than the symmetric mathematical
presentation we chose above?

What is an example of this maximization in action? Example of gas piston with
spring. [Wait, doesn't this involve a change in volume?]

# Notes

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
