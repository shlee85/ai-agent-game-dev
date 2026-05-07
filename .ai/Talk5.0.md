# Sentinel Protocol - 대화 로그 (Beta 5.0)

이 파일부터는 **Beta 5.0** 범위의 대화/결정/작업 로그를 이어서 기록한다.

---

## Beta 4.0 마감 상태 요약

Beta 4.0은 **2026-05-06** 기준 GitHub(`56b84d6`) 업로드 완료.

### 완료된 것
- 로비 전용 상점 (ShopScreen) — 보석으로 아이템 구매
- 인게임 아이템 재고 소비 구조 전환 (다이아 소모 제거)
- Wave 1~15 확장 — 각 웨이브 고유 맵 + 난이도별 스폰/보상 데이터
- Wave 7 Time Objective (타이머 종료 클리어)
- 난이도별 해금 진행 완전 분리 (easy/normal/hard)
- 로비 UI: Wave 카드 가로 스크롤 + 색상 구분 + 숫자 표기 버그 수정
- 관리자 모드 ON/OFF (다이아1000/전웨이브오픈/골드1000/RESET/ITEM+5)
- 결과 리포트 UI (처치/누수/골드/보석/아이템)
- Wave reset 확인창 (Alert)
- 캐릭터 이름 확정: 펄스 랜서 / 노바 캐논 / 크라이오 필드 / 러너 드론 / 가드 쉘

---

## Beta 5.0 방향 (논의 예정)

아래 항목은 후보안이며, 사용자 확정 후 진행한다.

### 후보 A — 게임플레이 고도화
1. Wave 8~15 밸런스 조정 (플레이 테스트 결과 반영)
2. Wave 12 또는 그 인근에 2번째 Time Objective 삽입
3. 타워/적 상성 시스템 (특정 타워가 특정 적에 유리)

### 후보 B — 컨텐츠 확장
1. 타워 3종 외 신규 타워 추가
2. 적 3번째 타입 추가
3. 웨이브 16~20 설계

### 후보 C — UX/UI 개선
1. 결과 화면 고도화 (그래프/통계)
2. 로비 난이도 선택 UI 개선
3. 인게임 타워 정보 툴팁 추가

---

## Beta 5.0 작업 로그

(이후 내용은 대화 진행에 따라 이어서 기록)

#################
## 질문: 좋아. 이번 beta5.0을 마무리 하면 최종적으로 버전 v1.0을 생성할꺼야.
최우선 1. beta 5.0으로 변경
최우선 2. 로딩 화면 제작해줘. SF적인 요소가 들어가면 좋겠찌? 아마 로딩화면은 내가 실행 할 떄 막 뭘 다운받던데 그 시점에 넣는거겠지? 너가 화인해봐.

최우선이 완료 되면 후보-A 게임플레이 고도화 진행해.
이게 완료 되면 후보 B와 후보 C를 해야할지 너가 나한테 다시 질문하는게 좋겠어.

---

**[CLAUDE 답변]**

### 최우선 1 완료 — beta5.0 버전 배지 변경
- `app/src/screens/LobbyScreen.tsx` 우측 상단 버전 배지 `beta4.0` → `beta5.0`

### 최우선 2 완료 — SF 로딩 화면

**로딩 타이밍 분석:**
앱 실행 시 "뭘 다운받는" 시점은 Expo 번들러가 JS를 로드하는 구간으로, 그 직전엔 native splash screen이 표시됩니다. JS가 로드된 직후 React가 마운트되는 시점에 AsyncStorage에서 저장된 데이터(보석/인벤토리)를 불러오는데, **이 타이밍**에 인앱 로딩 화면을 삽입했습니다.

**구현 내용:**
- `app/src/screens/LoadingScreen.tsx` 신규 생성
  - 배경: `bg.png` (어두운 우주)
  - 스캔 라인 오버레이 애니메이션
  - 게임 로고 + `SENTINEL PROTOCOL` 제목 (사이안 네온 글로우)
  - SF 메시지 순환 (INITIALIZING CORE SYSTEMS... 등)
  - 진행 바 애니메이션 (2.2초)
