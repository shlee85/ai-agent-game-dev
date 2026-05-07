# Project Changelog & Commit History

이 문서는 깃허브(GitHub) 커밋(Commit) 내역과 버전에 대한 상세 요약 및 변경 사항을 기록하여 관리하는 파일입니다.

---

## [2026-05-07] v1.0 단계2 — 튜토리얼·Wave 20 엔딩·APK 빌드 설정

### 상세 변경 사항 요약

1. **튜토리얼 오버레이 (WaveScreen.tsx)**
   - Wave 1 첫 진입 시 `AsyncStorage("tutorialShown")` 미존재 시 자동 표시
   - 3단계 슬라이드: Build Towers / Upgrade & Sell / Use Items (EN/KR 지원)
   - 진행 도트 UI + Spring 애니메이션
   - 마지막 단계 "Got it!" 클릭 시 `tutorialShown = "1"` 저장 → 이후 표시 안 함

2. **Wave 20 최종 클리어 엔딩 화면 (WaveScreen.tsx)**
   - `waveId === 20 && gameState === "wave_clear"` 조건 시 골든 팝업 표시
   - 황금 별(★★★) 장식 + 글로우 텍스트 (`allWavesCleared`, `allWavesClearedDesc`)
   - FINAL REPORT 섹션: kills/leaks/gold/diamond 통계 표시
   - "Back to Lobby" 버튼만 제공 (다음 웨이브 없음)

3. **i18n 문자열 추가 (index.ts)**
   - `tutorialTitle`, `tutorialNext`, `tutorialGotIt`, `tutorialStep[3]` (EN/KR)
   - `allWavesCleared`, `allWavesClearedDesc`, `finalReport` (EN/KR)

4. **APK 빌드 설정**
   - `app/eas.json` 신규 생성 — preview(APK) / production(AAB) 프로파일
   - `app/app.json` — `android.package: "com.shlee.sentinelprotocol"`, `versionCode: 1` 추가

5. **Bug Fix: Next Wave 조건 수정**
   - 팝업 내 "Next Wave" 버튼 및 스타일 분기에서 `waveId < 15` → `waveId < 20`

---

## [2026-05-07] v1.0 단계1 — 사운드 시스템·설정창·Wave 20 검증

### 상세 변경 사항 요약

1. **사운드 시스템 (expo-av)**
   - `expo-av ~16.0.8` 설치
   - Python wave 모듈로 SF 사운드 10종 생성 (`app/assets/sounds/`)
     - BGM: `bgm_lobby.wav` (8s 루프), `bgm_wave.wav` (10s 루프)
     - SFX: 타워별 공격음 4종 (`sfx_attack_sniper/aoe/slow/chain.wav`)
     - SFX: 이벤트 4종 (`sfx_wave_clear/game_over/item_use/enemy_leak.wav`)
   - `app/src/utils/soundManager.ts` 신규 생성
     - 싱글톤 SoundManager: BGM 루프, SFX 캐싱+쿨타임, 타워ID→SFX 매핑
   - `WaveScreen.tsx` 연결: 마운트 시 BGM 시작, 타워 공격마다 SFX, 적 누수/아이템 사용/결과화면 이벤트 사운드
   - `LobbyScreen.tsx` 연결: 마운트 시 로비 BGM 시작

2. **RESET → 설정 톱니바퀴**
   - 로비 우측 하단 공개 RESET 버튼 제거
   - 톱니바퀴(⚙) 아이콘 버튼 추가 (`Ionicons settings-outline`)
   - 버튼 클릭 시 설정 패널 토글 — 내부에 현재 선택 난이도 진행도 RESET 버튼 배치

3. **Wave 20 검증 완료**
   - 듀얼패스(Path A/B) 교대 스폰 로직 확인 — 두 경로 모두 `[8,7]` 수렴, 중간 겹침 없음
   - 적 구성(가드 30·러너 35·팬텀 35) 및 스폰 타이밍 정상 동작 확인

4. **Bug Fix: 웨이브 진행 저장 범위 수정**
   - `WaveScreen.tsx` `waveId < 15` → `waveId < 20` (Wave 16~20 클리어 시 진행도 저장 안 되던 버그 수정)

5. **TypeScript 체크 통과 (오류 없음)**

---

## [2026-04-28] Beta 3.0 비주얼 정렬 및 3D 검증 파이프라인 반영
- **Git Revision (Commit Hash):** `cea3f81`
- **Commit Message:** `feat: Beta 3.0 비주얼 정렬 및 3D 검증 파이프라인 반영`
- **Push Status:** `origin/main` 업로드 완료 (`03e77ce -> cea3f81`)

