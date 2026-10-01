"""Build static, bilingual landing pages from assets/appList.json.

Run from the repository root: python scripts/generate-landings.py
Only directories named by appList entries are written.
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from landing_profiles import PROFILES


ROOT = Path(__file__).resolve().parents[1]
BASE = "https://kangjung.github.io"
ITEMS = [
    item for item in json.loads((ROOT / "assets/appList.json").read_text(encoding="utf-8"))
    if item.get("landingMode") != "manual"
]
COPY = {
    "ko": {
        "home": "KangJung 홈", "games": "게임", "apps": "앱",
        "eyebrow_game": "GAME", "eyebrow_app": "APP",
        "play": "플레이하고 다운로드하기", "features": "주요 특징",
        "screenshots": "화면 보기", "about": "소개",
        "more": "다른 작품 보기", "privacy": "개인정보 처리방침",
        "contact": "문의", "video": "플레이 영상",
        "note": "기능과 스토어 제공 여부는 변경될 수 있습니다.",
    },
    "en": {
        "home": "KangJung home", "games": "Games", "apps": "Apps",
        "eyebrow_game": "GAME", "eyebrow_app": "APP",
        "play": "Play or download", "features": "Highlights",
        "screenshots": "Screenshots", "about": "About",
        "more": "Explore more", "privacy": "Privacy policy",
        "contact": "Contact", "video": "Gameplay video",
        "note": "Features and store availability may change.",
    },
}


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def localized(value: object, lang: str) -> str:
    if isinstance(value, dict):
        return str(value.get(lang) or value.get("ko") or value.get("en") or "")
    return str(value or "")


def asset(value: object, lang: str) -> str:
    path = localized(value, lang)
    if not path:
        return ""
    if path.startswith("./"):
        return "/game" + path[1:]
    return path


def screenshots(item: dict, lang: str) -> list[str]:
    manual = item.get("screenshots")
    if manual:
        shots = manual.get(lang) or manual.get("ko") if isinstance(manual, dict) else manual
        return [asset(path, lang) for path in shots]
    folder = ROOT / "game" / "img" / "shots" / item["slug"]
    if not folder.is_dir():
        return []
    return [
        "/game/img/shots/" + item["slug"] + "/" + path.name
        for path in sorted(folder.iterdir())
        if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"}
    ]


def prose(raw: str) -> tuple[list[str], list[str]]:
    paragraphs, bullets = [], []
    for block in re.split(r"\n\s*\n", raw.strip()):
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        plain = []
        for line in lines:
            if line.startswith(("- ", "* ")):
                bullets.append(line[2:].strip())
            elif line.lower() not in {"주요 기능", "주요 기능:", "key features", "key features:"}:
                plain.append(line)
        if plain:
            paragraphs.append(" ".join(plain))
    return paragraphs, bullets


def render(item: dict, lang: str) -> str:
    slug, kind = item["slug"], item["type"]
    group = "games" if kind == "game" else "apps"
    c = COPY[lang]
    variant, accent, paper, ink, headline_ko, headline_en, highlights = PROFILES[slug]
    headline = headline_ko if lang == "ko" else headline_en
    highlight_html = "".join(
        f'<div><span class="highlight-number">0{i}</span><p>{esc(pair[0 if lang == "ko" else 1])}</p></div>'
        for i, pair in enumerate(highlights, 1)
    )
    title = localized(item.get("title"), lang)
    desc = localized(item.get("desc"), lang)
    long_desc = localized(item.get("longDesc"), lang) or desc
    paragraphs, bullets = prose(long_desc)
    features = item.get("features")
    if isinstance(features, dict):
        bullets = features.get(lang) or features.get("ko") or bullets
    icon = asset(item.get("icon"), lang)
    cover = asset(item.get("img"), lang) or icon
    shots = screenshots(item, lang)
    page_path = f"/{group}/{slug}/" + ("en/" if lang == "en" else "")
    url = BASE + page_path
    ko_url = BASE + f"/{group}/{slug}/"
    en_url = ko_url + "en/"
    other = "../" if lang == "en" else "en/"
    other_lang = "한국어" if lang == "en" else "English"
    page_title = f"{title} | KangJung"
    lead = desc if desc else paragraphs[0]
    stores = item.get("stores") or []
    store_links = "".join(
        f'<a class="store-button" href="{esc(s["url"])}" target="_blank" rel="noopener noreferrer">'
        f'{esc(s["name"])} <span aria-hidden="true">↗</span></a>'
        for s in stores
    )
    if item.get("status") == "developing":
        store_links = '<span class="status">' + ("개발 중" if lang == "ko" else "In development") + "</span>"
    icon_html = f'<img class="app-icon" src="{esc(icon)}" alt="" width="84" height="84">' if icon else ""
    cover_html = (
        f'<img src="{esc(cover)}" alt="{esc(title)}" loading="eager">'
        if cover else f'<span class="cover-fallback">{esc(title)}</span>'
    )
    body = "".join(f"<p>{esc(p)}</p>" for p in paragraphs)
    if kind == "app" and shots:
        cover_html = (
            '<div class="screen-composition">'
            f'<img class="screen-primary" src="{esc(shots[0])}" alt="{esc(title)} — {"앱 화면" if lang == "ko" else "app screen"}" fetchpriority="high">'
            + (f'<img class="screen-secondary" src="{esc(shots[1])}" alt="{esc(title)} — {"다른 화면" if lang == "ko" else "another screen"}" loading="eager">' if len(shots) > 1 else "")
            + '</div>'
        )
    feature_html = (
        f'<section class="section"><h2>{c["features"]}</h2><ul class="features">'
        + "".join(f"<li>{esc(f)}</li>" for f in bullets) + "</ul></section>"
        if bullets else ""
    )
    gallery = [
        shot for shot in shots if shot != cover
    ]
    gallery_html = (
        f'<section class="section"><h2>{c["screenshots"]}</h2><div class="gallery">'
        + "".join(f'<a href="{esc(shot)}" target="_blank" rel="noopener"><img src="{esc(shot)}" alt="{esc(title)} screenshot {i}" loading="lazy"></a>' for i, shot in enumerate(gallery, 1))
        + "</div></section>"
        if gallery else ""
    )
    video = item.get("video", "")
    video_id = urlparse(video).path.split("/")[-1] if video else ""
    # Some legacy embeds have an outdated path but the correct clip in playlist.
    playlist_id = parse_qs(urlparse(video).query).get("playlist", [""])[0] if video else ""
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", playlist_id) and playlist_id != video_id:
        video_id = playlist_id
    video_html = (
        f'<section class="section"><h2>{c["video"]}</h2><div class="video">'
        f'<iframe src="https://www.youtube-nocookie.com/embed/{esc(video_id)}" title="{esc(title)}" loading="lazy" allowfullscreen></iframe>'
        "</div></section>"
        if re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id) else ""
    )
    privacy = (
        '<a href="/privacy">' + c["privacy"] + "</a>"
        if kind == "app" or any("play.google.com" in s.get("url", "") for s in stores)
        else ""
    )
    schema = {
        "@context": "https://schema.org",
        "@type": "MobileApplication" if kind == "app" else "VideoGame",
        "name": title, "description": lead, "url": url,
        "image": BASE + cover if cover.startswith("/") else cover, "inLanguage": lang,
        "author": {"@type": "Person", "name": "KangJung", "url": BASE + "/"},
    }
    if kind == "app":
        schema["operatingSystem"] = "Android"
    if stores:
        schema["sameAs"] = [s["url"] for s in stores]
    schema_json = json.dumps(schema, ensure_ascii=False).replace("</", "<\\/")
    return f'''<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="{paper}">
  <title>{esc(page_title)}</title>
  <meta name="description" content="{esc(lead)}">
  <link rel="canonical" href="{esc(url)}">
  <link rel="alternate" hreflang="ko" href="{esc(ko_url)}">
  <link rel="alternate" hreflang="en" href="{esc(en_url)}">
  <link rel="alternate" hreflang="x-default" href="{esc(ko_url)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{esc(page_title)}">
  <meta property="og:description" content="{esc(lead)}">
  <meta property="og:url" content="{esc(url)}">
  <meta property="og:image" content="{esc(BASE + cover if cover.startswith('/') else cover)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/assets/landing.css">
  <script type="application/ld+json">{schema_json}</script>
</head>
<body class="product-{kind} design-{variant}" style="--accent:{accent};--paper:{paper};--ink:{ink}">
  <a class="skip" href="#main">{"본문으로" if lang == "ko" else "Skip to content"}</a>
  <header class="site-header"><div class="wrap header-inner">
    <a class="brand product-brand" href="./">{icon_html}<span>{esc(title)}</span></a>
    <nav aria-label="{"페이지 이동" if lang == "ko" else "Page navigation"}">
      <a href="/{'' if lang == 'ko' else 'en/'}#{group}">{c["games"] if kind == "game" else c["apps"]}</a>
      <a href="{other}" lang="{"ko" if lang == "en" else "en"}" hreflang="{"ko" if lang == "en" else "en"}">{other_lang}</a>
    </nav>
  </div></header>
  <main id="main">
    <section class="hero wrap">
      <div class="hero-copy">
        <p class="eyebrow">{esc(title)} <span>·</span> {"ANDROID" if kind == "app" else "PLAY BY KANGJUNG"}</p>
        <h1>{'<br>'.join(esc(line) for line in headline.splitlines())}</h1>
        <p class="lead">{esc(lead)}</p>
        <div class="actions">{store_links}</div>
      </div>
      <div class="hero-media">{cover_html}</div>
    </section>
    <section class="highlights wrap" aria-label="{c["features"]}">{highlight_html}</section>
    <div class="content wrap">
      <section class="section intro"><h2>{c["about"]}</h2>{body}</section>
      {feature_html}
      {gallery_html}
      {video_html}
      <section class="closing"><p class="eyebrow">{esc(title)}</p><h2>{"지금 시작해 보세요." if lang == "ko" else "Make it yours."}</h2>
        <div class="actions">{store_links}</div>
        <a class="back-link" href="/{'' if lang == 'ko' else 'en/'}#{group}">{c["home"]} <span aria-hidden="true">↗</span></a>
      </section>
    </div>
  </main>
  <footer class="site-footer"><div class="wrap footer-inner"><span>© KangJung</span><nav>{privacy}<a href="mailto:aaggf1112@gmail.com">{c["contact"]}</a></nav></div></footer>
</body>
</html>
'''


def main() -> None:
    for item in ITEMS:
        if not re.fullmatch(r"[a-z0-9-]+", item["slug"]):
            raise ValueError(f"Invalid slug: {item['slug']}")
        group = "games" if item["type"] == "game" else "apps"
        for lang in ("ko", "en"):
            folder = ROOT / group / item["slug"]
            if lang == "en":
                folder = folder / "en"
            folder.mkdir(parents=True, exist_ok=True)
            (folder / "index.html").write_text(render(item, lang), encoding="utf-8", newline="\n")
    print(f"Generated {len(ITEMS) * 2} pages for {len(ITEMS)} titles.")


if __name__ == "__main__":
    main()
