import PercolationGrid from "./PercolationGrid.js";

export default interface PercolationStats {
  trials: number;
  percolationThresholds: number[];
  mean: number | null;
  stdDev: number | null;
  incrementTrials: () => void;
  updateMean: () => void;
  updateStdDev: () => void;
  updateResults: (g: PercolationGrid) => void;
}
