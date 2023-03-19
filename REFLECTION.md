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


### How to stop animations once they are in motion? 

Another problem I ran into was with getting animations to stop playing when the user clicks the stop button or changes the preset.

The issue stemmed from the fact that we had a loop that would continue until the 2d grid percolates and this was running within an asynchronous function that returns a promise. The difficulty is that once the asynchronous function is called, we loose direct control over what happens inside the function. And so when the user selects a different preset, the percolation grids would be redrawn but the asynchronous loop for the existing simulation would be running asynchronously in the background and the user would see the percolation statistics update despite no changes to the grids. This made for a poor user experience as the statistics shown would be unrelated to the displayed grids.

The fix I went with gives us more control over when to terminate the loop mentioned in the previous paragraph. The idea was to setup static variables on the percolation grid class so that the loop that opens random sites in the percolation grids would also check this flag before proceeding. Clicking the stop button or changing presets would then set this flag which would affect all instances of the class. Regardless of which stage of the loop each instance was at, once the loop condition is next evaluated, the asynchronous functions would end their loops and return a rejected promise. This would then end the grid animations and updates to the percolation statics. In the case where the user changes presets, both the displayed grids and statistics would reflect the new preset and would be independent of any previous percolation simulations.

18/03/2023 

Persisting problem with multiple simulations running behind the scenes. 

Because we do not disable the 'start simulation' button after it is clicked, the user can repeatedly click 'start simulation' and that will trigger a series of simulations, with the displayed grid only reflecting the first and the others will run hidden from view.
- This results in an incorrect display of the number of trials and what is shown.

Solution 
We can disable the 'start simulation' button until the 'stop simulation' button is clicked. 
Alternatively, we can have a single button that alternates between 'start' and 'stop' button states. 
This way the user cannot intentionaly or unintentionally run multiple instances of the preset simulation.

19/03/2023
When a simulation ends, we need to disable the 'stop' button and enable the 'start' button.
To achieve this for synchronous simulations, we can add DOM updates after the 'for' loop. 
For asynchronous simulations, we can use Promise.all to ensure that we only change the button states after all simulations complete.
Also ensure the starting button states includes a disabled 'stop' button. It doesn't make sense to stop simulations that aren't in motion.

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


 

