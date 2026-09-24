---
lng_pair: id_city_heist_ai_unity_2026
title: "보유 에셋부터 플레이테스트까지 - AI와 만드는 City Heist 개발기 #1"

category: Automation
tags: [Unity, GameDev, CityHeist, AI, Codex]
comments_disable: true

date: 2026-09-24 00:00:00 +0900
meta_description: "개발 중인 Unity 잠입 게임 City Heist의 기록. 보유 에셋 카탈로그와 AI 작업 환경을 만들고 직접 플레이하며 수정하는 과정."
image_viewer_on: true
---

{%- include util/auto-content-generator.liquid -%}

<!-- outline-start -->

## 작은 잠입 게임을 만들고 있다

Unity로 **City Heist**라는 작은 싱글 플레이 잠입 게임을 만들고 있습니다. 경비와 CCTV를 살피고, 들어갈 길을 고르고, 목표물을 훔친 뒤 달라진 보안 상황을 피해 빠져나오는 게임입니다. 전투 없이 관찰과 경로 선택에 집중하는 방향으로 잡았습니다.

2026년 9월 24일 기준으로는 **직접 플레이할 수 있는 프로토타입 / MVP 단계**입니다. 미션 선택부터 도구 선택, 잠입, 탈취, 탈출, 결과 확인과 재시도까지 기본 흐름과 주요 시스템은 구현되어 있습니다. 다만 UI는 임시이고 아트, 사운드, 피드백도 계속 조정 중입니다. 공개 playable build는 아직 없습니다.

