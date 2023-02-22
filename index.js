const container = document.getElementById("snake");

const PIXEL_SIZE = 12;
const grid = {
  ROWS: 40,
  COLS: 40,
};

function getInitialCoordsSnake() {
  return [
    [0, 5],
    [0, 4],
    [0, 3],
    [0, 2],
    [0, 1],
  ];
}

const coordinates = new Map();
const snakeCoords = getInitialCoordsSnake();
const moveRight = ([t, l]) => [t, l + 1];
const moveLeft = ([t, l]) => [t, l - 1];
const moveDown = ([t, l]) => [t + 1, l];
const moveUp = ([t, l]) => [t - 1, l];

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
      cell.style.background = "white";
      container.appendChild(cell);
      const cellPosition = retrivePosition(i, j);
      coordinates.set(cellPosition, cell);
    }
  }
}

function drawSnake(coords) {
  const uniqueSnakePosition = new Set();
  for (const [x, y] of coords) {
    const cellPosition = retrivePosition(x, y);
    uniqueSnakePosition.add(cellPosition);
  }

  coordinates.forEach((cell, position) => {
    if (uniqueSnakePosition.has(position)) {
      cell.style.background = "yellow";
    } else {
      cell.style.background = "white";
    }
  });
}

function moveSnake(newHeadPosition) {
  snakeCoords.unshift(newHeadPosition);
  snakeCoords.pop();
}

const snakeAction = {
  ArrowRight() {
    const newHeadPosition = snakeCoords[0];
    const right = moveRight(newHeadPosition);
    moveSnake(right);
    drawSnake(snakeCoords);
  },
  ArrowLeft() {
    const newHeadPosition = snakeCoords[0];
    const left = moveLeft(newHeadPosition);
    moveSnake(left);
    drawSnake(snakeCoords);
  },
  ArrowDown() {
    const newHeadPosition = snakeCoords[0];
    const down = moveDown(newHeadPosition);
    moveSnake(down);
    drawSnake(snakeCoords);
  },
  ArrowUp() {
    const newHeadPosition = snakeCoords[0];
    const up = moveUp(newHeadPosition);
    moveSnake(up);
    drawSnake(snakeCoords);
  },
};

window.addEventListener("keydown", (event) => {
  event.preventDefault();
  const { key: keyPressed } = event;
  if (snakeAction.hasOwnProperty(keyPressed)) snakeAction[keyPressed]();
});

function initGame() {
  drawGame();
  drawSnake(snakeCoords);
}

function retrivePosition(i, j) {
  const position = `${i}axls${j}`;
  return position;
}

initGame();
