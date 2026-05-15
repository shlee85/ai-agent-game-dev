export interface StageConfig {
  rows: number;
  cols: number;
  pathTiles: Array<[number, number]>;
  startTiles: Array<[number, number]>;
  goalTile: [number, number];
  paths?: Array<Array<[number, number]>>;
  multiStartTiles?: Array<[number, number]>;
  blockedTiles?: Array<[number, number]>;
}

// ── 그리드 규격: 7행 × 12열 (rows 0-6, cols 0-11) ──────────────────────────
// Kingdom Rush 기준 타일 크기 확보 (~58px in landscape)

// Wave 1: L자형 (튜토리얼 — 단순한 경로)
const wave1Path: Array<[number, number]> = [
  [0,2],[1,2],[2,2],[3,2],
  [3,3],[3,4],[3,5],[3,6],[3,7],[3,8],
  [4,8],[5,8],[6,8],
];

// Wave 2: Z자형
const wave2Path: Array<[number, number]> = [
  [0,9],[1,9],[2,9],
  [2,8],[2,7],[2,6],[2,5],[2,4],[2,3],
  [3,3],[4,3],
  [4,2],[4,1],[4,0],
  [5,0],[6,0],
];

// Wave 3: 듀얼 패스 — 좌우 동시 진입, 중앙 수렴
const wave3PathA: Array<[number, number]> = [
  [0,1],[1,1],[2,1],[3,1],
  [3,2],[3,3],[3,4],[3,5],
  [4,5],[5,5],[5,6],[6,6],
];
const wave3PathB: Array<[number, number]> = [
  [0,10],[1,10],[2,10],[3,10],
  [3,9],[3,8],[3,7],[3,6],
  [4,6],[5,6],[6,6],
];

// Wave 4: 우하향 ㄱ자
const wave4Path: Array<[number, number]> = [
  [0,0],[1,0],[2,0],
  [2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],
  [3,8],[4,8],
  [4,9],[4,10],[4,11],
  [5,11],[6,11],
];

// Wave 5: 우측 진입, 역 Z
const wave5Path: Array<[number, number]> = [
  [0,11],[1,11],[2,11],
  [2,10],[2,9],[2,8],[2,7],[2,6],[2,5],
  [3,5],[4,5],
  [4,4],[4,3],[4,2],[4,1],
  [5,1],[6,1],
];

// Wave 6: ⊂ 모양 — 왼쪽으로 꺾다가 아래로 길게
const wave6Path: Array<[number, number]> = [
  [0,5],[1,5],
  [1,4],[1,3],[1,2],[1,1],
  [2,1],[3,1],[4,1],[5,1],
  [5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9],[5,10],
  [6,10],
];

// Wave 7: 뱀 모양 3단 굴곡
const wave7Path: Array<[number, number]> = [
  [0,2],[1,2],
  [1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],
  [2,9],[3,9],
  [3,8],[3,7],[3,6],[3,5],[3,4],[3,3],
  [4,3],[5,3],
  [5,4],[5,5],[5,6],[5,7],[5,8],[5,9],
  [6,9],
];

// Wave 8: 우측 진입, 긴 역 L
const wave8Path: Array<[number, number]> = [
  [0,10],[1,10],[2,10],
  [2,9],[2,8],[2,7],[2,6],[2,5],[2,4],[2,3],[2,2],
  [3,2],[4,2],
  [4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9],[4,10],[4,11],
  [5,11],[6,11],
];

// Wave 9: 중앙 진입, 좌측 우회 후 우하향
const wave9Path: Array<[number, number]> = [
  [0,6],[1,6],
  [1,5],[1,4],[1,3],[1,2],[1,1],
  [2,1],[3,1],
  [3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],
  [4,9],[5,9],
  [5,10],[5,11],[6,11],
];

// Wave 10: 우측 편향 W자 형태
const wave10Path: Array<[number, number]> = [
  [0,3],[1,3],
  [1,4],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10],
  [2,10],[3,10],
  [3,9],[3,8],[3,7],[3,6],[3,5],[3,4],[3,3],[3,2],[3,1],
  [4,1],[5,1],
  [5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],
  [6,8],
];

