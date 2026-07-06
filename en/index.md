---
layout: hub
lng_pair: id_home
title: "Maker of games, apps & web tools"
img: ":banner.png"
---

<header class="hero">
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow reveal">Just Making Things</span>
      <h1 class="reveal" style="animation-delay:.05s">Just little<br>things I felt<br><span class="accent">like making.</span></h1>
      <p class="hero-sub reveal" style="animation-delay:.12s">
        No grand plan — just simple games, apps, and web tools I felt like building,
        made whenever I feel like it. Web dev by day; this is the hobby.
      </p>
      <div class="stats reveal" style="animation-delay:.18s">
        <div class="stat"><div class="num" id="stat-games">9</div><div class="lab">Games</div></div>
        <div class="stat"><div class="num" id="stat-apps">5</div><div class="lab">Apps · Service</div></div>
        <div class="stat"><div class="num" id="stat-tools">5</div><div class="lab">Web tools</div></div>
      </div>
      <div class="cta-row reveal" style="animation-delay:.24s">
        <a class="btn btn-primary" href="#games">See the games →</a>
        <a class="btn btn-ghost" href="#apps">Browse apps</a>
      </div>
    </div>
    <div class="arcade reveal" style="animation-delay:.3s" aria-hidden="true">
      <div class="tile" style="background:linear-gradient(145deg,#ff7a6b,#ff5a5a)">🐰</div>
      <div class="tile" style="background:linear-gradient(145deg,#6172ff,#3d5afe)">🪐</div>
      <div class="tile" style="background:linear-gradient(145deg,#3fb5ff,#2e8bff)">🟦</div>
      <div class="tile" style="background:linear-gradient(145deg,#ffb23e,#ff8a3e)">🔤</div>
      <div class="tile" style="background:linear-gradient(145deg,#ff6fa5,#ff4f93)">🥪</div>
      <div class="tile" style="background:linear-gradient(145deg,#15c9a0,#0fae9a)">⚔️</div>
      <div class="tile" style="background:linear-gradient(145deg,#ffb23e,#ff7a6b)">📅</div>
      <div class="tile" style="background:linear-gradient(145deg,#3fb5ff,#6172ff)">⏳</div>
      <div class="tile" style="background:linear-gradient(145deg,#15c9a0,#3fb5ff)">🔔</div>
    </div>
  </div>
</header>

