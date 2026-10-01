"""Check generated landing pages and local assets."""

import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
items = json.loads((root / "assets/appList.json").read_text(encoding="utf-8"))
errors = []
for item in items:
    group = "games" if item["type"] == "game" else "apps"
    for lang in ("ko", "en"):
        path = root / group / item["slug"]
        if lang == "en":
            path /= "en"
        path /= "index.html"
        if not path.exists():
            errors.append(f"Missing page: {path}")
            continue
        source = path.read_text(encoding="utf-8")
        for attr in re.findall(r'(?:src|href)="(/(?:game|assets)/[^"]+)"', source):
            if not (root / attr.lstrip("/")).exists():
                errors.append(f"Broken local reference: {path}: {attr}")
        for required in ('rel="canonical"', 'hreflang="ko"', 'hreflang="en"', 'application/ld+json'):
            if required not in source:
                errors.append(f"Missing metadata: {path}: {required}")
        if f'<html lang="{lang}">' not in source:
            errors.append(f"Wrong language: {path}")
print(f"Checked {len(items) * 2} landing pages.")
if errors:
    raise SystemExit("\n".join(errors))
print("All pages and local references passed.")
