import Percolation, { GridVertex } from "./Percolation.js";
import { wait } from "./helpers.js";
import { UserOptions } from "./types.js";

export default class PercolationGrid {
  cx: CanvasRenderingContext2D;
  scale: number;
  size: number;
  static animationDelay: number;
  static simulationIsStopped: boolean;
  percolation: Percolation;
  darkTheme: boolean;

  constructor(
    userOptions: UserOptions,
    percolation: Percolation,
    darkTheme = false
  ) {
    this.scale = userOptions.getScaleFactor();
    this.size = userOptions.getGridDimensions();
    PercolationGrid.animationDelay = userOptions.getAnimationSpeed();
    PercolationGrid.simulationIsStopped = true;
    this.percolation = percolation;
    this.darkTheme = darkTheme;
  }

  static setAnimationDelay(delay: number) {
    PercolationGrid.animationDelay = delay;
  }

  createPercolationGrid() {
    const canvas = document.createElement("canvas");
    const canvasSize = this.size * this.scale + 2 * this.scale;
    canvas.setAttribute("width", String(canvasSize));
    canvas.setAttribute("height", String(canvasSize));
    const rootNode = document.querySelector("div[id='root']");
    rootNode.appendChild(canvas);

    this.cx = canvas.getContext("2d");
    this.cx.strokeStyle = "black";
    this.cx.lineWidth = 1;
    this.cx.strokeRect(0, 0, canvasSize, canvasSize);

    if (this.darkTheme) {
      this.cx.fillStyle = "black";
      this.cx.fillRect(
        this.scale,
        this.scale,
        canvasSize - this.scale * 2,
        canvasSize - this.scale * 2
      );
    }
  }

  async beginPercolationSimulation(): Promise<void> {
    while (
      !this.percolation.percolates() &&
      !PercolationGrid.simulationIsStopped
    ) {
      await wait(PercolationGrid.animationDelay);
      const row = Math.floor(Math.random() * this.size) + 1;
      const col = Math.floor(Math.random() * this.size) + 1;
      if (this.percolation.open([col, row])) {
        this.fillSite([col, row], "blue");
      }
    }
    if (PercolationGrid.simulationIsStopped) {
      return Promise.reject("isStopped");
    }
    for (let y = 1; y <= this.size; y++) {
      for (let x = 1; x <= this.size; x++) {
        if (this.percolation.isFull([x, y])) {
          this.fillSite([x, y], "green");
        }
      }
    }
  }

  fillSite(start: GridVertex, colour: string) {
    this.cx.fillStyle = colour;
    const startX = start[0] * this.scale;
    const startY = start[1] * this.scale;
    const endX = this.scale;
    const endY = this.scale;
    this.cx.moveTo(startX, startY);
    this.cx.fillRect(startX, startY, endX, endY);
  }

  static startSimulation() {
    PercolationGrid.simulationIsStopped = false;
  }

  static stopSimulation() {
    PercolationGrid.simulationIsStopped = true;
  }

  static clearGrid(): void {
    const rootNode = document.querySelector("div[id='root']");
    while (rootNode.hasChildNodes()) {
      rootNode.removeChild(rootNode.firstElementChild);
    }
  }
}
