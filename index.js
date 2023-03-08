const screen = document.getElementById("board");
const score = document.getElementById("score");

const snakeGame = () => {
  const state = {
    snake: {
      coordinates: [
        [0, 5],
        [0, 4],
        [0, 3],
        [0, 2],
        [0, 1],
      ],
      nextMove: null,
      direction: "ArrowRight",
      speed: 100,
    },
    food: [],
    points: 0,
    board: {
      rows: 40,
      cols: 40,
      pixel: 12,
      coordinates: new Map(),
    },
  };

  function createElement(props) {
    const div = document.createElement("div");
    div.style.width = `${props.pixel}px`;
    div.style.height = `${props.pixel}px`;
    div.style.background = "#747474";
    div.style.boxSizing = "border-box";
    div.style.position = `absolute`;
    div.style.top = `${props.x * props.pixel}px`;
    div.style.left = `${props.y * props.pixel}px`;
    return div;
  }

  function fillCoordinates(state) {
    const { board } = state;
    for (let x = 0; x < board.rows; x++) {
      for (let y = 0; y < board.cols; y++) {
        const props = { x, y, pixel: board.pixel };
        const boardHouse = createElement(props);
        board.coordinates.set(`${x}-${y}`, boardHouse);
      }
    }
  }
  fillCoordinates(state);

  return { state, board };
};

function renderScreen(state) {
  const { board } = state;
  board.coordinates.forEach((boardHouse) => {
    screen.appendChild(boardHouse);
  });
}

function handleKeyPressed(event) {
  event.preventDefault();
  state.nextMove = event.key;
}

function removeKeyListener(handleKeyPressed) {
  window.removeEventListener("keydown", handleKeyPressed);
}

const maxValueConstraint = ([t, l]) => {
  return [t, l].map((direction) => Math.min(30, Math.max(0, direction)));
};

const checkCollision = ([t, l]) => {
  if (t < 0 || t > 30) return true;
  else if (l < 0 || l > 30) return true;
  else false;
};

const acceptedMoves = {
  ArrowRight([t, l]) {
    const isCollide = checkCollision([t, l]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return maxValueConstraint([t, l + 1]);
  },

  ArrowRight([t, l]) {
    const isCollide = checkCollision([t, l]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return maxValueConstraint([t, l - 1]);
  },

  ArrowDown([t, l]) {
    const isCollide = checkCollision([t, l]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return maxValueConstraint([t + 1, l]);
  },

  ArrowUp([t, l]) {
    const isCollide = checkCollision([t, l]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return maxValueConstraint([t - 1, l]);
  },
};

function renderSnake(state) {
  const { snake } = state;
  const snakeBodyPosition = snake.coordinates.map(([x, y]) => `${x}-${y}`);
  snakeBodyPosition.forEach((marker) => {
    state.board.coordinates.get(marker).style.background = "yellow";
  });
}

const { state } = snakeGame();

renderScreen(state);
renderSnake(state);

// const gameInterval = setInterval(() => {
//   let snakeHead = state.snake[0];

//   if (state.direction in acceptedMoves) {
//     state.nextMove = acceptedMoves[state.direction](snakeHead);
//   }

//   if (state.nextMove === false) {
//     clearInterval(gameInterval);
//     return;
//   }

//   moveSnake(nextMove);
//   drawSnake(snakeCoords);
// }, state.speed);

// function showPoints() {
//   score.innerHTML = POINTS + " points";
// }

//

// function getInitialCoordsSnake() {
//   return [
//     [0, 5],
//     [0, 4],
//     [0, 3],
//     [0, 2],
//     [0, 1],
//   ];
// }

// function drawSnake(coords) {
//   const uniqueSnakePosition = new Set();
//   for (const [x, y] of coords) {
//     const cellPosition = retrivePosition(x, y);
//     uniqueSnakePosition.add(cellPosition);
//   }

//   coordinates.forEach((cell, position) => {
//     if (uniqueSnakePosition.has(position)) {
//       cell.style.background = "yellow";
//     }

//     if (
//       !uniqueSnakePosition.has(position) &&
//       cell.style.background !== "green"
//     ) {
//       cell.style.background = "white";
//     }
//   });
// }

// function moveSnake(newHeadPosition) {
//   const [f_x, f_y, cell] = foodCoords[0];
//   const [s_x, s_y] = newHeadPosition;
//   if (s_x === f_x && s_y === f_y) {
//     snakeCoords.unshift([f_x, f_y]);
//     cell.remove();
//     foodCoords = [];
//     POINTS++;
//     generateSnakeFood();
//     showPoints();
//   } else {
//     snakeCoords.unshift(newHeadPosition);
//     snakeCoords.pop();
//   }
// }
// function generateSnakeFood() {
//   let f_x, f_y;

//   f_x = Math.floor(Math.random() * grid.ROWS);
//   f_y = Math.floor(Math.random() * grid.COLS);

//   const cell = createCell(f_x, f_y);
//   cell.style.background = "green";
//   container.appendChild(cell);

//   foodCoords.push([f_x, f_y, cell]);
// }

// const gameLoop = setInterval(() => {
//   var newHeadPosition = snakeCoords[0];
//   var nextMove;

//   switch (nextDirection) {
//     case "ArrowRight":
//       nextMove = moveRight(newHeadPosition);
//       break;
//     case "ArrowLeft":
//       nextMove = moveLeft(newHeadPosition);
//       break;
//     case "ArrowDown":
//       nextMove = moveDown(newHeadPosition);
//       break;
//     case "ArrowUp":
//       nextMove = moveUp(newHeadPosition);
//       break;
//     default:
//       nextMove = moveRight(newHeadPosition);
//   }

//   if (nextMove === false) {
//     clearInterval(gameLoop);
//     return;
//   }

//   moveSnake(nextMove);
//   drawSnake(snakeCoords);
// }, SNAKE_SPEED);

// function initGame() {
//   snakeCoords = getInitialCoordsSnake();

//   drawGame();
//   drawSnake(snakeCoords);
//   generateSnakeFood();
//   showPoints();
// }

// const retrivePosition = (x, y) => `${x}:${y}`;

// initGame();
