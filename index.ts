import { getNumericEntries } from "./helpers.js";
import Percolation from "./Percolation.js";
import PercolationGrid from "./PercolationGrid.js";
import PercolationStats from "./PercolationStats.js";

const scale = 5;
const size = 10;
const numOfGrids = 333;

// Possible coords
// (0, 0) to (size + 1, size + 1)
// Usable coords
// (1, 1) to (size, size)
// (0, 0) is our virtual top node
// (size + 1, size + 1) is our virtual bottom node

function updateDOM(e: string, val: any): void {
  const elements = {
    trials: document.querySelector("p[id='trials']"),
    mean: document.querySelector("p[id='mean']"),
    stdDev: document.querySelector("p[id='stdDev']"),
  };
  const table = {
    trials: updateLastElementChild,
    mean: updateLastElementChild,
    stdDev: updateLastElementChild,
  };
  return table[e](elements[e], String(val));
}

function updateLastElementChild(e: Element, text: string) {
  let lastChild = e.lastElementChild;
  if (!lastChild) return;
  console.log(lastChild);
  lastChild.textContent = text;
}

const monteCarloSimulation: PercolationStats = {
  trials: 0,
  percolationThresholds: [],
  mean: null,
  stdDev: null,
  incrementTrials() {
    this.trials++;
    updateDOM("trials", this.trials);
  },
  updateMean() {
    this.mean =
      this.percolationThresholds.reduce((a: number, b: number) => a + b) /
      this.trials;
    updateDOM("mean", this.mean);
  },
  updateStdDev() {
    const sumVariances = this.percolationThresholds.reduce(
      (acc: number, threshold: number) => {
        const diff = threshold - this.mean;
        return acc + Math.pow(diff, 2);
      }
    );
    this.stdDev = sumVariances / this.trials;
    updateDOM("stdDev", this.stdDev);
  },
  updateResults(percolationGrid: PercolationGrid) {
    this.incrementTrials();
    const percolationThreshold =
      percolationGrid.percolation.numberOfOpenSites() /
      Math.pow(percolationGrid.percolation.n, 2);
    this.percolationThresholds.push(percolationThreshold);
    this.updateMean();
    this.updateStdDev();
    getNumericEntries(this).forEach((entry) => {
      // console.log(entry[0], entry[1]);
    });
  },
};

let grids: PercolationGrid[] = [...new Array(numOfGrids)];

grids = grids.map(
  (_) => new PercolationGrid(scale, size, new Percolation(size))
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
