# 스크린샷 자동 등록 폴더 / Auto-discovered screenshots

이 폴더 아래에 **슬러그(slug) 이름의 폴더**를 만들고 스크린샷 이미지를 넣으면,
빌드할 때 자동으로 해당 게임·앱의 상세 모달 갤러리에 표시됩니다. `appList.json`을
수정할 필요가 없어요.

Put images into a folder named after the item's **slug** and they automatically
appear in that item's detail-modal gallery at build time — no `appList.json` edit.

```
game/img/shots/
  zigzag-rabbit/   01.png  02.png  03.png ...
  dday-lite/       01.png  02.png ...
  emotion-calendar/ 01.png ...
```

## 규칙 / Rules

- **폴더 이름 = 슬러그**: `appList.json`의 각 항목 `slug` 값과 똑같이.
  (예: `zigzag-rabbit`, `planet-game`, `1010`, `lllilll`, `fruit-sandwich`,
   `wait-travel`, `dday-lite`, `why-am-i-paying`, `emotion-calendar`,
   `before-forget`, `survivors-like`)
- **순서 = 파일 이름순**: `01.png`, `02.png`, `03.png` … 처럼 번호를 붙이면 그 순서대로 나옵니다.
- 지원 형식: png / jpg / webp 등 (브라우저가 표시할 수 있는 이미지면 됨).
- `appList.json`의 항목에 `screenshots` 배열을 직접 적으면 **그쪽이 우선**합니다
  (외부 URL 이나 특수 케이스용).

빌드: `bundle exec jekyll build` (또는 `serve`).
