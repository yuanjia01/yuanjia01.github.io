---
layout: default
title: Posts
permalink: /posts/
---

<div class="homepage-layout">
  <div class="homepage-main">
    <h4>All Posts</h4>

    <div class="posts">
      {% for post in site.posts %}
        <article class="post">

          <h1><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h1>

          <div class="entry">
            {{ post.excerpt }}
          </div>

          {{ post.date | date_to_long_string }} | <a href="{{ site.baseurl }}{{ post.url }}" class="read-more">Read More</a>
        </article>
      {% endfor %}
    </div>
  </div>

  <aside class="homepage-sidebar">
    <h4>Sidebar</h4>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  </aside>
</div>