// Wave 11: 좌측 진입, ㄹ자 내부 루프
const wave11Path: Array<[number, number]> = [
  [0,0],[1,0],[2,0],[3,0],
  [3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],
  [4,9],[5,9],
  [5,8],[5,7],[5,6],[5,5],[5,4],[5,3],
  [6,3],
];

// Wave 12: 좌측 진입, 역 코일
const wave12Path: Array<[number, number]> = [
  [0,1],[1,1],[2,1],
  [2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9],[2,10],
  [3,10],[4,10],
  [4,9],[4,8],[4,7],[4,6],[4,5],[4,4],[4,3],[4,2],[4,1],
  [5,1],[6,1],
];

// Wave 13: 우측 끝 진입, 전면 횡단
const wave13Path: Array<[number, number]> = [
  [0,11],[1,11],[2,11],[3,11],
  [3,10],[3,9],[3,8],[3,7],[3,6],[3,5],[3,4],[3,3],
  [4,3],[5,3],
  [5,2],[5,1],[5,0],
  [6,0],
];

// Wave 14: 중앙 진입, 우측 꺾고 복귀
const wave14Path: Array<[number, number]> = [
  [0,5],[1,5],
  [1,6],[1,7],[1,8],[1,9],
  [2,9],[3,9],
  [3,8],[3,7],[3,6],[3,5],[3,4],[3,3],
  [4,3],[5,3],
  [5,4],[5,5],[5,6],[5,7],[5,8],[5,9],[5,10],
  [6,10],
];

// Wave 15: 고난이도 — 전면 사행 (가장 긴 경로)
const wave15Path: Array<[number, number]> = [
  [0,8],[1,8],
  [1,7],[1,6],[1,5],[1,4],[1,3],[1,2],[1,1],[1,0],
  [2,0],[3,0],
  [3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],[3,10],[3,11],
  [4,11],[5,11],
  [5,10],[5,9],[5,8],[5,7],[5,6],[5,5],[5,4],[5,3],[5,2],[5,1],
  [6,1],
];

// Wave 16: 역 U자 (중반 이후)
const wave16Path: Array<[number, number]> = [
  [0,3],[1,3],[2,3],
  [2,4],[2,5],[2,6],[2,7],[2,8],
  [3,8],[4,8],
  [4,7],[4,6],[4,5],[4,4],[4,3],[4,2],
  [5,2],[6,2],
];

// Wave 17: 우측 진입, 역 W
const wave17Path: Array<[number, number]> = [
  [0,10],[1,10],
  [1,9],[1,8],[1,7],[1,6],[1,5],[1,4],
  [2,4],[3,4],
  [3,5],[3,6],[3,7],[3,8],[3,9],[3,10],
  [4,10],[5,10],
  [5,9],[5,8],[5,7],[5,6],[5,5],
  [6,5],
];

// Wave 18: 듀얼 패스 — 양쪽 끝에서 중앙 수렴 (속공)
const wave18PathA: Array<[number, number]> = [
  [0,0],[1,0],[2,0],[3,0],[4,0],
  [4,1],[4,2],[4,3],[4,4],[4,5],
  [5,5],[5,6],[6,6],
];
const wave18PathB: Array<[number, number]> = [
  [0,11],[1,11],[2,11],[3,11],[4,11],
  [4,10],[4,9],[4,8],[4,7],[4,6],
  [5,6],[6,6],
];

// Wave 19: 복잡 사행 (파이널 직전)
const wave19Path: Array<[number, number]> = [
  [0,5],[1,5],
  [1,4],[1,3],[1,2],[1,1],
  [2,1],[3,1],
  [3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],[3,10],
  [4,10],[5,10],
  [5,9],[5,8],[5,7],[5,6],[5,5],[5,4],[5,3],
  [6,3],
];

// Wave 20: 파이널 듀얼 패스 — 양쪽에서 돌아 중앙 수렴
const wave20PathA: Array<[number, number]> = [
  [0,4],[1,4],[2,4],[3,4],
  [3,3],[3,2],[3,1],[3,0],
  [4,0],[5,0],
  [5,1],[5,2],[5,3],[5,4],[5,5],[5,6],
  [6,6],
];
const wave20PathB: Array<[number, number]> = [
  [0,7],[1,7],[2,7],[3,7],
  [3,8],[3,9],[3,10],[3,11],
  [4,11],[5,11],
  [5,10],[5,9],[5,8],[5,7],[5,6],
  [6,6],
];

