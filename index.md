---
layout: hub
lng_pair: id_home
title: "게임 · 앱 · 도구를 만드는 사람"
# image for SEO / social cards
img: ":banner.png"
---

{%- include multi_lng/get-pages-by-lng.liquid pages = site.posts -%}

<header class="hero">
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow reveal">Indie Maker · Seoul</span>
      <h1 class="reveal" style="animation-delay:.05s">게임도 앱도,<br>직접 만들어<br><span class="accent">세상에 내놓습니다.</span></h1>
      <p class="hero-sub reveal" style="animation-delay:.12s">
        Unity·HTML5 게임, Android 앱, 브라우저에서 바로 쓰는 웹 도구까지 혼자 만들어
        <strong>Google Play · 원스토어 · Whale · itch.io</strong>에 내놓아요.
        만들면서 배운 것들은 기록으로 남깁니다.
      </p>
      <div class="stats reveal" style="animation-delay:.18s">
        <div class="stat"><div class="num">6</div><div class="lab">게임</div></div>
        <div class="stat"><div class="num">5</div><div class="lab">앱 · 서비스</div></div>
        <div class="stat"><div class="num">2</div><div class="lab">웹 도구</div></div>
      </div>
      <div class="cta-row reveal" style="animation-delay:.24s">
        <a class="btn btn-primary" href="#games">만든 게임 보기 →</a>
        <a class="btn btn-ghost" href="#apps">앱 둘러보기</a>
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
      <h2>직접 만든 게임</h2>
      <p>Unity와 HTML5로 만들어 여러 스토어에 출시했어요.</p>
    </div>
    <div class="grid games" id="games-grid"></div>
  </section>

  <section id="apps" class="wrap">
    <div class="sec-head">
      <span class="eyebrow">Apps &amp; Service</span>
      <h2>만든 앱과 서비스</h2>
      <p>일상에서 쓸 만한 작은 도구들, 그리고 공모전 출품 웹서비스.</p>
    </div>
    <div class="grid apps" id="apps-grid"></div>
  </section>

  <section id="tools" class="wrap">
    <div class="sec-head">
      <span class="eyebrow">Tools</span>
      <h2>브라우저에서 바로 쓰는 도구</h2>
      <p>설치 없이 열면 끝. 별도 사이트로 운영하는 웹 도구들이에요.</p>
    </div>
    <div class="grid apps">
      <a class="card" href="{{ site.baseurl }}/remove-background/">
        <div class="card-art emoji" style="background:linear-gradient(145deg,#9b7bff,#3d5afe);color:#fff">🪄</div>
        <div class="card-body"><div class="card-title"><h3>배경 제거 · AI 누끼</h3></div>
          <p>이미지 배경을 자동으로 지워 투명 PNG로 저장. WebAssembly로 브라우저 안에서만 처리해 서버 전송이 없어요. 최대 20장 일괄 처리.</p>
          <div class="meta-row"><span class="tag">WEBASSEMBLY</span><span class="stores"><span class="store-chip">바로 사용 ↗</span></span></div></div></a>

      <a class="card" href="{{ site.baseurl }}/tool/">
        <div class="card-art emoji" style="background:linear-gradient(145deg,#3fb5ff,#15c9a0);color:#fff">🧰</div>
        <div class="card-body"><div class="card-title"><h3>DevBox</h3></div>
          <p>자주 쓰는 브라우저 개발자 도구 모음. 설치 없이 바로.</p>
          <div class="meta-row"><span class="tag">WEB</span><span class="stores"><span class="store-chip">바로 사용 ↗</span></span></div></div></a>
    </div>
  </section>

  <section class="wrap lower">
    <div id="notes">
      <div class="sec-head">
        <span class="eyebrow">Writing</span>
        <h2>블로그</h2>
        <p>컨퍼런스, 게임잼, 만들면서 배운 것들.</p>
      </div>
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
        <p style="color:var(--muted)">아직 글이 없어요.</p>
      {%- endif -%}
    </div>

    <div id="elsewhere">
      <div class="sec-head">
        <span class="eyebrow">Elsewhere</span>
        <h2>다른 곳에 쓰는 글</h2>
      </div>
      <div class="rss-card">
        <div class="rss-top">
          <strong style="font-size:14.5px">📡 먹는거, 간간히 다른거</strong>
          <span class="rss-badge">● RSS</span>
        </div>
        <div id="rss-items">
          <a class="rss-item" href="https://blog.naver.com/chicken_kangjung" target="_blank" rel="noopener"><h4>네이버 블로그 바로가기</h4><p>먹은 거 · 리뷰 · 가끔 개발 이야기</p></a>
        </div>
        <p class="rss-note">↳ 네이버 블로그 최신 글을 자동으로 불러와요. 개발뿐 아니라 먹은 거·리뷰 같은 일상 글도 씁니다.</p>
      </div>
    </div>
  </section>
</main>
