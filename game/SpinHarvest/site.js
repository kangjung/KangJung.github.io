"use strict";
const $=id=>document.getElementById(id), storageKey="spin-harvest-preview-1-complete";
const names=["첫 토마토","세 알의 수확","막다른 길","사과와 토마토","서로 다른 바구니","작은 길, 큰 호박","토마토의 지름길","호박 다리","농장의 수확 시간","사과 모으기","묶음으로 나누기","작은 틈 사이로","호박은 돌아가요","두 층의 과수원","셋이 함께 수확","호박이 열쇠예요","열고, 나누고","열쇠 하나, 문 둘","열린 방 안으로","예비 열쇠 하나","세 방의 릴레이","먼저 골라내기","호박의 다음 일","발 디딜 곳 남기기","방 안에서 도와요","이웃을 구해줘","옆 창문의 비밀","하나씩 나눠 담기","하나, 그리고 둘","필요한 만큼 열기","칸막이 너머로","작은 과일부터?","위아래 교차로"];
const chapterIcons=["🌱","🍎","🎃","🗝️","🧺","🌿","🍅","🌼"];
let stages=[], player=null, booting=false, current=1, filter="전체", completed=new Set();
try{const data=JSON.parse(localStorage.getItem(storageKey)||"[]");if(Array.isArray(data))completed=new Set(data.filter(n=>Number.isInteger(n)&&n>=1&&n<=33));}catch{}
function tally(){$("tally").textContent=`${completed.size} / 33 수확`;}
function error(e){$("error-text").textContent=String(e?.message||e);$("error").hidden=false;$("loading").hidden=true;console.error(e);}
function resize(){const host=$("play"),frame=$("game-frame");const h=Math.max(1,Math.min(host.clientHeight,host.clientWidth*16/9));frame.style.height=h+"px";frame.style.width=(h*9/16)+"px";}
function draw(){
 const groups=[...new Set(stages.map(s=>s.chapter))];$("chapters").replaceChildren();
 ["전체",...groups].forEach((name,i)=>{const b=document.createElement("button");b.textContent=(i?chapterIcons[i-1]+" ":"")+name;b.setAttribute("aria-pressed",String(name===filter));b.onclick=()=>{filter=name;draw();};$("chapters").append(b);});
 $("stages").replaceChildren();stages.filter(s=>filter==="전체"||s.chapter===filter).forEach(s=>{const number=Number(s.id),b=document.createElement("button");b.className="stage-card"+(completed.has(number)?" done":"");b.setAttribute("aria-label",`${number}판 ${names[number-1]||s.title}${completed.has(number)?", 수확 완료":""}`);const badge=document.createElement("span");badge.className="stage-num";badge.textContent=String(number).padStart(2,"0");const copy=document.createElement("span");copy.className="stage-copy";const label=document.createElement("small");label.textContent=s.chapter+" · "+s.number;const title=document.createElement("strong");title.textContent=names[number-1]||s.title;copy.append(label,title);b.append(badge,copy);b.onclick=()=>launch(number);$("stages").append(b);});tally();
}
function hideMenu(){if(!player)return;stopWebControl();document.body.classList.add("playing");$("turn-controls").hidden=false;$("chooser").hidden=true;document.body.classList.remove("menu-open");player.SendMessage("Web preview entry","SetMenuOpen","0");resize();$("unity-canvas").focus();}
function openMenu(){if(!player||booting)return;stopWebControl();document.body.classList.remove("playing");$("turn-controls").hidden=true;player.SendMessage("Web preview entry","SetMenuOpen","1");$("chooser").hidden=false;$("resume").hidden=false;document.body.classList.add("menu-open");draw();$("resume").focus();}
async function launch(number){
 if(booting||!stages.some(s=>Number(s.id)===number))return;stopWebControl();current=number;
 if(player){player.SendMessage("Web preview entry","SelectStage",String(number));hideMenu();return;}
 booting=true;document.body.classList.add("playing");$("chooser").hidden=true;$("play").hidden=false;$("loading").hidden=false;resize();
 try{const response=await fetch("player.json?v=mobile1");if(!response.ok)throw new Error("게임 정보를 불러오지 못했어요.");const config=await response.json();await new Promise((resolve,reject)=>{const script=document.createElement("script");script.src=config.loaderUrl;script.onload=resolve;script.onerror=()=>reject(new Error("게임 파일을 불러오지 못했어요. 연결을 확인해 주세요."));document.body.append(script);});
 player=await createUnityInstance($("unity-canvas"),{...config,streamingAssetsUrl:"StreamingAssets",devicePixelRatio:Math.min(devicePixelRatio||1,2),showBanner:(message,type)=>{if(type==="error")error(message);else console.warn(message);}},progress=>{$("progress").value=progress;$("load-text").textContent=Math.round(progress*100)+"% · 농장을 준비하고 있어요";});
 player.SendMessage("Web preview entry","EnableBrowserControls", "1");player.SendMessage("Web preview entry","SelectStage",String(number));$("loading").hidden=true;$("menu-button").hidden=false;booting=false;hideMenu();
 }catch(e){booting=false;error(e);}
}
window.addEventListener("spinharvest:state",event=>{const n=Number(event.detail?.stage);if(!Number.isInteger(n)||n<1||n>stages.length)return;stopWebControl();current=n;const url=new URL(location.href);url.searchParams.set("stage",String(n));history.replaceState(null,"",url);if(event.detail.complete){completed.add(n);try{localStorage.setItem(storageKey,JSON.stringify([...completed]));}catch{}tally();}});
$("play-menu").onclick=openMenu;$("menu-button").onclick=openMenu;$("resume").onclick=hideMenu;$("start").onclick=()=>launch(stages.find(s=>!completed.has(Number(s.id)))?.id*1||1);
window.addEventListener("resize",()=>{stopWebControl();resize();});window.visualViewport?.addEventListener("resize",()=>{stopWebControl();resize();});document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!$("chooser").hidden&&player){event.preventDefault();hideMenu();}});
(async()=>{try{const response=await fetch("stages.json");if(!response.ok)throw new Error("스테이지 목록을 불러오지 못했어요.");const data=await response.json();stages=data.stages;if(!Array.isArray(stages)||stages.length!==33)throw new Error("스테이지 목록을 확인해 주세요.");draw();$("start").disabled=false;$("start").textContent=completed.size?"다음 밭으로 가기 →":"첫 수확 시작하기 →";const requested=Number(new URL(location.href).searchParams.get("stage"));if(requested>=1&&requested<=stages.length)$("start").onclick=()=>launch(requested);}catch(e){error(e);}})();