### 상세 변경 사항 요약
1. **Beta 3.0 대화/기획 문서 정리**
   - `.ai/Talk3.0.md` 신규 생성 및 대화 결정사항 누적 기록
   - `GamePlan.md`, `Character.md`, `Talk2.0.md` 업데이트
2. **캐릭터/맵 비주얼 고도화**
   - 타워/적 PNG 리프레시 (`tower_*`, `enemy_*`)
   - `GridMap.tsx`, `BuildMenu.tsx`, `TowerMenu.tsx`, `HUD.tsx` 시각 문법 정렬
   - 네이밍 정렬: Display Name / System ID / Asset File 매핑 고정
3. **3D 검증 트랙 추가**
   - `Phase0Screen.tsx`, `Phase1Screen.tsx` 추가 및 로비 진입 동선 연결
   - GLB/GLTF 로딩 경로 반영 및 Metro 확장자 설정 보강
4. **GLTF 로딩 안정화**
   - `patch-package` 도입 (`postinstall`) 및 `three-stdlib` 패치 반영
   - `app/patches/three-stdlib+2.36.1.patch` 추가

---

## [2026-05-06] Beta 4.0: 상점·웨이브 확장·관리자 모드·UI 고도화
- **Git Revision (Commit Hash):** `56b84d6`
- **Commit Message:** `feat: Beta 4.0 — 상점/Wave 1~15 확장/관리자 모드/UI 고도화`
- **Push Status:** `origin/main` 업로드 완료 (`cea3f81 -> 56b84d6`)

### 상세 변경 사항 요약

1. **로비 전용 상점 추가**
   - `app/src/screens/ShopScreen.tsx` 신규 추가
   - `app/src/data/shop.ts` 신규 추가 (상품 스키마, 가격, 쿨다운/상한 정책)
   - `app/src/data/itemAssets.ts` 신규 추가 (아이템 아이콘 매핑)
   - `app/assets/items/` 아이콘 4종 추가
   - 보석은 상점 구매에서만 소모, 인게임은 재고 수량만 소모로 전환
   - 연속 구매 쿨다운 0.25초, 아이템 보유 상한 99 적용

2. **Wave 1~15 확장**
   - `app/src/data/waves.ts`: Wave 1~15 난이도별 스폰/보상 데이터 전면 반영
   - `app/src/data/stages.ts`: Wave 1~15 전부 고유 맵(경로) 적용
   - Wave 7: Time Objective(시간제) 웨이브 — 타이머 종료 시 클리어
   - 난이도별 진행도 완전 분리 (`maxUnlockedWave_easy/normal/hard`)

3. **로비 UI 개선**
   - Wave 카드 가로 스크롤형 + 한 화면 6개 표시
   - Wave 1~15 각각 고유 색상 구분
   - Wave 번호 표시 버그 수정 (010~015 → 10~15)
   - SHOP 버튼 다이아몬드 아이콘형으로 변경
   - Phase 0/1 TEST 버튼 제거

4. **관리자 모드**
   - 로비 상단 `ADMIN ON/OFF` 토글
   - ON: 다이아 1000 / 전 웨이브 오픈 / 웨이브 시작 골드 1000
   - OFF: ON 직전 다이아 값 복구
   - 추가 기능: `RESET <난이도>` / `ITEM +5`

5. **인게임 개선**
   - Wave 결과 리포트 UI (처치 수, 누수 수, 획득 골드/보석, 사용 아이템)
   - Wave reset 확인창(Alert) 추가

6. **캐릭터 이름 확정 및 코드 반영**
   - 펄스 랜서 (Pulse Lancer) / 노바 캐논 (Nova Cannon) / 크라이오 필드 (Cryo Field)
   - 러너 드론 (Runner Drone) / 가드 쉘 (Guard Shell)

7. **문서 동기화**
   - `.ai/Talk4.0.md` 신규 생성
   - `.ai/WavePlan.md` Wave 1~7 + 8~15 설계 전면 업데이트
   - `.ai/GamePlan.md` Beta 4.0 릴리즈 체크리스트 반영
   - `CLAUDE.md` 신규 추가 (프로젝트 컨텍스트)

---

## [2026-04-27] Beta 2.0 1차 마감 문서 동기화
- **Git Revision (Commit Hash):** `03e77ce`
- **Commit Message:** `feat: Beta 2.0 캐릭터 UI/전투 피드백 고도화 및 Text 렌더 오류 수정`

