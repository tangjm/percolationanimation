import PercolationGrid from "./PercolationGrid.js";
import { UserOptions } from "./types.js";

export default interface PercolationStats {
  trials: {
    total: number;
    completed: number;
  };
  percolationThresholds: number[];
  mean: number | null;
  stdDev: number | null;
  incrementTrialsCompleted: () => void;
  addPercolationThreshold: (g: PercolationGrid) => void;
  updateMean: () => void;
  updateStdDev: () => void;
  updateResults: (g: PercolationGrid) => void;
}

export class MonteCarloSimulation implements PercolationStats {
  trials: {
    total: number;
    completed: number;
  };
  percolationThresholds: number[];
  mean: number | null;
  stdDev: number | null;

  constructor(
    config: UserOptions,
  ) {
    this.trials = {
      total: config.getNumOfGrids(),
      completed: 0,
    };
    this.percolationThresholds = [];
    this.mean = null;
    this.stdDev = null;
    updateDOM("trialsTotal", this.trials.total);
  }
  incrementTrialsCompleted() {
    this.trials.completed++;
  }
  addPercolationThreshold(percolationGrid: PercolationGrid) {
    const percolationThreshold =
      percolationGrid.percolation.numberOfOpenSites() /
      Math.pow(percolationGrid.percolation.n, 2);
    this.percolationThresholds.push(percolationThreshold);
  }
  updateMean() {
    this.mean =
      this.percolationThresholds.reduce((a: number, b: number) => a + b, 0) /
      this.trials.completed;
  }
  updateStdDev() {
    const sumVariances = this.percolationThresholds.reduce(
      (acc: number, threshold: number) => {
        const diff = threshold - this.mean;
        return acc + Math.pow(diff, 2);
      },
      0
    );
    this.stdDev = sumVariances / this.trials.completed;
  }
  updateResults(percolationGrid: PercolationGrid) {
    this.incrementTrialsCompleted();
    this.addPercolationThreshold(percolationGrid);
    this.updateMean();
    this.updateStdDev();
    updateDOM("trialsCompleted", this.trials.completed);
    updateDOM("mean", this.mean);
    updateDOM("stdDev", this.stdDev);
  }
}

export function updateDOM(e: string, val: any): void {
  function updateTextContent(e: Element, text: string) {
    e.textContent = text;
  }
  function updateLastElementChild(e: Element, text: string) {
    let lastChild = e.lastElementChild;
    if (!lastChild) return;
    lastChild.textContent = text;
  }
  const elements = {
    trialsTotal: document.querySelector("b[id='trials-total']"),
    trialsCompleted: document.querySelector("b[id='trials-completed']"),
    mean: document.querySelector("p[id='mean']"),
    stdDev: document.querySelector("p[id='stdDev']"),
  };
  const table = {
    trialsTotal: updateTextContent,
    trialsCompleted: updateTextContent,
    trials: updateLastElementChild,
    mean: updateLastElementChild,
    stdDev: updateLastElementChild,
  };
  return table[e](elements[e], String(val));
}