---
layout: post
title: "What is the Legendre Transform?"
published: true
mathjax: true
draft: true
---

The Legendre transform is one of those mathematical techniques which physics
textbooks pull out with little explanation and intuition. If you were a physics
student, you may have encountered it in thermodynamics, where it is used to
relate the internal energy of a system to other thermodynamic potentials like
the free energy or enthalpy. Or maybe you came across the Legendre transform in
classical mechanics as the link between the Lagrangian and the Hamiltonian.

As compared to more common operations like derivatives and integrals, or even
other transforms like the Fourier transform, I found the Legendre transform
more opaque and less intuitive:

* If someone presented you a function $$f(x)$$, and stated that the Legendre
  transform $$g$$ is defined as $$g = px - f$$, you might ask, "but why?"

* You might be told that $$p$$ is the derivative of $$f$$, but again, why?

* What is the independent variable in this formula?

* What is the intuition behind the Legendre transform anyway?

My goal with this post is to share a clear exposition of what the Legendre
transform is, as well as why it is the right way to describe the deep
connection between energy, temperature and entropy.

Let's get started.


## Curves and tangent lines

I'll start by posing a seemingly unrelated problem, but it contains all the
intuition you'll need to understand Legendre transforms:

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

Now you can answer the original question posed:

> If I give you a curve in the $$x$$-$$y$$ plane, how would you describe its
> tangent lines?
>
> I'd use the Legendre transform!

In the above example, the function $$g(p)$$ looks suspiciously like a parabola
as well. How would you compute the Legendre transform algebraically?

## From curves to equations

Let's rephrase the question in mathematical notation: given a function $$f(x)$$
with independent variable $$x$$, what is the procedure to compute the Legendre
transform $$g(p)$$, where the independent variable $$p$$ ranges over the slopes
of the tangent lines?

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
the Legendre transform so defined would have an extra minus sign floating
around and not be an involution.

> Aside: not everyone defines the Legendre transform this way, so pay attention
> to minus sign conventions in the literature.

One other property to note is that if they were phyiscal quantities, the
Legendre transform $$g$$ must have the same units as $$f$$. For example, if
$$f$$ had units of energy, then $$g$$ must also be a measure of energy.
Likewise, the product $$p x$$ must also have units of energy. [How does this
relate to $$p$$ and $$x$$ being conjugate variables? What's the definition of a
conjugate variable and what physical process do they represent?]

Finally, solving for $$g$$, we get

$$g = p x - f$$

While this formula makes sense in terms of segment lengths of the triangle,
what is lost is the notion of what is the independent variable. Since the
Legendre transform is a function of the tangent line slopes, what we do is the
following: given the input $$f(x)$$

1. Find the tangent line slopes by taking the derivative $$p = f'(x)$$
2. Invert this equation to get $$x = f'^{-1}(p)$$.
3. Insert into the expression $$p x - f(x)$$ to eliminate $$x$$ in favor of $$p$$

The $$f'^{-1}(p)$$ notation is awkward so I'll write $$x = x(p)$$

In summary, this is the prescription for finding the Legendre transform:

$$\boxed{
\begin{gather}
  g(p) = p \, x(p) - f(x(p)) \\
  \text{where } x(p) \text{ is obtained by inverting } p = f'(x)
\end{gather}
}$$

Now we can answer the question of whether the Legendre transform of $$f(x) =
x^2$$ is also a parabola:

1. The derivative is $$p(x) = 2x$$
2. The original coordinate in terms of the derivative is $$x(p) = p / 2$$
3. The Legendre transform is $$g(p) = p \cdot p/2 - (p/2)^2 = p^2 / 4$$

Yes, it's a parabola! Also, you can check that applying the transform again to
$$g(p) = p^2/4$$ will recover the original function, showing that the transform
is an involution.

Before we move on, I want to show one other way to compute the Legendre
transform that involves maximization, which turns out to be related to
something that is maximized in Nature (hint, it has to do with the second law
of thermodynamics).

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

> For a concave down function, the definition changes to $$g(p) = \min_x \{p\,x - f(x)\}$$.

Now let's have some fun.

## Visual examples and curves which get us in trouble

I've worked out the Legendre transform in some common cases to give you a sense
of how it behaves. Taking a function and translating the curve upwards shifts
the Legendre transform downwards an equal amount:

![](/images/legendre/translate-up.png)