- `app/App.tsx`
  - `isLoading` 상태 추가
  - AsyncStorage 로드와 최소 2.5초 타이머를 `Promise.all`로 병렬 처리
  - 로딩 완료 전까지 `LoadingScreen` 표시
- `app/app.json`
  - native splash 배경색 `#ffffff` → `#020617` (어두운 우주색)으로 변경 (로딩화면과 색상 통일)

---

**다음 단계: 후보-A 게임플레이 고도화 진행 예정**

## 질문: 좋아, 확인했어. 그럼 게임플레이 고도화 진행을 해줘.

---

**[CLAUDE 답변 — 후보-A 게임플레이 고도화 완료]**

### 1. Wave 8~15 밸런스 검토
- `app/src/data/waves.ts` 기준으로 Wave 8~15 스폰간격/총수/클리어골드/보석 전수 검토 완료
- 총 골드 곡선(처치+클리어)이 Wave 7 → 8 → 9 → 10... 단계적으로 상승하며 이상 없음
- `.ai/WavePlan.md` 섹션 8에 Easy/Normal/Hard 3난이도 전체 상세표(Wave 8~15) 추가

### 2. Wave 12 Time Objective 전환
- `app/src/data/waves.ts` Wave 12 완전 변환
  - 기존: 일반 전멸 처리, 560초, Normal 320마리
  - 변경: Time Objective, **200초 생존 클리어**, kill 골드 0, clearGold 마리수 기반
  - 보상 공식 (Wave 7 TO와 동일): avg 7.6 gold/마리, diamond = floor(total/10)
  - Easy: 200마리→1520g/20♦ | Normal: 217마리→1649g/21♦ | Hard: 238마리→1809g/23♦
- `.ai/WavePlan.md` 섹션 9에 Wave 12 TO 상세 스펙 추가

### 3. 타워/적 상성 시스템
- `app/src/data/towers.ts`
  - `TowerStats` 인터페이스에 `affinityEnemyType?: EnemyType`, `affinityMultiplier?: number` 추가
  - 각 타워에 상성 적용: sniper→guard(x1.3), aoe→runner(x1.3), slow→guard(x1.3)
- `app/src/screens/WaveScreen.tsx`
  - 단일 타격/AOE 스플래시 모두 `affinityMult` 적용 — 상성 적 타입 일치 시 배율 곱산
- `app/src/ui/BuildMenu.tsx`, `app/src/ui/TowerMenu.tsx`
  - 상성 인디케이터 표시: `▲GUARD x1.3` / `▲RUNNER x1.3` (노란색)

**TypeScript 체크 (`npx tsc --noEmit`) 이상 없음 확인**

---

### 후보-A 완료 — 후보-B / 후보-C 진행 여부 확인

후보-A가 모두 반영됐습니다. 다음 두 후보 중 어느 것을 진행할지 선택해 주세요.

**후보 B — 컨텐츠 확장**
1. 신규 타워 1종 추가 (역할/외형/스탯 신규 설계)
2. 적 3번째 타입 추가 (예: "폭격형" 또는 "보스형")
3. Wave 16~20 설계 및 구현

**후보 C — UX/UI 개선**
1. 결과 화면 고도화 (그래프/처치통계 등)
2. 로비 난이도 선택 UI 개선
3. 인게임 타워 정보 툴팁

둘 다 진행할 수도 있고, B 또는 C 중 하나만 해도 됩니다. 말씀해 주세요!*

## 질문: 후보 B는 Beta제일 마지막에 하도록 순서 변경해줘.
그리고 후보C를 할껀데, 여기서 추가할께 하나 있어. 영어/한국어를 추가 해줬으면 좋겠어
캐릭터 이름부터 모든게 영어/한국어를 추가해서 나누어주면 좋을 것 같아.

---

**[CLAUDE 답변 — 후보 C 진행 전 확인 질문]**

후보 B는 Beta 마지막으로 순서 이동합니다.
후보 C 진행 전, 언어 기능 관련 아래 3가지를 확인해 주세요.

**Q1. 언어 전환 방식**
- (A) 로비 상단에 `EN / KR` 토글 버튼 → 사용자가 직접 전환
- (B) 디바이스 언어 자동 감지 → 한국어 기기는 KR, 그 외 EN

**Q2. 기본 언어**
- 한국어 기본 (KR → EN 전환)
- 영어 기본 (EN → KR 전환)

