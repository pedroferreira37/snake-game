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
  event.preventDefault();
  state.snake.direction = event.key;
}

function removeKeyListener(handleKeyPressed) {
  window.removeEventListener("keydown", handleKeyPressed);
}

const checkCollision = ([snake]) => {
  const [head, neck] = snake;
  const [head_x, head_y] = head;
  if (head_x < 0 || head_x >= board.cols || head_y < 0 || head_y >= board.rows)
    //have to fix it
    return true;
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

    return [t - 1, l];
  },
};

function renderSnake(state) {
  const { snake, board } = state;

  board.coordinates.forEach(([x, y]) => {
    const id = idGetter([x, y]);

    const box = document.getElementById(id);

    box?.classList?.remove("snake");

    box?.classList?.remove("rounded");
  });

  snake.coordinates.forEach(([x, y]) => {
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

  const snakePiece = snake.coordinates[0];
  const id = idGetter(snakePiece);

  if (food?.includes(id)) {
    snake.coordinates.unshift(snakePiece);

    state = { ...state, snake: { speed: snake.speed - 10 } };

    state.food.pop();

    createRandomFood(state);
  }
}

function countPoints(state) {
  const { snake } = state;
  const sum = snake.coordinates.length - 5;
  state = { ...state, points: sum };

  state.points > 1
    ? (score.innerHTML = `${state.points} PONTOS`)
    : (score.innerHTML = `${state.points} PONTO !`);
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
  countPoints(state);
  moveSnake(state);

  renderSnake(state);

  renderFood(state);

  checkIfFoodWasEaten(state);
}, state.snake.speed);

document.addEventListener("keydown", handleKeyPressed);