### 마감 상태 요약
- 타워 3종/적 2종 스프라이트 적용 완료
- 적 연출(잔상/바운스/스폰 플래시) 및 타입별 타워 발사 피드백 적용 완료
- 로비 버전 배지 `beta2.0` 반영 완료
- TypeScript/Lint 검증 통과

### 문서 동기화
- `GamePlan.md`: Beta 2.0 완료 현황 및 동결 체크리스트 반영
- `Character.md`: 적용 현황/동결 기준 반영
- `Talk2.0.md`: 단계별 의사결정 및 변경 로그 연동

---

## [Pending Commit] Beta 2.0 (2차): 적 유닛 스프라이트 적용
- **Commit Message:** `feat: Beta 2.0 2차 적 유닛 스프라이트 렌더링 적용`

### 상세 변경 사항 요약
1. **적 유닛 스프라이트 에셋 추가**
   - `app/assets/units/enemies/` 경로에 `enemy_runner.png`, `enemy_guard.png` 추가
2. **적 에셋 매핑 데이터 신설**
   - `app/src/data/enemyAssets.ts` 생성
   - 적 `type`과 정적 `require()`를 1:1 매핑
3. **GridMap 적 렌더링 교체**
   - 기존 색상 박스 기반 렌더를 `Image` 스프라이트 렌더로 전환
   - 피격/감속 상태는 오버레이 색상으로 가독성 유지

---

## [Pending Commit] Beta 2.0 (1차): 타워 캐릭터 UI 스프라이트 적용
- **Commit Message:** `feat: Beta 2.0 1차 타워 스프라이트 렌더링 및 문서 스펙 반영`

### 상세 변경 사항 요약
1. **타워 스프라이트 에셋 추가**
   - `app/assets/units/towers/` 경로에 `tower_sniper.png`, `tower_aoe.png`, `tower_slow.png` 추가
2. **타워 에셋 매핑 데이터 신설**
   - `app/src/data/towerAssets.ts` 생성
   - 타워 `id`와 정적 `require()`를 1:1로 매핑
3. **GridMap 타워 렌더링 교체**
   - 기존 원형 `View` 기반 타워 표시를 `Image` 기반 스프라이트 렌더링으로 전환
   - 업그레이드 배지(`U`)는 시인성 높은 오버레이 배지로 유지
4. **Beta 2.0 문서 스펙 동기화**
   - `GamePlan.md`, `Character.md`, `GraphicsPlan.md`에 캐릭터 UI 1차 스펙(해상도/포맷/우선순위) 반영

---

## [Pending Commit] 4단계: UI/UX 및 이펙트 고도화 (3차 폴리싱 - 우주 테마 배경 및 아이콘 적용)
- **Commit Message:** `feat: 게임 앱 아이콘 추가 및 로비/인게임 우주 배경 적용`

### 상세 변경 사항 요약
1. **앱 아이콘(Sentinel Protocol) 등록**
   - `app.json` 설정에 앱 이름(`Sentinel Protocol`) 반영
   - `GenerateImage`로 생성한 사이버펑크 네온 방어기지 아이콘을 `assets/logo.png`로 저장 및 `LobbyScreen` 메인 화면에 적용
2. **우주 테마(Space Theme) 배경화면 적용**
   - 별과 행성, 성운이 보이는 고퀄리티 우주 배경 이미지를 생성하여 `assets/bg.png`로 저장
   - `LobbyScreen.tsx`와 `WaveScreen.tsx`의 최상단 컨테이너를 `<ImageBackground>`로 교체하여 우주 배경이 은은하게 깔리도록 연출
3. **그리드 맵 투명도(Opacity) 조절**
   - 인게임 전투가 벌어지는 `GridMap.tsx`의 타일 배경(`bg`)을 불투명 색상에서 반투명(rgba) 색상으로 변경하여, 바닥 너머로 우주 배경이 예쁘게 비쳐 보이도록 시각적 깊이감 향상

---

## [Pending Commit] 4단계: UI/UX 및 이펙트 고도화 (2차 폴리싱 - 사이버펑크 네온 테마)
- **Commit Message:** `feat: 피격 플래시 이펙트, 타워 레이더 표시 및 로비 화면 네온 테마 전면 개편`

