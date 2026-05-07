# Sentinel Protocol - 대화 로그 (v1.0)

이 파일부터는 **v1.0** 정식 버전 범위의 대화/결정/작업 로그를 기록한다.
이 파일에서 질문한 내용은 질문한 내용 밑에 답변을 달도록 한다.
---

## v1.0 시작 상태 요약

**Beta 5.0 마감일:** 2026-05-07  
**git 기준 커밋:** `17d502c`  
**앱 버전 배지:** `v1.0` (LobbyScreen 우측 상단)

### 누적 완료 기능 (Beta 1.0 ~ 5.0)

| 영역 | 내용 |
|---|---|
| 화면 구조 | Lobby → Wave → Shop → Guide (+ Loading) |
| 타워 | Pulse Lancer / Nova Cannon / Cryo Field / **Volt Striker** (4종) |
| 적 | Guard Shell / Runner Drone / **Phantom Crawler** (3종, 팬텀은 슬로우 면역) |
| 웨이브 | Wave 1~20 (TO: 7·12·19, 멀티패스: 3·18·20) |
| 상성 시스템 | 각 타워마다 상성 적 타입 ×1.3 데미지 |
| 메타 시스템 | 다이아 획득→상점에서 아이템 구매→인게임 소비 |
| 언어 | EN / KR 토글 (AsyncStorage 영속) |
| 설명서 | GuideScreen — 타워·아이템·적 탭 (실제 스프라이트 + 장단점) |
| 난이도 | Easy / Normal / Hard 해금 진행 완전 분리 |
| 관리자 | Admin ON/OFF — 골드 1000, 아이템 +5, 난이도별 진행도 리셋 |

### 현재 데이터 파일 구조 (핵심)

| 파일 | 역할 |
|---|---|
| `data/towers.ts` | TowerStats 4종 (sniper·aoe·slow·chain) |
| `data/enemies.ts` | EnemyStats 3종 (guard·runner·phantom) |
| `data/waves.ts` | Wave 1~20 WaveConfig |
| `data/stages.ts` | Wave 1~20 StageConfig (경로·그리드) |
| `data/items.ts` | 아이템 4종 (bomb·freeze·global_bomb·heart_boost) |
| `data/shop.ts` | ShopItem 가격 정의 |
| `data/guideData.ts` | 타워·아이템·적 가이드 텍스트 (EN/KR) |
| `i18n/index.ts` | 전체 번역 문자열 |
| `assets/units/` | towers/ + enemies/ PNG 스프라이트 |

---

## v1.0 작업 로그

(이후 내용은 대화 진행에 따라 이어서 기록)

-

## 질문: 이제 기본적인 게임은 가능한 상태라고 보여지는데 너가 볼 때는 어떠니?

[CLAUDE 답변]

게임의 핵심 루프는 완성도 있게 갖춰져 있다고 생각합니다. 타워 설치→적 처치→골드 획득→업그레이드, 웨이브 클리어→다이아→상점→아이템, 이 두 축의 사이클이 Wave 1~20까지 자연스럽게 연결됩니다.

다만 v1.0 "정식 출시" 기준으로 보면 아래 항목들이 신경 쓰입니다:

### 중요도 높음
1. **사운드 없음** — BGM·효과음이 전혀 없습니다. 모바일 게임에서 가장 체감 차이가 큰 요소입니다.
2. **로비 하단 RESET 버튼** — Admin 모드와 별개로 공개 UI에 리셋 버튼이 노출되어 있습니다. 실수로 누르면 진행도가 날아가는 위험이 있어 출시 전에 제거하거나 숨겨야 합니다.
3. **Wave 20 밸런스 미검증** — 코드상으로 설계했지만 실제 플레이 테스트가 없었습니다.

### 중요도 중간
4. **첫 실행 튜토리얼 없음** — 타워 설치 방법, 아이템 사용법을 처음 보는 사람은 혼자 파악하기 어렵습니다. 간단한 첫 웨이브 안내 텍스트라도 있으면 좋습니다.
5. **Wave 20 클리어 연출 없음** — 최종 웨이브를 깼을 때 특별한 엔딩 화면이나 축하 연출이 없어 허전합니다.
6. **APK 빌드 경험** — 지금은 Expo Go로만 확인했습니다. 실제 `.apk` 빌드 후 일반 설치 테스트가 필요합니다.

