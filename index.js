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
      coordinates: [],
      createBoard() {
        for (let x = 0; x < this.rows; x++) {
          for (let y = 0; y < this.cols; y++) {
            this.coordinates.push([x, y]);
          }
        }
      },
    },
  };

  return { state };
};

function createElement(props) {
  const div = document.createElement("div");
  div.style.width = `${props.pixel}px`;
  div.style.height = `${props.pixel}px`;
  div.style.boxSizing = "border-box";
  div.style.position = `absolute`;
  div.style.top = `${props.x * props.pixel}px`;
  div.style.left = `${props.y * props.pixel}px`;
  div.setAttribute("class", "board");
  div.setAttribute("id", `${props.x}_${props.y}`);
  return div;
}

function renderScreen(state) {
  const { board } = state;

  board.coordinates.forEach(([x, y]) => {
    const props = { x, y, pixel: board.pixel };
    const buildingBlock = createElement(props);
    screen.appendChild(buildingBlock);
  });
}

function handleKeyPressed(event) {
  event.preventDefault();
  state.snake.direction = event.key;
}

function removeKeyListener(handleKeyPressed) {
  window.removeEventListener("keydown", handleKeyPressed);
}

const checkCollision = ([snake]) => {
  const [head, neck] = snake;
  const [head_x, head_y] = head;
  const [neck_x] = neck;
  console.log(head_x, neck_x);
  if ((head_x <= 0 && neck_x >= 1) || head_x > 40) return true;
  else if (head_y < 0 || head_y > 40) return true;
  else false;
};

const acceptedMoves = {
  ArrowRight(snake) {
    const [t, l] = snake[0];
    const isCollide = checkCollision([snake]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return [t, l + 1];
  },

  ArrowLeft(snake) {
    const [t, l] = snake[0];
    const isCollide = checkCollision([snake]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return [t, l - 1];
  },

  ArrowDown(snake) {
    const [t, l] = snake[0];
    const isCollide = checkCollision([snake]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    return [t + 1, l];
  },

  ArrowUp(snake) {
    const [t, l] = snake[0];
    const isCollide = checkCollision([snake]);
    if (isCollide) {
      removeKeyListener();
      return false;
    }
    console.log(Math.max(0, t - 1), l);
    return [Math.max(0, t - 1), l];
  },
};

function renderSnake(state) {
  const { snake, board } = state;

  board.coordinates.forEach(([x, y]) => {
    const box = document.getElementById(`${x}_${y}`);
    box?.classList?.remove("snake");
  });

  snake.coordinates.forEach(([x, y]) => {
    const snake = document.getElementById(`${x}_${y}`);
    snake?.classList?.add("snake");
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
  board.coordinates.forEach(([x, y]) => {
    if (snake.food.includes(x) && snake.food.includes(y)) {
      buildingBlock.classList.add("food");
    }
  });
}

function checkIfFoodWasEaten(state) {
  const { snake, board } = state;
  const tail = [...snake.coordinates.values()].pop();
}

const { state } = snakeGame();
state.board.createBoard();
renderScreen(state);
renderSnake(state);
createRandomFood(state);
const gameInterval = setInterval(() => {
  const { snake } = state;
  if (snake.direction in acceptedMoves) {
    snake.nextMove = acceptedMoves[snake.direction](snake.coordinates);
  }

  if (snake.nextMove === false) {
    clearInterval(gameInterval);

    return;
  }

  moveSnake(snake);
  renderSnake(state);
  //renderFood(state);
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
