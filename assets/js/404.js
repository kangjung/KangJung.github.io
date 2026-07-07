/* =========================================================================
   Lost Canvas — 인터랙티브 404 로직 (Vanilla JS, 외부 의존성 없음)

   좌표 모델
   ---------
   화면(screen) 좌표와 월드(world) 좌표를 아래 관계로 변환한다.
       screenX = worldX * scale + tx
       worldX  = (screenX - tx) / scale
   #lc-world 요소에 `translate(tx, ty) scale(scale)` 를 적용하고,
   각 오브젝트는 자신의 월드 좌표에 `translate(x, y) translate(-50%, -50%)` 로 배치한다.
   ========================================================================= */
(function () {
  "use strict";

  var CFG = window.LOST_CANVAS || { home: "/", i18n: {} };
  var I18N = CFG.i18n || {};
  var NOTES = I18N.notes || [];

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var MIN_SCALE = 0.2;
  var MAX_SCALE = 1.8;
  var GRID = 24; // 점 그리드 간격(월드 px)

  // ---- DOM ----
  var viewport = document.getElementById("lc-viewport");
  var world    = document.getElementById("lc-world");
  var grid     = document.getElementById("lc-grid");
  var zoomVal  = document.getElementById("lc-zoom-val");
  var hint     = document.getElementById("lc-hint");

  // ---- 상태 ----
  var state = { x: 0, y: 0, scale: 1 };
  var dirty = true;

  // ================= 오브젝트 정의 =================
  // 좌표는 언어 무관(월드 고정). 404 숫자·이미지 타일·홈은 모두 캔버스 안쪽 오브젝트이며
  // 드래그해 옮기거나 던질 수 있다(홈은 짧게 탭하면 이동). 여기서 전부 생성한다.
  var GITHUB_URL = "https://github.com/kangjung";

  // 홈 방향 표지판이 참조할 요소들 (홈이 움직이면 화살표가 따라 회전)
  var homeEl = null, signEl = null, signArrowEl = null;

  // 사진 대신 쓰는 SVG 모티프 (흰색 선/면). viewBox 0 0 100 70.
  var MOTIFS = {
    sun: '<circle cx="50" cy="35" r="13"/><path d="M50 8v7M50 55v7M22 35h7M71 35h7M31 16l5 5M64 49l5 5M69 16l-5 5M36 49l-5 5"/>',
    mountains: '<path d="M8 56h84"/><path d="M18 56l18-26 14 18 9-13 17 21"/><circle cx="74" cy="19" r="6"/>',
    waves: '<path d="M6 28q11-11 22 0t22 0 22 0 22 0"/><path d="M6 44q11-11 22 0t22 0 22 0 22 0"/>',
    blob: '<path d="M50 12c18 0 31 9 31 25s-15 21-31 21-31-7-31-23 13-23 31-23z"/>',
    dots: '<g fill="rgba(255,255,255,0.92)" stroke="none"><circle cx="28" cy="22" r="5"/><circle cx="50" cy="22" r="5"/><circle cx="72" cy="22" r="5"/><circle cx="28" cy="42" r="5"/><circle cx="50" cy="42" r="5"/><circle cx="72" cy="42" r="5"/></g>',
    star: '<path d="M50 12l9 19 20 3-15 14 4 21-18-10-18 10 3-21-14-14 20-3z"/>',
    q: '<path d="M38 27a12 12 0 1 1 18 10c-4 3-6 5-6 10"/><circle cx="50" cy="58" r="3" fill="rgba(255,255,255,0.92)" stroke="none"/>'
  };

  // 그라디언트 프리셋 (포인트 컬러 조합)
  var GRADS = {
    coral:  ["#F6C85F", "#F28B82"],
    blue:   ["#5B8FF9", "#52C7A5"],
    purple: ["#8B7CF6", "#5B8FF9"],
    mint:   ["#52C7A5", "#F6C85F"],
    yellow: ["#F6C85F", "#F28B82"],
    bluep:  ["#5B8FF9", "#8B7CF6"],
    coralp: ["#F28B82", "#8B7CF6"]
  };

  function buildObjects() {
    var defs = [
      // 중심 404 — 세 숫자를 각각 잡아서 옮기거나 던질 수 있다
      { type: "digit", x: -210, y: 0, char: "4" },
      { type: "digit", x:    0, y: 0, char: "0" },
      { type: "digit", x:  210, y: 0, char: "4" },
      // 홈 방향을 가리키는 표지판 (홈 위치에 따라 화살표가 회전)
      { type: "signpost", x: 0, y: 430 },
      // 드래그 가능한 이미지 타일
      { type: "tile", x: -560, y: -300, photo: "sun",       grad: "coral",  rotate: -5 },
      { type: "tile", x:  600, y: -340, photo: "mountains", grad: "blue",   rotate:  4 },
      { type: "tile", x:  900, y:  260, photo: "waves",     grad: "purple", rotate: -3 },
      { type: "tile", x: -860, y:  240, photo: "blob",      grad: "mint",   rotate:  6 },
      { type: "tile", x: 1300, y: -170, photo: "dots",      grad: "yellow", rotate: -6 },
      { type: "tile", x: -360, y:  580, photo: "star",      grad: "bluep",  rotate:  3 },
      { type: "tile", x: 1420, y:  580, photo: "sun",       grad: "coralp", rotate:  5 },
      // 배경 장식(드래그 불가)
      { type: "ring",   x: -1140, y: -80 },
      { type: "circle", x: 1120, y:  460 },
      // 홈: 하단 고정 버튼 대신 캔버스 안쪽 오브젝트로
      { type: "home",   x: 1650, y:  900 },
      // 멀리 숨겨둔 발견 요소
      { type: "tile",   x: 2500, y: -1450, photo: "q", grad: "purple", rotate: -4 },
      { type: "github", x: -2200, y: 1350 }
    ];

    var frag = document.createDocumentFragment();
    defs.forEach(function (d) {
      var el = renderObject(d);
      if (!el) return;
      el.dataset.x = d.x;
      el.dataset.y = d.y;
      if (d.rotate) el.dataset.rotate = d.rotate;
      frag.appendChild(el);
    });
    world.appendChild(frag);
  }

  function renderObject(d) {
    if (d.type === "tile")     return renderTile(d);
    if (d.type === "digit")    return renderDigit(d);
    if (d.type === "home")     return renderHome(d);
    if (d.type === "github")   return renderGithub(d);
    if (d.type === "signpost") return renderSignpost(d);
    // 배경 장식 도형 (드래그 불가)
    var el = document.createElement("div");
    el.className = "lc-obj";
    switch (d.type) {
      case "circle": el.className += " lc-shape circle"; break;
      case "square": el.className += " lc-shape square"; break;
      case "ring":   el.className += " lc-shape ring";   break;
      default: return null;
    }
    return el;
  }

  // 드래그·던지기 가능한 404 숫자 하나
  function renderDigit(d) {
    var el = document.createElement("div");
    el.className = "lc-obj lc-digit lc-draggable";
    el.textContent = d.char;
    el.setAttribute("aria-hidden", "true");
    return el;
  }

  // 홈 방향 도로 안내 표지판(고정, 클릭 대상 아님). 화살표가 홈 오브젝트를 향해 회전한다.
  function renderSignpost() {
    var el = document.createElement("div");
    el.className = "lc-obj lc-signpost";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<span class="lc-sign-board">' +
        '<span class="lc-sign-text">HOME</span>' +
        '<svg class="lc-signpost-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
             'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' +
          '<line x1="3" y1="12" x2="19" y2="12"/><polyline points="13,6 20,12 13,18"/></svg>' +
      '</span>' +
      '<span class="lc-sign-post"></span>';
    signEl = el;
    signArrowEl = el.querySelector(".lc-signpost-arrow");
    return el;
  }

  // 표지판 화살표를 홈의 현재 위치 방향으로 회전
  function updateSignpost() {
    if (!signArrowEl || !homeEl || !signEl) return;
    var hx = parseFloat(homeEl.dataset.x) || 0;
    var hy = parseFloat(homeEl.dataset.y) || 0;
    var sx = parseFloat(signEl.dataset.x) || 0;
    var sy = parseFloat(signEl.dataset.y) || 0;
    var deg = Math.atan2(hy - sy, hx - sx) * 180 / Math.PI; // 화살표 기본 방향=오른쪽(0deg)
    signArrowEl.style.transform = "rotate(" + deg + "deg)";
  }

  // 드래그 가능한 이미지 타일(폴라로이드 느낌). 실제 사진 대신 CSS 그라디언트 + SVG 모티프.
  // 실제 이미지로 바꾸려면 .lc-photo 내부를 <img> 로 교체하면 된다.
  function renderTile(d) {
    var g = GRADS[d.grad] || GRADS.purple;
    var el = document.createElement("div");
    el.className = "lc-obj lc-tile lc-draggable";
    el.setAttribute("role", "img");
    el.innerHTML =
      '<div class="lc-photo" style="background:linear-gradient(135deg,' + g[0] + ',' + g[1] + ')">' +
        '<svg viewBox="0 0 100 70" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="4" ' +
             'stroke-linecap="round" stroke-linejoin="round">' + (MOTIFS[d.photo] || "") + '</svg>' +
      '</div>';
    return el;
  }

  // 홈: 캔버스 안쪽 오브젝트. 드래그/던지기 가능하고, 짧게 탭(클릭)하면 홈으로 이동.
  function renderHome() {
    var a = document.createElement("a");
    a.className = "lc-obj lc-home-obj lc-draggable";
    a.href = CFG.home;
    a.draggable = false; // 네이티브 링크 드래그(고스트) 방지 — 드래그는 직접 처리
    a.dataset.home = "1";
    a.setAttribute("aria-label", I18N.home || "Home");
    a.innerHTML =
      '<span class="lc-home-card">' +
        '<svg class="lc-home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>' +
        '<span>' + (I18N.home_badge || "HOME") + '</span>' +
      '</span>' +
      '<span class="lc-home-label">' + (I18N.home_label || "") + '</span>';
    a.addEventListener("click", function (e) {
      e.preventDefault();
      if (homeDragged) { homeDragged = false; return; } // 드래그였으면 이동 안 함
      goHome();
    });
    homeEl = a; // 표지판이 방향을 계산할 기준
    return a;
  }

  // 멀리 숨겨둔 GitHub 오브젝트. 발견하면 새 탭으로 프로필 이동. (드래그/탭 동일 규칙)
  function renderGithub() {
    var a = document.createElement("a");
    a.className = "lc-obj lc-github-obj lc-draggable";
    a.href = GITHUB_URL;
    a.target = "_blank";
    a.rel = "noopener";
    a.draggable = false;
    a.dataset.home = "1"; // 탭/드래그 구분 로직 재사용 (탭이면 링크 이동)
    a.setAttribute("aria-label", "GitHub");
    a.innerHTML =
      '<span class="lc-github-card">' +
        '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">' +
          '<path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-1.8c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>' +
        '</svg>' +
        '<span>@kangjung</span>' +
      '</span>';
    a.addEventListener("click", function (e) {
      e.preventDefault(); // 키보드 Enter 대응. 포인터 탭은 endPointer 에서 처리.
      if (homeDragged) { homeDragged = false; return; }
      openGithub();
    });
    return a;
  }

  // 오브젝트 하나를 자신의 월드 좌표에 배치 (scale 은 부모 world 가 담당)
  function placeOne(el) {
    var x = parseFloat(el.dataset.x) || 0;
    var y = parseFloat(el.dataset.y) || 0;
    var rot = el.dataset.rotate ? (" rotate(" + el.dataset.rotate + "deg)") : "";
    el.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)" + rot;
    // 홈이 움직이면 표지판 화살표를 다시 겨냥
    if (el === homeEl) updateSignpost();
  }
  function placeObjects() {
    var objs = world.querySelectorAll(".lc-obj");
    for (var i = 0; i < objs.length; i++) placeOne(objs[i]);
  }

  // ================= 렌더 =================
  function scheduleRender() {
    if (dirty) return;
    dirty = true;
    requestAnimationFrame(render);
  }

  function render() {
    dirty = false;
    world.style.transform =
      "translate(" + state.x + "px," + state.y + "px) scale(" + state.scale + ")";
    // 그리드도 함께 이동/확대되는 것처럼 보이게 갱신
    var gs = GRID * state.scale;
    grid.style.backgroundSize = gs + "px " + gs + "px";
    grid.style.backgroundPosition = state.x + "px " + state.y + "px";
    zoomVal.textContent = Math.round(state.scale * 100) + "%";
  }

  // dirty 초기값을 false 로 두고 최초 1회 강제 렌더
  dirty = false;

  // ================= 확대/축소 =================
  function clampScale(s) { return Math.max(MIN_SCALE, Math.min(MAX_SCALE, s)); }

  // (cx, cy) = 화면 기준 줌 중심. 그 지점의 월드 좌표가 확대 전후로 유지되도록 tx, ty 보정.
  function zoomAt(factor, cx, cy) {
    var next = clampScale(state.scale * factor);
    var applied = next / state.scale;
    if (applied === 1) return;
    state.x = cx - (cx - state.x) * applied;
    state.y = cy - (cy - state.y) * applied;
    state.scale = next;
    scheduleRender();
  }

  function centerXY() { return [window.innerWidth / 2, window.innerHeight / 2]; }

  // ================= 초기 위치 =================
  // 월드 원점(0,0)이 화면 중앙에 오도록. scale=1. 리사이즈/회전에도 항상 재계산.
  function resetView(animate) {
    var c = centerXY();
    var target = { x: c[0], y: c[1], scale: 1 };
    if (animate && !reduceMotion) {
      animateTo(target, 320);
    } else {
      state.x = target.x; state.y = target.y; state.scale = target.scale;
      scheduleRender();
    }
  }

  function animateTo(target, dur) {
    var start = { x: state.x, y: state.y, scale: state.scale };
    var t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      state.x = start.x + (target.x - start.x) * e;
      state.y = start.y + (target.y - start.y) * e;
      state.scale = start.scale + (target.scale - start.scale) * e;
      render();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ================= 포인터 입력 (마우스/터치 통합) =================
  var pointers = new Map(); // pointerId -> {x, y}
  var isPanning = false;
  var pinchPrev = null;     // { dist, mx, my }

  // 오브젝트 드래그 상태 (캔버스 팬과 분리)
  var dragEl = null, dragId = null, dragStart = null, dragOrig = null;
  var dragVel = { vx: 0, vy: 0 }, dragLast = null, dragMoved = false;
  var homeDragged = false;
  var topZ = 100;

  function isInteractive(target) {
    // 고정 UI(컨트롤 바/도움말)만 기본 클릭 유지. 홈·GitHub 는 드래그 대상이다.
    return !!(target.closest &&
      target.closest(".lc-controls, .lc-help-wrap"));
  }

  // 화면(뷰포트) 좌표 → 월드 좌표
  function toWorld(sx, sy) {
    return { x: (sx - state.x) / state.scale, y: (sy - state.y) / state.scale };
  }
  function now() {
    return (window.performance && performance.now) ? performance.now() : Date.now();
  }

  viewport.addEventListener("pointerdown", function (e) {
    firstInteraction();
    if (isInteractive(e.target)) return; // 컨트롤 바/도움말은 기본 클릭 유지

    // 드래그 가능한 오브젝트(숫자·이미지·홈)를 집었는가?
    var grab = e.target.closest && e.target.closest(".lc-draggable");
    if (grab && !dragEl) {
      dragEl = grab;
      dragId = e.pointerId;
      catchIfFlying(dragEl);               // 날아가던 중이면 붙잡기
      var w = toWorld(e.clientX, e.clientY);
      dragStart = { wx: w.x, wy: w.y };     // 잡은 지점(월드 좌표)
      dragOrig = {                          // 오브젝트의 원래 위치
        x: parseFloat(dragEl.dataset.x) || 0,
        y: parseFloat(dragEl.dataset.y) || 0
      };
      dragVel = { vx: 0, vy: 0 };
      dragMoved = false;
      homeDragged = false;
      dragLast = { t: now(), x: dragOrig.x, y: dragOrig.y };
      dragEl.classList.add("is-dragging");
      dragEl.style.zIndex = (++topZ);
      try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
      return;
    }

    // 그 외 빈 공간: 캔버스 팬/핀치
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
    if (pointers.size === 1) {
      isPanning = true;
      viewport.classList.add("is-panning");
    } else if (pointers.size === 2) {
      isPanning = false;
      pinchPrev = pinchState();
    }
  });

  viewport.addEventListener("pointermove", function (e) {
    // 1) 오브젝트 드래그 중: 그 오브젝트만 이동시키고 속도를 기록(던지기용)
    if (dragEl && e.pointerId === dragId) {
      var w = toWorld(e.clientX, e.clientY);
      var nx = dragOrig.x + (w.x - dragStart.wx);
      var ny = dragOrig.y + (w.y - dragStart.wy);
      dragEl.dataset.x = nx;
      dragEl.dataset.y = ny;
      placeOne(dragEl);
      var t = now();
      var dt = t - dragLast.t;
      if (dt > 0) {
        dragVel.vx = (nx - dragLast.x) / dt; // 월드px/ms
        dragVel.vy = (ny - dragLast.y) / dt;
        dragLast = { t: t, x: nx, y: ny };
      }
      // 실제로 움직였는지(탭과 구분) — 화면 기준 5px 초과
      if (Math.abs(w.x - dragStart.wx) * state.scale > 5 ||
          Math.abs(w.y - dragStart.wy) * state.scale > 5) {
        dragMoved = true;
        if (dragEl.dataset.home) homeDragged = true;
      }
      return;
    }
    // 2) 캔버스 팬/핀치
    if (!pointers.has(e.pointerId)) return;
    var prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1 && isPanning) {
      state.x += e.clientX - prev.x;
      state.y += e.clientY - prev.y;
      scheduleRender();
    } else if (pointers.size >= 2) {
      var cur = pinchState();
      if (pinchPrev) {
        if (pinchPrev.dist > 0) zoomAt(cur.dist / pinchPrev.dist, cur.mx, cur.my);
        state.x += cur.mx - pinchPrev.mx;
        state.y += cur.my - pinchPrev.my;
        scheduleRender();
      }
      pinchPrev = cur;
    }
  });

  function endPointer(e) {
    // 오브젝트 드래그 종료 → 속도가 있으면 던지기(관성)
    if (dragEl && e.pointerId === dragId) {
      dragEl.classList.remove("is-dragging");
      try { viewport.releasePointerCapture(e.pointerId); } catch (err) {}
      var speed = Math.hypot(dragVel.vx, dragVel.vy);
      if (dragMoved) {
        // 던지기: 놓는 속도가 충분하면 관성으로 날린다
        if (!reduceMotion && speed > 0.05) throwObject(dragEl, dragVel.vx, dragVel.vy);
      } else {
        // 탭(거의 안 움직임): 링크 오브젝트면 이동. pointerdown 에서 preventDefault 했으므로
        // 네이티브 click 에 의존하지 않고 여기서 직접 처리한다.
        if (dragEl.classList.contains("lc-home-obj")) goHome();
        else if (dragEl.classList.contains("lc-github-obj")) openGithub();
      }
      dragEl = null; dragId = null; dragLast = null;
      return;
    }
    // 팬/핀치 종료
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    try { viewport.releasePointerCapture(e.pointerId); } catch (err) {}
    if (pointers.size < 2) pinchPrev = null;
    if (pointers.size === 0) {
      isPanning = false;
      viewport.classList.remove("is-panning");
    } else if (pointers.size === 1) {
      isPanning = true; // 핀치 → 팬 전환
      viewport.classList.add("is-panning");
    }
  }
  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);

  // 두 포인터의 거리와 중점 계산 (핀치용)
  function pinchState() {
    var pts = Array.from(pointers.values());
    var dx = pts[1].x - pts[0].x;
    var dy = pts[1].y - pts[0].y;
    return {
      dist: Math.hypot(dx, dy),
      mx: (pts[0].x + pts[1].x) / 2,
      my: (pts[0].y + pts[1].y) / 2
    };
  }

  // ================= 던지기(관성) =================
  // 놓는 순간의 속도로 오브젝트를 날린 뒤 마찰로 감속시킨다.
  var flying = [];           // { el, vx, vy }  속도 단위: 월드px/ms
  var flyRAF = null, flyPrev = null;

  function throwObject(el, vx, vy) {
    for (var i = 0; i < flying.length; i++) {
      if (flying[i].el === el) { flying[i].vx = vx; flying[i].vy = vy; startFly(); return; }
    }
    flying.push({ el: el, vx: vx, vy: vy });
    startFly();
  }
  function catchIfFlying(el) {
    for (var i = flying.length - 1; i >= 0; i--) {
      if (flying[i].el === el) flying.splice(i, 1);
    }
  }
  function startFly() { if (!flyRAF) { flyPrev = null; flyRAF = requestAnimationFrame(flyStep); } }
  function flyStep(t) {
    if (flyPrev === null) flyPrev = t;
    var dt = Math.min(40, t - flyPrev);
    flyPrev = t;
    var friction = Math.pow(0.94, dt / 16.67); // 프레임당 약 0.94 감쇠
    for (var i = flying.length - 1; i >= 0; i--) {
      var f = flying[i];
      var x = (parseFloat(f.el.dataset.x) || 0) + f.vx * dt;
      var y = (parseFloat(f.el.dataset.y) || 0) + f.vy * dt;
      f.el.dataset.x = x; f.el.dataset.y = y;
      placeOne(f.el);
      f.vx *= friction; f.vy *= friction;
      if (Math.hypot(f.vx, f.vy) < 0.003) flying.splice(i, 1);
    }
    if (flying.length) flyRAF = requestAnimationFrame(flyStep);
    else { flyRAF = null; flyPrev = null; }
  }

  // ================= 마우스 휠 =================
  viewport.addEventListener("wheel", function (e) {
    e.preventDefault(); // 페이지 확대/스크롤 방지
    firstInteraction();
    var factor = e.deltaY < 0 ? 1.12 : 0.89;
    zoomAt(factor, e.clientX, e.clientY);
  }, { passive: false });

  // ================= 키보드 =================
  window.addEventListener("keydown", function (e) {
    var c = centerXY();
    var step = 90;
    switch (e.key) {
      case "ArrowUp":    state.y += step; scheduleRender(); break;
      case "ArrowDown":  state.y -= step; scheduleRender(); break;
      case "ArrowLeft":  state.x += step; scheduleRender(); break;
      case "ArrowRight": state.x -= step; scheduleRender(); break;
      case "+": case "=": zoomAt(1.12, c[0], c[1]); break;
      case "-": case "_": zoomAt(0.89, c[0], c[1]); break;
      case "0": resetView(true); break;
      case "h": case "H": goHome(); break;
      case "Escape": closeHelp(); break;
      default: return;
    }
    firstInteraction();
    e.preventDefault();
  });

  // ================= 컨트롤 바 =================
  document.getElementById("lc-reset").addEventListener("click", function () {
    firstInteraction(); resetView(true);
  });
  document.getElementById("lc-zoom-in").addEventListener("click", function () {
    var c = centerXY(); firstInteraction(); zoomAt(1.12, c[0], c[1]);
  });
  document.getElementById("lc-zoom-out").addEventListener("click", function () {
    var c = centerXY(); firstInteraction(); zoomAt(0.89, c[0], c[1]);
  });

  // ================= 도움말 =================
  var helpToggle = document.getElementById("lc-help-toggle");
  var helpPanel  = document.getElementById("lc-help");
  helpToggle.addEventListener("click", function () {
    var open = helpPanel.hasAttribute("hidden");
    if (open) { helpPanel.removeAttribute("hidden"); helpToggle.setAttribute("aria-expanded", "true"); }
    else { closeHelp(); }
  });
  function closeHelp() {
    helpPanel.setAttribute("hidden", "");
    helpToggle.setAttribute("aria-expanded", "false");
  }

  // ================= 홈 이동 (짧은 페이드 후 이동) =================
  var leaving = false;
  function goHome() {
    if (leaving) return;
    leaving = true;
    if (reduceMotion) { window.location.href = CFG.home; return; }
    viewport.classList.add("is-leaving");
    window.setTimeout(function () { window.location.href = CFG.home; }, 400);
  }

  // GitHub 이동 (새 탭). 짧은 시간 내 중복 호출은 무시(탭+click 이중 발생 방지).
  var lastGithub = 0;
  function openGithub() {
    var t = now();
    if (t - lastGithub < 600) return;
    lastGithub = t;
    window.open(GITHUB_URL, "_blank", "noopener");
  }

  // ================= 자동 안내 힌트 =================
  var hintTimer = window.setTimeout(function () {
    if (hint) { hint.classList.add("show"); }
  }, 3000);
  var interacted = false;
  function firstInteraction() {
    if (interacted) return;
    interacted = true;
    window.clearTimeout(hintTimer);
    if (hint) hint.classList.remove("show");
  }

  // ================= 리사이즈/회전 =================
  var resizeRAF = null;
  window.addEventListener("resize", function () {
    if (resizeRAF) return;
    resizeRAF = requestAnimationFrame(function () {
      resizeRAF = null;
      scheduleRender(); // 그리드/오브젝트는 transform 기반이라 위치 재계산 불필요
    });
  });
  window.addEventListener("orientationchange", function () { scheduleRender(); });

  // ================= 초기화 =================
  buildObjects();
  placeObjects();
  resetView(false); // 첫 화면: 404 를 중앙에
})();
