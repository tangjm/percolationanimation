import { randomInt } from "./helpers.js";
import Percolation from "./Percolation.js";
import PercolationGrid from "./PercolationGrid.js";
import { MonteCarloSimulation, updateDOM } from "./PercolationStats.js";
import { UserOptions } from "./types.js";
import { startButton, synchronous, asynchronous } from "./domSelectors.js";

const userOptions: UserOptions = {
  scaleFactor: 10,
  gridDimensions: 100,
  numOfGrids: 1,
  speed: 0.02,
  getScaleFactor() {
    return this.scaleFactor;
  },
  getGridDimensions() {
    return this.gridDimensions;
  },
  getNumOfGrids() {
    return this.numOfGrids;
  },
  getAnimationSpeed() {
    return this.speed;
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

updateUserOptions(DefaultSampleSizes.RANDOM);

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
      const max = 30;
      const min = 5;
      const scaleFactor = randomInt(min, max / 2);
      const gridCount =
        scaleFactor >= 10 ? randomInt(min, max / 4) : randomInt(min, max * 4);
      userOptions.setScaleFactor(scaleFactor);
      userOptions.setGridDimensions(randomInt(min, max));
      userOptions.setNumOfGrids(gridCount);
      break;
  }
}

// Possible coords
// (0, 0) to (size + 1, size + 1)
// Usable coords
// (1, 1) to (size, size)
// (0, 0) is our virtual top node
// (size + 1, size + 1) is our virtual bottom node

const monteCarloSimulation: MonteCarloSimulation = new MonteCarloSimulation(
  userOptions,
  updateDOM
);

let grids: PercolationGrid[] = [...new Array(userOptions.getNumOfGrids())];

grids = grids.map(
  (_) =>
    new PercolationGrid(
      userOptions,
      new Percolation(userOptions.getGridDimensions()),
      true
    )
);
grids.forEach((grid) => grid.createPercolationGrid());

let simulationMode = "sync";

synchronous.addEventListener("change", () => {
  updateSimulationMode(synchronous.getAttribute("value"));
});
asynchronous.addEventListener("change", () => {
  updateSimulationMode(asynchronous.getAttribute("value"));
});

function updateSimulationMode(newMode: string) {
  simulationMode = newMode;
}

startButton.addEventListener("click", () => {
  if (simulationMode === "sync") {
    return initiateSimulationsSync();
  }
  return initiateSimulationsAsync();
});

/**
 * Run simulations one after each other.
 */
async function initiateSimulationsSync() {
  for (const grid of grids) {
    await grid.beginPercolationSimulation();
    monteCarloSimulation.updateResults(grid);
  }
}

/**
 * Run simulations in parallel.
 */
function initiateSimulationsAsync() {
  grids.forEach((grid) => {
    const simulation = grid.beginPercolationSimulation();
    simulation.then(() => monteCarloSimulation.updateResults(grid));
  });
}
