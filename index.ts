import { getNumericEntries } from "./helpers.js";
import Percolation from "./Percolation.js";
import PercolationGrid from "./PercolationGrid.js";
import PercolationStats from "./PercolationStats.js";

const userOptions = {
  scaleFactor: 10,
  gridDimensions: 100,
  numOfGrids: 1,
  getScaleFactor() {
    return this.scaleFactor;
  },
  getGridDimensions() {
    return this.gridDimensions;
  },
  getNumOfGrids() {
    return this.numOfGrids;
  },
  setScaleFactor(scaleFactor: number) {
    this.scaleFactor = scaleFactor;
  },
  setGridDimensions(n: number) {
    this.gridDimensions = n;
  },
  setNumOfGrids(numOfGrids: number) {
    this.numOfGrids = numOfGrids;
  },
};

enum DefaultSampleSizes {
  LARGE,
  MEDIUM,
  SMALL,
  RANDOM,
}

updateUserOptions(DefaultSampleSizes.SMALL);

function updateUserOptions(options: DefaultSampleSizes) {
  switch (options) {
    case DefaultSampleSizes.LARGE:
      userOptions.setScaleFactor(5);
      userOptions.setGridDimensions(10);
      userOptions.setNumOfGrids(333);
      break;
    case DefaultSampleSizes.MEDIUM:
      userOptions.setScaleFactor(10);
      userOptions.setGridDimensions(20);
      userOptions.setNumOfGrids(50);
      break;
    case DefaultSampleSizes.SMALL:
      userOptions.setScaleFactor(10);
      userOptions.setGridDimensions(10);
      userOptions.setNumOfGrids(1);
      break;
    case DefaultSampleSizes.RANDOM:
      userOptions.setScaleFactor(10);
      userOptions.setGridDimensions(10);
      userOptions.setNumOfGrids(1);
      break;
  }
}

// Possible coords
// (0, 0) to (size + 1, size + 1)
// Usable coords
// (1, 1) to (size, size)
// (0, 0) is our virtual top node
// (size + 1, size + 1) is our virtual bottom node

function updateDOM(e: string, val: any): void {
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

const monteCarloSimulation: PercolationStats = {
  trials: {
    total: userOptions.numOfGrids,
    completed: 0,
  },
  percolationThresholds: [],
  mean: null,
  stdDev: null,
  incrementTrials() {
    this.trials.completed++;
  },
  addPercolationThreshold(percolationGrid: PercolationGrid) {
    const percolationThreshold =
      percolationGrid.percolation.numberOfOpenSites() /
      Math.pow(percolationGrid.percolation.n, 2);
    this.percolationThresholds.push(percolationThreshold);
  },
  updateMean() {
    this.mean =
      this.percolationThresholds.reduce((a: number, b: number) => a + b, 0) /
      this.trials.completed;
  },
  updateStdDev() {
    const sumVariances = this.percolationThresholds.reduce(
      (acc: number, threshold: number) => {
        const diff = threshold - this.mean;
        return acc + Math.pow(diff, 2);
      },
      0
    );
    this.stdDev = sumVariances / this.trials.completed;
  },
  updateResults(percolationGrid: PercolationGrid) {
    this.incrementTrials();
    this.addPercolationThreshold(percolationGrid);
    this.updateMean();
    this.updateStdDev();
    updateDOM("trialsCompleted", this.trials.completed);
    updateDOM("mean", this.mean);
    updateDOM("stdDev", this.stdDev);
  },
};

let grids: PercolationGrid[] = [...new Array(userOptions.getNumOfGrids())];

grids = grids.map(
  (_) =>
    new PercolationGrid(
      userOptions.getScaleFactor(),
      userOptions.getGridDimensions(),
      new Percolation(userOptions.getGridDimensions()),
      true
    )
);
grids.forEach((grid) => grid.createPercolationGrid());

const simulations = [];
grids.forEach((grid) => {
  const simulation = grid.beginPercolationSimulation();
  simulation.then(() => {
    monteCarloSimulation.updateResults(grid);
  });
  simulations.push(simulation);
});

Promise.all(simulations).then(() => {
  console.log("Total trials", monteCarloSimulation.trials);
});
