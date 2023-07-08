const WALL_BLOCK = "wall-block";
const BOARD_BLOCK = "board-block";
const SNAKE = "snake";

const startInputElement = document.getElementById("startInput");
const startButton = document.getElementById("start-button");
const board = document.getElementById("board");
const resultScreen = document.getElementById("resultScreen");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-button");

let boardHeight;
let boardWidth;
let blockTotal;
let gameGrid;

let gameTicker;
let snakeArray = [0];
let boardArray = [];
let lastBlock;
let growBlock;
let direction = "right";

startInputElement.classList.add("show");

startButton.addEventListener("click", function () {
  boardHeight = Number(document.getElementById("height-input").value);
  boardWidth = Number(document.getElementById("width-input").value);
  blockTotal = boardHeight * boardWidth + boardHeight * 2 + boardWidth * 2 + 4;
  startInputElement.classList.remove("show");
  const timer = document.getElementById("timer");

  for (let i = 0; i < blockTotal; i++) {
    if (
      i <= boardWidth + 1 ||
      i % (boardWidth + 2) == 0 ||
      i % (boardWidth + 2) == boardWidth + 1 ||
      i >= (boardWidth + 2) * (boardHeight + 1)
    ) {
      board.appendChild(createBlock(WALL_BLOCK));
    } else {
      board.appendChild(createBlock(BOARD_BLOCK));
    }
  }

  gameGrid = document.querySelectorAll("[data-board-block]");

  resizeGrid(boardHeight + 2, boardWidth + 2);

  window.addEventListener(
    "resize",
    function () {
      resizeGrid(boardHeight + 2, boardWidth + 2);
    },
    true
  );

  // restartButton.addEventListener("click", setUpGame);

  setUpGame();
});

function setUpGame() {
  snakeArray = [0];
  lastBlock = undefined;
  growBlock = undefined;
  boardArray = [];
  direction = "right";

  resultScreen.classList.remove("show");

  for (let i = 0; i < gameGrid.length; i++) {
    boardArray.push(Number(i));
    gameGrid[i].style.backgroundColor = "";
  }

  colorSnake();
  boardArray.splice(0, 1);

  setTimeout(function () {
    timer.innerText = "3";
    timer.style.color = "lightgreen";
    timer.style.display = "flex";
  }, 1000);

  setTimeout(function () {
    timer.innerText = "2";
    timer.style.color = "rgb(255, 255, 144)";
  }, 2000);

  setTimeout(function () {
    timer.innerText = "1";
    timer.style.color = "coral";
  }, 3000);

  setTimeout(function () {
    timer.innerText = "START";
    timer.style.color = "hotpink";
  }, 4000);

  setTimeout(function () {
    timer.style.display = "none";
    gameTicker = setInterval(moveBlock, 500);
    document.addEventListener("keydown", setDirection);
  }, 5000);

  createGrowBlock();
}

function createBlock(classId) {
  const block = document.createElement("div");
  block.className = classId;

  if (classId == BOARD_BLOCK) {
    block.dataset.boardBlock = "";
  } else if (classId == WALL_BLOCK) {
    block.dataset.wallBlock = "";
  }
  return block;
}

function resizeGrid(gridHeight, gridWidth) {
  if (board.offsetWidth * gridHeight < board.offsetHeight * gridWidth) {
    board.style.gridTemplateRows = `repeat(${gridHeight}, ${
      (board.offsetWidth - 40) / gridWidth
    }px)`;
    board.style.gridTemplateColumns = `repeat(${gridWidth}, ${
      (board.offsetWidth - 40) / gridWidth
    }px)`;
  } else {
    board.style.gridTemplateRows = `repeat(${gridHeight}, ${
      (board.offsetHeight - 40) / gridHeight
    }px)`;
    board.style.gridTemplateColumns = `repeat(${gridWidth}, ${
      (board.offsetHeight - 40) / gridHeight
    }px)`;
  }
}

function setDirection(e) {
  if (e.key == "ArrowUp") {
    direction = "up";
  } else if (e.key == "ArrowDown") {
    direction = "down";
  } else if (e.key == "ArrowLeft") {
    direction = "left";
  } else if (e.key == "ArrowRight") {
    direction = "right";
  }
}

function moveBlock() {
  let grow = false;

  switch (direction) {
    case "up":
      if (
        snakeArray[0] - boardWidth >= 0 &&
        !snakeArray.includes(snakeArray[0] - boardWidth)
      ) {
        if (snakeArray[0] - boardWidth == growBlock) {
          growSnake(growBlock);
          grow = true;
        } else {
          snakeArray.unshift(snakeArray[0] - boardWidth);
        }
      } else {
        stopGame("lose");
      }
      break;
    case "down":
      if (
        snakeArray[0] + boardWidth < gameGrid.length &&
        !snakeArray.includes(snakeArray[0] + boardWidth)
      ) {
        if (snakeArray[0] + boardWidth == growBlock) {
          growSnake(growBlock);
          grow = true;
        } else {
          snakeArray.unshift(snakeArray[0] + boardWidth);
        }
      } else {
        stopGame("lose");
      }
      break;
    case "left":
      if (
        (snakeArray[0] - 1) % boardWidth != boardWidth - 1 &&
        !snakeArray.includes(snakeArray[0] - 1) &&
        snakeArray[0] - 1 >= 0
      ) {
        if (snakeArray[0] - 1 == growBlock) {
          growSnake(growBlock);
          grow = true;
        } else {
          snakeArray.unshift(snakeArray[0] - 1);
        }
      } else {
        stopGame("lose");
      }
      break;
    case "right":
      if (
        (snakeArray[0] + 1) % boardWidth != 0 &&
        !snakeArray.includes(snakeArray[0] + 1)
      ) {
        if (snakeArray[0] + 1 == growBlock) {
          growSnake(growBlock);
          grow = true;
        } else {
          snakeArray.unshift(snakeArray[0] + 1);
        }
      } else {
        stopGame("lose");
      }
      break;
  }

  if (!grow) {
    lastBlock = snakeArray[snakeArray.length - 1];
    snakeArray.splice(snakeArray.indexOf(lastBlock), 1);
    boardArray.splice(boardArray.indexOf(snakeArray[0]), 1);
    boardArray.push(lastBlock);
  }

  if (!(grow && boardArray.length == 0)) {
    colorSnake();
  }
}

function growSnake(block) {
  snakeArray.unshift(block);
  boardArray.splice(boardArray.indexOf(block), 1);
  if (boardArray.length == 0) {
    gameGrid[snakeArray[0]].style.backgroundColor = "hotpink";
    stopGame("win");
  } else {
    createGrowBlock();
  }
}

function createGrowBlock() {
  console.log(boardArray);
  let randomBlock = boardArray[Math.floor(Math.random() * boardArray.length)];

  gameGrid[randomBlock].style.backgroundColor = "white";
  growBlock = randomBlock;
}

function colorSnake() {
  if (
    lastBlock != undefined &&
    gameGrid[lastBlock].style.backgroundColor != "white"
  ) {
    gameGrid[lastBlock].style.backgroundColor = "";
  }
  gameGrid[snakeArray[0]].style.backgroundColor = "hotpink";
}

function stopGame(state) {
  clearInterval(gameTicker);
  resultScreen.classList.add("show");

  if (state == "win") {
    resultMessage.innerText = "You Win!";
    console.log("You win!");
  } else {
    resultMessage.innerText = "You Lose.";
    console.log("You lose.");
  }

  restartButton.addEventListener("click", setUpGame);
}
