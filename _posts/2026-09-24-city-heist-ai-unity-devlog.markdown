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

## Unity로 잠입 게임을 만들고 있다

이번에는 Unity로 잠입 게임을 만들고 있습니다. 이름은 **City Heist**입니다.

경비와 CCTV를 피해 들어가서 물건을 훔치고 빠져나오는 게임입니다. 경비와 싸울 수는 없고, 들키면 도망가거나 숨어야 합니다. 어느 쪽으로 들어갈지 살펴보고, 들어갈 때보다 나올 때 조금 더 곤란해지는 게임을 생각했습니다.

지금은 미션을 고르고 도구를 챙겨서 들어간 뒤, 목표물을 훔쳐 탈출하는 데까지는 해볼 수 있습니다. 기본 기능이 붙은 프로토타입 정도입니다. UI는 아직 임시이고 그래픽과 소리도 손볼 곳이 많습니다. 따로 공개한 플레이용 빌드는 아직 없습니다.

게임 화면과 진행 상황은 [itch.io 개발일지](https://kangjung.itch.io/city-heist/devlog/1675365/city-heist-devlog-1-from-prototype-to-playable-stealth-game)에도 올리고 있습니다. 여기서는 게임을 만들면서 AI를 어떻게 쓰고 있는지, 직접 해보니 어떤 문제가 있었는지를 적어보려고 합니다.

처음에는 바닥과 벽을 놓고 플레이어 대신 간단한 도형을 움직이게 했습니다. 이동과 쿼터뷰 카메라부터 만들고, 정해진 길을 순찰하는 경비를 붙였습니다. 플레이어를 보면 의심하고, 들키면 쫓아오고, 놓치면 마지막으로 본 곳을 찾아보는 식입니다.

![간단한 도형으로 만든 City Heist 초기 테스트맵](https://kangjung.github.io/assets/img/posts/20260924/city-heist-graybox.png){:data-align="center"}

아직은 게임이라기보다 경비를 피해 돌아다니는 테스트에 가까웠습니다. 여기에 문을 열고, 보석을 집고, 탈출 지점까지 가는 과정을 붙였습니다. 보석을 훔친 뒤에는 경비의 순찰도 빨라지게 했습니다. 들어간 길로 그대로 나오면 끝나는 건 좀 심심할 것 같았습니다.

## 코드를 맡기기 전에 정해둔 것들

이번에는 GPT와 기획을 이야기하고 Codex로 구현하면서 만들고 있습니다. 흔히 말하는 바이브 코딩에 가깝겠네요.

만들고 싶은 기능이나 플레이하다 이상했던 점을 GPT와 이야기하면서 정리하고, Codex에 구현을 맡깁니다. 코드뿐 아니라 씬과 프리팹을 만들고 연결하는 작업, 테스트, 문서 정리와 Git 작업까지 같이 맡기고 있습니다. 저는 Unity에서 직접 해보고 마음에 안 드는 부분을 다시 이야기합니다. 기능을 넣을지 뺄지도 제가 정하고요.

그런데 매번 프로젝트 설명부터 다시 하는 건 번거롭습니다. 전에 왜 그렇게 만들었는지 모르면 이미 결정한 내용을 다시 바꾸기도 쉽고요.

그래서 개인적으로 쓰는 Unity 기본 프로젝트에 <code>AGENTS.md</code>와 작업 문서를 넣어뒀습니다. 새 게임을 시작할 때 가져다 쓰는 용도입니다. 구현 전에 기획과 할 일, 이전에 결정한 내용부터 읽도록 했습니다. 작업이 끝나면 바뀐 내용도 문서에 남기게 했고요.

반복해서 해야 하는 Unity 설정도 가능하면 도구로 만들게 했습니다. 씬에 오브젝트를 놓고 Inspector에서 하나씩 연결하는 작업을 매번 제가 하기보다는, 에디터 메뉴를 눌러 다시 만들 수 있게 하는 편이 편했습니다. City Heist에도 단계별 테스트 씬을 만드는 메뉴와 빠진 참조를 검사하는 메뉴가 있습니다.

덕분에 설정하는 시간은 줄었습니다. 다만 검사에서 오류가 없다고 게임까지 괜찮은 것은 아니었습니다. 이건 뒤에서 다시 이야기하겠습니다.

## 사둔 에셋 목록도 AI에게 줬다

Unity Asset Store에서 사둔 에셋이 꽤 많습니다. 문제는 새 게임을 만들 때마다 뭘 가지고 있는지 다시 찾아봐야 한다는 것이었습니다. 쓸 만한 게 있었던 것 같은데 이름이 기억 안 나는 경우도 있고요.

그래서 구매 목록을 파일로 정리해두었습니다. <code>owned-assets.json</code>에 **210개 에셋의 이름과 제작자, 패키지 ID, 스토어 주소, 버전 정보** 등을 넣었습니다. My Assets 페이지의 HTML에서 패키지 ID를 가져온 목록입니다. 이름이 비슷해도 ID와 주소가 있으면 어떤 에셋인지 구분할 수 있습니다.

이 목록도 Unity 기본 프로젝트에 넣었습니다. AI가 배경이나 캐릭터, 애니메이션, 효과음 등을 찾을 때 제가 가진 것부터 확인하도록 했습니다. Unity 안에서 이름이나 제작자로 검색하고 쓸 에셋을 고르는 창도 만들었습니다.

그렇다고 목록에 있는 에셋이 전부 프로젝트에 들어 있는 건 아닙니다. 여기서 자꾸 헷갈리면 문제가 생깁니다. 가지고 있다는 이유로 아직 넣지도 않은 프리팹을 찾거나, 패키지 이름만 보고 파일 경로를 짐작해서 쓰면 안 되니까요.

필요한 에셋을 고르면 제가 Unity에 가져오고, 그다음에 실제 폴더 안에 어떤 파일이 있는지 확인하게 했습니다. 프리팹이나 애니메이션, 머티리얼, 효과음 파일이 정말 있는지 보고 나서 연결하는 순서입니다.

고른 에셋은 <code>selected-assets.json</code>과 <code>ASSET_SELECTION.md</code>에 따로 적어둡니다. 후보로 골랐는지(<code>planned</code>), 프로젝트에 가져왔는지(<code>imported</code>), 실제 게임에 연결했는지(<code>wired</code>), 검토하고 쓰지 않기로 했는지(<code>rejected</code>)를 구분합니다.

이렇게 해두면 다음 작업에서 같은 에셋을 또 찾거나, 가져오기만 한 것을 이미 쓰고 있다고 착각하는 일을 줄일 수 있습니다. 코드와 기획뿐 아니라 **제가 가진 에셋도 AI가 참고할 자료로 만들어둔 것**입니다. 다음 게임을 만들 때도 그대로 가져다 쓸 수 있고요.

GitHub에 넣은 것은 이 목록과 작업 문서, 직접 만든 코드 등입니다. 구매한 에셋 원본 파일은 각 PC의 Unity 프로젝트에만 넣고 Git에서는 제외했습니다. 원본을 직접 수정하지 않고 게임에 맞게 따로 만든 프리팹이나 애니메이터 컨트롤러를 관리하는 식입니다.

## 모델은 있는데 걷는 애니메이션이 없었다

City Heist에 쓸 도시와 상점부터 필요했습니다. 보유 목록에서 **POLYGON - City Pack - Art by Synty**와 **POLYGON - Heist Pack - Art by Synty**를 골랐습니다. 같은 Synty 에셋이라 거리와 건물, 캐릭터를 함께 써도 크게 어색하지 않을 것 같았습니다.

실제로 가져온 프리팹과 데모 씬을 확인한 뒤 City의 거리, 건물, 차량과 가로등을 쓰고, Heist의 캐릭터와 상점 내부, 문, 진열대와 보석을 연결했습니다. 화면에 보이는 모델을 바꾸더라도 기존 이동이나 충돌 판정이 바뀌지 않도록 따로 붙였습니다.

캐릭터 모델을 넣었으니 움직이게 하면 될 줄 알았는데, 필요한 애니메이션이 없었습니다. Heist에 들어 있던 <code>Take 001</code>을 검사해봤지만 걷거나 뛰는 데 쓸 수 있는 애니메이션은 아니었습니다.

다시 보유 목록을 보고 **Human Basic Motions**를 가져왔습니다. 실제 파일을 확인해서 서 있기, 걷기, 달리기, 웅크려 있기, 웅크려 걷기 다섯 가지를 플레이어와 경비에 연결했습니다. 이동은 원래 코드가 처리하고 애니메이션은 그 움직임을 따라가게 했습니다. 그래도 발이 미끄러져 보이는 부분이나 동작이 바뀌는 순간은 더 봐야 합니다.

![진열대 뒤에 웅크린 플레이어와 순찰 중인 경비](https://kangjung.github.io/assets/img/posts/20260924/city-heist-stealth.png){:data-align="center"}

*이미지는 Unity에서 기존 개발일지용으로 찍어둔 것을 사용했습니다. 장면을 잘 보여주려고 캐릭터와 카메라를 배치하고 경비 움직임을 멈춰 촬영했습니다. 상세 장면의 시야 판정은 그대로 두었고, 주요 UI는 숨긴 상태입니다.*

이후에는 도구를 썼는지, CCTV가 꺼졌는지 눈과 귀로 알 수 있게 할 필요가 있었습니다. **Epic Toon FX**에서 작은 불꽃과 반짝임 효과를 고르고, **UI SFX Mega Pack**에서 버튼, 장치 작동, 경고에 쓸 소리를 골랐습니다. 파티클과 머티리얼을 확인하고 URP에서 보이도록 게임 쪽에 별도 설정을 만들었습니다.

**FREE Casual Game SFX Pack**과 **Free Casual SoundFX Pack**도 가져와서 확인했지만 지금은 쓰지 않고 있습니다. 발소리나 문 여닫는 소리, 거리와 실내의 배경음은 아직 맞는 것을 찾지 못해 비워뒀습니다. 소리가 없다고 아무 효과음이나 넣으면 더 이상할 것 같았습니다. 지금 넣은 소리도 크기나 느낌이 맞는지는 더 들어봐야 합니다.

현재 사용 중인 주요 에셋은 아래 다섯 개입니다.

※ 이 글에는 Unity Asset Store 제휴 링크가 포함되어 있으며, 해당 링크를 통해 구매가 발생하면 작성자에게 커미션이 지급될 수 있습니다.

<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
  <a href="https://assetstore.unity.com/packages/3d/environments/urban/polygon-city-pack-art-by-synty-95214?aid=1011l8tvR" target="_blank" rel="noopener" title="POLYGON - City Pack - Art by Synty" style="flex:0 0 128px;"><img data-no-image-viewer src="https://api.assetstore.unity3d.com/affiliate/embed/package/95214/icon" alt="POLYGON - City Pack - Art by Synty" width="128" height="128" style="display:block; max-width:100%;" /></a>
  <a href="https://assetstore.unity.com/packages/3d/environments/urban/polygon-heist-pack-art-by-synty-97949?aid=1011l8tvR" target="_blank" rel="noopener" title="POLYGON - Heist Pack - Art by Synty" style="flex:0 0 128px;"><img data-no-image-viewer src="https://api.assetstore.unity3d.com/affiliate/embed/package/97949/icon" alt="POLYGON - Heist Pack - Art by Synty" width="128" height="128" style="display:block; max-width:100%;" /></a>
  <a href="https://assetstore.unity.com/packages/3d/animations/human-basic-motions-157744?aid=1011l8tvR" target="_blank" rel="noopener" title="Human Basic Motions" style="flex:0 0 128px;"><img data-no-image-viewer src="https://api.assetstore.unity3d.com/affiliate/embed/package/157744/icon" alt="Human Basic Motions" width="128" height="128" style="display:block; max-width:100%;" /></a>
  <a href="https://assetstore.unity.com/packages/vfx/particles/epic-toon-fx-57772?aid=1011l8tvR" target="_blank" rel="noopener" title="Epic Toon FX" style="flex:0 0 128px;"><img data-no-image-viewer src="https://api.assetstore.unity3d.com/affiliate/embed/package/57772/icon" alt="Epic Toon FX" width="128" height="128" style="display:block; max-width:100%;" /></a>
  <a href="https://assetstore.unity.com/packages/audio/sound-fx/ui-sfx-mega-pack-245595?aid=1011l8tvR" target="_blank" rel="noopener" title="UI SFX Mega Pack" style="flex:0 0 128px;"><img data-no-image-viewer src="https://api.assetstore.unity3d.com/affiliate/embed/package/245595/icon" alt="UI SFX Mega Pack" width="128" height="128" style="display:block; max-width:100%;" /></a>
</div>

## 맵 하나로 미션 세 개 만들기

CCTV를 넣으니 경비만 피할 때와는 다른 문제가 생겼습니다. 지나가야 할 곳을 카메라가 보고 있으면 기다리거나 다른 길로 가야 했습니다. 여기에 도구도 붙였습니다. EMP로 CCTV를 잠깐 끄고, 락픽으로 잠긴 문을 열고, 소음을 내는 장치로 경비를 다른 곳으로 유인할 수 있습니다. 출발 전에 세 가지 중 두 개를 고릅니다.

그런데 미션이 늘 때마다 맵도 새로 만들면 일이 너무 커질 것 같았습니다. 같은 장소에서 보석을 훔칠 때와 사무실 서류를 가져올 때를 다르게 만들어보고 싶었습니다.

그래서 맵과 미션 설정을 나눴습니다. 건물과 길은 그대로 두고, <code>MissionDefinition</code>에서 시작 위치와 탈출구, 목표물, 경비와 CCTV 배치, 잠긴 문을 바꿉니다.

작은 상점 주변도 **68 × 52m 크기의 City Block A**로 넓혔습니다. 보석상 옆에 사무실이 있고, 앞쪽 거리와 뒤쪽 골목, 주차장으로 돌아갈 수 있게 했습니다. 단순히 바닥을 넓히기보다는 가까운데 위험한 길과 조금 돌아가는 길을 만들고 싶었습니다.

![보석상과 사무실, 골목, 주차장이 있는 City Block A](https://kangjung.github.io/assets/img/posts/20260924/city-heist-city-block.png){:data-align="center"}

*이 사진은 맵 전체를 보여주려고 안개와 경비를 숨겼습니다. 실제 플레이 화면에서는 이렇게 전부 보이지 않습니다. 맨 위의 초기 테스트맵과는 배치와 촬영 거리도 다릅니다.*

현재는 같은 맵에서 세 미션을 해볼 수 있습니다.

| 미션 | 들어가서 나오는 길 | 경비 / CCTV | 시간대 |
| --- | --- | --- | --- |
| 보석 훔치기 | 앞쪽 거리 → 보석상 → 동쪽 골목 | 2 / 2 | 해 질 무렵 |
| 사무실 서류 훔치기 | 뒤쪽 골목 → 사무실 → 주차장 | 3 / 3 | 밤 |
| 보안이 강화된 보석상 | 주차장 → 서쪽 진열대 → 앞쪽 거리 | 4 / 5 | 늦은 밤 |

어떤 문이 잠겨 있는지도 다릅니다. 맵은 아는 곳인데 이번에는 다른 길로 들어가고 나와야 하는 식입니다.

![밤 시간대의 사무실 미션](https://kangjung.github.io/assets/img/posts/20260924/city-heist-night.png){:data-align="center"}

시간대에 따라 조명도 바꾸지만, 어둡다고 경비가 플레이어를 못 보는 기능까지 넣은 것은 아닙니다. 지금은 조명과 탐지 판정을 따로 두고 있습니다. 밤 분위기를 내면서도 길은 알아볼 수 있어야 해서 밝기도 계속 확인하고 있습니다.

## 벽 뒤에 있는 경비가 다 보였다

쿼터뷰로 내려다보니 맵은 보기 편했습니다. 그런데 벽 뒤에 있는 경비까지 보였습니다. 캐릭터는 볼 수 없는 곳인데 저는 위에서 다 보고 있으니, 굳이 조심해서 확인하러 갈 필요가 없었습니다.

그래서 캐릭터가 볼 수 있는 곳만 보여주도록 바꿨습니다. 지금 보는 곳은 그대로 보이고, 지나온 곳은 어둡게 남고, 아직 가보지 않은 곳은 거의 안 보이게 했습니다. 흔히 전장의 안개라고 부르는 방식입니다.

경비는 벽에 가리지 않고 실제 시야 안에 들어왔을 때만 보입니다. CCTV도 한 번 봤다고 계속 어느 방향을 보는지 알려주지는 않습니다. 시야에서 벗어나면 발견했던 위치만 표시합니다. 화면에서 숨겼을 뿐 경비는 계속 순찰하고 CCTV도 돌아갑니다.

![캐릭터가 보는 곳과 지나온 곳, 아직 가보지 않은 곳의 차이](https://kangjung.github.io/assets/img/posts/20260924/city-heist-visibility.png){:data-align="center"}

그런데 이걸 넣으니 가로등이 켜져 있는데도 뒤를 돌면 거리가 너무 어두워졌습니다. 불은 켜져 있는데 바닥까지 잘 안 보이는 건 어색했습니다.

최근에는 가로등 주변의 길과 건물은 시야 밖이어도 어느 정도 보이게 바꿨습니다. 대신 그곳에 있는 경비나 CCTV의 움직임까지 보여주지는 않습니다. 벽 너머 방이 조명 때문에 드러나지 않도록 막는 처리도 넣었습니다.

다 가리면 답답하고, 다 보여주면 잠입할 이유가 없어집니다. 이 정도면 괜찮겠지 싶어서 해보면 또 너무 어두운 곳이 보이네요.

## 그냥 훔치고 달리면 되는 것 아닌가

기능은 꽤 붙었는데 직접 해보니 이상한 점이 계속 나왔습니다.

우선 아직 건물에 들어가지도 않았는데 경비가 반응했습니다. 길에 서 있는 것만으로 쫓아오는 건 이상해서, 자유롭게 다녀도 되는 곳과 출입 제한 구역, 보안이 더 강한 구역을 나눴습니다. 이제 시작 위치에서는 바로 의심받지 않습니다. 다만 이미 경보가 울렸거나 물건을 훔쳤다면 밖으로 나와도 계속 쫓아옵니다.

CCTV에 걸렸을 때도 왜 들켰는지 잘 모르겠는 경우가 있었습니다. 지금은 탐지 게이지와 발각 메시지를 보여주게 했습니다. 시야 밖 카메라의 위치까지 알려주지는 않지만, 적어도 지금 CCTV에 걸리고 있다는 건 알 수 있게 했습니다.

![CCTV 감시 범위와 탐지 중임을 알려주는 표시](https://kangjung.github.io/assets/img/posts/20260924/city-heist-cctv.png){:data-align="center"}

훔칠 물건을 어디서 찾아야 하는지도 부족했습니다. 미션 설명에 대략 어느 건물, 어느 구역인지 적고, 실제로 발견하면 메시지와 작은 반짝임을 보여주도록 바꿨습니다. 벽 너머에서부터 정확한 위치를 알려주지는 않고요.

락픽도 선택 도구라기보다 반드시 챙겨야 하는 열쇠처럼 느껴지는 문제가 있었습니다. 그래서 지금은 세 미션 모두 도구를 쓰지 않고도 통과할 길을 남겨두고, 잠긴 문은 더 빨리 갈 수 있는 지름길로 쓰고 있습니다. 길이 있어도 못 찾으면 소용없으니 옆문과 출입 제한 구역 표시도 보강했습니다.

그중 가장 걸렸던 건 그냥 달리는 게 너무 잘 통한다는 점이었습니다. 경비와 CCTV를 무시하고 물건을 집은 뒤 바로 뛰어나오면 됐습니다. 이러면 경비 움직임을 보고 기다릴 이유가 별로 없습니다.

최근에는 경보가 울리면 기존 경비 한 명이 출구 근처를 순찰하도록 바꿨습니다. 탈출 지점에 닿았다고 바로 끝나지도 않습니다. 경비와 CCTV의 시야에서 3초 동안 벗어나야 탈출할 수 있게 했습니다. 그렇다고 문을 다 잠가버리면 락픽이 다시 필수가 될 것 같아서 문은 그대로 뒀습니다.

여기까지는 구현했고, 자동 테스트에서도 세 미션을 각각 세 가지 도구 조합으로 통과하는 경로를 확인했습니다. 도구를 한 번도 쓰지 않고 나올 수도 있습니다.

다만 이걸로 밸런스가 괜찮아졌다고 하기는 어렵습니다. 제가 더 해보면서 그냥 뛰는 것보다 숨어서 기다리는 게 나은지, 돌아가는 길을 찾는 게 너무 답답하지는 않은지 봐야 합니다. 경고 소리나 작은 표시가 실제 플레이 중에도 눈에 들어오는지도 아직 확인할 부분이 남아 있습니다.

## AI가 빨리 만들어줘도 직접 해봐야 했다

Codex에 맡기니 반복 작업은 확실히 빨라졌습니다. 씬을 만들고 설정을 연결하는 도구나 테스트까지 같이 만들 수 있었고, 문서 정리도 덜 미루게 됐습니다.

그런데 코드는 돌아가는데 막상 해보면 별로인 경우는 여전히 있었습니다. 경비가 잘 쫓아오는 것과 플레이할 때 억울하지 않은 것은 다르고, 도구 세 개를 넣었다고 선택이 재미있어지는 것도 아니었습니다. 그냥 달리면 되는 문제도 직접 해봐야 알 수 있었고요.

그래서 지금도 구현을 맡기고, 해보고, 이상한 부분을 다시 고치는 일을 반복하고 있습니다. AI가 빠르게 코드를 만들어주는 덕분에 생각한 걸 시험해보기는 쉬워졌습니다. 그중 뭘 남기고 어떻게 고칠지는 결국 플레이하면서 정하고 있습니다.

## 당분간은 계속 해보면서 고칠 생각

현재 버전은 미션을 고르고 들어가서 성공하거나 잡힌 뒤 다시 시작하는 데까지 이어집니다. Windows 실행 파일로도 확인했지만, 아직 다른 사람이 내려받아 해볼 수 있게 공개하지는 않았습니다. 보상이나 진행도 저장도 아직 없습니다.

UI는 임시이고 캐릭터 움직임, 효과음, 화면에 뜨는 표시도 손볼 곳이 많습니다. 처음 하는 사람이 목표와 경고를 이해할 수 있을지, 세 미션의 난이도가 적당할지, 밤 화면이 너무 어둡지는 않을지도 더 봐야 합니다.

직접 해보면 고칠 부분이 계속 보입니다. 당분간은 기능을 더 늘리기보다 지금 있는 것들이 실제 잠입 게임처럼 잘 맞물리는지 계속 플레이하면서 다듬어볼 생각입니다.

<!-- outline-end -->
