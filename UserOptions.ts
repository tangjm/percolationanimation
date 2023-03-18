export class UserOptions {
  scaleFactor: number;
  gridDimensions: number;
  numOfGrids: number;
  speed: number;
  isSyncMode: boolean;

  constructor(
    scaleFactor: number,
    gridDimensions: number,
    numOfGrids: number,
    speed: number,
    isSyncMode: boolean = true
  ) {
    this.scaleFactor = scaleFactor;
    this.gridDimensions = gridDimensions;
    this.numOfGrids = numOfGrids;
    this.speed = speed;
    this.isSyncMode = isSyncMode;
  }

  getScaleFactor() {
    return this.scaleFactor;
  }
  getGridDimensions() {
    return this.gridDimensions;
  }
  getNumOfGrids() {
    return this.numOfGrids;
  }
  getAnimationSpeed() {
    return this.speed;
  }
  getSyncMode() {
    return this.isSyncMode;
  }
  setScaleFactor(scaleFactor: number) {
    this.scaleFactor = scaleFactor;
  }
  setGridDimensions(n: number) {
    this.gridDimensions = n;
  }
  setNumOfGrids(numOfGrids: number) {
    this.numOfGrids = numOfGrids;
  }
  setAnimationSpeed(speed: number) {
    this.speed = speed;
  }
  setSyncMode(newMode: boolean) {
    this.isSyncMode = newMode;
  }
}
