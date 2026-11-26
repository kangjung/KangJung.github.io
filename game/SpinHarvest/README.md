# Spin Harvest WebGL publication

Release touch-20261126; Unity source and verification 2eb9e7e. Four worlds, sixty-one stages. World1 stage5 is the twenty-tomato bumper harvest (18 to clear; 19/20 for extra stars).

- Play: /game/SpinHarvest/ — native Unity home, selection, hold/drag/keys, pause, results and saves.
- Landing: /games/spin-harvest/ — independent lightweight static page.
- Only player.css/player.js/player-manifest.json are used by the new player index. Old site.js/site.css/player.json/stages.json/WebRelease files are preserved but not loaded. Old 33-stage browser completion keys are not deleted or converted to unrelated 60-stage completion IDs.
- Build files are immutable under Build/touch-20261126; SHA256 is in player-manifest.json. Keep that URL path when copying this same release. Change the release folder for a later build to avoid mixed cached versions.
- The companyName/productName/version match the verified generated Unity player. No custom web stage or input bridge is invoked.
- One existing AdSense client/slot requests a300×50 banner on kangjung.github.io only, after game startup. The ad is an ordinary top document row; the non-scrolling game fills the remaining dynamic viewport. No sticky/fixed ad overlay or additional game toolbar. No Auto Ads account settings changed. Actual fills/automatic account placements require live account verification.
- localhost and ?preview=1 suppress ad requests for QA. The empty slot remains reserved so layout tests match an occupied banner.
- Loading errors show retry and landing links. Ad failures do not affect Unity. No ad refresh loop or click tracking.
- Existing external site content, staged timer work and purchase-source assets are outside this publication.

- Previous goal2-20261122 runtime files and progress identities are preserved. The newly inserted bumper stage is optional for unlocks. World1 now has16 stages, total61/183 stars.
- Known existing issue: AdSense account auto-optimization can expand the top ad and insert overlays. Account access remains unapproved; this content update does not change account/ad settings.

- 2026-11-26: direct circular drag replaces horizontal delta mapping. Center exclusion, first-pointer ownership, UI/pause cancellation, release stop and constant-speed keyboard remain in shared Unity logic. Includes latest farm home/gameplay presentation. Existing bumper/goal2/legacy files and save identities retained.
- Very fast flicks may be limited by the physical rotation speed cap. Actual phone feel remains a user playtest item. No ad account/configuration changes in this release.