**Q3. 번역 범위**
현재 HUD/버튼 대부분이 영어라 EN 모드는 현재 상태 유지, KR 모드에서 한국어로 바꾸는 방향이 자연스럽습니다.
아래 항목 전부 포함인지 확인해 주세요.
- 타워 이름: `Pulse Lancer` / `Nova Cannon` / `Cryo Field`
- 적 이름: `Guard Shell` / `Runner Drone`
- HUD: `Wave`, `Lives`, `Gold`, `Diamond` 등
- 버튼: `Upgrade`, `Sell`, `Build`, `X`, `Start`, `Back` 등
- 로비, 상점, 결과 화면 내 모든 텍스트

## 질문: 맞아. 잘 정리했어. 이제 그럼 구현 시작하도록해.
(Q1~Q3 전부 확인. EN 기본값, 로비 토글 버튼, 전체 범위 모두 동의)

---

**[CLAUDE 답변 — 언어 시스템 구현 완료]**

### 구현 내용

**신규 파일:**
- `app/src/i18n/index.ts` — EN/KR 번역 딕셔너리 (`I18nStrings` 인터페이스 + `STRINGS` 레코드)
- `app/src/contexts/LanguageContext.tsx` — `LanguageProvider` + `useLanguage()` 훅, AsyncStorage `appLang` 키로 언어 설정 영속 저장

**수정 파일:**
- `app/App.tsx` — 전체를 `<LanguageProvider>`로 감쌈
- `app/src/screens/LobbyScreen.tsx` — 우측 상단 EN/KR 토글 버튼 추가 (beta5.0 배지 왼쪽), 난이도 라벨/태그라인/WAVE/SHOP/RESET 번역 적용
- `app/src/screens/ShopScreen.tsx` — BACK, DIAMOND, SHOP, 아이템 라벨, 보유 수량 번역
- `app/src/screens/WaveScreen.tsx` — 결과화면(GAME OVER/WAVE CLEAR/통계), 일시정지화면, Alert, 메뉴 버튼 번역. Wave 7 하드코딩(`waveId === 7`) → `wave.isTimeObjective` 버그 수정
- `app/src/ui/HUD.tsx` — Wave/Time 라벨 번역
- `app/src/ui/BuildMenu.tsx` — 타워 이름, 역할 라벨, 상성 표시 번역
- `app/src/ui/TowerMenu.tsx` — 타워 이름, 역할 라벨, Sell/Upgrade/Max, 상성 번역
- `app/src/ui/ItemShop.tsx` — SKILLS 번역

**번역 범위 (EN 기본값, KR 토글):**
| 항목 | EN | KR |
|---|---|---|
| 타워 이름 | Pulse Lancer / Nova Cannon / Cryo Field | 펄스 랜서 / 노바 캐논 / 크라이오 필드 |
| 적 이름 | Guard Shell / Runner Drone | 가드 쉘 / 러너 드론 |
| 역할 라벨 | Precision / Blast / Control | 정밀 / 폭격 / 제압 |
| 상성 | GUARD/RUNNER Affinity | 가드/러너 상성 |
| 액션 | Upgrade / Sell / Max / Back | 업그레이드 / 판매 / 최대 / 뒤로 |
| 결과화면 | WAVE CLEAR! / GAME OVER | 웨이브 클리어! / 게임 오버 |
| 일시정지 | PAUSED / Continue / Restart Wave | 일시 정지 / 계속 하기 / 이 웨이브 다시 시작 |
| 상점 | SHOP / Stock | 상점 / 보유 수량 |
| 기타 | 전체 버튼/HUD/Alert 텍스트 | 전체 번역 |

**TypeScript 체크 이상 없음 확인**

## 질문: 중간에 ERROR  Text strings must be rendered within a <Text> component 이 에러가 발생되었어. 확인 한번해주고.
그 다음 단계 할게 뭐있지?

---

**[CLAUDE 답변 — 에러 원인 및 수정]**

### 에러 원인
`app/App.tsx`에서 `<LanguageProvider>`와 `<View>`가 동일한 들여쓰기(4칸)로 작성되어 있어서, React Native가 두 태그 사이의 개행 공백을 텍스트 노드로 인식한 것.

