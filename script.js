const WALL_BLOCK = "wall-block";
const BOARD_BLOCK = "board-block";
const SNAKE = "snake";

const startInputElement = document.getElementById("startInput");
const speedUpBox = document.getElementById("speed-up-box");
const startButton = document.getElementById("start-button");
const board = document.getElementById("board");
const boardFeatures = document.getElementById("board-features");
const scoreCounter = document.getElementById("score-counter");
const eatenCounter = document.getElementById("eaten-counter");
const resultScreen = document.getElementById("resultScreen");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-button");
const changeSettingsButton = document.getElementById("change-settings-button");

let boardHeight;
let boardWidth;
let blockTotal;
let gameGrid;
let speedType;
let speed;

let gameTicker;
let speedTicker;
let snakeArray = [0];
let boardArray = [];
let lastBlock;
let growBlock;
let direction = "right";
let score = 0;
let eaten = 0;

let lose = false;

setUpStartMenu();

function setUpStartMenu() {
  startInputElement.classList.add("show");
  boardFeatures.classList.remove("show");
  resultScreen.classList.remove("show");

  startButton.removeEventListener;
  startButton.addEventListener("click", setBoardSettings);
}

function setBoardSettings() {
  const timer = document.getElementById("timer");

  boardHeight = Number(document.getElementById("height-input").value);
  boardWidth = Number(document.getElementById("width-input").value);
  speedType = document.querySelector('input[name="speed-type"]:checked').value;
  blockTotal = boardHeight * boardWidth + boardHeight * 2 + boardWidth * 2 + 4;
  startInputElement.classList.remove("show");

  board.innerHTML = "";

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

  window.removeEventListener("resize", resizeWindow);
  window.addEventListener("resize", resizeWindow, true);

  setUpGame();
}

function resizeWindow() {
  resizeGrid(boardHeight + 2, boardWidth + 2);
}

function setUpGame() {
  snakeArray = [0];
  lastBlock = undefined;
  growBlock = undefined;
  boardArray = [];
  direction = "right";
  score = 0;
  eaten = 0;
  lose = false;

  boardFeatures.classList.add("show");
  resultScreen.classList.remove("show");

  for (let i = 0; i < gameGrid.length; i++) {
    boardArray.push(Number(i));
    gameGrid[i].style.backgroundColor = "";
  }

  colorSnake();
  boardArray.splice(0, 1);
  scoreCounter.innerText = score;
  eatenCounter.innerText = eaten;

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

    switch (speedType) {
      case "slow":
        speed = 150;
        break;
      case "normal":
        speed = 100;
        break;
      case "fast":
        speed = 50;
        break;
    }

    // if (document.getElementById("speed-up-box").checked) {
    //   speedTicker = setInterval()
    // }

    gameTicker = setInterval(moveBlock, speed);
    document.removeEventListener("keydown", setDirection);
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
      (board.offsetWidth - 80) / gridWidth
    }px)`;
    board.style.gridTemplateColumns = `repeat(${gridWidth}, ${
      (board.offsetWidth - 80) / gridWidth
    }px)`;
  } else {
    board.style.gridTemplateRows = `repeat(${gridHeight}, ${
      (board.offsetHeight - 80) / gridHeight
    }px)`;
    board.style.gridTemplateColumns = `repeat(${gridWidth}, ${
      (board.offsetHeight - 80) / gridHeight
    }px)`;
  }
}

function speedUp() {
  if (speed > 150) {
    speed -= 20;
  } else if (speed > 50) {
    speed -= 10;
  } else {
    speed -= 5;
  }

  gameTicker = setInterval(moveBlock, speed);
}

function setDirection(e) {
  if (e.key == "ArrowUp" || e.key == "w") {
    direction = "up";
  } else if (e.key == "ArrowDown" || e.key == "s") {
    direction = "down";
  } else if (e.key == "ArrowLeft" || e.key == "a") {
    direction = "left";
  } else if (e.key == "ArrowRight" || e.key == "d") {
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
          grow = true;
          score += 100 / speed;
          growSnake(growBlock);
        } else {
          snakeArray.unshift(snakeArray[0] - boardWidth);
        }
      } else {
        stopGame("lose");
        lose = true;
      }
      break;
    case "down":
      if (
        snakeArray[0] + boardWidth < gameGrid.length &&
        !snakeArray.includes(snakeArray[0] + boardWidth)
      ) {
        if (snakeArray[0] + boardWidth == growBlock) {
          grow = true;
          score += 100 / speed;
          growSnake(growBlock);
        } else {
          snakeArray.unshift(snakeArray[0] + boardWidth);
        }
      } else {
        stopGame("lose");
        lose = true;
      }
      break;
    case "left":
      if (
        (snakeArray[0] - 1) % boardWidth != boardWidth - 1 &&
        !snakeArray.includes(snakeArray[0] - 1) &&
        snakeArray[0] - 1 >= 0
      ) {
        if (snakeArray[0] - 1 == growBlock) {
          grow = true;
          score += 100 / speed;
          growSnake(growBlock);
        } else {
          snakeArray.unshift(snakeArray[0] - 1);
        }
      } else {
        stopGame("lose");
        lose = true;
      }
      break;
    case "right":
      if (
        (snakeArray[0] + 1) % boardWidth != 0 &&
        !snakeArray.includes(snakeArray[0] + 1)
      ) {
        if (snakeArray[0] + 1 == growBlock) {
          grow = true;
          score += 100 / speed;
          growSnake(growBlock);
        } else {
          snakeArray.unshift(snakeArray[0] + 1);
        }
      } else {
        stopGame("lose");
        lose = true;
      }
      break;
  }

  if (!grow) {
    lastBlock = snakeArray[snakeArray.length - 1];
    snakeArray.splice(snakeArray.indexOf(lastBlock), 1);
    boardArray.splice(boardArray.indexOf(snakeArray[0]), 1);
    boardArray.push(lastBlock);
  }

  if (!(grow && boardArray.length == 0) && !lose) {
    colorSnake();
  }
}

function growSnake(block) {
  eaten += 1;
  scoreCounter.innerText = score.toFixed(2);
  eatenCounter.innerText = eaten;
  snakeArray.unshift(block);
  boardArray.splice(boardArray.indexOf(block), 1);

  if (boardArray.length == 0) {
    gameGrid[snakeArray[0]].style.backgroundColor = "hotpink";
    stopGame("win");
  } else {
    createGrowBlock();
  }

  if (speedUpBox.checked) {
    if (eaten != 0 && eaten % 5 == 0 && speed > 30) {
      clearInterval(gameTicker);
      speedUp();
    }
  }
}

function createGrowBlock() {
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
  gameTicker = undefined;
  resultScreen.classList.add("show");

  if (state == "win") {
    resultMessage.innerText = "You Win!";
    console.log("You win!");
  } else {
    resultMessage.innerText = "You Lose.";
    console.log("You lose.");
  }

  restartButton.removeEventListener("click", setUpGame);
  restartButton.addEventListener("click", setUpGame);

  changeSettingsButton.removeEventListener("click", setUpStartMenu);
  changeSettingsButton.addEventListener("click", setUpStartMenu);
}
