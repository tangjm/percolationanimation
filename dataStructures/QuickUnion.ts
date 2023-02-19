import UnionFind from "./UnionFind";

export default class QuickUnion implements UnionFind {
  n: number;
  parent: number[];

  constructor(n: number) {
    this.parent = new Array(n);
    for (let i = 0; i < this.n; i++) {
      this.parent[i] = i;
    }
  }

  /**
   * Return the root element of the set to which 'x' belongs.
   * @param x The element in question.
   */
  find(x: number): number {
    while (x !== this.parent[x]) {
      x = this.parent[x];
    }
    return x;
  }

  /**
   * Merges two sets by making the root of one the child of the root of the other.
   * @param p Element whose set is being expanded.
   * @param q Element whose set is being merged.
   */
  union(p: number, q: number): void {
    const rootP = this.find(p);
    const rootQ = this.find(q);
    this.parent[rootQ] = rootP;
  }
}