**수정 전 (잘못된 구조):**
```jsx
<LanguageProvider>
<View ...>   ← 들여쓰기가 같은 레벨
```

**수정 후 (올바른 구조):**
```jsx
<LanguageProvider>
  <View ...>  ← <View>를 LanguageProvider의 자식으로 명확히 들여쓰기
```

`app/App.tsx` 들여쓰기 정상화 완료. TypeScript 체크 이상 없음.

---

### 다음 단계 (후보 C 잔여 항목)

언어 시스템 완료 후 남은 후보 C 항목:

1. **C-1. 결과 화면 고도화** — 현재 텍스트 나열 형태 → 아이콘+수치 강조, 보상 시각화
2. **C-2. 로비 난이도 선택 UI 개선** — 현재 텍스트 버튼 → 진행률 표시, 잠금/해금 상태 강화
3. **C-3. 인게임 타워 정보 툴팁** — 셀 선택 시 타워 상세 스탯 팝업

진행 원하시면 말씀해 주세요.

## 질문 : 좋아 전부 진행해.
추가로 각 wave들 모양? 이걸 md문서로좀 만들어줘. 내가 일일히 wave들어가서 확인하기가 힘들어서 그래.

---

**[CLAUDE 답변]**

- **후보 C-1/C-2/C-3** 전부 진행
- **`.ai/StageMap.md` 신규 생성** — Wave 1~15 맵 레이아웃을 ASCII 그리드(9행×16열)로 시각화. S=시작, G=도착, #=경로, .=빈칸. 경로 길이·형태 설명 포함. Wave 3은 멀티패스(두 시작점) 표시.

### 후보 C-1 완료 — 결과 화면 고도화
`app/src/screens/WaveScreen.tsx`
- 누수 수에 따른 등급 표시: S(0), A(1-3), B(4-7), C(8+) — 색상 강조
- 결과 통계 각 행에 아이콘 추가: ⚔ 처치 / 💧 누수 / 💰 골드 / 💎 보석 / 🎯 아이템
- Wave Clear 시 별도 "클리어 보상" 섹션 분리 표시

### 후보 C-2 완료 — 로비 난이도 선택 UI 개선
`app/src/screens/LobbyScreen.tsx`
- 난이도 버튼 하단에 3개 난이도 전체 진행률 동시 표시 (`X/15 Wave`)
- 3개 난이도 진행도를 AsyncStorage에서 동시에 로드 (`Promise.all`)

### 후보 C-3 완료 — 타워 정보 툴팁 강화
`app/src/ui/TowerMenu.tsx`
- 쿨다운(CD) 정보 추가: `ATK: X | RNG: X | CD: Xs`
- 공격 타입 배지 추가: `SINGLE / AOE / SLOW`

**TypeScript 체크 이상 없음 확인**

## 질문 : 좋아, 그러면 메뉴를 하나 더 추가해서 각 아이템과 방어무기, 적들에 대한 설명이 되어 있는 책자같은 마크로해서 설명서를 만들어줘.
가격, 공격성, 뭐 이런거 장,단점을 다 같이 적어서
그래야 나중에 유저가 이해하기 쉬울꺼야.
그리고 추가로 지금 ExpoGo로 할때 같은 망에서만 되는거 같아. 내가 집에서 하려고 하면 안되더라고?
서버는 실행되어 있는데, 이걸 외부에서도 접속되게 할 수 있니?
현재 개발 노트북은 계속 켜놓고 있어

---

**[CLAUDE 답변]**

### 1. GUIDE 설명서 화면 구현 완료

신규 파일:
- `app/src/data/guideData.ts` — 타워/아이템/적별 EN+KR 장점/단점/요약 데이터
- `app/src/screens/GuideScreen.tsx` — 탭 기반 설명서 화면 (타워 | 아이템 | 적)

수정 파일:
- `app/src/i18n/index.ts` — guide 관련 UI 문자열 13개 추가
- `app/App.tsx` — `"guide"` 화면 상태 추가, GuideScreen 렌더링 연결
- `app/src/screens/LobbyScreen.tsx` — 로비 하단 좌측에 📖 GUIDE 버튼 추가 (SHOP 버튼 우측)

