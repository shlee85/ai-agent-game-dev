# Character Sheet — Sentinel Protocol v1.0

> 실제 코드(`towers.ts` / `enemies.ts`) 기준으로 동기화된 캐릭터 시트.
> 헷갈릴 때 이 문서를 참고할 것.

---

## 타워 (4종)

| 항목 | 펄스 랜서 | 노바 캐논 | 크라이오 필드 | 볼트 스트라이커 |
|---|---|---|---|---|
| **한글 이름** | 펄스 랜서 | 노바 캐논 | 크라이오 필드 | 볼트 스트라이커 |
| **영문 이름** | Pulse Lancer | Nova Cannon | Cryo Field | Volt Striker |
| **시스템 ID** | `sniper` | `aoe` | `slow` | `chain` |
| **역할** | 단일 저격형 | 광역 폭격형 | 감속 제어형 | 광역 전격형 |
| **설치 비용** | 120G | 160G | 140G | 150G |
| **업그레이드 비용** | Lv1→2: 180G / Lv2→3: 270G | Lv1→2: 240G / Lv2→3: 360G | Lv1→2: 210G / Lv2→3: 315G | Lv1→2: 225G / Lv2→3: 338G |
| **기본 ATK** | 45 | 15 | 5 | 8 |
| **ATK (Lv2)** | 67 | 22 | 7 | 12 |
| **ATK (Lv3)** | 90 | 30 | 10 | 16 |
| **사거리(RNG)** | 3.5타일 | 2.5타일 | 2.5타일 | 3.0타일 |
| **쿨다운(CD)** | 1.2s | 1.5s | 1.0s | 0.7s |
| **공격 방식** | SINGLE | AOE (반경 1.5) | SLOW (50%감속 2초) | AOE (반경 1.0) |
| **상성 적** | Guard Shell ×1.3 | Runner Drone ×1.3 | Siege Golem ×1.4 | Phantom Crawler ×1.3 |
| **이미지 Lv1** | `image_lance.png` | `tower_aoe.png` | `tower_slow.png` | `tower_chain.png` |
| **이미지 Lv2** | `image_lance2.png` | (Lv1과 동일) | (Lv1과 동일) | (Lv1과 동일) |
| **이미지 Lv3** | `image_lance3.png` | (Lv1과 동일) | (Lv1과 동일) | (Lv1과 동일) |
| **에셋 파일** | `tower_sniper.png` | `tower_aoe.png` | `tower_slow.png` | `tower_chain.png` |
| **색상** | 시안 (#67e8f9) | 주황 (#F97316) | 하늘 (#06B6D4) | 보라 (#A855F7) |

### 타워 특징 요약

**펄스 랜서 (Pulse Lancer)**
- 단일 적을 높은 데미지로 순간 제거
- Guard Shell 전담, 고레벨 업그레이드 효율 최고
- 이미지가 적을 향해 자동 회전 (레벨별 이미지 별도 존재)

**노바 캐논 (Nova Cannon)**
- 범위 내 모든 적에게 피해 (AOE 반경 1.5타일)
- Runner Drone 밀집 처리에 탁월
- 단일 화력은 낮으나 다수 동시 처리

**크라이오 필드 (Cryo Field)**
- 공격과 동시에 적 이동속도 50% 감소 (2초)
- Siege Golem 상성 ×1.4 (유일하게 골렘에 효과적)
- 직접 처치보다 다른 타워와 연계 시 진가 발휘

**볼트 스트라이커 (Volt Striker)**
- 빠른 쿨다운(0.7s)으로 연속 공격
- AOE 1.0타일로 밀집 소형적 처리
- Phantom Crawler 상성 ×1.3

---

## 적 유닛 (4종)

| 항목 | 가드 쉘 | 러너 드론 | 팬텀 크롤러 | 시즈 골렘 |
|---|---|---|---|---|
| **한글 이름** | 가드 쉘 | 러너 드론 | 팬텀 크롤러 | 시즈 골렘 |
| **영문 이름** | Guard Shell | Runner Drone | Phantom Crawler | Siege Golem |
| **시스템 ID** | `guard` | `runner` | `phantom` | `golem` |
| **역할** | 준탱커형 | 고속 침투형 | 슬로우 면역 돌격형 | 초고체력 보스형 |
| **기본 HP** | 120 | 45 | 75 | 350 |
| **이동속도** | 1.0 타일/s | 2.2 타일/s | 1.7 타일/s | 0.45 타일/s |
| **처치 보상** | 10G | 12G | 14G | 28G |
| **색상** | 빨강 (#EF4444) | 로즈 (#F43F5E) | 보라 (#8B5CF6) | 회갈 (#78716C) |
| **크기** | 0.6 (타일 대비) | 0.45 | 0.50 | 0.82 |
| **슬로우 면역** | ✗ | ✗ | ✓ | ✓ |
| **AOE 저항** | 없음 | 없음 | 없음 | 60% (40%만 받음) |
| **약점 타워** | Pulse Lancer | Nova Cannon | Volt Striker | Cryo Field |
| **에셋 파일** | `enemy_guard.png` | `enemy_runner.png` | `enemy_phantom.png` | `enemy_golem.png` |
| **등장 웨이브** | Wave 1~20 | Wave 1~20 | Wave 5~20 | Wave 10~20 |

### 적 특징 요약

**가드 쉘 (Guard Shell)**
- 체력이 높아 단일 타워로는 처리가 느림
- 물량으로 밀어붙이는 초반 주력
- Pulse Lancer로 우선 제거 권장

**러너 드론 (Runner Drone)**
- 매우 빠른 이동속도(2.2) → 누수(Leak) 위험 최고
- 체력이 낮아 AOE 한 방에 다수 처리 가능
- Nova Cannon 설치 전까지 가장 위협적인 적

**팬텀 크롤러 (Phantom Crawler)**
- 슬로우 면역 — Cryo Field 효과 무효
- 준수한 체력 + 빠른 속도로 혼란 유발
- Volt Striker 필수 (×1.3 상성)

**시즈 골렘 (Siege Golem)**
- 초고체력(350) + 슬로우 면역 + AOE 60% 저항
- 느리지만 일반 딜러로는 처치가 매우 어려움
- Cryo Field 집중 배치 필수 (유일 상성 ×1.4)
- Wave 10부터 등장, Wave 15 이후 비중 증가

---

## 상성 요약표

| 타워 \ 적 | Guard Shell | Runner Drone | Phantom Crawler | Siege Golem |
|---|---|---|---|---|
| **Pulse Lancer** | ★ ×1.3 | - | - | - |
| **Nova Cannon** | - | ★ ×1.3 | - | - |
| **Cryo Field** | - | - | (슬로우 무효) | ★ ×1.4 |
| **Volt Striker** | - | - | ★ ×1.3 | (AOE 저항 60%) |

---

## 파일 위치

```
app/assets/
├── units/
│   ├── towers/
│   │   ├── tower_sniper.png   ← Pulse Lancer (= image_lance.png 복사본)
│   │   ├── tower_aoe.png      ← Nova Cannon
│   │   ├── tower_slow.png     ← Cryo Field
│   │   └── tower_chain.png    ← Volt Striker
│   └── enemies/
│       ├── enemy_guard.png
│       ├── enemy_runner.png
│       ├── enemy_phantom.png
│       └── enemy_golem.png
├── image_lance.png   ← Pulse Lancer Lv1 (GPT 생성)
├── image_lance2.png  ← Pulse Lancer Lv2 (GPT 생성)
└── image_lance3.png  ← Pulse Lancer Lv3 (GPT 생성)
```
