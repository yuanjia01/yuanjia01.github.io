---
layout: post
title: "Krippendorff's alpha"
published: true
mathjax: true
---

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

You might suggest, "Let's measure how often the labels from different
annotators agree." If agreement is low, then we know something is wrong and we
can take steps to clarify the labeling guidelines, retrain the annotators, or
in the worst case, replace the low-performing annotators. (How one makes this
judgment to fire someone is a different, entirely human, matter!)

There is a metric tailor-made for inter-annotator agreement: [Krippendorff's
alpha](https://en.wikipedia.org/wiki/Krippendorff%27s_alpha). I had no prior
intuition around what this metric meant when our team adopted it as the metric
of choice, so I dug into papers. It turns out Krippendorff's alpha isn't the
only way to measure inter-annotator agreement: there is a veritable zoo of
metrics, going by names like Scott's pi, Fleiss' kappa, and confusingly,
another kappa by Cohen. Which one is the best?

If you ask Klaus Krippendorff, he'd probably say alpha is the best...unless he
was a very modest man, in which case he'd say something about loving all
~~children~~ annotator agreement measures equally. For our team's use case,
alpha is useful because (1) it generalizes to more than two annotators, and
more importantly, (2) it can handle missing data in the cases where some data
points haven't been labeled by all annotators.

## Intuition: observed vs. expected disagreements

Now, to gain intuition around what alpha measures, I found it useful to look
again at the zoo of metrics: for the common case of comparing two annotators on
a binary (yes/no) labeling task, Krippendorff himself has a handy table
comparing various inter-annotator metrics ([Krippendorff
2004](https://repository.upenn.edu/cgi/viewcontent.cgi?article=1250&context=asc_papers)):

<style type="text/css">
img[src~="bordered"] {
   border: 1px solid black;
}
</style>

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
> in the first case is 0.5, while in the second, chance agreement is 0.82 (work
> it out!).
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

Krippendorff's alpha provides a useful measure of how often labels from
different annotators agree in a manner that isolates annotator skill and is
comparable across datasets with varying proportions of positives. Here is some
intuition:

* An $$\alpha = 0.5$$ means the annotators agreed on 50% of the labels they
  were expected to disagree on by chance.
 
* An $$\alpha = 0.8$$ means the annotators agreed on 80% of the labels they
  were expected to disagree on by chance.
 
* An $$\alpha = -1.0$$ means the annotators *disagreed* on 200% of the labels
  they were expected to disagree on by chance.

As suggested by Krippendorff, alphas above 0.8 are considered very good
agreement, and tentative conclusions can be made with data where $$\alpha \ge
0.667$$ (that is, two thirds). These are rules of thumb he derived from
examples in content analysis, and we've adopted them for our team's work.

I like to imagine that similar to bias and variance in machine learning, there
is something akin to "bias" and "variance" in the measures for label quality.
Krippendorff's alpha measures the "variance", namely how much scatter there is
between the annotators. Other metrics are needed to monitor the "bias", namely
whether the annotators are labeling the concept correctly.

## A derivation and Bessel's correction: that $$n\,/\,(n-1)$$ factor

Taking a deeper look at the above table, the metrics largely differ on how the
denominator estimating the expected disagreement is defined. The thing that
jumped out at me about Krippendorff's alpha?

> ...what's with that funny factor of $$n\,/\,(n-1)$$?

Here, $$n$$ is the number of labels: if there are 10 data points, and 3
annotators, $$n = 30$$. The factor is infinite when $$n = 1$$ and gradually
approaches one from above as $$n$$ becomes large.

If you're familiar with the construction of estimators, you might suspect this
has something to do with unbiased estimation. I'll spend the rest of this post
showing why your intuition is correct, and giving you a derivation of
Krippendorff's alpha.

To explain the factor, we will work out the answer to the question:

> What's the expected disagreement for two annotators creating binary labels?

Let's set up the scenario mathematically: as a shift in framing, rather than
considering two annotators, combine them into a single averaged annotator which
produces a label $$X_i \in \{0, 1\}$$ for each data point $$i$$. The way to
think about this averaged annotator is to first randomly select one of the two
annotators, then ask this annotator to produce a label.

For binary labels, we have

$$ X_i \sim \text{Bernoulli}(p) $$

where $$p$$ is the probability of producing a label of 1.

What is the probability two of these average annotators disagree if they are
randomly producing labels? The probability of 1 from the first annotator is
$$p$$, the probability of 0 from the second annotator is $$(1-p)$$, and since
the probabilities are symmetric for the opposite case:

$$ \text{expected disagreement} = 2 \, p \, (1-p) $$

How do we estimate this quantity from the observed data? Naively, one would use

$$ \text{expected disagreement} \stackrel{?}{=} 2 \, \bar{X} \, (1 - \bar{X}) \quad \text{(it's not!)}$$

where $$\bar{X} = (1/n) \sum_i^n X_i $$. It turns out this is the definition of
Scott's $$\pi$$, and the formula seems to make sense: take the observed data
and estimate $$p$$ from the proportion of positives $$\bar{X}$$, then compute
$$2 \bar{X} (1-\bar{X})$$.

In the match up between Scott's $$\pi$$ and Krippendorff's $$\alpha$$,
unfortunately, Scott loses: this naive estimator is biased.

Krippendorff's alpha corrects for this by including a factor of $$n/(n-1)$$,
similar to [Bessel's
correction](https://en.wikipedia.org/wiki/Bessel%27s_correction) for estimating
the population variance, and the proof is similar. We start by asking, "what IS
the expected value of the naive estimator $$\bar{X} \, (1 - \bar{X})$$ and how
much does it differ from $$p(1-p)$$?". Time to shut up and calculate:

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
term. However, for a Bernoulli variable, we know that $$\sigma^2 = p(1-p)$$.
What fortune! That means

$$ \mathbb{E} \, \bar{X} \, (1 - \bar{X}) = \left(1 - \frac{1}{n}\right) p \, (1-p) $$

so the unbiased estimator for $$2\, p \, (1-p)$$ is

$$ \text{expected disagreement} = 2 \, \frac{n}{n-1} \, \bar{X} \, (1 - \bar{X}) $$

That is where the factor of $$n/(n-1)$$ comes from.

In summary, to estimate the expected disagreement due to chance, first estimate
the probability an annotator marks samples as positive by computing
$$\bar{X}$$, then compute the expected disagreement $$\bar{X}
(1-\bar{X})$$ and multiply by $$n / (n-1)$$.

Returning to the table above from Krippendorff's paper, the denominator is written

$$\frac{n}{n-1} 2 \, \bar{p} \, \bar{q}$$

I've used different notation from him, but the idea is the same. You can see
from the following definitions included in his paper that $$\bar{p} = 1 -
\bar{X}$$ and $$\bar{q} = \bar{X}$$.

![contingency table](/images/krippendorff/krippendorff-2004-fig1.png# bordered)

Using Krippendorff's notation from the figure above, where $$b$$ is the
proportion of instances where Coder A marked 1 and Coder B marked 0, and $$c$$
is the proportion of instances where the opposite occurred, the observed
disagreement is $$(b+c)$$ and the formula for Krippendorff's alpha is:

$$
\boxed{
  \alpha = 1 - (b + c) \left/ \frac{n}{n-1} 2 \, \bar{p} \, \bar{q} \right.
}
$$

which is what was shown in the first table.

*Last updated Feb 9, 2023*

_
