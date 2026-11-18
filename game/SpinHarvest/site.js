"use strict";
const $=id=>document.getElementById(id), storageKey="spin-harvest-preview-1-complete";
const names=["첫 토마토","세 알의 수확","막다른 길","사과와 토마토","서로 다른 바구니","작은 길, 큰 호박","토마토의 지름길","호박 다리","농장의 수확 시간","사과 모으기","묶음으로 나누기","작은 틈 사이로","호박은 돌아가요","두 층의 과수원","셋이 함께 수확","호박이 열쇠예요","열고, 나누고","열쇠 하나, 문 둘","열린 방 안으로","예비 열쇠 하나","세 방의 릴레이","먼저 골라내기","호박의 다음 일","발 디딜 곳 남기기","방 안에서 도와요","이웃을 구해줘","옆 창문의 비밀","하나씩 나눠 담기","하나, 그리고 둘","필요한 만큼 열기","칸막이 너머로","작은 과일부터?","위아래 교차로"];
const chapterIcons=["🌱","🍎","🎃","🗝️","🧺","🌿","🍅","🌼"];
let stages=[], player=null, booting=false, current=1, filter="전체", completed=new Set();
try{const data=JSON.parse(localStorage.getItem(storageKey)||"[]");if(Array.isArray(data))completed=new Set(data.filter(n=>Number.isInteger(n)&&n>=1&&n<=33));}catch{}
function tally(){$("tally").textContent=`${completed.size} / 33 수확`;}
function error(e){$("error-text").textContent=String(e?.message||e);$("error").hidden=false;$("loading").hidden=true;console.error(e);}
function resize(){const host=$("play"),frame=$("game-frame");const h=Math.max(1,Math.min(host.clientHeight-32,(host.clientWidth-8)*16/9));frame.style.height=h+"px";frame.style.width=(h*9/16)+"px";}
function draw(){
 const groups=[...new Set(stages.map(s=>s.chapter))];$("chapters").replaceChildren();
 ["전체",...groups].forEach((name,i)=>{const b=document.createElement("button");b.textContent=(i?chapterIcons[i-1]+" ":"")+name;b.setAttribute("aria-pressed",String(name===filter));b.onclick=()=>{filter=name;draw();};$("chapters").append(b);});
 $("stages").replaceChildren();stages.filter(s=>filter==="전체"||s.chapter===filter).forEach(s=>{const number=Number(s.id),b=document.createElement("button");b.className="stage-card"+(completed.has(number)?" done":"");b.setAttribute("aria-label",`${number}판 ${names[number-1]||s.title}${completed.has(number)?", 수확 완료":""}`);const badge=document.createElement("span");badge.className="stage-num";badge.textContent=String(number).padStart(2,"0");const copy=document.createElement("span");copy.className="stage-copy";const label=document.createElement("small");label.textContent=s.chapter+" · "+s.number;const title=document.createElement("strong");title.textContent=names[number-1]||s.title;copy.append(label,title);b.append(badge,copy);b.onclick=()=>launch(number);$("stages").append(b);});tally();
}
function hideMenu(){if(!player)return;$("chooser").hidden=true;document.body.classList.remove("menu-open");player.SendMessage("Web preview entry","SetMenuOpen","0");resize();$("unity-canvas").focus();}
function openMenu(){if(!player||booting)return;player.SendMessage("Web preview entry","SetMenuOpen","1");$("chooser").hidden=false;$("resume").hidden=false;document.body.classList.add("menu-open");draw();$("resume").focus();}
async function launch(number){
 if(booting||!stages.some(s=>Number(s.id)===number))return;current=number;
 if(player){player.SendMessage("Web preview entry","SelectStage",String(number));hideMenu();return;}
 booting=true;$("chooser").hidden=true;$("play").hidden=false;$("loading").hidden=false;resize();
 try{const response=await fetch("player.json");if(!response.ok)throw new Error("게임 정보를 불러오지 못했어요.");const config=await response.json();await new Promise((resolve,reject)=>{const script=document.createElement("script");script.src=config.loaderUrl;script.onload=resolve;script.onerror=()=>reject(new Error("게임 파일을 불러오지 못했어요. 연결을 확인해 주세요."));document.body.append(script);});
 player=await createUnityInstance($("unity-canvas"),{...config,streamingAssetsUrl:"StreamingAssets",devicePixelRatio:Math.min(devicePixelRatio||1,2),showBanner:(message,type)=>{if(type==="error")error(message);else console.warn(message);}},progress=>{$("progress").value=progress;$("load-text").textContent=Math.round(progress*100)+"% · 농장을 준비하고 있어요";});
 player.SendMessage("Web preview entry","SelectStage",String(number));$("loading").hidden=true;$("menu-button").hidden=false;booting=false;hideMenu();
 }catch(e){booting=false;error(e);}
}
window.addEventListener("spinharvest:state",event=>{const n=Number(event.detail?.stage);if(!Number.isInteger(n)||n<1||n>stages.length)return;current=n;const url=new URL(location.href);url.searchParams.set("stage",String(n));history.replaceState(null,"",url);if(event.detail.complete){completed.add(n);try{localStorage.setItem(storageKey,JSON.stringify([...completed]));}catch{}tally();}});
$("menu-button").onclick=openMenu;$("resume").onclick=hideMenu;$("start").onclick=()=>launch(stages.find(s=>!completed.has(Number(s.id)))?.id*1||1);
window.addEventListener("resize",resize);document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!$("chooser").hidden&&player){event.preventDefault();hideMenu();}});
(async()=>{try{const response=await fetch("stages.json");if(!response.ok)throw new Error("스테이지 목록을 불러오지 못했어요.");const data=await response.json();stages=data.stages;if(!Array.isArray(stages)||stages.length!==33)throw new Error("스테이지 목록을 확인해 주세요.");draw();$("start").disabled=false;$("start").textContent=completed.size?"다음 밭으로 가기 →":"첫 수확 시작하기 →";const requested=Number(new URL(location.href).searchParams.get("stage"));if(requested>=1&&requested<=stages.length)$("start").onclick=()=>launch(requested);}catch(e){error(e);}})();
