# Sentinel Protocol - 대화 로그 (v1.0)

이 파일부터는 **v1.0** 정식 버전 범위의 대화/결정/작업 로그를 기록한다.

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

---