### 상세 변경 사항 요약
1. **적군 피격 플래시(Hit Flash) 이펙트 추가**
   - 적이 타워의 공격이나 스킬(폭격, 빙결 등)에 맞을 때마다 아주 짧은 시간(0.1초) 동안 하얗게 번쩍이도록 `EnemyData`에 `hitTimer` 속성을 추가하고 렌더링에 반영
   - 타격감을 극대화하여 "맞고 있다"는 피드백을 직관적으로 제공
2. **로비 화면(LobbyScreen) 사이버펑크 네온 테마 개편**
   - "PATH DEFENSE - CYBERPUNK PROTOCOL" 이라는 타이틀 텍스트에 네온 그림자(`textShadow`) 적용
   - 난이도 및 웨이브(SECTOR) 선택 버튼에 형광색(Cyan, Fuchsia, Emerald)과 고대비 다크 테마(`bg-slate-900`)를 입혀 미래적인 UI 구현
   - `Ionicons`를 적극 활용하여 아이콘과 텍스트의 조화를 향상
3. **타워 사거리(Range) 시각화 개선**
   - 기존의 단순한 옅은 원형 사거리 표시를 Cyan 계열의 `dashed` 스타일 테두리로 변경하여, 미래의 '홀로그램 레이더'가 영역을 스캔하는 듯한 느낌을 연출

---

## [Pending Commit] 4단계: UI/UX 및 이펙트 고도화 (1차 폴리싱)
- **Commit Message:** `feat: 아이콘 에셋 교체, 플로팅 텍스트 효과 및 팝업 애니메이션 추가`

### 상세 변경 사항 요약
1. **아이콘 에셋 교체 (이모지 렌더링 버그 원천 차단)**
   - `expo-vector-icons`(`FontAwesome5`, `Ionicons`)를 설치 및 적용
   - `HUD.tsx`, `ItemShop.tsx`, `BuildMenu.tsx`, `TowerMenu.tsx` 내의 텍스트 기반 이모지(🪙, 💎, ❤️)를 모두 고품질 벡터 아이콘 에셋으로 교체하여 UI를 세련되게 다듬음
2. **플로팅 텍스트(Floating Text) 피드백 추가**
   - 적 처치 시 획득하는 골드 수치(`+10` 등)가 적의 사망 위치에서 위로 떠오르며 서서히 사라지는 애니메이션 컴포넌트(`FloatingTextItem`) 구현
   - `GridMap.tsx` 및 `WaveScreen.tsx` 연동으로 타격감과 골드 수급 인지력 대폭 상향
3. **팝업 애니메이션 적용**
   - 게임 오버, 웨이브 클리어, 일시 정지 팝업 등장 시 딱딱하게 뜨는 대신 `Animated.spring`을 사용해 부드럽게 튀어 오르는(Scale & Fade-in) 고급 연출 적용

---

## [Pending Commit] 3단계: 아이템/스킬 시스템 (다이아몬드 소모)
- **Commit Message:** `feat: 다이아몬드 재화 및 3종 스킬(정밀 폭격, 절대 영도, 융단 폭격) 시스템 추가`

### 상세 변경 사항 요약
1. **재화(다이아몬드) 및 UI 추가**
   - 난이도별 초기 다이아몬드 지급량 설정 (`difficulty.ts` - 초보 30개, 중수 20개, 고수 10개)
   - `HUD.tsx` 상단바에 다이아몬드(💎) 보유량 표시 추가
2. **스킬 상점(`ItemShop.tsx`) 컴포넌트 신설**
   - 화면 좌측에 3가지 스킬(폭탄, 빙결, 광역 폭탄)을 즉시 사용할 수 있는 UI 패널 구현
   - 다이아몬드 부족 시 아이콘 비활성화 및 타겟팅 중 상태(Pulse 애니메이션) 시각화 반영
3. **스킬(아이템) 작동 로직 구현 (`WaveScreen.tsx`)**
   - **정밀 폭격 (Bomb Drop):** 선택 시 타겟팅 모드로 전환. 맵 터치 시 반경 2.5타일 내 적들에게 50 데미지 및 폭발 이펙트 렌더링
   - **절대 영도 (Global Freeze):** 사용 즉시 맵 전체 번쩍임 이펙트와 함께 10 데미지 및 4초간 모든 적 이동 속도 90% 감소(거의 정지)
   - **융단 폭격 (Global Bomb):** 사용 즉시 맵 전체 적에게 35 고정 데미지 부여
