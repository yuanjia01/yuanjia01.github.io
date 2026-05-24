# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal blog (chuckyee.github.io) built on Jekyll and hosted by GitHub Pages. It was bootstrapped from the "Jekyll Now" template (see `README.md`, most of which is template boilerplate and not specific to this site).

## Deployment

Built and deployed by **GitHub Actions**, not by GitHub Pages' built-in Jekyll runner. The workflow at `.github/workflows/pages.yml` runs on every push to `main`: it sets up Ruby 3.3 via `ruby/setup-ruby@v1`, runs `bundle exec jekyll build`, and publishes via `actions/deploy-pages@v5`.

This means the site is **not** locked to the `github-pages` gem's pinned Jekyll/Ruby versions. The Gemfile depends directly on `jekyll ~> 4.4` and the plugins this site uses (`jekyll-feed`, `jekyll-sitemap`). To upgrade Ruby or Jekyll, bump the version in `pages.yml` and/or the Gemfile — that is the single source of truth.

One-time repo setting (does not live in code): Settings → Pages → Source must be set to **"GitHub Actions"** (not "Deploy from a branch") for this workflow to publish.

## Local development

```bash
bundle install               # one-time; installs into ./vendor/bundle (gitignored)
bundle exec jekyll serve     # serves at http://127.0.0.1:4000/ and watches for changes
```

Open **http://localhost:4000/**.

Always use `bundle exec` so the in-repo Gemfile's Jekyll version is used. The `_site/`, `vendor/`, `.bundle/`, and `Gemfile.lock` paths are gitignored — don't commit them.

Local Ruby: on macOS, the system Ruby (`/usr/bin/ruby`) is too old. Use Homebrew Ruby (`/opt/homebrew/opt/ruby/bin`) and put it on `PATH` before invoking `bundle`. If a deeper Ruby version mismatch ever bites locally, the CI workflow's `ruby-version: "3.3"` is the version GitHub Pages renders with — match it locally if needed.

## Authoring posts

- Posts live in `_posts/` and must be named `YYYY-MM-DD-slug.md`. Work-in-progress posts live in `_drafts/`.
- Frontmatter pattern used throughout this site:
  ```yaml
  ---
  layout: post
  title: "Post title"
  published: true
  mathjax: true
  ---
  ```
- `mathjax: true` is **required** to load MathJax — `_includes/mathjax.html` gates the script tags on `page.mathjax`. Without it, `$$...$$` math will render as raw text.
- Math uses double-dollar delimiters (`$$...$$`) for both inline and display, per Kramdown/MathJax convention used in existing posts.
- `published: false` hides a post from the rendered site. The index page (`index.html`) also filters posts where `post.draft` is truthy, so either mechanism works.
- Companion assets:
  - Post images go in `images/<post-slug>/` (see `images/cardiac-segmentation/`, `images/legendre/`, etc.).
  - Standalone Python code referenced from posts lives in `code/` (e.g. `code/legendre.py` paired with the Legendre transform post).

## Layout chain

`_layouts/post.html` extends `_layouts/default.html` and pulls in `_includes/mathjax.html`, `disqus.html`, and `analytics.html`. `default.html` always includes Google Analytics (configured via `google_analytics` in `_config.yml`). If editing site-wide chrome (header, footer, nav), `default.html` is the single source.

## Styling

SCSS lives in `_sass/` and is compiled by Jekyll via `style.scss` at the repo root (which `@import`s the partials). `sass.style: :expanded` is set in `_config.yml` — keep it that way unless you're intentionally switching to minified output.
