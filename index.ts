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
  stopButton,
} from "./domSelectors.js";
import { UserOptions } from "./UserOptions.js";

enum Presets {
  LARGE,
  MEDIUM,
  SMALL,
  RANDOM,
  DEFAULT,
}
interface Options {
  scaleFactor: number;
  gridDimensions: number;
  numOfGrids: number;
  speed: number;
}

var userOptions = updateUserOptions(Presets.DEFAULT);

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
    case Presets.DEFAULT:
      return new UserOptions(10, 40, 1, 0.02);
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

var monteCarloSimulation: MonteCarloSimulation = new MonteCarloSimulation(
  userOptions
);

function updateMonteCarloSimulation() {
  monteCarloSimulation = new MonteCarloSimulation(userOptions);
}
var grids = generateGrids();

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

// Presets
presets.addEventListener("change", () => {
  setUserOptions(Presets[presets.value]);
});

function setUserOptions(options: Options) {
  userOptions = updateUserOptions(options);
  PercolationGrid.clearGrid();
  updateGrids();
  updateMonteCarloSimulation();
  // monteCarloSimulation.clear();
}
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

// Start simulation button
/*
Stop any existing simulations
Clear the statistics for the current simulation
Clear the grid 
Create a new grid 
Begin new simulations for all new grids
*/
startButton.addEventListener("click", () => {
  updateMonteCarloSimulation();
  PercolationGrid.clearGrid();
  updateGrids();
  PercolationGrid.startSimulation();
  if (userOptions.isSyncMode()) {
    return initiateSimulationsSync();
  }
  return initiateSimulationsAsync();
});

stopButton.addEventListener("click", () => {
  PercolationGrid.stopSimulation();
});
/**
 * Run simulations one after each other.
 */
async function initiateSimulationsSync() {
  for (const grid of grids) {
    try {
      await grid.beginPercolationSimulation();
      monteCarloSimulation.updateResults(grid);
    } catch (reason) {
      console.log(reason);
    }
  }
}

/**
 * Run simulations in parallel.
 */
function initiateSimulationsAsync() {
  grids.forEach((grid) => {
    const simulation = grid.beginPercolationSimulation();
    simulation
      .then(() => monteCarloSimulation.updateResults(grid))
      .catch(console.log);
  });
}