4. **시각 효과 처리 (`GridMap.tsx`)**
   - 글로벌 스킬 사용 시 맵 전체를 덮는 `flashColor` 이펙트 레이어 추가
   - 정밀 폭격 시 지정 좌표에 거대한 폭발 이펙트(`attackEffects`) 렌더링 추가

---

## [Pending Commit] 적군 다양화 및 난이도 시스템 연동
- **Commit Message:** `feat: 다양한 적군(Runner, Guard) 추가 및 난이도(초보/중수/고수) 시스템 연동`

### 상세 변경 사항 요약
1. **적군 속성 분리 (`enemies.ts` 신설)**
   - `Guard Shell`: 느린 이동 속도(1.0), 높은 체력(120), 큰 크기와 진한 붉은색
   - `Runner Drone`: 아주 빠른 이동 속도(2.2), 낮은 체력(45), 작은 크기와 밝은 붉은색
2. **난이도 선택 시스템 (`LobbyScreen.tsx` 수정)**
   - 웨이브 선택 전 초보(Easy), 중수(Normal), 고수(Hard) 세 가지 난이도를 선택할 수 있는 UI 구현
   - 선택한 난이도 데이터(`Difficulty`)를 최상단 `App.tsx`를 통해 `WaveScreen`으로 전달
3. **난이도 배율 및 웨이브 스폰 로직 적용 (`WaveScreen.tsx` 수정)**
   - **적군 필터링:** 선택한 난이도(`enemyTypeLimit`)에 맞춰 해당 웨이브에서 나올 수 있는 적 종류 제한 (예: 초보는 1종, 중수는 2종 등)
   - **가중치 랜덤 스폰:** 필터링된 적들의 `weight` 값을 기준으로 출현 확률을 계산해 스폰하도록 알고리즘 구현
   - **수치 연동:** 난이도의 체력 배율(`enemyHpMultiplier`), 이속 배율, 스폰량 배율(`spawnCountMultiplier`) 및 골드 획득 배율(`killGoldMultiplier`)을 적 생성 시 실시간으로 적용
4. **시각적 다양성 렌더링 (`GridMap.tsx` 수정)**
   - 기존에 단일 크기(0.6)와 색상으로 고정되어 있던 적군 그래픽을 `enemy.size` 및 `enemy.color` 값으로 각각 다르게 렌더링하도록 픽스

---

## [Pending Commit] 타워 관리 시스템 (업그레이드 및 판매) 추가
- **Commit Message:** `feat: 타워 업그레이드, 판매 기능 및 사거리/U마크 시각화 구현`

### 상세 변경 사항 요약
1. **타워 상태 관리 및 확장 (`towers.ts`)**
   - 각 타워(단일, 광역, 감속) 데이터에 `upgradeCost` 속성 추가
2. **타워 관리 메뉴 (TowerMenu) 컴포넌트 신규 제작**
   - 이미 지어진 타워를 터치하면 하단에 팝업되는 관리 메뉴 구현
   - **업그레이드 기능:** 현재 골드와 업그레이드 비용을 비교하여 레벨업(최대 레벨 2 임시 설정) 및 데미지 증가 (1레벨당 +50% 공격력 증가 로직 연동)
   - **판매 기능:** 타워 건설 + 업그레이드 비용의 총 70%를 환급해주고 맵에서 철거하는 기능
3. **인게임 시각 효과 보강 (`GridMap.tsx`)**
   - 타워를 터치(선택)했을 때 해당 타워의 **공격 사거리 반경(Radius)** 을 맵 위에 옅은 반투명 원형으로 오버레이 표시
   - 업그레이드가 완료된 타워(레벨 2 이상)에는 타워 그래픽 중앙에 **'U' 텍스트 마크**를 표시해 육안으로 쉽게 구분되도록 처리

---

## [2026-04-23] 게임 시스템 확장 (로비, 멀티패스, 일시정지)
- **Git Revision (Commit Hash):** `53bbd6bfbd0318b630e61483a9c00ea04a7fd565`
- **Commit Message:** `feat: 로비 추가, 멀티 패스 맵 적용, 일시정지 및 재시작 시스템 구현`

### 상세 변경 사항 요약

