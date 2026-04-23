export interface StageConfig {
  rows: number;
  cols: number;
  pathTiles: Array<[number, number]>;
  startTiles: Array<[number, number]>;
  goalTile: [number, number];
  // 다중 경로를 지원하기 위해 pathTiles를 여러 개 가질 수 있는 옵션 추가
  paths?: Array<Array<[number, number]>>;
  // 각 경로별 시작 타일
  multiStartTiles?: Array<[number, number]>;
}

// Wave 1: 기본 경로
const wave1Path: Array<[number, number]> = [
  [0, 3], [1, 3], [2, 3], [3, 3], [4, 3],
  [4, 4], [4, 5], [4, 6], [4, 7],
  [5, 7], [6, 7], [7, 7], [8, 7],
  [8, 8], [8, 9], [8, 10], [8, 11], [8, 12], [8, 13],
];

// Wave 2: 꼬불꼬불한 경로 (ㄹ자 모양 등)
const wave2Path: Array<[number, number]> = [
  [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], // 아래로
  [4, 2], [4, 3], [4, 4], [4, 5],         // 오른쪽으로
  [3, 5], [2, 5], [1, 5],                 // 위로
  [1, 6], [1, 7], [1, 8], [1, 9],         // 오른쪽으로
  [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], // 아래로
  [6, 10], [6, 11], [6, 12],              // 오른쪽으로
  [7, 12], [8, 12],                       // 아래로 (목표점)
];

// Wave 3: 2개의 입구에서 중앙으로 합류하는 경로
// 경로 A (왼쪽 입구)
const wave3PathA: Array<[number, number]> = [
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
  [4, 3], [4, 4], [4, 5], [4, 6],
  [5, 6], [6, 6], [7, 6], [8, 6], [8, 7], // (8, 7)이 최종 목표
];

// 경로 B (오른쪽 입구)
const wave3PathB: Array<[number, number]> = [
  [0, 13], [1, 13], [2, 13], [3, 13], [4, 13],
  [4, 12], [4, 11], [4, 10], [4, 9], [4, 8],
  [5, 8], [6, 8], [7, 8], [8, 8], [8, 7], // (8, 7)에서 A경로와 합류
];

export const STAGE_CONFIG: Record<1 | 2 | 3, StageConfig> = {
  1: {
    rows: 9,
    cols: 16,
    pathTiles: wave1Path,
    startTiles: [[0, 3]],
    goalTile: [8, 13],
  },
  2: {
    rows: 9,
    cols: 16,
    pathTiles: wave2Path,
    startTiles: [[0, 1]],
    goalTile: [8, 12],
  },
  3: {
    rows: 9,
    cols: 16,
    pathTiles: wave3PathA, // 기본값 (멀티패스 로직에서 실제로는 paths를 사용함)
    startTiles: [[0, 2], [0, 13]],
    goalTile: [8, 7],
    // 웨이브 3 전용 멀티 패스 설정
    paths: [wave3PathA, wave3PathB],
    multiStartTiles: [[0, 2], [0, 13]],
  },
};
