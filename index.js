const container = document.getElementById("snake");
const score = document.getElementById("score");

function showPoints() {
  score.innerHTML = POINTS + " points";
}

let POINTS = 0;
const PIXEL_SIZE = 12;
let SNAKE_SPEED = 100;
const grid = {
  ROWS: 40,
  COLS: 40,
};

function removeKeyListener() {
  window.removeEventListener("keydown", handleKeyPressed);
}

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
let snakeCoords = [];
let foodCoords = [];
const moveRight = ([t, l]) => {
  const coords = [t, l + 1];
  if (coords[1] >= grid.COLS) {
    removeKeyListener();
    return false;
  }
  return coords;
};
const moveLeft = ([t, l]) => {
  const coords = [t, l - 1];
  if (coords[1] < 0) {
    removeKeyListener();
    return false;
  }
  return coords;
};
const moveDown = ([t, l]) => {
  const coords = [t + 1, l];
  //verification to not hit the wall when snake is walking in straight line, has to check the direction also
  if (coords[0] >= grid.ROWS && snakeCoords[0][0] > snakeCoords[1][0]) {
    console.log(snakeCoords);
    removeKeyListener();
    return false;
  } else if (coords[0] < grid.ROWS) {
    return [t + 1, l];
  } else {
    return moveRight([t, l]);
  }
};
const moveUp = ([t, l]) => {
  const coords = [t - 1, l];

  if (coords[0] < 0 && snakeCoords[1][0] > 0) {
    removeKeyListener();
    return false;
  } else if (coords[0] > -1) {
    return [t - 1, l];
  } else {
    return moveRight([t, l]);
  }
};

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
    border-radius: 3px;
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
    }

    if (
      !uniqueSnakePosition.has(position) &&
      cell.style.background !== "green"
    ) {
      cell.style.background = "white";
    }
  });
}

function moveSnake(newHeadPosition) {
  const [f_x, f_y, cell] = foodCoords[0];
  const [s_x, s_y] = newHeadPosition;
  if (s_x === f_x && s_y === f_y) {
    snakeCoords.unshift([f_x, f_y]);
    cell.remove();
    foodCoords = [];
    POINTS++;
    generateSnakeFood();
    showPoints();
  } else {
    snakeCoords.unshift(newHeadPosition);
    snakeCoords.pop();
  }
}
function generateSnakeFood() {
  let f_x, f_y;

  f_x = Math.floor(Math.random() * grid.ROWS);
  f_y = Math.floor(Math.random() * grid.COLS);

  const cell = createCell(f_x, f_y);
  cell.style.background = "green";
  container.appendChild(cell);

  foodCoords.push([f_x, f_y, cell]);
}

function handleKeyPressed(event) {
  event.preventDefault();
  const { key: keyPressed } = event;
  nextDirection = keyPressed;
}

let nextDirection = "ArrowRight";
window.addEventListener("keydown", handleKeyPressed);

const gameLoop = setInterval(() => {
  var newHeadPosition = snakeCoords[0];
  var nextMove;

  switch (nextDirection) {
    case "ArrowRight":
      nextMove = moveRight(newHeadPosition);
      break;
    case "ArrowLeft":
      nextMove = moveLeft(newHeadPosition);
      break;
    case "ArrowDown":
      nextMove = moveDown(newHeadPosition);
      break;
    case "ArrowUp":
      nextMove = moveUp(newHeadPosition);
      break;
    default:
      nextMove = moveRight(newHeadPosition);
  }

  if (nextMove === false) {
    clearInterval(gameLoop);
    return;
  }

  moveSnake(nextMove);
  drawSnake(snakeCoords);
}, SNAKE_SPEED);

function initGame() {
  snakeCoords = getInitialCoordsSnake();

  drawGame();
  drawSnake(snakeCoords);
  generateSnakeFood();
  showPoints();
}

function retrivePosition(i, j) {
  const position = `${i}axls${j}`;
  return position;
}

initGame();
