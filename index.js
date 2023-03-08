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
      speed: 500,
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
  state.snake.direction = event.key;
}

function removeKeyListener(handleKeyPressed) {
  window.removeEventListener("keydown", handleKeyPressed);
}

const checkCollision = ([t, l]) => {
  if (t < 0 || t >= 40) return true;
  else if (l < 0 || l >= 40) return true;
  else false;
};

const acceptedMoves = {
  ArrowRight([t, l]) {
    const isCollide = checkCollision([t, l]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return [t, l + 1];
  },

  ArrowLeft([t, l]) {
    const isCollide = checkCollision([t, l]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return [t, l - 1];
  },

  ArrowDown([t, l]) {
    const isCollide = checkCollision([t, l]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return [t + 1, l];
  },

  ArrowUp([t, l]) {
    const isCollide = checkCollision([t, l]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return [t - 1, l];
  },
};

function renderSnake(state) {
  const { snake } = state;
  const snakeBodyPosition = snake.coordinates.map(([x, y]) => `${x}-${y}`);
  state.board.coordinates.forEach((boardHouse, marker) => {
    if (snakeBodyPosition.includes(marker)) {
      state.board.coordinates.get(marker).classList.add("snake");
      state.board.coordinates.get(marker).classList.remove("board");
    } else {
      state.board.coordinates.get(marker).classList.remove("snake");
      state.board.coordinates.get(marker).classList.add("board");
    }
  });
}

function moveSnake(snake) {
  const snakeHead = snake.nextMove;
  if (snakeHead) {
    snake.coordinates.unshift(snakeHead);
    snake.coordinates.pop();
  }
}

function createRandomFood(state) {
  const { snake, board } = state;
  let foodRandomCoordinates = [
    [
      Math.floor(Math.random() * board.rows),
      Math.floor(Math.random() * board.cols),
    ],
  ].map(([x, y]) => `${x}-${y}`);

  state.snake.food = foodRandomCoordinates;
}

function renderFood(state) {
  const { snake, board } = state;
  board.coordinates.forEach((boardHouse, marker) => {
    if (snake.food.includes(marker)) {
      boardHouse.style.background = "green";
    }
  });
}

const { state } = snakeGame();

renderScreen(state);
renderSnake(state);
createRandomFood(state);
const gameInterval = setInterval(() => {
  const { snake } = state;
  if (snake.direction in acceptedMoves) {
    snake.nextMove = acceptedMoves[snake.direction](snake.coordinates[0]);
  }

  if (snake.nextMove === false) {
    clearInterval(gameInterval);

    return;
  }

  moveSnake(snake);
  renderSnake(state);
  renderFood(state);
}, 100);

document.addEventListener("keydown", handleKeyPressed);

// function showPoints() {
//   score.innerHTML = POINTS + " points";
// }

//

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

//   moveSnake(nextMove);
//   drawSnake(snakeCoords);
// }, SNAKE_SPEED);
