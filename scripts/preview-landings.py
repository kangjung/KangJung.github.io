"""Check responsive layouts and save representative screenshots to a supplied folder.

Usage: python scripts/preview-landings.py <output-directory>
Requires Playwright and Microsoft Edge. External embeds are blocked during checks.
"""

import functools
import http.server
import json
from pathlib import Path
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
output = Path(sys.argv[1]).resolve()
output.mkdir(parents=True, exist_ok=True)
items = json.loads((ROOT / "assets/appList.json").read_text(encoding="utf-8"))


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = http.server.ThreadingHTTPServer(
    ("127.0.0.1", 0), functools.partial(QuietHandler, directory=str(ROOT))
)
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_port}"
examples = {"secret-shelf", "dday-lite", "gym-again-today", "my-travel-pins", "planet-game", "why-am-i-paying"}
errors = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        page = browser.new_page()
        page.route("**/*", lambda route: route.continue_() if route.request.url.startswith(base) else route.abort())
        for width, height, label in ((1440, 1000, "desktop"), (390, 844, "mobile")):
            page.set_viewport_size({"width": width, "height": height})
            for item in items:
                group = "games" if item["type"] == "game" else "apps"
                for lang in ("ko", "en"):
                    path = f"/{group}/{item['slug']}/" + ("en/" if lang == "en" else "")
                    page.goto(base + path, wait_until="load")
                    if page.evaluate("document.documentElement.scrollWidth > innerWidth"):
                        errors.append(f"Horizontal overflow: {label} {path}")
                    broken = page.locator('img[src^="/"]').evaluate_all(
                        "imgs => imgs.filter(i => i.loading !== 'lazy' && (!i.complete || !i.naturalWidth)).map(i => i.src)"
                    )
                    if broken:
                        errors.append(f"Broken hero images: {path}: {broken}")
                    if lang == "ko" and item["slug"] in examples:
                        page.screenshot(path=str(output / f"{item['slug']}-{label}.png"), full_page=True)
        browser.close()
finally:
    server.shutdown()
if errors:
    raise SystemExit("\n".join(errors))
print("84 desktop/mobile page checks passed. Screenshots:", output)
