"use strict";
(() => {
  const canvas = document.getElementById("unity-canvas");
  const loading = document.getElementById("loading");
  const progress = document.getElementById("progress");
  const loadText = document.getElementById("load-text");
  let failed = false;
  function showError(error) {
    if (failed) return;
    failed = true;
    console.error("Spin Harvest could not start:", error);
    loading.hidden = true;
    document.getElementById("error").hidden = false;
  }
  document.getElementById("retry").addEventListener("click", () => location.reload());

  function requestBanner() {
    // Local/explicit preview QA never makes a real ad request. Ads cannot block gameplay.
    if (location.hostname !== "kangjung.github.io" || new URLSearchParams(location.search).has("preview")) return;
    if (document.getElementById("harvest-ad").getBoundingClientRect().width < 300) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2007216448786117";
    script.onload = () => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (error) { console.warn("Banner unavailable", error); } };
    document.head.append(script);
  }

  async function start() {
    try {
      const response = await fetch("player-manifest.json?v=touch-20261126", {cache:"no-store"});
      if (!response.ok) throw new Error(`Manifest ${response.status}`);
      const manifest = await response.json();
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = manifest.loaderUrl;
        script.onload = resolve;
        script.onerror = () => reject(new Error("Unity loader unavailable"));
        document.body.append(script);
      });
      await createUnityInstance(canvas, {
        dataUrl:manifest.dataUrl,frameworkUrl:manifest.frameworkUrl,codeUrl:manifest.codeUrl,
        streamingAssetsUrl:"StreamingAssets",companyName:manifest.companyName,
        productName:manifest.productName,productVersion:manifest.productVersion,
        devicePixelRatio:Math.min(window.devicePixelRatio || 1, 2),
        showBanner:(message,type) => { if (type === "error") showError(message); else console.warn(message); }
      }, value => {
        progress.value = value;
        loadText.textContent = `${Math.round(value * 100)}% · 농장을 준비하고 있어요`;
      });
      if (failed) return;
      loading.hidden = true;
      // Unity owns all menus, hold/drag/keyboard controls, pause, results and persistence.
      canvas.focus({preventScroll:true});
      requestBanner();
    } catch (error) { showError(error); }
  }
  start();
})();
