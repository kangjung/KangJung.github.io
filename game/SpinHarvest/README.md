# Spin Harvest WebGL publication

Release goal2-20261122; Unity runtime b76d2f4 / verified d6845d9. Four worlds, sixty stages.

- Play: /game/SpinHarvest/ — native Unity home, selection, hold/drag/keys, pause, results and saves.
- Landing: /games/spin-harvest/ — independent lightweight static page.
- Only player.css/player.js/player-manifest.json are used by the new player index. Old site.js/site.css/player.json/stages.json/WebRelease files are preserved but not loaded. Old 33-stage browser completion keys are not deleted or converted to unrelated 60-stage completion IDs.
- Build files are immutable under Build/goal2-20261122; SHA256 is in player-manifest.json. Keep that URL path when copying this same release. Change the release folder for a later build to avoid mixed cached versions.
- The companyName/productName/version match the verified generated Unity player. No custom web stage or input bridge is invoked.
- One existing AdSense client/slot requests a300×50 banner on kangjung.github.io only, after game startup. The ad is an ordinary top document row; the non-scrolling game fills the remaining dynamic viewport. No sticky/fixed ad overlay or additional game toolbar. No Auto Ads account settings changed. Actual fills/automatic account placements require live account verification.
- localhost and ?preview=1 suppress ad requests for QA. The empty slot remains reserved so layout tests match an occupied banner.
- Loading errors show retry and landing links. Ad failures do not affect Unity. No ad refresh loop or click tracking.
- Existing external site content, staged timer work and purchase-source assets are outside this publication.