화면 구성:
- **타워 탭**: 건설 비용, ATK, RNG, CD, 공격 타입 배지, 상성, 장점/단점 카드
- **아이템 탭**: 상점 가격(💎), 데미지, 반경, 지속 시간, 장점/단점 카드
- **적 탭**: 기본 체력, 이동 속도, 처치 보상, 장점/단점 카드
- EN/KR 언어 전환 반영됨 (lang 상태 연동)
- TypeScript 오류 없음 확인

---

### 2. ExpoGo 외부망(집) 접속 방법

**원인**: `npx expo start` 기본 모드는 LAN(로컬 네트워크)만 지원. 개발 PC와 폰이 같은 WiFi에 있어야 작동.

**해결: Tunnel 모드 사용**

```bash
npx expo start --tunnel
```

이 명령어는 ngrok을 통해 공개 URL을 생성해 외부망에서도 접속 가능.

**첫 실행 시 패키지 설치 필요:**
```bash
npx expo install @expo/ngrok@^4.0.2
```

**사용법:**
1. 개발 노트북에서 `npx expo start --tunnel` 실행
2. 터미널에 `exp://xxxx.ngrok.io/...` 형태의 QR 코드 출력
3. 집 폰으로 Expo Go 앱에서 QR 코드 스캔 → 접속

**주의:**
- 터널 속도가 LAN보다 느릴 수 있음 (게임 플레이는 괜찮음)
- 노트북이 켜져 있고 터미널이 실행 중이어야 유지됨
- 무료 ngrok 계정 없이도 동작하나, 가끔 세션이 만료될 수 있음

## 질문: 잘했어, 가이드 부분에 수정이 필요해. 아이템이나 적들이런것들에 대한 설명도좋지만 기본적인 아이콘들이 다 동일하고 색만다른데 실제 게임에서 쓰는 아이콘들을 쓰면 좋게써.

---

**[CLAUDE 답변]**

`app/src/screens/GuideScreen.tsx` 아이콘 표현 교체

| 탭 | 수정 전 | 수정 후 |
|---|---|---|
| 타워 | `crosshairs` 아이콘 (색만 다름) | 색상 원 + 역할 태그 (`SN` / `AOE` / `CC`) — TowerMenu와 동일 |
| 아이템 | `flash` 아이콘 (색만 다름) | 실제 PNG 이미지 (`ITEM_ASSETS`) — ItemShop과 동일 |
| 적 | `skull` 아이콘 (색만 다름) | 색상 원 + 위협 태그 (`RUSH` / `HOLD`) — GridMap 렌더링과 동일 |

TypeScript 체크 이상 없음. 커밋 `42909b4` 완료.

## 질문 : 적하고 타워는 왜그래? 실제 게임시 나오는 캐릭터 모양으로 해줘

---

**[CLAUDE 답변]**

`app/src/screens/GuideScreen.tsx` 헤더 이미지 교체

| 탭 | 수정 전 | 수정 후 |
|---|---|---|
| 타워 | 색상 원 + 역할 태그(SN/AOE/CC) | `TOWER_ASSETS` 실제 PNG + 역할 태그 배지 — GridMap과 동일 |
| 적 | 색상 원 + 위협 태그(RUSH/HOLD) | `ENEMY_ASSETS` 실제 PNG + 위협 태그 — GridMap과 동일 |
| 아이템 | 변경 없음 | `ITEM_ASSETS` PNG 유지 |

TypeScript 체크 이상 없음. 커밋 `8e58b78` 완료.

## 질문: 좋아. 뭐 추가로 할거 있어? 없으면 이제 beta가 아닌 정식버전으로 변경 해볼까 하는데 어떻게 생각해?

---

**[CLAUDE 답변]**

### 현재까지 완료 상태 요약

| 항목 | 상태 |
|---|---|
| beta5.0 배지 + SF 로딩 화면 | ✅ 완료 |
| 후보-A: Wave 밸런스·Wave12 TO·상성 시스템 | ✅ 완료 |
| 후보-C: i18n EN/KR·결과화면·로비UI·타워메뉴 | ✅ 완료 |
| GuideScreen (타워/아이템/적 설명서) | ✅ 완료 |
| **후보-B: 신규 타워·적 타입·Wave 16~20** | ⏳ 미진행 |