Translating the original curve to the right shifts the Legendre transform to
the left and downwards on a diagonal:

![](/images/legendre/translate-right.png)

You can find a whole slew of properties of the Legendre transform on
[Wikipedia](https://en.wikipedia.org/wiki/Legendre_transformation#Further_properties).

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
this more general case) becomes multi-valued. The two minima in $$f(x)$$ map
onto the "X" crossing on the vertical axes in the $$g(p)$$ plot while the two
cusps or "horns" in the transform correspond to the two points where $$f$$
changes concavity.

As an aside, transforms of non-convex functions are related to convex hulls and
the [Maxwell construction](https://en.wikipedia.org/wiki/Maxwell_construction),
but to avoid these complexities, we'll deal only with convex or concave
functions going forward. Another way of saying this is that we'll restrict
ourselves to functions whose derivative is *single-valued* when considered as a
function of $$p$$. For our purposes, that means $$p = f'(x)$$ is monotonic
increasing or decreasing. The example on the right is not permissible because
there are some values of $$p$$ which corresponds to multiple values of $$x$$.

![](/images/legendre/single-valued.png)

> The fact that $$p = f'(x)$$ is single-valued means that choosing $$p$$
> uniquely specifies $$x$$. Either one could play the role as the independent
> variable. To make this symmetry explicity, physicists often overload the
> notation and write $$p(x)$$ and $$x(p)$$ to represent the curve viewed as a
> function of $$x$$ and $$p$$ respectively. It should be clear from the context
> whether we mean $$x$$ the independent variable, or $$x$$ the function (and
> similarly for $$p$$).

In the past three sections, we've explored the Legendre transform from the
perspective of duality for plane curves, namely the mapping between points and
tangent lines. In the next sections, I want to move from derivative calculus to
integral calculus and reinterpret the construction in terms of areas. This will
lead to a connection between Legendre transforms to integrals of inverse
functions, the product rule and to an explict geometric symmetry between $$f$$
and $$g$$.

## From slopes to areas

Go back to the triangle in the plot of $$f(x)$$ constructed by picking a point
$$x$$ and drawing the tangent line, which led to the relationship

$$ p\,x = f + g $$

Each of the three terms is a length, and the equation essentially is two ways
to express the height of the triangle: "the height of the triangle is equal to
the slope $$p$$ times the width $$x$$, or equivalently, the sum of the line
segments $$f$$ and $$g$$".

Now switch to the plot the derivative $$p = f'(x)$$. What does the triangle
(specifically the height of the triangle) become?

![](/images/legendre/lengths-vs-areas.png)

In the $$p$$-$$x$$ axes, the three terms representing lengths become areas:

* The height of the triangle $$p \, x$$ becomes the area of the *rectangle*
  with dimensions $$x \times p$$.

* The value of the function $$f$$ at an argument $$x$$ becomes the *area* under
  the curve of $$p$$ integrated up to $$x$$:

  $$ f(x) = \int_0^x\! dx\, p(x) $$

* To make things add up, the negative $$y$$-intercept $$g$$ must be the area
  above the curve of $$p(x)$$. Because the derivative is single-valued, we can
  work with the inverse $$x(p)$$ and integrate up to $$p$$:

  $$ g(p) = \int_0^p\! dp\, x(p) $$

Remember, because the derivative is single-valued, $$x$$ and $$p$$ uniquely
specify one another. The area $$g(p)$$ is the Legendre transform of the
function $$f(x)$$.

![](/images/legendre/lengths-vs-areas-flipped.png)

From this area diagram, we can read off almost every useful equation related to
the Legendre transform!

* Taking $$p$$ to be the independent variable, we can read off

  $$ g(p) = p\,x(p) - f(x(p)) $$

  which is the definition of the Legendre transform.

* Imagine making a small change in the height of the triangle $$d(px)$$. Using
  the product rule gives $$d(px) = p\,dx + x\,dp$$

* Imagine making a small change $$dx$$ in the value of $$x$$. Then $$df = p
  dx$$. Similarly, a small change $$dp$$ implies $$dg = x dp$$.

> I've simplified the arguments by choosing a function $$f(x)$$ which both
> passes through the origin and has zero slope at the origin. You can check
> that a suitably modified construction continues to work for more general
> functions satisfying neither of those conditions.

* [switch axes graphically?]

* Connect to integration of inverse functions

* Connect to product rule and integration by parts

* Behavior of differentials

* Duality of derivatives and derivatives being inverses

Remember that $$p$$, $$f$$ and $$g$$ are the slope, the value of the function
and the $$y$$-intercept of the tangent line respectively for a chosen value of
$$x$$. Because the derivative $$f'(x)$$ is single-valued, we can equivalently
say that $$x$$, $$f$$ and $$g$$ are the $$x$$-coordinate, function value and
$$y$$-intercept of the tangent line respectively for a chosen value of the
slope $$p$$.


# Integration of inverse functions

The French mathematician Charles-Ange Laisant "could hardly believe that this
theorem is new" when he published his article "Integration of Inverse
Functions" in 1905. The question is simple: given a function $$y = f(x)$$ which
has an inverse $$x = \phi(y)$$, what is the integral of $$\phi$$? (I'm going to
use Laisant's original notation.)

Defining $$F(x) = \int dx\, f(x)$$ and $$\Phi(x) = \int dx\, \phi(x)$$, Laisant
showed that

$$ \Phi(x) = x\, \phi(x) - F(\phi(x)) $$

Does this formula look familiar? If we replace $$\Phi \rightarrow g$$, $$\phi
\rightarrow p$$, $$x \rightarrow p$$ and $$F \rightarrow f$$, we have exactly
the definition of the Legendre transform.

[What's with the indefinite integration constants?]


---

The graphical behavior of the Legendre transform is fun to play with, but what
are its properties that make it useful?

## Derivatives and potentials

It turns out a useful quantity to examine is the derivative of $$g(p)$$. A
straightforward calculation gives the answer:

$$ \begin{align}
   \frac{dg}{dp} &= \frac{d}{dp} [ p\,x(p) - f(x(p)) ] \\
                 &= x(p) + p \, \frac{dx}{dp} - \frac{df}{dx} \frac{dx}{dp} \\
                 &= x(p)                 
   \end{align}$$

The derivative of the Legendre transform is the original independent variable
$$x$$.

Written side-by-side, derivatives of the original function and its Legendre
transform display a pretty symmetry:

$$\boxed{
\begin{align}
  \frac{df}{dx} &= p(x) \\
  \frac{dg}{dp} &= x(p)
\end{align}
}$$

Duality in action! This property is useful for constructing potentials in
physics, and I'll introduce it by posing a toy problem.

In classical mechanics, a common question we want to know is "in the presence
of some potential $$V(x)$$, what is the force $$F$$ acting on an object when
it's located at position $$x$$"? For example, when a mass attached to a spring
is stretched to a displacement $$x$$ away from its equilibrium position
$$x_0$$, what is the force $$F$$ that the mass experience?

One way to answer this question is to introduce the concept of a potential
energy $$V(x)$$ whose derivative with respect to $$x$$ tells us the force:

$$ F(x) = -\frac{dV(x)}{dx} $$

For the case of a spring with spring constant $$k$$, the potential energy is
$$V(x) = k(x-x_0)^2/2$$ and the force is $$F(x) = -k(x-x_0)$$, which is Hooke's
law.

> Aside: the convention in physics is to compute the force of the potential
> acting on the object, so there's an extra minus sign floating around which
> we'll need to keep track of.

What if I wanted to construct a potential $$W(F)$$ whose derivative with
respect to the force $$F$$ experienced by the object gives us the displacement
$$x$$?

Use the derivative properties of the Legendre transform: the relationship
between the potential energy and force is just the first relation with the
substitutions $$f \rightarrow -V$$ and $$p \rightarrow F$$. Substituting $$g
\rightarrow -W$$ in the second relation gives:

$$ x(F) = -\frac{dW(F)}{dF} $$

The potential $$W$$ is the Legendre transform of $$V$$, up to some minus signs!
The answer for the mass attached to a spring is $$W = F^2/(2k) - Fx_0$$.

---

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

[What is the derivative of $$g(p)$$, or equivalently, it's differential, and
how is it useful for classical mechanics (=potentials)? How does this relate to
the area interpretation and the product rule?]

Behavior of differentials:

$$df = p \, dx \quad \text{where } p = \frac{df}{dx}$$

What about the differential of $$g$$?

$$dg = x\,dp + p \frac{dx}{dp} - \frac{df}{dx} \frac{dx}{dp}$$

The last two terms cancel, and we find

$$dg = x\,dp$$

Point is the slope of the Legendre transform is the original independent
variable $$x$$.


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
