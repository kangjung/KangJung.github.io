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
      <span class="eyebrow reveal">Just Making Things</span>
      <h1 class="reveal" style="animation-delay:.05s">이것저것,<br>만들어 보고 싶은<br><span class="accent">간단한 것들.</span></h1>
      <p class="hero-sub reveal" style="animation-delay:.12s">
        거창한 목표는 없어요. 그냥 만들어 보고 싶은 게임·앱 등을
        그때그때 가볍게 만듭니다. 본업은 웹 개발이고, 이건 취미예요.
      </p>
      <div class="stats reveal" style="animation-delay:.18s">
        <div class="stat"><div class="num" id="stat-games">9</div><div class="lab">게임</div></div>
        <div class="stat"><div class="num" id="stat-apps">5</div><div class="lab">앱과 서비스</div></div>
        <div class="stat"><div class="num" id="stat-tools">5</div><div class="lab">웹 도구</div></div>
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
      <h2>게임</h2>
      <p>Unity와 HTML5로 만들어 여러 스토어에 출시했어요.</p>
    </div>
    <div class="grid games" id="games-grid"></div>
  </section>

  <section id="apps" class="wrap">
    <div class="sec-head">
      <span class="eyebrow">Apps &amp; Services</span>
      <h2>앱과 서비스</h2>
      <p>일상에서 쓸 만한 작은 앱과 서비스.</p>
    </div>
    <div class="grid apps" id="apps-grid"></div>
  </section>

  <section id="tools" class="wrap">
    <div class="sec-head">
      <span class="eyebrow">Other</span>
      <h2>기타</h2>
      <p>브라우저에서 바로 쓰는 것부터 작은 유틸리티까지 모아뒀어요.</p>
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
          <p>자주 쓰는 브라우저 개발자 기능 모음. 설치 없이 바로.</p>
          <div class="meta-row"><span class="tag">WEB</span><span class="stores"><span class="store-chip">바로 사용 ↗</span></span></div></div></a>

      <a class="card" href="{{ site.baseurl }}/js-edge-cases/">
        <div class="card-art emoji" style="background:linear-gradient(145deg,#111827,#00d4ff);color:#fff">JS</div>
        <div class="card-body"><div class="card-title"><h3>JavaScript Edge Cases</h3></div>
          <p>자바스크립트의 헷갈리는 형변환, 비교, 정렬 같은 엣지 케이스를 퀴즈처럼 살펴보는 인터랙티브 페이지.</p>
          <div class="meta-row"><span class="tag">JAVASCRIPT</span><span class="stores"><span class="store-chip">바로 보기 ↗</span></span></div></div></a>

      <a class="card" href="https://github.com/kangjung/kakaowork-backup" target="_blank" rel="noopener">
        <div class="card-art emoji" style="background:linear-gradient(145deg,#ffe45c,#ff9f1c);color:#14151a">💬</div>
        <div class="card-body"><div class="card-title"><h3>KakaoWork Backup</h3></div>
          <p>카카오워크 대화와 자료를 보관하기 위한 백업 유틸리티. GitHub에서 코드와 사용 방법을 확인할 수 있어요.</p>
          <div class="meta-row"><span class="tag">BACKUP</span><span class="stores"><span class="store-chip">GitHub ↗</span></span></div></div></a>

      <a class="card" href="https://github.com/kangjung/Disable-CSP" target="_blank" rel="noopener">
        <div class="card-art emoji" style="background:linear-gradient(145deg,#ef4444,#111827);color:#fff">CSP</div>
        <div class="card-body"><div class="card-title"><h3>Disable-CSP</h3></div>
          <p>현재 페이지의 Content Security Policy를 비활성화하는 브라우저 확장 프로그램. 테스트와 디버깅용입니다.</p>
          <div class="meta-row"><span class="tag">EXTENSION</span><span class="stores"><span class="store-chip">GitHub ↗</span></span></div></div></a>
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
          <strong style="font-size:14.5px;display:inline-flex;align-items:center;gap:8px">
            <svg viewBox="0 0 40 40" width="22" height="22" role="img" aria-label="티스토리 블로그" style="flex-shrink:0">
              <rect width="40" height="40" rx="11" fill="#EB531D"/>
              <text x="20" y="28" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-weight="700" fill="#fff">T</text>
            </svg>
            개발 이야기 (AI 자동 발행)
          </strong>
          <span class="rss-badge">● RSS</span>
        </div>
        <div id="rss-items-tistory">
          <a class="rss-item" href="https://kangjung.tistory.com/" target="_blank" rel="noopener"><h4>티스토리 블로그 바로가기</h4><p>공식 API 없는 티스토리에 매일 자동 발행하는 개발 글</p></a>
        </div>
        <p class="rss-note">↳ 티스토리 최신 글을 자동으로 불러와요. AI가 매일 작성·검수해 발행하는 개발 글입니다.</p>
      </div>
      <div class="rss-card">
        <div class="rss-top">
          <strong style="font-size:14.5px;display:inline-flex;align-items:center;gap:8px">
            <svg viewBox="0 0 40 40" width="22" height="22" role="img" aria-label="네이버 블로그" style="flex-shrink:0">
              <rect width="40" height="40" rx="11" fill="#03C75A"/>
              <text x="20" y="27" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#fff">blog</text>
            </svg>
            먹는거, 간간히 다른거
          </strong>
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