---

### 정식버전 전환 의견

정식버전 전환 **찬성**입니다. 이유:

- 현재 Wave 1~15 + 2개 Time Objective + 3종 타워 + 2종 적 + 난이도 3단계 + 상성 + 가이드 → **완결된 게임 루프**
- 후보-B(컨텐츠 확장)는 v1.0 이후 **v1.1 패치**로 넣는 게 더 자연스러움

### 정식버전 전환 시 할 작업

1. `app.json` `version` 필드: `"1.0.0"` 으로 업데이트
2. `app/src/screens/LobbyScreen.tsx` 버전 배지: `beta5.0` → `v1.0`
3. (선택) 로비 태그라인 등 beta 잔재 문구 정리

**후보-B 포함 여부를 먼저 결정해 주세요:**
- **지금 바로 v1.0 전환** → 후보-B는 v1.1에서 진행
- **후보-B 먼저 완료 후 v1.0** → 신규 타워/적/Wave 16~20 구현 뒤 전환

## 질문 : 후보B를 먼저 작업 하고 완료되면 v1.0으로 변경 하자.

---

**[CLAUDE 답변 — 후보-B 진행 전 설계 확인]**

후보-B를 시작하기 전에 아래 4가지를 먼저 확인해 주세요.

---

**Q1. 신규 타워 — 아래 제안 괜찮으신가요?**

> **볼트 스트라이커 (Volt Striker)** — 고속 광역 전류 포
> - 비용: 180g / 업그레이드: 270g
> - ATK: 12 | RNG: 3.2 | CD: 0.7s | 공격타입: AOE (반경 1.0)
> - 상성: 러너 ×1.3
> - 역할: 빠른 연사로 광역 제압. Nova Cannon(느린 강타)과 다른 "속사형 광역" 포지션

다른 아이디어(체인 번개, 배리어, 지원형 등)가 있으면 말씀해 주세요.

---

**Q2. 신규 적 — 아래 제안 괜찮으신가요?**

> **팬텀 크롤러 (Phantom Crawler)** — 중간 체력/속도, 슬로우 면역
> - 기본 체력: 75 (러너 45 / 가드 120 사이)
> - 이동 속도: 1.7 (러너 2.2 / 가드 1.0 사이)
> - 처치 보상: 14g
> - 특성: 슬로우 면역 (크라이오 필드의 감속이 적용되지 않음)
> - 상성: 없음 (모든 타워 동일 배율)

다른 아이디어(재생형, 분열형, 보스형 등)가 있으면 말씀해 주세요.

---

**Q3. Wave 16~20 방향 — 아래 구성 어떠신가요?**

| Wave | 유형 | 주요 특징 |
|---|---|---|
| 16 | 일반 | 가드+러너 혼합, 첫 팬텀 등장 |
| 17 | 일반 | 팬텀+가드 중심, 슬로우 무효 압박 |
| 18 | 일반 | 러너+팬텀 고속 러쉬 |
| 19 | ★ Time Objective (220초) | 3번째 TO, 3종 혼합 |
| 20 | 일반 (최종) | 3종 전부 + 빠른 스폰, 최고 난이도 |

---

**Q4. 새 PNG 에셋 처리**

신규 타워(`tower_volt.png`)와 신규 적(`enemy_phantom.png`) 이미지 파일이 필요합니다.

- **(A) 임시 플레이스홀더 사용** → 기존 이미지를 색만 다르게 코드로 처리, 실제 아트는 나중에 교체
- **(B) 직접 PNG 제공** → 준비된 이미지 파일을 `app/assets/units/`에 넣어주시면 반영

어떻게 진행할까요?

##질문 :전부 좋아, 새 png에서는 너가 한번 그거에 맞게 만들어봐봐. 그리고 볼트스트라이커는 빠른공격이 장점이지만 공격력은 좀 떨어지게 하는게 좋아보여. 너 생각말해줘

[CLAUDE 답변]
볼트 스트라이커 밸런스 최종안:
- ATK 8 / CD 0.7s / AOE 반경 1.0타일 / 팬텀 상성 ×1.3
- DPS(단일) ≈ 11.4, 노바 캐논(DPS 10)보다 약간 높지만 반경이 1.0으로 짧아 집중이 필요
- "빠른 연사로 군집 처리"가 장점, "타격력 낮고 반경 좁음"이 단점 → 뚜렷한 개성

