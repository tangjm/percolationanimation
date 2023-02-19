### Some hurdles that were overcome 

1. Non-terminating function

An initial issue was that the grid vertices would continue to be filled in even after percolation was possible. This suggested that the computation was not terminating. 

The problem was with this line.

```javascript
new Array(size).fill(new Array(size).fill(false)); 
```

A reference to the same inner array is stored for each element of the outer array. 

This meant that when I opened a single cell, it would open all the cells in the same column. So, if at a later point in time, I try to open another cell at a different position but in the same column, it would be treated as open and wouldn't be merged with any open neighbours. 

As a result, the animation would still continue to fill in cells as after we fill in one cell for each column, the entire grid would be open which would mean subsequent attempts to open cells would fail. 
This means `percolation.percolates()` would always return 'false' as not being able to open cells means that a grid that doesn't percolate will never change, and so it will never percolate. 

This can be fixed with 

```javascript
[...new Array(size)].map(new Array(size).fill(false)) 
```

which creates a new array for each element in the outer array.

2. Horizontal instead of vertical percolation

Another issue was that the percolation path was horizontal instead of vertical. 
This was because we needed to alter our mapping function that mapped vertices to integers. 

The behaviour of the function that lead to horizontal percolation was the following as we were treating the x-coordinate as representing rows instead of columns in [x, y]
(1,1) -> 1 
(1,2) -> 2
(1,3) -> 3 


### Typescript 

Typescript can be installed as a devDependency with 'npm install --save-dev typescript'
Typescript doesn't generate imports with '.js' extension. 

When you compile your '.ts' source files to Javascript with 'npx tsc', any imports without an extension will also not have any extension in the emitted Javascript files. 

E.g. 

```typescript 
// source file
import Grid from "./Grid" 

// In the emitted javascript file,
// you might expect 'import Grid from "./Grid.js"' but you get
import Grid from "./Grid"

```

One solution is to import other Typescript modules with '.js' extension. 

So if you needed to import everything from Square.ts in App.ts, then you would write 

```typescript 
import * from "./Square.js"
``` 

and Typescript will recognise that you are importing a typescript file despite the javascript file extension. 


 

