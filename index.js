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
      pixel: 8,
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

const idGetter = (props = [] || {}) => {
  if (Array.isArray(props)) {
    const [x, y] = props;
    return `${x}_${y}`;
  }

  if (props instanceof Object) {
    return `${props.x}_${props.y}`;
  }
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
  const key = event.key;
  event.preventDefault();

  if (key === "R" || (key === "r" && state.snake.nextMove === false)) {
    restartGame();
  } else {
    state.snake.direction = key;
  }
}

function removeKeyListener(handleKeyPressed) {
  window.removeEventListener("keydown", handleKeyPressed);
}

const checkCollision = ({ snake: { coordinates }, board, food }) => {
  const [head, ...body] = coordinates;
  const [head_x, head_y] = head;
  const [food_x, food_y] = food.map((axle) =>
    [...axle.split("_")].map((value) => Number(value))
  )[0];

  for (const [x, y] of body) {
    if (x === head_x && y === head_y) {
      return true;
    }
  }
  if (head_x < 0 || head_x >= board.cols || head_y < 0 || head_y >= board.rows)
    return true;
  else false;
};

const acceptedMoves = {
  ArrowRight(state) {
    const {
      snake: { coordinates },
      food,
    } = state;
    const [t, l] = coordinates[0];

    const isCollide = checkCollision(state);
    const isFoodEaten = checkIfFoodWasEaten(state);

    if (isCollide && !isFoodEaten) {
      removeKeyListener();
      return false;
    }

    return [t, l + 1];
  },

  ArrowLeft(state) {
    const {
      snake: { coordinates },
    } = state;
    const [t, l] = coordinates[0];

    const isCollide = checkCollision(state);
    const isFoodEaten = checkIfFoodWasEaten(state);

    if (isCollide && !isFoodEaten) {
      removeKeyListener();
      return false;
    }

    return [t, l - 1];
  },

  ArrowDown(state) {
    const {
      snake: { coordinates },
    } = state;
    const [t, l] = coordinates[0];

    const isCollide = checkCollision(state);
    const isFoodEaten = checkIfFoodWasEaten(state);

    if (isCollide && !isFoodEaten) {
      removeKeyListener();
      return false;
    }

    return [t + 1, l];
  },

  ArrowUp(state) {
    const {
      snake: { coordinates },
    } = state;
    const [t, l] = coordinates[0];

    const isCollide = checkCollision(state);
    const isFoodEaten = checkIfFoodWasEaten(state);

    if (isCollide && !isFoodEaten) {
      removeKeyListener();
      return false;
    }

    return [t - 1, l];
  },
};

function renderSnake(state) {
  const { snake, board } = state;

  board.coordinates.forEach(([x, y]) => {
    const id = idGetter([x, y]);

    const box = document.getElementById(id);

    box?.classList?.remove("snake");
  });

  snake.coordinates.forEach(([x, y], i) => {
    const id = idGetter([x, y]);

    const snake = document.getElementById(id);

    snake?.classList?.add("snake");
  });
}

function moveSnake(state) {
  const {
    snake: { nextMove, coordinates },
  } = state;

  if (Array.isArray(nextMove)) {
    coordinates.unshift(nextMove);

    coordinates.pop();
  }
}

function createRandomFood(state) {
  const { board } = state;

  const randomX = Math.floor(Math.random() * board.rows);
  const randomY = Math.floor(Math.random() * board.cols);

  const randomFood = idGetter([randomX, randomY]);

  state.food.pop();
  state.food.push(randomFood);
}

function renderFood(state) {
  const { board } = state;

  board.coordinates.forEach(([x, y]) => {
    const id = idGetter([x, y]);

    if (state.food?.includes(id)) {
      const food = document.getElementById(id);
      food?.classList?.add("food");
    } else {
      const notFood = document.getElementById(id);
      notFood?.classList?.remove("food");
    }
  });
}

function checkIfFoodWasEaten(state) {
  const { snake, food, board } = state;

  const [food_x, food_y] = food[0].split("_").map((value) => Number(value));

  const snakeHead = snake.coordinates[0];
  const id = idGetter(snakeHead);

  if (
    food?.includes(id) ||
    (snakeHead[0] === food_x && snakeHead[1] === food_y)
  ) {
    snake.coordinates.unshift(snakeHead);

    state = { ...state, snake: { speed: snake.speed - 10 } };

    state.food.pop();

    createRandomFood(state);

    return true;
  }

  return false;
}

function initGame(state) {
  state.board.createBoard();

  renderScreen(state);

  renderSnake(state);

  createRandomFood(state);
}

function endGame(state) {
  const text = `You lose with ${state.points}, Press R to restart game!`;
  const div = document.createElement("div");
  div.innerHTML = text;
  score.appendChild(div);
}

function restartGame() {
  state = {
    ...state,
    food: [],
    points: 0,
    snake: {
      coordinates: [
        [0, 5],
        [0, 4],
        [0, 3],
        [0, 2],
        [0, 1],
      ],
      direction: "ArrowRight",
      nextMove: null,
      speed: 100,
    },
  };

  createRandomFood(state);
  renderSnake(state);
  createInterval(state);
}

function countPoints(state) {
  const { snake } = state;
  const sum = snake.coordinates.length - 5;
  state = { ...state, points: sum };

  if (state.snake.nextMove === false) {
    score.innerHTML = "";
    return;
  }
  state.points > 1
    ? (score.innerHTML = `${state.points} Pontos`)
    : (score.innerHTML = `${state.points} Ponto`);
}

function createInterval(state) {
  const gameInterval = setInterval(() => {
    const { snake } = state;

    if (snake.direction in acceptedMoves) {
      snake.nextMove = acceptedMoves[snake.direction](state);
    }

    countPoints(state);

    if (snake.nextMove === false) {
      clearInterval(gameInterval);
      endGame(state);
      return;
    }

    moveSnake(state);

    renderSnake(state);

    renderFood(state);
  }, state.snake.speed);
}

let state = snakeGame().state;

initGame(state);
createInterval(state);

document.addEventListener("keydown", handleKeyPressed);