<main>
  <section id="games" class="wrap">
    <div class="sec-head">
      <span class="eyebrow">Games</span>
      <h2>Games</h2>
      <p>Built with Unity and HTML5, shipped across several stores.</p>
    </div>
    <div class="grid games" id="games-grid"></div>
  </section>

  <section id="apps" class="wrap">
    <div class="sec-head">
      <span class="eyebrow">Apps &amp; Services</span>
      <h2>Apps &amp; Services</h2>
      <p>Small, useful apps and services for everyday life.</p>
    </div>
    <div class="grid apps" id="apps-grid"></div>
  </section>

  <section id="tools" class="wrap">
    <div class="sec-head">
      <span class="eyebrow">Tools</span>
      <h2>Tools</h2>
      <p>A mix of browser-based pages and small utilities.</p>
    </div>
    <div class="grid apps">
      <a class="card" href="{{ site.baseurl }}/remove-background/">
        <div class="card-art emoji" style="background:linear-gradient(145deg,#9b7bff,#3d5afe);color:#fff">🪄</div>
        <div class="card-body"><div class="card-title"><h3>Background Remover</h3></div>
          <p>Removes image backgrounds into transparent PNGs. Runs fully in your browser via WebAssembly — nothing is uploaded. Batch up to 20 images.</p>
          <div class="meta-row"><span class="tag">WEBASSEMBLY</span><span class="stores"><span class="store-chip">Open ↗</span></span></div></div></a>

      <a class="card" href="{{ site.baseurl }}/tool/">
        <div class="card-art emoji" style="background:linear-gradient(145deg,#3fb5ff,#15c9a0);color:#fff">🧰</div>
        <div class="card-body"><div class="card-title"><h3>DevBox</h3></div>
          <p>A set of handy browser developer tools. No install needed.</p>
          <div class="meta-row"><span class="tag">WEB</span><span class="stores"><span class="store-chip">Open ↗</span></span></div></div></a>

      <a class="card" href="{{ site.baseurl }}/js-edge-cases/">
        <div class="card-art emoji" style="background:linear-gradient(145deg,#111827,#00d4ff);color:#fff">JS</div>
        <div class="card-body"><div class="card-title"><h3>JavaScript Edge Cases</h3></div>
          <p>An interactive page for exploring odd JavaScript coercion, comparison, sorting, and other edge cases like small quizzes.</p>
          <div class="meta-row"><span class="tag">JAVASCRIPT</span><span class="stores"><span class="store-chip">Open ↗</span></span></div></div></a>

      <a class="card" href="https://github.com/kangjung/kakaowork-backup" target="_blank" rel="noopener">
        <div class="card-art emoji" style="background:linear-gradient(145deg,#ffe45c,#ff9f1c);color:#14151a">💬</div>
        <div class="card-body"><div class="card-title"><h3>KakaoWork Backup</h3></div>
          <p>A backup utility for keeping KakaoWork conversations and files. Code and usage notes are available in the public GitHub repo.</p>
          <div class="meta-row"><span class="tag">BACKUP</span><span class="stores"><span class="store-chip">GitHub ↗</span></span></div></div></a>

      <a class="card" href="https://github.com/kangjung/Disable-CSP" target="_blank" rel="noopener">
        <div class="card-art emoji" style="background:linear-gradient(145deg,#ef4444,#111827);color:#fff">CSP</div>
        <div class="card-body"><div class="card-title"><h3>Disable-CSP</h3></div>
          <p>A browser extension for disabling the current page's Content Security Policy, built for testing and debugging workflows.</p>
          <div class="meta-row"><span class="tag">EXTENSION</span><span class="stores"><span class="store-chip">GitHub ↗</span></span></div></div></a>
    </div>
  </section>

  <section class="wrap lower">
    <div id="notes">
      <div class="sec-head">
        <span class="eyebrow">Writing</span>
        <h2>Blog</h2>
        <p>Conferences, game jams, and things learned while building.</p>
      </div>
      {%- include multi_lng/get-pages-by-lng.liquid pages = site.posts -%}
      {%- if lng_pages.size > 0 -%}
        {%- for _post in lng_pages limit: 6 -%}
          {%- assign _cat = _post.categories[0] | default: _post.tags[0] -%}
          <a class="note" href="{{ site.baseurl }}{{ _post.url }}">
            <span class="date">{{ _post.date | date: "%Y.%m" }}</span>
            <h3>{{ _post.title }}</h3>
            {%- if _cat %}<span class="cat">{{ _cat }}</span>{%- endif -%}
          </a>
        {%- endfor -%}
      {%- else -%}
        <p style="color:var(--muted)">No posts yet.</p>
      {%- endif -%}
    </div>

    <div id="elsewhere">
      <div class="sec-head">
        <span class="eyebrow">Elsewhere</span>
        <h2>Writing elsewhere</h2>
      </div>
      <div class="rss-card">
        <div class="rss-top">
          <strong style="font-size:14.5px;display:inline-flex;align-items:center;gap:8px">
            <svg viewBox="0 0 40 40" width="22" height="22" role="img" aria-label="Tistory blog" style="flex-shrink:0">
              <rect width="40" height="40" rx="11" fill="#EB531D"/>
              <text x="20" y="28" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-weight="700" fill="#fff">T</text>
            </svg>
            Dev blog (auto-published by AI)
          </strong>
          <span class="rss-badge">● RSS</span>
        </div>
        <div id="rss-items-tistory">
          <a class="rss-item" href="https://kangjung.tistory.com/" target="_blank" rel="noopener"><h4>Visit my Tistory blog</h4><p>Dev posts auto-published daily to Tistory — no official API</p></a>
        </div>
        <p class="rss-note">↳ Latest posts pulled from my Tistory blog — dev writing that an AI drafts, reviews, and publishes daily.</p>
      </div>
      <div class="rss-card">
        <div class="rss-top">
          <strong style="font-size:14.5px;display:inline-flex;align-items:center;gap:8px">
            <svg viewBox="0 0 40 40" width="22" height="22" role="img" aria-label="Naver blog" style="flex-shrink:0">
              <rect width="40" height="40" rx="11" fill="#03C75A"/>
              <text x="20" y="27" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#fff">blog</text>
            </svg>
            My Naver blog
          </strong>
          <span class="rss-badge">● RSS</span>
        </div>
        <div id="rss-items">
          <a class="rss-item" href="https://blog.naver.com/chicken_kangjung" target="_blank" rel="noopener"><h4>Visit my Naver blog</h4><p>Food · reviews · the occasional dev post</p></a>
        </div>
        <p class="rss-note">↳ Latest posts pulled from my Naver blog — food, reviews, and dev, not just code.</p>
      </div>
    </div>
  </section>
</main>
