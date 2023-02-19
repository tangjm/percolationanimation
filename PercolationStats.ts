import PercolationGrid from "./PercolationGrid.js";

export default interface PercolationStats {
  trials: {
    total: number;
    completed: number;
  };
  percolationThresholds: number[];
  mean: number | null;
  stdDev: number | null;
  incrementTrials: () => void;
  addPercolationThreshold: (g: PercolationGrid) => void;
  updateMean: () => void;
  updateStdDev: () => void;
  updateResults: (g: PercolationGrid) => void;
}
