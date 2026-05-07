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