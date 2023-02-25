export interface UserOptions {
  scaleFactor: number;
  gridDimensions: number;
  numOfGrids: number;
  speed: number;
  getScaleFactor: () => number;
  getGridDimensions: () => number;
  getNumOfGrids: () => number;
  getAnimationSpeed: () => number;
  setScaleFactor: (n: number) => void;
  setGridDimensions: (n: number) => void;
  setNumOfGrids: (n: number) => void;
}
