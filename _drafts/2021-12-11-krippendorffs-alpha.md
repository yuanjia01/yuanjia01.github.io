---
layout: post
title: "Krippendorff's alpha"
published: true
mathjax: true
---

<style type="text/css">
img[src~="bordered"] {
   border: 1px solid black;
}
</style>

Any machine learning practioner will tell you that most of their time isn't
spent building models. Instead, it's spent obsessing over data. The higher the
quality of the information captured in your data, the higher the quality of
your resulting model.

Teams in industry spend years building datasets, investing significant budget
in human annotators who meticulously label each data point. But humans make
mistakes, so teams guard against that by acquiring multiple independent labels
for each data point. As this expensive effort is unfolding, at the top of
everyone's mind is "how good are the labels we're paying for, and how do we
measure that?"

An intuitive thing to measure is how often the labels from different annotators
agree. If agreement is low, then we know something is wrong and we can take
steps to clarify the labeling guidelines, retrain the annotators, or in the
worst case, replace the low-performing annotators. (How one makes this judgment
is a different, entirely human, matter.)

There is a metric tailor-made for inter-annotator agreement: [Krippendorff's
alpha](https://en.wikipedia.org/wiki/Krippendorff%27s_alpha). I had no prior
intuition around what this metric meant and our team had adopted it as the
metric of choice, so I dug into papers. I found this handy table by
Krippendorff himself comparing various inter-annotator metrics for the case of
two annotators producing binary labels ([Krippendorff
2004](https://repository.upenn.edu/cgi/viewcontent.cgi?article=1250&context=asc_papers)):

![table of agreement metrics](/images/krippendorff/krippendorff-2004-fig2.png# bordered)

As presented here, this table isn't intelligible unless the various quantities
like $$b$$, $$c$$, $$\bar{p}$$ and $$\bar{q}$$ are defined, but the main point
Krippendorf gets across is that every metric is of the form

$$\text{agreement} = 1 - \frac{\text{observed disagreement}}{\text{expected disagreement}}$$

The metrics are all variations of inter-annotator agreement rescaled by chance.

> Aside: why not simply use percent agreement?
>
> Because percent agreement does not take into account dataset imbalance.
>
> Consider one dataset with binary labels where 50% of samples are positive,
> compared to another where 90% are positive. Chance agreement of two labelers
> in the first case is 0.5, while in the second, chance agreement is 0.82.
>
> If metrics weren't rescaled by chance, annotators would appear to be
> performing better on the second dataset by almost a third, even though in
> both cases they're picking labels at random.
>
> So percent agreement isn't ideal because (1) comparing across datasets with
> varying levels of imbalance is difficult, and (2) the scale is not normalized
> so that zero means annotators with no skill.
>
> One final point: rescaling by chance means negative values of the agreement
> metric are possible. This means the annotators are systematically disagreeing
> with one another.

Taking a deeper look at the above table, the metrics largely differ on how the
denominator estimating the expected disagreement is defined. The thing that
jumped out at me about Krippendorff's alpha?

> What's with that funny factor of $$n\,/\,(n-1)$$?

Here, $$n$$ is the number of labels: if there are 10 data points, and 3
annotators, $$n = 30$$. The factor is infinite when $$n = 1$$ and gradually
approaches one from above as $$n$$ becomes large.

Readers familiar with the construction of estimators might suspect this has
something to do with unbiased estimation. I'll spend the rest of this post
trying to convince you they are right, and giving you some insight into the
formula.

To explain the factor, we will work out the answer to the question:

> What's the expected disagreement for two annotators creating binary labels?

Let's set up the scenario mathematically: rather than considering two
annotators, combine them into a single averaged annotator which produces a
label $$X_i \in \{0, 1\}$$ for each data point $$i$$. The way to think about
this averaged annotator is to first randomly select one of the two annotators,
then ask this annotator to produce a label.

For binary labels, we have

$$ X_i \sim \text{Bernoulli}(p) $$

where $$p$$ is the probability of producing a label of 1.

What is the probability two of these average annotators disagree if they are
randomly producing labels? The probability of 1 from the first annotator is
$$p$$, the probability of 0 from the second annotator is $$(1-p)$$, and since
the probabilities are symmetric for the opposite case:

$$ \text{expected disagreement} = 2 \, p \, (1-p) $$

How do we estimate this quantity from the observed data? Naively, one would use

$$ \text{expected disagreement} = 2 \, \bar{X} \, (1 - \bar{X}) $$

where $$\bar{X} = (1/n) \sum_i^n X_i $$. It turns out these is the definition
of Scott's $$\pi$$, and it seems to make sense: take the observed data and
estimate $$p$$ from the proportion of positives, then compute $$2 \bar{X}
(1-\bar{X})$$.

Unfortunately, this estimator is biased. Krippendorff's alpha corrects for this
by including a factor of $$n/(n-1)$$, similar to Bessel's correction for
estimating the population variance.

The calculation is similar in spirit to the derivation of the unbiased
estimator for the variance. Let's work out expected value of $$\bar{X} \, (1 -
\bar{X})$$ and see how much it differs from $$p(1-p)$$:

$$
\begin{align}
  \mathbb{E} \, \bar{X} \, (1 - \bar{X}) &= p - \frac{1}{n^2} \sum_{ij} \mathbb{E}\,X_i X_j \\
  &= p - \frac{1}{n^2}\left( n(n-1) p^2 + n(p^2 + \sigma^2) \right)
\end{align}
$$

We used the fact that for the $$n(n-1)$$ terms where $$i \neq j$$,
$$\mathbb{E}\,X_i X_j = \mathbb{E}\, X_i \cdot \mathbb{E}\, X_j = p^2$$ because
we assume labels are produced independently. For the $$n$$ terms where $$i =
j$$, we use the definition of the variance $$\sigma^2 = \mathbb{E} \, X_i^2 -
p^2$$.

Simplifying the expression, we get

$$ \mathbb{E} \, \bar{X} \, (1 - \bar{X}) = p \, (1-p) - \frac{\sigma^2}{n} $$

which is very close to what we want, except for the pesky $$\sigma^2 / n$$
term. However, for a Bernoulli variable, we know that $$\sigma^2 = p(1-p)$$!
That means

$$ \mathbb{E} \, \bar{X} \, (1 - \bar{X}) = \left(1 - \frac{1}{n}\right) p \, (1-p) $$

so the unbiased estimator for $$2\, p \, (1-p)$$ is

$$ \text{expected disagreement} = 2 \, \frac{n}{n-1} \, \mathbb{E} \, \bar{X} \, (1 - \bar{X}) $$

That is where the factor of $$n/(n-1)$$ comes from.

In summary, to estimate the expected disagreement due to chance, first estimate
the probability an annotator marks samples as positive by computing
$$\bar{X}$$, then compute the expected disagreement $$\bar{X}
(1-\bar{X})$$ and multiply by $$n / (n-1)$$.

Returning to the table above from Krippendorff's paper, the denominator is written

$$\frac{n}{n-1} 2 \, \bar{p} \, \bar{q}$$

I've used different notation from him, but the idea is the same. You can see
from the following definitions from this paper

![contingency table](/images/krippendorff/krippendorff-2004-fig1.png# bordered)

that $$\bar{p} = \bar{X}$$ and $$\bar{q} = 1 - \bar{X}$$.

Krippendorff's alpha provides a useful measure of how often labels from
different annotators agree. Here is some intuition:

* An $$\alpha = 0.5$$ means the annotators agreed on 50% of the labels they
  were expected to disagree on by chance.

* An $$\alpha = 0.8$$ means the annotators agreed on 80% of the labels they
  were expected to disagree on by chance.

As suggested by Krippendorff, alphas above 0.8 are considered very good
agreement, and tentative conclusions can be made with data where $$\alpha \ge
0.667$$ (that is, two thirds). These are rules of thumb.

Finally, I imagine that there is something like bias and variance when measure
label quality, similar to the notions of bias and variance in machine learning.
Krippendorff's alpha measures the variance: how much "scatter" there is between
the annotators. Other metrics are needed to monitor bias: whether the
annotators are labeling the concept correctly, which is another matter
entirely.