게임 자체의 진행 상황은 [itch.io Devlog](https://kangjung.itch.io/city-heist/devlog/1675365/city-heist-devlog-1-from-prototype-to-playable-stealth-game)에도 기록하고 있습니다. 이번 글에서는 조금 더 안쪽으로 들어가, Unity와 AI를 어떤 방식으로 함께 사용하고 있는지 정리해보려고 합니다.

시작은 아주 작은 graybox였습니다. 바닥과 벽, 플레이어를 나타내는 도형을 놓고 이동과 쿼터뷰 카메라부터 확인했습니다. 그다음에는 정해진 waypoint를 도는 경비를 붙였습니다. 시야에 들어가면 의심하고, 발견하면 쫓고, 놓치면 마지막으로 본 곳을 수색하는 정도였습니다.

![City Heist 초기 Phase 1 graybox](https://kangjung.github.io/assets/img/posts/20260924/city-heist-graybox.png){:data-align="center"}

처음부터 큰 도시나 많은 미션을 만들 생각은 없었습니다. 우선 작은 공간에서 경비를 피해 움직이는 것이 괜찮은지 확인하고 싶었습니다. 이후 문을 열고 목표물을 집어 탈출하는 흐름을 붙이면서, 단순히 들키지 않는 것뿐 아니라 **훔친 다음 어떻게 나올 것인가**가 필요해졌습니다.

## 이번에는 개발 환경부터 정리했다

이번 프로젝트는 AI-assisted development, 흔히 말하는 바이브 코딩을 적극적으로 사용하고 있습니다. 그렇다고 프롬프트 몇 번으로 게임이 나오는 방식은 아니었습니다.

저는 어떤 게임을 만들지, 무엇을 넣고 뺄지 결정합니다. GPT와 아이디어와 문제를 정리하고 구현 범위를 좁힌 다음, Codex가 Unity C# 코드와 Editor 도구, scene과 prefab 생성, 검증, 문서와 Git 작업을 맡는 식입니다. 결과가 나오면 제가 Play Mode로 해보고 다음 수정 방향을 정합니다.

아이디어 → AI와 구조 정리 → Codex 구현 → 직접 플레이 → 이상한 점 발견 → 설계 수정 → 다시 구현하고 플레이.

실제로는 이 과정을 계속 오가고 있습니다. 한 번의 긴 요청으로 끝내기보다, 다음에 확인할 수 있는 작은 단위로 나누는 편이 낫다고 느꼈습니다.

이를 위해 개인적으로 사용하는 Unity base repository에 공통 규칙을 먼저 넣어두었습니다. 새 게임을 시작할 때 이 작업 방식을 가져오고, 게임마다 기획과 판단을 쌓는 구조입니다. 현재 그 base repository와 City Heist 저장소는 모두 비공개입니다.

<code>AGENTS.md</code>에는 구현 전에 기획, TODO, 이전 결정과 에셋 선택 기록을 읽도록 적었습니다. 직접 만든 코드는 <code>Assets/_Project/</code>, Editor 자동화는 <code>Assets/Editor/AI/</code>에 두고, 같은 scene 설정을 반복해야 하면 Editor 도구로 만들도록 했습니다.

City Heist에도 단계별 scene builder와 현재 MVP를 구성하는 메뉴가 있습니다. Inspector에서 같은 연결을 되풀이하는 일을 줄이고, 다시 생성해도 확인할 수 있는 형태로 남기는 데 도움이 됐습니다. 저장된 scene과 참조를 검사하는 <code>Validate MVP</code>도 있지만, 이 검사가 통과한다고 조작감이나 난이도까지 괜찮다는 뜻은 아닙니다.

## 게임을 만들기 전에 내가 가진 에셋부터 알려줬다

Unity Asset Store에서 예전에 구매한 에셋들이 꽤 쌓여 있었습니다. 그런데 새 프로젝트를 만들 때마다 어떤 것을 가지고 있는지 다시 찾는 것도 일이었습니다. 이미 비슷한 것을 샀는데 또 검색부터 시작하는 경우도 있고요.

그래서 보유 에셋을 AI가 읽을 수 있는 카탈로그로 정리했습니다. 현재 <code>owned-assets.json</code>에는 **210개 패키지의 메타데이터**가 들어 있습니다. My Assets HTML에서 package ID를 추출했고, 이름뿐 아니라 제작자, 버전, legacy 여부와 정확한 Asset Store URL도 함께 기록했습니다.

이름만 적어두는 것보다 package ID가 있는 편이 같은 제품을 구분하기 좋았습니다. 그리고 이 목록을 개인 Unity base repository에 넣어, 다음 게임에서도 다시 사용할 수 있게 했습니다. Unity Editor 안에서 이름, 제작자, ID로 검색하고 선택을 저장하는 작은 카탈로그 창도 있습니다.

AI에게는 아트, 환경, 캐릭터, 애니메이션, 오디오, VFX, UI 등이 필요할 때 보유 목록부터 확인하도록 했습니다. 먼저 현재 선택 기록을 보고, 필요한 후보를 보유 목록에서 좁히는 식입니다. 모든 패키지를 한꺼번에 import하는 방식은 아닙니다.

가장 중요하게 구분한 것은 **가지고 있는 에셋과 현재 프로젝트에 들어 있는 에셋은 다르다**는 점입니다.

카탈로그에 POLYGON City가 있다고 해서 특정 prefab이 프로젝트에 존재하는 것은 아닙니다. 패키지 이름을 보고 그럴듯한 폴더나 파일 경로를 만들어내면 곤란합니다. 제가 필요한 패키지만 Unity에 import한 다음, AI가 실제 <code>Assets/</code> 폴더를 조사하고 prefab, AnimationClip, material, audio, VFX의 경로를 확인한 뒤 사용하게 했습니다.

선택 과정은 <code>selected-assets.json</code>과 <code>ASSET_SELECTION.md</code>에 남깁니다.

- <code>planned</code>: 사용할 후보로 고른 상태
- <code>imported</code>: 프로젝트에 들어온 상태
- <code>wired</code>: 실제 게임에 연결한 상태
- <code>rejected</code>: 검토 후 사용하지 않기로 한 상태

이렇게 해두면 다음 작업에서도 “무엇을 샀는지”, “무엇이 들어 있는지”, “지금 무엇을 쓰는지”를 따로 볼 수 있습니다. 없는 prefab을 상상할 위험을 줄이고, 이미 가진 개발 자원을 바탕으로 다음 선택을 할 수 있습니다.

**코드를 위한 context뿐 아니라, 내가 가진 개발 자산도 AI가 읽을 수 있는 context로 만든 셈입니다.**

여기서 Git으로 관리하는 것은 package metadata, ID와 URL, 선택 상태, 작업 규칙과 직접 만든 코드입니다. 구매한 Asset Store 원본 파일을 GitHub에 올린 것이 아닙니다. 원본은 각 Unity 프로젝트에 local import하고 Git에서는 제외합니다. 게임에 맞게 연결하는 wrapper나 Animator Controller 등은 프로젝트 소유 파일로 따로 관리하고 있습니다.

## City Heist에서는 실제로 이렇게 골랐다

첫 번째로 필요했던 것은 도시와 잠입 공간의 모습이었습니다. 보유 목록에서 **POLYGON - City Pack - Art by Synty**와 **POLYGON - Heist Pack - Art by Synty**를 골랐습니다. 서로 다른 그림체를 많이 섞기보다, 같은 계열로 거리와 상점, 캐릭터와 소품을 맞추고 싶었습니다.

import 후에는 실제 prefab과 material, Demo/Overview scene을 조사했습니다. City는 거리와 건물 배경, 차량과 가로등 등에, Heist는 캐릭터와 상점 내부, 문과 진열대, 보석 등에 연결했습니다. 구매한 prefab 자체를 고치기보다 프로젝트 쪽 wrapper에서 비주얼을 연결하고, 게임의 충돌과 이동 로직은 별도로 유지했습니다.

캐릭터 모델을 넣으니 이번에는 움직임이 문제였습니다. 모델이 있다고 걷기와 달리기까지 쓸 수 있는 것은 아니었습니다. 실제 Heist 애니메이션을 검사했을 때 <code>Take 001</code>은 필요한 locomotion을 제공하지 못했습니다.

그래서 보유 중인 **Human Basic Motions**를 import하고 실제 clip을 검사했습니다. 현재는 Idle, Walk, Run, Crouch Idle, Crouch Walk 다섯 개를 프로젝트 소유 Player/Guard Animator Controller에 연결했습니다. 이동은 기존 게임 코드가 담당하고 root motion은 끈 상태입니다. 발 미끄러짐이나 전환이 자연스러운지는 직접 보면서 더 다듬어야 합니다.

![진열대 엄폐물 근처의 플레이어와 경비](https://kangjung.github.io/assets/img/posts/20260924/city-heist-stealth.png){:data-align="center"}

*이 글의 이미지는 기존 Devlog용 Unity 렌더 캡처입니다. 설명을 위해 인물과 카메라를 배치하고 경비 움직임을 멈춘 촬영 장면이며, 연속 플레이 기록은 아닙니다. 상세 장면은 실제 시야 판정을 유지했고 주요 HUD는 숨겼습니다. 화면에 남아 있는 UI와 아트도 개발 중인 상태입니다.*

도구와 탐지 시스템이 늘어나면서 버튼을 눌렀는지, CCTV가 꺼졌는지 같은 피드백도 필요해졌습니다. 여기서는 **Epic Toon FX**와 **UI SFX Mega Pack**을 사용했습니다. 실제 파일 목록과 clip 정보, 파티클과 material을 검사하고 작은 spark/glint와 UI·전자 장치·경고용 소리 일부만 골랐습니다. VFX는 프로젝트 소유 wrapper와 URP용 파생 material로 연결했습니다.

보유한 에셋을 모두 쓰지는 않았습니다. **FREE Casual Game SFX Pack**과 **Free Casual SoundFX Pack**도 import하고 조사했지만 현재 사용 중인 소리에는 포함하지 않았습니다. 발소리, 문 여닫는 기계음, 도시와 실내 ambience는 적절한 source를 확인하지 못해 아직 미배정입니다. 빈자리를 아무 클릭음으로 채우지는 않았습니다. 지금 연결된 사운드 역시 실제로 듣고 mix와 음색을 검토할 일이 남아 있습니다.

아래는 현재 게임에 연결된 핵심 에셋 다섯 개입니다.

※ 이 글에는 Unity Asset Store 제휴 링크가 포함되어 있으며, 해당 링크를 통해 구매가 발생하면 작성자에게 커미션이 지급될 수 있습니다.

<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
  <a href="https://assetstore.unity.com/packages/3d/environments/urban/polygon-city-pack-art-by-synty-95214?aid=1011l8tvR" title="POLYGON - City Pack - Art by Synty" style="flex:0 0 128px;"><img data-no-image-viewer src="https://api.assetstore.unity3d.com/affiliate/embed/package/95214/icon" alt="POLYGON - City Pack - Art by Synty" width="128" height="128" style="display:block; max-width:100%;" /></a>
  <a href="https://assetstore.unity.com/packages/3d/environments/urban/polygon-heist-pack-art-by-synty-97949?aid=1011l8tvR" title="POLYGON - Heist Pack - Art by Synty" style="flex:0 0 128px;"><img data-no-image-viewer src="https://api.assetstore.unity3d.com/affiliate/embed/package/97949/icon" alt="POLYGON - Heist Pack - Art by Synty" width="128" height="128" style="display:block; max-width:100%;" /></a>
  <a href="https://assetstore.unity.com/packages/3d/animations/human-basic-motions-157744?aid=1011l8tvR" title="Human Basic Motions" style="flex:0 0 128px;"><img data-no-image-viewer src="https://api.assetstore.unity3d.com/affiliate/embed/package/157744/icon" alt="Human Basic Motions" width="128" height="128" style="display:block; max-width:100%;" /></a>
  <a href="https://assetstore.unity.com/packages/vfx/particles/epic-toon-fx-57772?aid=1011l8tvR" title="Epic Toon FX" style="flex:0 0 128px;"><img data-no-image-viewer src="https://api.assetstore.unity3d.com/affiliate/embed/package/57772/icon" alt="Epic Toon FX" width="128" height="128" style="display:block; max-width:100%;" /></a>
  <a href="https://assetstore.unity.com/packages/audio/sound-fx/ui-sfx-mega-pack-245595?aid=1011l8tvR" title="UI SFX Mega Pack" style="flex:0 0 128px;"><img data-no-image-viewer src="https://api.assetstore.unity3d.com/affiliate/embed/package/245595/icon" alt="UI SFX Mega Pack" width="128" height="128" style="display:block; max-width:100%;" /></a>
</div>

## 작은 테스트맵이 City Block으로 커졌다

문과 목표물, 탈출이 연결된 다음에는 CCTV가 필요해졌고, 위험한 구간을 다르게 통과할 방법으로 EMP, Lockpick, Distraction을 붙였습니다. 지금은 출발 전에 세 도구 중 두 개를 고릅니다. EMP는 CCTV를 잠시 끄고, Lockpick은 잠긴 지름길을 열고, Distraction은 경비를 다른 곳으로 유도하는 역할입니다.

다만 기능이 늘 때마다 새 맵을 만드는 것은 부담이 컸습니다. 보석상에서 훔치는 것과 사무실에서 서류를 가져오는 것을 같은 공간에서 다르게 해보면 어떨까 싶었습니다.

그래서 물리적인 맵과 미션 데이터를 분리했습니다. 맵은 벽과 길, 출입구와 순찰 경로 후보를 가지고 있고, <code>MissionDefinition</code>은 그중 어느 목표, 경비, CCTV, 잠긴 문, 시작점과 탈출구를 사용할지 고릅니다.

이후 작은 상점 주변을 **68 × 52m City Block A**로 넓혔습니다. 보석상에 서쪽 사무실, 앞쪽 거리, 뒤편 골목, 서비스 통로와 주차·하역 공간이 붙었습니다. 공간만 넓히기보다 빠른 길, 돌아가는 길, 도구로 열 수 있는 길을 만드는 쪽으로 잡았습니다.

![City Block A의 보석상, 사무실, 골목과 주차 공간](https://kangjung.github.io/assets/img/posts/20260924/city-heist-city-block.png){:data-align="center"}

*전체 구조를 보여주기 위해 이 overview에서는 안개와 경비를 숨겼습니다. 실제 플레이에서 맵 전체가 이렇게 보이는 것은 아닙니다. 초기 graybox와도 같은 배치나 같은 촬영 거리의 비교는 아닙니다.*

현재 세 미션은 이 맵 하나를 공유합니다.

| 미션 | 진입 → 목표 → 탈출 | 경비 / CCTV | 조명 |
| --- | --- | --- | --- |
| Jewelry Basic | 앞쪽 거리 → 보석 → 동쪽 골목 | 2 / 2 | Dusk |
| Office Documents | 뒤편 골목 → 사무실 서류 → 주차장 | 3 / 3 | Night |
| Jewelry High Security | 주차장 → 서쪽 진열대 → 앞쪽 거리 | 4 / 5 | Late Night |

잠긴 경로와 보안 배치도 미션마다 다릅니다. 같은 장소를 알아가는 감각은 유지하면서 들어가고 나오는 계획이 달라지게 하려는 구조입니다. 새 시스템이나 맵 수를 늘리기보다 작은 공간을 얼마나 다르게 사용할 수 있는지 시험하고 있습니다.

![Office Documents 미션의 Night 조명](https://kangjung.github.io/assets/img/posts/20260924/city-heist-night.png){:data-align="center"}

조명도 미션 데이터에서 선택하지만, 어두워졌다고 경비의 탐지 거리가 자동으로 줄어드는 시스템은 아닙니다. 분위기와 실제 탐지 규칙은 분리했고, 밤 화면이 어느 정도까지 어두워도 편하게 읽히는지는 계속 확인해야 합니다.

## 쿼터뷰에서는 벽 뒤까지 보였다

쿼터뷰는 공간을 보기 편한 대신 잠입 게임에서는 문제가 있었습니다. 캐릭터는 벽 뒤를 볼 수 없는데, 위에서 내려다보는 플레이어는 그곳의 경비까지 볼 수 있었습니다. 위험을 확인하기 위해 움직일 이유가 줄어드는 셈이었습니다.

그래서 Player Visibility와 Fog of War를 넣었습니다. 현재 시야는 정상적으로 보여주고, 탐색했던 환경은 어두운 기억으로 남기며, 미탐색 공간은 거의 보이지 않게 했습니다. 경비는 실제 플레이어 시야와 LOS 안에 있을 때만 보입니다.

CCTV도 한 번 발견했다고 시야 밖에서 회전 방향이나 실시간 cone까지 알려주지는 않습니다. 발견한 위치를 중립적인 표시로 기억할 수는 있지만, 현재 상태를 계속 중계하지는 않습니다. 보이지 않는 동안에도 경비와 CCTV의 동작은 계속됩니다.

![현재 시야와 탐색한 거리의 기억, 미탐색 공간](https://kangjung.github.io/assets/img/posts/20260924/city-heist-visibility.png){:data-align="center"}

그런데 정보를 가리고 나니 또 다른 문제가 생겼습니다. 가로등이 켜져 있는데도 시야 밖이라는 이유로 거리가 지나치게 어두워 보였습니다.

최근 Phase 9에서는 야외 조명이 비추는 정적인 공간을 읽는 것과 경비의 실시간 정보를 보는 것을 분리했습니다. 벽에 막히지 않는 조명 주변의 거리와 배경은 보이되, 그곳의 경비나 CCTV 정보는 여전히 실제 시야가 있어야 보이게 했습니다. 실내 조명만으로 벽 너머 방이 드러나지도 않도록 했습니다.

시야를 좁히는 것만으로 잠입이 좋아지는 것은 아니었습니다. 숨겨야 할 정보와 길을 이해하는 데 필요한 정보 사이를 계속 조정하고 있습니다.

## 직접 플레이하니 다시 문제가 보였다

시스템이 하나씩 붙을 때는 꽤 그럴듯해 보였습니다. 그런데 직접 해보니 “이건 왜 이렇지?” 싶은 부분이 계속 나왔습니다.

아직 침입하기 전인데 경비가 적대적으로 반응하는 것은 이상했습니다. 지금은 Public, Restricted, Secure 구역을 나누고 시작 위치를 Public으로 두었습니다. 경보나 탈취 전에는 공공 구역에서 의심이 쌓이지 않지만, 이미 경보가 울렸거나 목표물을 들고 있다면 밖으로 나와도 추적이 이어집니다. 위험해지는 기준을 좀 더 이해할 수 있게 바꾼 것입니다.

CCTV에 걸렸는데 무엇 때문에 들켰는지 이해하기 어려운 문제도 있었습니다. 현재는 탐지 진행과 발각 메시지를 보여줍니다. 그렇다고 시야 밖 CCTV의 정확한 위치나 방향을 알려주지는 않습니다. 경고는 필요하지만, 경고가 벽 너머 정보를 주는 도구가 되면 곤란했습니다.

![CCTV 탐지 cone과 현재 경고 피드백](https://kangjung.github.io/assets/img/posts/20260924/city-heist-cctv.png){:data-align="center"}

무엇을 훔쳐야 하는지 알아도 어디서 찾아야 하는지 막막한 부분에는 대략적인 목표 구역 설명을 추가했습니다. 실제 시야로 처음 찾았을 때 <code>TARGET LOCATED</code>와 작은 반짝임을 보여주고, 다시 시야를 잃으면 목표물 표시도 숨깁니다. 시작부터 벽 너머 목표 좌표를 찍어주는 방식은 피했습니다.

Lockpick도 고민이었습니다. 선택 도구인데 사실상 입장권처럼 느껴진다면, 출발 전에 두 개를 고르는 의미가 줄어듭니다. 현재 세 미션에는 도구를 소비하지 않고 통과할 수 있는 경로를 유지했고, 잠긴 문은 지름길 역할을 하도록 했습니다. 통과 가능한 경로가 있다는 것과 플레이어가 그 경로를 알아볼 수 있다는 것은 다른 문제여서, 입구와 제한 구역 표기도 함께 보강했습니다.

경비와 CCTV를 무시하고 목표물을 집은 뒤 바로 달려 나오는 전략이 너무 강한 것도 문제였습니다. 최근에는 경보 후 기존 경비 하나가 정해진 출구 접근 경로로 순찰을 바꾸고, 탈출 전에는 경비와 CCTV의 실제 시야에서 3초 동안 벗어나야 하도록 했습니다. 문을 전부 잠가 Lockpick을 필수로 만드는 방식은 쓰지 않았습니다.

이 변경들은 코드와 저장된 미션에 반영되어 있습니다. 자동 Play Mode 검사에서도 세 미션과 세 도구 조합, 총 아홉 조합을 도구 소비 없이 통과하는 경로를 확인했습니다. 하지만 **통과할 수 있다는 검증이 재미있거나 공정하다는 검증은 아닙니다.** 달리기만 하는 전략이 충분히 약해졌는지, 경고가 잘 들리는지, 돌아가는 길이 납득되는지는 사람의 플레이테스트와 밸런스 검토가 남아 있습니다.

## AI가 빨리 구현해도 판단은 남았다

AI를 쓰면서 가장 크게 달라진 것은 아이디어를 실제로 시험해보는 비용이었습니다. 반복 구현, scene 생성, 참조 연결, 검증 도구와 문서 정리를 함께 만들 수 있으니 생각했던 규칙을 플레이 가능한 상태로 가져가는 속도가 빨라졌습니다.

하지만 “경비가 정상적으로 추적한다”와 “경비가 불공평하게 느껴지지 않는다”는 다른 이야기였습니다. 두 도구를 고르는 UI가 있어도 특정 도구가 사실상 필수라면 선택은 형식뿐이고, 보안 시스템이 여러 개 있어도 그냥 달리는 것이 가장 좋으면 관찰할 이유가 없어집니다.

이런 문제는 제가 직접 해보고 불편하거나 이상한 지점을 말해야 다음 수정으로 이어졌습니다. 방향과 범위를 정하고, AI가 만든 결과를 확인하고, 다시 플레이하는 일은 계속 남아 있습니다.

AI가 코드를 빠르게 만드는 것과 게임이 재미있어지는 것은 별개의 문제였습니다. 다만 구현 비용이 내려가면서, 그 차이를 알아보기 위해 더 많은 아이디어를 직접 시험해볼 수 있게 됐습니다.

## 아직 개발 중

지금 구현된 상태에서는 세 미션의 기본 흐름을 플레이하고 재시도할 수 있습니다. 로컬 Windows 빌드와 자동 검증 기록도 있지만, 공개 playable build는 아직 없습니다. 보상, 진행도와 저장도 아직 구현하지 않았습니다.

UI는 여전히 임시이고 아트, 애니메이션, 오디오와 피드백도 최종 polish 전입니다. 첫 플레이에서 목표와 경고를 이해할 수 있는지, 세 미션의 난이도가 적절한지, 밤 화면과 소리가 실제 플레이 환경에서도 괜찮은지 확인할 일이 남아 있습니다.

직접 플레이하면 고쳐야 할 부분이 계속 보이고 있습니다. 당분간은 기능을 더 늘리기보다 지금 있는 시스템들이 실제 잠입 게임처럼 잘 맞물리는지, 관찰하고 기다리고 우회하는 선택이 재미있는지 계속 플레이하면서 다듬어볼 생각입니다.

<!-- outline-end -->
