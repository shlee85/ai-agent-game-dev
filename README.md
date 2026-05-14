# Sentinel Protocol

> SF 배경의 모바일 타워 디펜스 게임 — React Native (Expo) 기반

---

## 게임 소개

**Sentinel Protocol**은 SF 우주 전쟁을 배경으로 한 타워 디펜스 게임입니다.  
플레이어는 타워를 전략적으로 배치하고 업그레이드하며, 밀려오는 적의 파도(Wave)를 막아내야 합니다.

- **Wave 1 ~ 20** 의 점층적 난이도 설계
- **Easy / Normal / Hard** 3단계 난이도, 진행도 완전 분리
- **타워 4종 × 3레벨** 업그레이드 시스템
- **적 4종** — 각각 고유한 특성(슬로우 면역, AOE 저항, 고속 등)
- **상성 시스템** — 타워마다 특정 적에게 ×1.3~1.4 추가 데미지
- **메타 루프** — 웨이브 클리어 → 다이아 획득 → 상점 → 아이템 인게임 소비

---

## 타워

| 이름 | ID | 특성 | 상성 적 |
|---|---|---|---|
| Pulse Lancer | `sniper` | 단일 고데미지 저격 | Guard Shell |
| Nova Cannon | `aoe` | 광역 폭격 | Runner Drone |
| Cryo Field | `slow` | 광역 감속 | Siege Golem |
| Volt Striker | `chain` | 전격 연쇄 AOE | Phantom Crawler |

---

## 적

| 이름 | ID | 특성 |
|---|---|---|
| Guard Shell | `guard` | 기본 중장갑 적 |
| Runner Drone | `runner` | 고속 저체력, 누수 위험 |
| Phantom Crawler | `phantom` | 슬로우 면역 |
| Siege Golem | `golem` | 슬로우 면역 + AOE 저항 60% |

---

## 기술 스택

| 항목 | 내용 |
|---|---|
| 프레임워크 | React Native + Expo SDK 54 |
| 언어 | TypeScript |
| 스타일 | NativeWind (TailwindCSS) |
| 상태 관리 | React useState / useRef / useEffect |
| 영속 저장 | AsyncStorage (진행도, 설정, 언어) |
| 사운드 | expo-av (BGM 2종 + SFX 8종) |
| 빌드 | Gradle (로컬 APK), EAS Build (Play Store AAB) |

---

## 화면 구성

```
LobbyScreen      — 난이도 선택, 웨이브 진행도, 다이아/상점 접근, 언어 토글
  └─ WaveScreen  — 메인 게임 플레이 (타워 설치·업그레이드·아이템 사용)
  └─ ShopScreen  — 다이아로 아이템 구매
  └─ GuideScreen — 타워·아이템·적 설명서 (EN/KR)
```

---

## 아이템

| 이름 | 효과 |
|---|---|
| Bomb | 단일 지점 폭탄 |
| Freeze | 전체 적 일시 동결 |
| Global Bomb | 전체 적 광역 폭격 |
| Heart Boost | 기지 체력 회복 |

---

## 빌드 방법

### 개발 확인 (Expo Go)
```bash
cd app
npx expo start
```
Expo Go 앱에서 QR 스캔 후 확인.

### APK 빌드 (배포용)
```bash
cd app
./gradlew assembleRelease
# 결과물: android/app/build/outputs/apk/release/app-release.apk
```

---

## 프로젝트 구조

```
PathDefenseGame/
├── app/
│   ├── src/
│   │   ├── screens/       # LobbyScreen, WaveScreen, ShopScreen, GuideScreen
│   │   ├── ui/            # GridMap, HUD, BuildMenu, TowerMenu, ItemShop
│   │   ├── data/          # towers, enemies, waves, stages, items, shop, guideData
│   │   ├── contexts/      # LanguageContext
│   │   ├── i18n/          # EN/KR 번역
│   │   └── utils/         # soundManager
│   └── assets/
│       ├── units/         # 타워·적 스프라이트
│       ├── backgrounds/   # Wave 배경 이미지
│       └── sounds/        # BGM·SFX wav 파일
└── .ai/
    ├── TalkV1.0.md        # 개발 대화 로그
    └── Changelog.md       # 버전별 변경 이력
```

---

## 버전

현재 버전: **v1.0** (개발 진행 중)  
플랫폼: Android (iOS 대응 예정)
