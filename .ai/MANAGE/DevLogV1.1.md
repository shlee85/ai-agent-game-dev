# DevLog V1.1

> Sentinel Protocol — v1.1 개발 로그  
> 시작일: 2026-05-15  
> 작업 방식: 질문 → 바로 아래 [CLAUDE 답변] 순서로 기록

---

## V1.0 → V1.1 목표

- 음악/사운드 개선
- 기타 폴리싱 및 버그 수정

---

## 질문: 이제 조금씩 기능 수정 및 추가를 해보자고.
배경 음악과, 소리를 추가 할거야.
먼저 배경음악을 추가 해보자.
너가 만드는것보단 그걸 다른 AI에게 부탁하는게 더 좋을듯해서.
너도 알겠지만 SF가 배경이니깐.
배경음악 생성할 AI한테 어떻게 말하는게 좋을까?
[CLAUDE 답변]

Suno AI (suno.com) 또는 Udio (udio.com) 추천. 둘 다 프롬프트 기반 음악 생성.

현재 게임 배경 3구간에 맞춰 프롬프트 작성:

---

**① 로비 BGM** (게임 시작 화면)
```
ambient sci-fi space music, mysterious atmosphere, futuristic synthesizer, slow tempo, 
cinematic, deep space exploration, subtle electronic pulse, no vocals, loop-friendly, 90 BPM
```

**② 웨이브 1~7 BGM** (우주선 내부)
```
sci-fi action music, tense mechanical rhythm, electronic percussion, cyberpunk influence,
futuristic military, driving synth bass, space combat theme, no vocals, 130-140 BPM
```

**③ 웨이브 8~14 BGM** (군사 기지)
```
sci-fi military battle music, intense hybrid orchestral electronic, brass stabs, 
electronic drums, battle station theme, rising tension, no vocals, 150 BPM
```

**④ 웨이브 15~20 BGM** (행성 — 최종 구간)
```
epic sci-fi climax music, orchestral electronic hybrid, alien planet battle, 
dramatic final wave, full orchestra with synthesizer, intense, no vocals, 160 BPM
```

---

**팁:**
- "no vocals" 꼭 포함 (게임 BGM은 가사 없어야 함)
- "loop-friendly" 추가하면 반복 재생에 자연스러운 곡 생성됨
- Suno는 스타일 태그, Udio는 프롬프트 방식 — 둘 다 위 프롬프트 그대로 사용 가능
- 생성 후 wav 또는 mp3로 다운로드 → `app/assets/sounds/` 에 넣으면 됨

## 질문 일단 3개 mp3를 asset에 넣었어. 지금 4번쨰 트렉이 멍청해져서.
일단 3개만 처리해주고.
폴더를 asset/music으로 생성해서 그 밑으로 이동 시켜줘.
4번쨰 트랙은 완성되는대로 처리할꼐.
[CLAUDE 답변]

`app/assets/music/` 폴더 생성 후 3개 파일 이동 완료.

**파일 배정 (임시 — 확인 필요):**
| 파일 | BGM 키 | 구간 |
|---|---|---|
| `The_Sovereign_Gate.mp3` | `bgm_lobby` | 로비 화면 |
| `Iron_Perimeter.mp3` | `bgm_wave1` | 웨이브 1~7 |
| `Siege_of_the_Iron_Moon.mp3` | `bgm_wave2` | 웨이브 8~14 |

**변경 파일:**
- `soundManager.ts`: SoundKey 타입 `bgm_wave` → `bgm_wave1` / `bgm_wave2` / `bgm_lobby`, require 경로를 `music/*.mp3`로 변경
- `WaveScreen.tsx`: `waveId <= 7` → `bgm_wave1`, `waveId >= 8` → `bgm_wave2` 분기 적용

4번째 트랙 완성 시: `bgm_wave3` 키 추가 + `waveId >= 15` 분기 추가하면 됨.
파일명 → 구간 배정이 틀렸으면 알려줘.