1. **로비 및 스테이지 선택 시스템 구현**
   - `@react-native-async-storage/async-storage` 패키지 설치
   - 웨이브 클리어 시 다음 웨이브를 해금(`maxUnlockedWave`) 상태로 기기에 영구 저장 (현재 테스트 목적으로 전체 해금 임시 적용 중)
   - 로비 화면 (`LobbyScreen`) 컴포넌트 신규 제작 및 리셋 버튼 추가
   - 게임 화면 (`WaveScreen`)을 하드코딩에서 `waveId` 프롭스를 받아 동적으로 `STAGE_CONFIG`, `WAVE_CONFIG` 로딩하도록 수정
   - `App.tsx`에 로비(`lobby`)와 게임(`wave`) 간 화면 전환(라우팅) 구조 업데이트

2. **멀티 패스 및 스테이지별 고유 맵 도입**
   - 단일 경로만 지원하던 `StageConfig`에 `paths` 배열과 `multiStartTiles` 옵션 추가
   - **Wave 1:** 기존의 S자형 기본 단일 경로
   - **Wave 2:** 보다 꼬불꼬불하고 길어진 ㄹ자 형태의 신규 맵 레이아웃 적용
   - **Wave 3 (듀얼 엔트리):** 왼쪽과 오른쪽 2개의 입구에서 적들이 3:7 비율로 스폰되어 중앙에서 합류하는 다중 경로 적용
   - 타워 사거리 탐색(어그로) 및 스플래시 데미지 처리도 적이 속한 각기 다른 경로 배열을 참조하여 오차 없이 판정하도록 고도화

3. **일시정지 메뉴 및 웨이브 재시작 기능 추가**
   - 게임 화면 우측 상단에 `⚙️ 메뉴` 버튼 추가
   - 버튼 클릭 시 게임 엔진(루프)이 즉시 정지(`gameState: "paused"`)되는 일시정지 기능 구현
   - **팝업 옵션 연동:** 계속 하기, 이 웨이브 다시 시작(`App.tsx`의 `key` 속성을 활용해 상태 꼬임 없이 완벽한 리셋), 로비로 돌아가기 기능 구현

---

## [2026-04-22] 코어 루프 구현 완료
- **Git Revision (Commit Hash):** `642733d6389b6f1575b3504783ff928da5c90ef5`
- **Commit Message:** `feat: 코어 루프 구현 (타워 설치, 적 스폰/이동, 타워 공격, 승패 판정)`

### 상세 변경 사항 요약
1. **타워 시스템 (Tower System)**
   - 타워 종류 3종 데이터 분리 정의 (`towers.ts`)
   - 하단 건설 팝업 메뉴 컴포넌트 신규 제작 (`BuildMenu.tsx`)
   - 타일 터치 시 골드(Gold) 차감 및 맵에 임시 타워 그래픽 배치 로직 구현
2. **적군 시스템 (Enemy System)**
   - 설정된 웨이브 간격(`1.5초`)에 맞춘 실시간 자동 스폰 로직 추가
   - 지정된 경로(Path)를 따라 픽셀 단위로 부드럽게 미끄러지듯 이동하는 수학적 보간(`progress`) 로직 구현
3. **전투 엔진 (Combat Engine)**
   - 타워 사거리 내 타겟 자동 탐색 및 쿨타임/데미지 적용
   - 타워 종류에 따른 특수 공격(단일/광역 스플래시/감속 디버프) 적용
   - 적 체력 실시간 계산, 처치 시 골드(+10G) 즉시 획득 및 공격 이펙트 렌더링
4. **승패 판정 (Win/Loss)**
   - 적이 목표 지점에 도달(누수) 시 하트(Heart) 감소 로직 처리
   - 하트가 0이 될 경우 엔진을 정지하고 `GAME OVER` 팝업을 띄우는 상태 추가
   - 할당된 모든 적(36마리)이 스폰 및 처리되면 `WAVE CLEAR` 팝업을 띄우는 상태 추가
5. **설정/UI 보정 (Config/UI Fixes)**
   - 앱 구동 시 모바일 환경 강제 가로 모드 락(Lock) 처리
   - 안드로이드 환경의 HUD 겹침(Elevation) 및 하단 팝업 터치 먹통(`pointerEvents`) 버그 픽스

---

## [2026-04-15] 반응형 그리드 맵 및 기본 환경 세팅 (초기)
- **Commit Message:** `feat: 반응형 그리드 맵 및 기본 환경 세팅`

### 상세 변경 사항 요약
- React Native + NativeWind(v4) 초기 환경 및 설정 폴더 구조 셋업
- 스마트폰 화면 크기(Dimensions)에 맞춰 여백 없이 타일 크기가 자동으로 계산되고 중앙에 정렬되는 반응형 타일 맵(GridMap) 구현
- HUD 인터페이스 기초 레이아웃 생성
