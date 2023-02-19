import UnionFind from "./UnionFind";

export default class WeightedQuickUnionWithPathCompression
  implements UnionFind
{
  n: number;
  parent: number[];
  size: number[];

  constructor(n: number) {
    this.n = n;
    this.parent = new Array(n);
    this.size = new Array(n);
    for (let i = 0; i < this.n; i++) {
      this.parent[i] = i;
      this.size[i] = 1;
    }
  }

  /**
   * Return the root element of the set to which 'x' belongs.
   * Apply path compression to restructure the path from the element to its root so the distance to the root is halved.
   * @param x The element in question.
   */
  find(x: number): number {
    while (x !== this.parent[x]) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }

  /**
   * Merge the smaller set into the larger set.
   * When they are the same size, we default to merging the set containing 'q' into the set containing 'p'.
   * @param p First element
   * @param q Second element
   */
  union(p: number, q: number): void {
    const rootP = this.find(p);
    const rootQ = this.find(q);

    if (this.size[rootP] >= this.size[rootQ]) {
      this.parent[rootQ] = rootP;
      this.size[rootP] += this.size[rootQ];
    } else {
      this.parent[rootP] = rootQ;
      this.size[rootQ] += this.size[rootP];
    }
  }
}
