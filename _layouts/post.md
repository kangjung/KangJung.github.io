---
# Post (article) layout, hub-styled. Shares chrome via hub-base.
layout: hub-base
---
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}
<article class="post-wrap">
  <a class="post-back" href="{{ site.baseurl }}/tabs/blog/">← 개발 기록</a>
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

  {%- if page.previous or page.next %}
  <nav class="post-nav">
    {%- if page.previous %}
    <a href="{{ site.baseurl }}{{ page.previous.url }}"><span class="pn-dir">← 이전 글</span><span class="pn-title">{{ page.previous.title }}</span></a>
    {%- else %}<span></span>{% endif -%}
    {%- if page.next %}
    <a href="{{ site.baseurl }}{{ page.next.url }}" style="text-align:right"><span class="pn-dir">다음 글 →</span><span class="pn-title">{{ page.next.title }}</span></a>
    {%- else %}<span></span>{% endif -%}
  </nav>
  {%- endif %}
</article>
