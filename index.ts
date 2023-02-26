import { randomInt } from "./helpers.js";
import Percolation from "./Percolation.js";
import PercolationGrid from "./PercolationGrid.js";
import { MonteCarloSimulation, updateDOM } from "./PercolationStats.js";
import {
  startButton,
  asynchronous,
  synchronous,
  presets,
  animationSpeed,
} from "./domSelectors.js";
import { UserOptions } from "./UserOptions.js";

enum Presets {
  LARGE,
  MEDIUM,
  SMALL,
  RANDOM,
}
interface Options {
  scaleFactor: number;
  gridDimensions: number;
  numOfGrids: number;
  speed: number;
}

var userOptions = updateUserOptions(Presets.RANDOM);

function setUserOptions(options: Options) {
  userOptions = updateUserOptions(options);
  PercolationGrid.clearGrid();
  updateGrids();
}

function updateUserOptions(options: Presets | Options) {
  switch (options) {
    case Presets.LARGE:
      return new UserOptions(5, 10, 333, 0.02);
    case Presets.MEDIUM:
      return new UserOptions(10, 20, 50, 0.02);
    case Presets.SMALL:
      return new UserOptions(10, 10, 1, 0.02);
    case Presets.RANDOM:
      const max = 30;
      const min = 5;
      const scaleFactorRand = randomInt(min, max / 2);
      const gridCount =
        scaleFactorRand >= 10
          ? randomInt(min, max / 4)
          : randomInt(min, max * 4);
      return new UserOptions(
        scaleFactorRand,
        randomInt(min, max),
        gridCount,
        0.02
      );
    default:
      const { scaleFactor, gridDimensions, numOfGrids, speed } = options;
      return new UserOptions(scaleFactor, gridDimensions, numOfGrids, speed);
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

var grids = generateGrids();

// Presets
presets.addEventListener("change", () => {
  setUserOptions(Presets[presets.value]);
});

// Simulation speed
animationSpeed.addEventListener("change", (e) => {
  userOptions.setAnimationSpeed(+animationSpeed.value);
  PercolationGrid.setAnimationDelay(userOptions.getAnimationSpeed());
});

// Simulation mode
synchronous.addEventListener("change", () => {
  updateSimulationMode(synchronous.getAttribute("value"));
});
asynchronous.addEventListener("change", () => {
  updateSimulationMode(asynchronous.getAttribute("value"));
});

function updateSimulationMode(newMode: string) {
  userOptions.setSyncMode(newMode === "sync");
}

// Grids
function generateGrids() {
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
  return grids;
}

function updateGrids() {
  grids = generateGrids();
}

// Start simulation button
startButton.addEventListener("click", () => {
  if (userOptions.isSyncMode()) {
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
