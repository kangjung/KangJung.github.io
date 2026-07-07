---
# Lost Canvas — 인터랙티브 404 (독립형 레이아웃)
# 테마 기본 not-found 레이아웃을 대체하되, redirect_from 과 다국어 리다이렉트는 유지한다.
---
{%- comment -%} 현재 페이지의 언어 판별 (루트=ko, /en/=en) {%- endcomment -%}
{%- include multi_lng/get-lng-by-url.liquid -%}
{%- assign lng = get_lng -%}
{%- include multi_lng/get-lng-code.liquid lng = lng -%}
{%- assign c = site.data.lang[lng].not_found.canvas -%}
<!DOCTYPE html>
<html lang="{{ lng_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
  <meta name="robots" content="noindex">
  <title>{{ c.doc_title }}</title>
  <meta name="theme-color" content="#F8F8F6" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#171719" media="(prefers-color-scheme: dark)">
  <link rel="icon" href="{{ '/assets/img/favicons/favicon.ico' | relative_url }}">
  <link rel="icon" type="image/png" sizes="32x32" href="{{ '/assets/img/favicons/favicon-32x32.png' | relative_url }}">
  <link rel="apple-touch-icon" href="{{ '/assets/img/favicons/apple-touch-icon.png' | relative_url }}">
  <link rel="stylesheet" href="{{ '/assets/css/404.css' | relative_url }}">
</head>
<body>
  <!-- 캔버스 뷰포트: 실제 pan/zoom 이 일어나는 영역 -->
  <main id="lc-viewport" class="lc-viewport" aria-label="{{ c.doc_title }}">
    <!-- 배경 점 그리드 (transform 과 별개로 background-position/size 로 이동) -->
    <div id="lc-grid" class="lc-grid" aria-hidden="true"></div>

    <!-- 월드: 여기에 translate + scale 이 적용된다. 자식 오브젝트는 월드 좌표에 배치. -->
    <!-- 404 숫자·이미지 타일·홈·GitHub 오브젝트는 모두 404.js 가 좌표와 함께 생성한다. -->
    <div id="lc-world" class="lc-world"></div>

    <!-- 고정 컨트롤 바: 캔버스 transform 의 영향을 받지 않는다. (홈은 캔버스 안쪽 오브젝트) -->
    <div class="lc-controls" role="group" aria-label="{{ c.doc_title }}">
      <button type="button" id="lc-reset" class="lc-btn">{{ c.reset }}</button>
      <span class="lc-zoom-group">
        <button type="button" id="lc-zoom-out" class="lc-icon-btn" aria-label="{{ c.zoom_out }}">&minus;</button>
        <span id="lc-zoom-val" class="lc-zoom-val" aria-live="polite">100%</span>
        <button type="button" id="lc-zoom-in" class="lc-icon-btn" aria-label="{{ c.zoom_in }}">+</button>
      </span>
    </div>

    <!-- 도움말 (키보드 조작 안내) -->
    <div class="lc-help-wrap">
      <button type="button" id="lc-help-toggle" class="lc-icon-btn" aria-label="{{ c.help }}" aria-expanded="false">?</button>
      <div id="lc-help" class="lc-help" hidden>
        <strong>{{ c.help_title }}</strong>
        <ul>
          {%- for line in c.help_lines %}
          <li>{{ line }}</li>
          {%- endfor %}
        </ul>
      </div>
    </div>

    <!-- 자동 안내 힌트 -->
    <div id="lc-hint" class="lc-hint" aria-hidden="true">{{ c.hint_drag }}</div>
  </main>

  <script>
    // Liquid 로 주입되는 설정: 문구(다국어)와 홈 경로. 좌표/로직은 404.js 가 담당.
    window.LOST_CANVAS = {
      home: {{ '/' | relative_url | jsonify }},
      i18n: {{ c | jsonify }}
    };
  </script>

  {%- comment -%}
    다국어 리다이렉트: 기본 언어(루트) 404 에서, 요청 경로가 지원 언어 폴더(/en/ 등)로
    시작하면 해당 언어의 404 로 넘긴다. 테마 기본 not-found 동작을 간략화해 유지.
  {%- endcomment -%}
  {%- if lng == site.data.conf.main.default_lng %}
  <script>
    (function () {
      var langs = {{ site.data.conf.main.language_switch_lang_list | jsonify }};
      var base = {{ site.baseurl | jsonify }};
      if (location.pathname === base + "/404.html") return; // 실제 404.html 직접 접근이면 두지 않음
      var seg = location.pathname.replace(base, "").split("/").filter(Boolean)[0];
      if (seg && langs.indexOf(seg) !== -1 && seg !== {{ site.data.conf.main.default_lng | jsonify }}) {
        location.replace(base + "/" + seg + "/404.html");
      }
    })();
  </script>
  {%- endif %}

  <script src="{{ '/assets/js/404.js' | relative_url }}" defer></script>
</body>
</html>