// A single manual banner in a reserved row below gameplay. No stage-change refresh.
// Local previews never contact the live advertising service.
(function setupHarvestAd() {
 const placement = document.getElementById("harvest-ad");
 if (!placement || location.hostname !== "kangjung.github.io") return;
 let requested = false;
 function requestAd() {
  if (requested || placement.clientWidth === 0) return;
  requested = true;
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2007216448786117";
  document.head.append(script);
  try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* Gameplay is independent of ads. */ }
 }
 if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
   if (entries.some(entry => entry.isIntersecting)) { requestAd(); observer.disconnect(); }
  });
  observer.observe(placement);
 } else requestAd();
})();

// CSS-normalized coordinates avoid canvas backing-resolution / device-pixel-ratio differences.
let webControl = null, turnHeartbeat = null;
const heldPointers = new Set();
function sendControl(method,value="") { if(player) player.SendMessage("Web preview entry",method,String(value)); }
function stopWebControl() {
 if(turnHeartbeat!==null){clearInterval(turnHeartbeat);turnHeartbeat=null;}
 if(webControl){sendControl("StopWebInput");webControl=null;}
 for(const id of ["turn-left","turn-right"])$(id).classList.remove("held");
}
function pointOnCanvas(event) {
 const rect=$("unity-canvas").getBoundingClientRect();
 const x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
 return x>=0&&x<=1&&y>=0&&y<=1?`${x.toFixed(6)},${y.toFixed(6)}`:null;
}
window.addEventListener("pointerdown",event=>{heldPointers.add(event.pointerId);if(heldPointers.size>1)stopWebControl();},true);
window.addEventListener("pointerup",event=>{heldPointers.delete(event.pointerId);if(webControl?.id===event.pointerId)stopWebControl();},true);
window.addEventListener("pointercancel",event=>{heldPointers.delete(event.pointerId);if(webControl?.id===event.pointerId)stopWebControl();},true);
function startTurn(button,direction,id) {
 if(!player||booting||!$("chooser").hidden)return;
 stopWebControl();webControl={id,button};button.classList.add("held");
 sendControl("SetTurn",direction);turnHeartbeat=setInterval(()=>sendControl("SetTurn",direction),150);
}
for(const [id,direction] of [["turn-left",1],["turn-right",-1]]) {
 const button=$(id);
 button.addEventListener("pointerdown",event=>{
  if(event.button!==0||heldPointers.size!==1)return;
  event.preventDefault();button.setPointerCapture(event.pointerId);startTurn(button,direction,event.pointerId);
 });
 button.addEventListener("pointermove",event=>{
  if(webControl?.id!==event.pointerId)return;
  const r=button.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)stopWebControl();
 });
 button.addEventListener("lostpointercapture",()=>stopWebControl());
 button.addEventListener("contextmenu",event=>event.preventDefault());
 button.addEventListener("keydown",event=>{if([" ","Enter"].includes(event.key)){event.preventDefault();if(!event.repeat)startTurn(button,direction,"key");}});
 button.addEventListener("keyup",event=>{if([" ","Enter"].includes(event.key)){event.preventDefault();stopWebControl();}});
 button.addEventListener("blur",()=>stopWebControl());
}
$("unity-canvas").addEventListener("pointerdown",event=>{
 if(event.button!==0||heldPointers.size!==1||!player||booting)return;
 const point=pointOnCanvas(event);if(point===null)return;
 stopWebControl();webControl={id:event.pointerId};event.currentTarget.setPointerCapture(event.pointerId);sendControl("PointerDown",point);
});
$("unity-canvas").addEventListener("pointermove",event=>{
 if(webControl?.id!==event.pointerId||webControl.button)return;
 const point=pointOnCanvas(event);if(point===null)stopWebControl();else sendControl("PointerMove",point);
});
$("unity-canvas").addEventListener("lostpointercapture",()=>stopWebControl());
window.addEventListener("keydown",event=>{if(document.body.classList.contains("playing")&&["ArrowLeft","ArrowRight"].includes(event.key))event.preventDefault();});
window.addEventListener("blur",()=>{heldPointers.clear();stopWebControl();});
window.addEventListener("pagehide",()=>{heldPointers.clear();stopWebControl();});
document.addEventListener("visibilitychange",()=>{if(document.hidden){heldPointers.clear();stopWebControl();}});
