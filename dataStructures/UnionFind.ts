export default interface UnionFind {
  find: (n: number) => number,
  union: (p: number, q: number) => void
}