export const STAGE_CONFIG: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20, StageConfig> = {
  1: {
    rows: 7,
    cols: 12,
    pathTiles: wave1Path,
    startTiles: [[0, 2]],
    goalTile: [6, 8],
    blockedTiles: [[1,5],[2,9],[4,5],[5,2],[1,10],[4,11]],
  },
  2: {
    rows: 7,
    cols: 12,
    pathTiles: wave2Path,
    startTiles: [[0, 9]],
    goalTile: [6, 0],
    blockedTiles: [[1,6],[3,7],[5,4],[2,1],[6,5],[4,6]],
  },
  3: {
    rows: 7,
    cols: 12,
    pathTiles: wave3PathA,
    startTiles: [[0, 1], [0, 10]],
    goalTile: [6, 6],
    paths: [wave3PathA, wave3PathB],
    multiStartTiles: [[0, 1], [0, 10]],
  },
  4: {
    rows: 7,
    cols: 12,
    pathTiles: wave4Path,
    startTiles: [[0, 0]],
    goalTile: [6, 11],
  },
  5: {
    rows: 7,
    cols: 12,
    pathTiles: wave5Path,
    startTiles: [[0, 11]],
    goalTile: [6, 1],
  },
  6: {
    rows: 7,
    cols: 12,
    pathTiles: wave6Path,
    startTiles: [[0, 5]],
    goalTile: [6, 10],
  },
  7: {
    rows: 7,
    cols: 12,
    pathTiles: wave7Path,
    startTiles: [[0, 2]],
    goalTile: [6, 9],
  },
  8: {
    rows: 7,
    cols: 12,
    pathTiles: wave8Path,
    startTiles: [[0, 10]],
    goalTile: [6, 11],
  },
  9: {
    rows: 7,
    cols: 12,
    pathTiles: wave9Path,
    startTiles: [[0, 6]],
    goalTile: [6, 11],
  },
  10: {
    rows: 7,
    cols: 12,
    pathTiles: wave10Path,
    startTiles: [[0, 3]],
    goalTile: [6, 8],
  },
  11: {
    rows: 7,
    cols: 12,
    pathTiles: wave11Path,
    startTiles: [[0, 0]],
    goalTile: [6, 3],
  },
  12: {
    rows: 7,
    cols: 12,
    pathTiles: wave12Path,
    startTiles: [[0, 1]],
    goalTile: [6, 1],
  },
  13: {
    rows: 7,
    cols: 12,
    pathTiles: wave13Path,
    startTiles: [[0, 11]],
    goalTile: [6, 0],
  },
  14: {
    rows: 7,
    cols: 12,
    pathTiles: wave14Path,
    startTiles: [[0, 5]],
    goalTile: [6, 10],
  },
  15: {
    rows: 7,
    cols: 12,
    pathTiles: wave15Path,
    startTiles: [[0, 8]],
    goalTile: [6, 1],
  },
  16: {
    rows: 7,
    cols: 12,
    pathTiles: wave16Path,
    startTiles: [[0, 3]],
    goalTile: [6, 2],
  },
  17: {
    rows: 7,
    cols: 12,
    pathTiles: wave17Path,
    startTiles: [[0, 10]],
    goalTile: [6, 5],
  },
  18: {
    rows: 7,
    cols: 12,
    pathTiles: wave18PathA,
    startTiles: [[0, 0], [0, 11]],
    goalTile: [6, 6],
    paths: [wave18PathA, wave18PathB],
    multiStartTiles: [[0, 0], [0, 11]],
  },
  19: {
    rows: 7,
    cols: 12,
    pathTiles: wave19Path,
    startTiles: [[0, 5]],
    goalTile: [6, 3],
  },
  20: {
    rows: 7,
    cols: 12,
    pathTiles: wave20PathA,
    startTiles: [[0, 4], [0, 7]],
    goalTile: [6, 6],
    paths: [wave20PathA, wave20PathB],
    multiStartTiles: [[0, 4], [0, 7]],
  },
};