PNG 생성 및 후보-B 전체 구현 완료 내역:
1. Python Pillow로 sprite 생성
   - `tower_chain.png`: 보라색 전기수정 타워, 번개볼트 심볼, 전극 4개
   - `enemy_phantom.png`: 유령 실루엣, 반투명 보라, 빛나는 눈, 꼬리 촉수
2. 신규 타워 Volt Striker (ID: `chain`) 추가
   - `towers.ts`, `towerAssets.ts`, `visualTheme.ts`(VOLT 태그), `i18n`(EN/KR), `guideData.ts`
3. 신규 적 Phantom Crawler (ID: `phantom`) 추가
   - `enemies.ts` — `immuneToSlow: true` 필드 추가
   - `enemyAssets.ts`, `visualTheme.ts`(GHOST 태그), `i18n`(EN/KR), `guideData.ts`
4. 슬로우 면역 로직 적용
   - `GridMap.tsx` EnemyData에 `immuneToSlow?: boolean` 추가
   - `WaveScreen.tsx` — 타워 slow 공격 시 `!t.immuneToSlow` 조건, 아이템 freeze 시도 동일 체크
5. 웨이브 16~20 추가
   - `waves.ts`: WaveId 타입 확장(16~20), 각 웨이브 설정(16=팬텀 데뷔, 17=팬텀+가드, 18=러너+팬텀 듀얼패스, 19=타임오브젝티브 220s, 20=파이널 듀얼패스)
   - `stages.ts`: 경로 설계 및 STAGE_CONFIG 확장
6. 로비·앱 업데이트
   - `LobbyScreen.tsx`: TOTAL_WAVES=20, 웨이브 카드 20개, 진행도 X/20, wave 16~20 색상, 배지 v1.0
   - `App.tsx`: onNextWave 상한 20으로 변경
7. TypeScript 타입 검사 통과 (오류 없음)

## 질문: 생성된 맵 정보는 StageMap.md에 업데이트 해줘

[CLAUDE 답변]
`.ai/StageMap.md` Wave 16~20 섹션 추가 완료.

- Wave 16: 역C형, 타일 24개 — 팬텀 데뷔
- Wave 17: ロ형 사각 루프, 타일 25개 — 팬텀+가드
- Wave 18: H형 듀얼패스, A=16/B=17 — 러너+팬텀 (멀티패스)
- Wave 19: 역S형, 타일 25개 — Time Objective 220초
- Wave 20: 파이널 듀얼패스, A=21/B=22 — 전 유닛 (멀티패스)

각 맵에 ASCII 그리드(9×16) + 요약 테이블 추가. 문서 제목도 `Wave 1~15` → `Wave 1~20`으로 변경.

## 질문: 좋아 여기서 이제 beta5.0종료 하고 새롭게 v1.0.md 파일을 생성해주고 v1.0부터는 새로 생성된 md문서에서 진행할께.
문서 넘어가면서 정리할거 있으면 정리해서 해당 문서로 옮기든지

[CLAUDE 답변]
Talk5.0.md 마감. TalkV1.0.md 신규 생성 후 현재 상태 요약 이전.

---

## ✅ Beta 5.0 마감 (2026-05-07)

**git 커밋 기준: `17d502c`**

### 완료된 모든 항목
- SF 로딩화면 (LoadingScreen.tsx)
- 후보-A: Wave 8~15 밸런스, Wave 12 Time Objective, 타워/적 상성 시스템
- 후보-C: 결과화면 고도화(등급), 로비 난이도 진행도, TowerMenu 스탯 강화
- 언어 시스템 (EN/KR 토글, LanguageContext, i18n 전 화면 적용)
- 설명서 화면 (GuideScreen — 타워/아이템/적 탭, 실제 스프라이트, 장단점)
- 후보-B: Volt Striker + Phantom Crawler + Wave 16~20 + v1.0 배지
- StageMap.md Wave 16~20 ASCII 맵 추가

**이후 대화는 `TalkV1.0.md`에서 진행.**