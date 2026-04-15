export interface StageConfig {
  rows: number;
  cols: number;
  pathTiles: Array<[number, number]>;
  startTiles: Array<[number, number]>;
  goalTile: [number, number];
}

const wave1Path: Array<[number, number]> = [
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 3],
  [4, 3],
  [4, 4],
  [4, 5],
  [4, 6],
  [4, 7],
  [5, 7],
  [6, 7],
  [7, 7],
  [8, 7],
  [8, 8],
  [8, 9],
  [8, 10],
  [8, 11],
  [8, 12],
  [8, 13],
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
    pathTiles: wave1Path,
    startTiles: [[0, 2]],
    goalTile: [8, 12],
  },
  3: {
    rows: 9,
    cols: 16,
    pathTiles: wave1Path,
    startTiles: [
      [0, 2],
      [0, 11],
    ],
    goalTile: [8, 7],
  },
};
