import Percolation, { GridVertex } from "./Percolation.js";

const scale = 30;
const size = 10;

const canvas = document.createElement("canvas");
const canvasSize = size * scale + 2 * scale;
canvas.setAttribute("width", String(canvasSize));
canvas.setAttribute("height", String(canvasSize));
const rootNode = document.querySelector("div");
rootNode.appendChild(canvas);

const cx = canvas.getContext("2d");
cx.strokeStyle = "black";
cx.lineWidth = 1;
cx.strokeRect(0, 0, canvasSize, canvasSize);

// Possible coords
// (0, 0) to (size + 1, size + 1)
// Usable coords
// (1, 1) to (size, size)
// (0, 0) is our virtual top node
// (size + 1, size + 1) is our virtual bottom node

const percolation = new Percolation(size);

beginPercolationSimulation();

async function beginPercolationSimulation(): Promise<void> {
  while (!percolation.percolates()) {
    await wait(0.05);
    const row = Math.floor(Math.random() * size) + 1;
    const col = Math.floor(Math.random() * size) + 1;
    if (percolation.open([col, row])) {
      fillSite([col, row], "blue");
    }
  }
  for (let y = 1; y <= size; y++) {
    for (let x = 1; x <= size; x++) {
      if (percolation.isFull([x, y])) {
        cx.fillStyle = "green";
        fillSite([x, y], "green");
      }
    }
  }
}

function fillSite(start: GridVertex, colour: string) {
  cx.fillStyle = colour;
  const startX = start[0] * scale;
  const startY = start[1] * scale;
  const endX = scale;
  const endY = scale;
  cx.moveTo(startX, startY);
  cx.fillRect(startX, startY, endX, endY);
}

/**
 * Wait a specified number of seconds before resolving to 'null'.
 * @param seconds to wait
 * @returns
 */
function wait(seconds: number): Promise<null> {
  return new Promise((resolve, reject) => {
    return setTimeout(() => resolve(null), seconds * 1000);
  });
}