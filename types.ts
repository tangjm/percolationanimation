export interface UserOptions {
  scaleFactor: number;
  gridDimensions: number;
  numOfGrids: number;
  getScaleFactor: () => number;
  getGridDimensions: () => number;
  getNumOfGrids: () => number;
  setScaleFactor: (n: number) => void;
  setGridDimensions: (n: number) => void;
  setNumOfGrids: (n: number) => void;
}
