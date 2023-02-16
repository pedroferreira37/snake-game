const container = document.getElementById("snake");

const PIXEL_SIZE = 12;
const grid = {
  ROWS: 40,
  COLS: 40,
};

let snakeCoords = getInitialCoordsSnake();
const coordinates = new Map();

function createDiv() {
  return document.createElement("div");
}

function createCell(x, y) {
  const div = createDiv();
  div.style.cssText = `
    height: ${PIXEL_SIZE}px;
    width: ${PIXEL_SIZE}px;
    position: absolute;
    top: ${PIXEL_SIZE * x}px;
    left: ${PIXEL_SIZE * y}px;
    border: 0.1px solid #C0C0C0;
  `;

  return div;
}

function drawGame() {
  for (let i = 0; i < grid.ROWS; i++) {
    for (let j = 0; j < grid.COLS; j++) {
      const cell = createCell(i, j);
      container.appendChild(cell);
      const cellPosition = retrivePosition(i, j);
      coordinates.set(cellPosition, cell);
    }
  }
}

function drawSnake(coords) {
  console.log(coords);
  for (const [x, y] of coords) {
    const cellPosition = retrivePosition(x, y);
    const cell = coordinates.get(cellPosition);
    cell.style.background = "yellow";
  }
}

const moveRight = ([t, l]) => [t, l + 1];

window.addEventListener("keydown", (e) => {
  e.preventDefault();
  switch (e.key) {
    case "ArrowLeft":
    case "A":
    case "a":
      snakeCoords = snakeCoords.map(moveRight);
      drawSnake();
      break;
  }
});

function getInitialCoordsSnake() {
  return [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
  ];
}

function initGame() {
  drawGame();
  drawSnake(snakeCoords);
}

function retrivePosition(i, j) {
  const position = `${i}axls${j}`;
  return position;
}

initGame();
