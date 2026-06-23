---
# Post (article) layout, hub-styled. Shares chrome via hub-base.
layout: hub-base
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}
{%- assign lp = '' -%}{%- if lng == 'en' -%}{%- assign lp = '/en' -%}{%- endif -%}
{%- include multi_lng/get-pages-by-lng.liquid pages = site.posts -%}
{%- assign lng_posts = lng_pages | sort: 'date' | reverse -%}
{%- assign current_index = nil -%}
{%- for post in lng_posts -%}
  {%- if post.url == page.url -%}
    {%- assign current_index = forloop.index0 -%}
  {%- endif -%}
{%- endfor -%}
{%- assign older_post = nil -%}
{%- assign newer_post = nil -%}
{%- if current_index != nil -%}
  {%- assign older_index = current_index | plus: 1 -%}
  {%- assign newer_index = current_index | minus: 1 -%}
  {%- if older_index < lng_posts.size -%}
    {%- assign older_post = lng_posts[older_index] -%}
  {%- endif -%}
  {%- if current_index > 0 -%}
    {%- assign newer_post = lng_posts[newer_index] -%}
  {%- endif -%}
{%- endif -%}
<article class="post-wrap">
  <a class="post-back" href="{{ site.baseurl }}{{ lp }}/tabs/blog/">← {% if lng == 'en' %}Blog{% else %}블로그{% endif %}</a>
  <header class="post-head">
    <div class="post-meta">
      <span class="date">{{ page.date | date: "%Y.%m.%d" }}</span>
      {%- if page.category %}<span class="cat">{{ page.category }}</span>{%- endif -%}
    </div>
    <h1>{{ page.title }}</h1>
    {%- if page.tags.size > 0 %}
    <div class="post-tags">
      {%- for t in page.tags %}<span class="tag">{{ t }}</span>{% endfor -%}
    </div>
    {%- endif %}
  </header>

  <div class="prose markdown-style">
    {{ content }}
  </div>

  {%- if older_post or newer_post %}
  <nav class="post-nav">
    {%- if older_post %}
    <a href="{{ site.baseurl }}{{ older_post.url }}"><span class="pn-dir">← {% if lng == 'en' %}Older{% else %}이전 글{% endif %}</span><span class="pn-title">{{ older_post.title }}</span></a>
    {%- else %}<span></span>{% endif -%}
    {%- if newer_post %}
    <a href="{{ site.baseurl }}{{ newer_post.url }}" style="text-align:right"><span class="pn-dir">{% if lng == 'en' %}Newer{% else %}다음 글{% endif %} →</span><span class="pn-title">{{ newer_post.title }}</span></a>
    {%- else %}<span></span>{% endif -%}
  </nav>
  {%- endif %}
</article>
