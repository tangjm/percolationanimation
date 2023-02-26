export class UserOptions {
  scaleFactor: number;
  gridDimensions: number;
  numOfGrids: number;
  speed: number;
  simulationMode: boolean = true;

  constructor(
    scaleFactor: number,
    gridDimensions: number,
    numOfGrids: number,
    speed: number
  ) {
    this.scaleFactor = scaleFactor;
    this.gridDimensions = gridDimensions;
    this.numOfGrids = numOfGrids;
    this.speed = speed;
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
  isSyncMode() {
    return this.simulationMode;
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
    this.simulationMode = newMode;
  }
}
