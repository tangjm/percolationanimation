import WeightedQuickUnionWithPathCompression from "./WeightedQuickUnionWithPathCompression.js";

export type GridVertex = [number, number];

export default class Percolation {
  openSites: number = 0;
  sites: WeightedQuickUnionWithPathCompression;
  grid: boolean[][];
  size: number;
  n: number;

  /**
   *
   * Create an n-by-n grid with all sites initially blocked.
   * @param n Grid width and height
   */
  constructor(n: number) {
    if (n <= 0) throw new Error("Illegal argument");
    this.n = n;
    this.size = n * n + 2;

    /*
    sites[1] to sites[n * n] enumerates our N*N grid of sites.

    [1 .. n]
    [n + 1 .. 2n]
    [2n + 1 .. 3n]
      .
      .
      .
    [n(n - 2) + 1 .. n(n - 1)]
    [n(n - 1) + 1 .. n * n]

    sites[0] is reserved for the virtual top node.
    sites[n * n + 1] is reserved for the virtual bottom node.
    */
    this.sites = new WeightedQuickUnionWithPathCompression(this.size);

    // Connect all top row sites to the virtual top node.
    for (let i = 1; i <= n; i++) {
      this.sites.union(0, i);
    }

    // Connect all bottom row sites to the virtual bottom node.
    for (let i = n * (n - 1) + 1; i < this.size - 1; i++) {
      this.sites.union(n * n + 1, i);
    }

    // (1, 1) is the top-left.
    // (n, n) is the bottom-right.

    // (0, 0) is reserved for the virtual top node.
    // (n + 1, n + 1) is reserved for the virtual bottom node.
    // (0, k) and (k, 0) for k != 0 are unused.
    // (n + 1, k) and (k, n + 1) for k != n + 1 are unused.

    // Let 'false' denote a closed site and 'true' an open site.
    this.grid = [...new Array(n + 2)].map((_) => new Array(n + 2).fill(false));
  }

  isValidVertex(vertex: GridVertex): boolean {
    const [row, col] = vertex;
    if (row < 1 || row > this.n) return false;
    if (col < 1 || col > this.n) return false;
    return true;
  }

  /**
   * Map grid points (col, row) to union-find sites as follows:
   *
   * Definition:
   *
   * f(col, row) -> col + n * (row - 1).
   *
   * f(1, 1) -> 1
   *
   * f(1, 10) -> 91
   *
   * f(10, 1) -> 10
   *
   * f(n, n) -> n * n
   * @param vertex Grid coordinate [x, y]
   * @returns
   */
  gridVertexToSitePos(vertex: GridVertex): number {
    const [col, row] = vertex;
    return col + this.n * (row - 1);
  }

  getNeighbours(vertex: GridVertex): GridVertex[] {
    const [col, row] = vertex;
    return [
      [col - 1, row],
      [col + 1, row],
      [col, row - 1],
      [col, row + 1],
    ];
  }

  /**
   * Open a grid coordinate. Attempt to merge the coordinate with any open neighbours.
   * @param vertex Grid coordinate to open
   * @returns A truth-value indicating whether the vertex was opened.
   */
  open(vertex: GridVertex): boolean {
    if (!this.isValidVertex(vertex))
      throw new Error(
        `IllegalArgumentException -- Vertex ${vertex} falls outside the ${this.n}x${this.n} grid`
      );
    if (this.isOpen(vertex)) return false;
    const currentSitePos: number = this.gridVertexToSitePos(vertex);
    const neighbours: GridVertex[] = this.getNeighbours(vertex);
    for (const neighbour of neighbours) {
      if (!this.isValidVertex(neighbour)) continue;
      if (this.isOpen(neighbour)) {
        const neighbourSitePos: number = this.gridVertexToSitePos(neighbour);
        this.sites.union(currentSitePos, neighbourSitePos);
      }
    }
    const [col, row] = vertex;
    this.grid[col][row] = true;
    this.openSites++;
    return true;
  }

  isOpen(vertex: GridVertex): boolean {
    if (!this.isValidVertex(vertex))
      throw new Error(
        `IllegalArgumentException -- Vertex ${vertex} falls outside the ${this.n}x${this.n} grid`
      );
    const [col, row] = vertex;
    return this.grid[col][row];
  }

  // Is the site (col, row) full?
  // A 'full' site is one that is open and connected to an open site in the top row.
  /**
   * 
    We only need to show that the node is open and belongs to the same set as the virtual top node.
    Note that all open sites on the top row are connected to the virtual top node.

    The virtual top node could be the root, in which case we just need to show that the root of the set to which the current node belongs is the virtual top node.
    Another node could be the root element and both the current node and the virtual top node are set members.
    Consider when the virtual top node's set is merged into a larger set of nodes in the middle of the grid.
    Or consider when the virtual top node's set is merged into the virtual bottom node's set.
   * O(1) time. 
   * @param vertex 
   * @returns 
   */
  isFull(vertex: GridVertex): boolean {
    if (!this.isValidVertex(vertex))
      throw new Error(
        `IllegalArgumentException -- Vertex ${vertex} falls outside the ${this.n}x${this.n} grid`
      );
    if (!this.isOpen(vertex)) return false;
    const sitePos: number = this.gridVertexToSitePos(vertex);
    return this.sites.find(sitePos) === this.sites.find(0);
  }

  numberOfOpenSites(): number {
    return this.openSites;
  }

  percolates(): boolean {
    return (
      this.numberOfOpenSites() >= 1 &&
      this.sites.find(0) === this.sites.find(this.n * this.n + 1)
    );
  }
}