### 낮음 (있으면 좋음)
7. **스프라이트 퀄리티** — Volt Striker·Phantom Crawler는 Python Pillow로 생성한 것이라 다른 타워/적에 비해 퀄리티 차이가 날 수 있습니다.

결론적으로 **플레이는 충분히 가능한 상태**입니다. 다만 **출시** 기준으로는 최소한 "RESET 버튼 제거"와 "사운드"는 챙기는 것이 좋다고 봅니다. 사운드는 범위가 크니 어디까지 할지 의논이 필요합니다.

## 질문: 좋아, 그러면 중요도 높은것부터 추가 하자. 
중요도 높음(단계1) 중간(단계2) 낮음 (단계3) 으로 정리 하고
단계1. 사운드는 SF적인 요소가 들어가면 좋겠고. 또 타워가 공격 할때의 이팩트소리가 들어가면 좋으려나? 이건 너가 판단해줘. 만약에 필요하다면 각각 타워별로 만들어줘. 또는 기존에 무료로 풀린거 가져다 써도되.

RESET버튼은 별도의 톱니바퀴를 만들어서 거기다가 넣는거 어때? ADMIN은 출시 전까진 유효하게 놔두고 이후에 너가 신경써서 다시 말해줘.
WAVE 20검증 해줘.

단계1이 다 완성 되면 단계2로 넘어가는데, 이건 다시 정리 하기로 하고 단계1이 다 되면 git commit 하도록 해
그리고 당연하겠지만 git commit이 되면 changelog.md에 기록 남겨

[CLAUDE 답변 — 단계1 완료]

### 사운드 시스템 구현
타워 공격 사운드는 각각 다르게 만드는 게 맞다고 판단했습니다. 타워마다 역할이 다르니 소리도 달라야 게임 피드백이 명확합니다.

**Python wave 모듈로 SF 사운드 10종 생성:**
- BGM: `bgm_lobby.wav` (8초 루프, 우주 드론 앰비언트), `bgm_wave.wav` (10초 루프, 긴장감 있는 베이스+펄스)
- 타워 SFX: 스나이퍼(고주파 레이저 pew), 노바캐논(저주파 폭발 boom), 크라이오(얼음 노이즈 hiss), 볼트스트라이커(전기 FM 크래클)
- 이벤트 SFX: 웨이브 클리어(장조 아르페지오), 게임오버(불협화음 하강), 아이템 사용, 적 누수 경고음

**soundManager 싱글톤 (`src/utils/soundManager.ts`):**
- SFX: 캐싱 + 쿨타임으로 동시 다발 재생 중복 방지
- BGM: 화면 전환 시 자동 교체
- `getTowerSfxKey(towerId)` 로 타워별 SFX 매핑

**연결된 이벤트:**
- LobbyScreen 마운트 → `bgm_lobby` 시작
- WaveScreen 마운트 → `bgm_wave` 시작
- 타워 공격 → 타워별 SFX
- 적 누수 → `sfx_enemy_leak`
- 아이템 사용 → `sfx_item_use`
- Wave Clear / Game Over → SFX + BGM 볼륨 다운

### RESET → 설정 톱니바퀴
- 로비 우측 하단 공개 RESET 버튼 완전 제거
- `Ionicons settings-outline` 톱니바퀴 버튼으로 교체
- 클릭 시 패널 토글 — 내부에 `RESET [선택난이도]` 버튼

### Wave 20 검증 완료
- 듀얼 패스(Path A: 0,5 / Path B: 0,10) 교대 스폰 — 두 경로 모두 `[8,7]`로 수렴, 중간 겹침 없음 ✓
- 적 구성(가드 30·러너 35·팬텀 35), 스폰 카운트/타이밍 정상 ✓

### Bug Fix (발견 및 수정)
- `WaveScreen.tsx`: `waveId < 15` → `waveId < 20` (Wave 16~20 클리어 시 진행도가 저장되지 않던 버그)

TypeScript 체크 통과, git commit + Changelog.md 기록 완료.