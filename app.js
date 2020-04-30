'use strict';

const gridWidth = 42;
const gridHeight = 24;
const blockWidth = 20;

// Game Metrics
let gameMetrics = {
  width: gridWidth,
  height: gridHeight,
  currentIndex: 0,
  apples: [],
  eatenApples: [],
  snake: [], // first index = head, last index = tail
  nextDirection: 0, // Stores direction to change to in next interval
  direction: 0,
  score: 0,
  speed: 0,
  intervalTime: 0
};

document.addEventListener('DOMContentLoaded', () => {

  // Create grid
  let grid = document.getElementById('grid');
  grid.style.width = gridWidth * blockWidth + 'px';
  grid.style.height = gridHeight * blockWidth + 'px';
  for (let i = 0; i < gridWidth * gridHeight; i++) {
    let block = document.createElement('div');
    block.style.width = blockWidth + 'px';
    block.style.height = blockWidth + 'px';
    grid.appendChild(block);
  }

  const blocks = document.querySelectorAll('#grid div');
  const scoreDisplay = document.getElementById('score');
  const startBtn = document.getElementById('start');

  let interval = null;

  document.addEventListener('keyup', control);

  startBtn.addEventListener('click', startGame);

  // Start game
  function startGame() {

    // Clear grid
    gameMetrics['snake'].forEach((index) => {
      blocks[index].classList.remove('snake');
    })
    gameMetrics['apples'].forEach((index) => {
      blocks[index].classList.remove('apple');
    })

    clearInterval(interval);

    gameMetrics['score'] = 0;
    scoreDisplay.textContent = gameMetrics['score'];

    gameMetrics['intervalTime'] = 750;
    gameMetrics['currentIndex'] = 0;
    gameMetrics['direction'] = 1;
    gameMetrics['speed'] = 0.9;
    gameMetrics['snake'] = [2, 1, 0];
    gameMetrics['snake'].forEach((index) => {
      blocks[index].classList.add('snake')
    })
    gameMetrics['apples'] = [];
    genApple();
    gameMetrics['apples'].forEach((index) => {
      blocks[index].classList.add('apple')
    })

    interval = setInterval(move, gameMetrics['intervalTime']);
  }

  // Handles outcomes of snakes move
  function move() {
    let snake = gameMetrics['snake'];
    let snakeHead = snake[0];
    let width = gameMetrics['width'];
    let height = gameMetrics['height'];

    if (gameMetrics['nextDirection']) {
      gameMetrics['direction'] = gameMetrics['nextDirection'];
      gameMetrics['nextDirection'] = 0;
    }
    let direction = gameMetrics['direction'];

    // If snake hits border, wrap around to the other side of grid
    switch(direction) {
      case -1:
        if (snakeHead % width == 0) {
          snakeHead += width;
        }
        break;
      case -width:
        if (snakeHead < width) {
          snakeHead += width * height;
        }
        break;
      case 1:
        if (snakeHead % width == width - 1) {
          snakeHead -= width;
        }
        break;
      case width:
        if (snakeHead >= width * (height - 1)) {
          snakeHead = (snakeHead % width) - width;
        }
        break;
    }

    snakeHead += direction;

    // Check if snake ate apple
    let apples = gameMetrics['apples'];
    if (apples.includes(snakeHead)) {
      gameMetrics['score'] += 5;
      scoreDisplay.textContent = gameMetrics['score'];
      blocks[snakeHead].classList.remove('apple');
      apples.splice(apples.indexOf(snakeHead), 1);
      gameMetrics['eatenApples'].push(snakeHead);
      genApple();

      // Increase speed of snake
      clearInterval(interval);
      gameMetrics['intervalTime'] *= gameMetrics['speed'];
      interval = setInterval(move, gameMetrics['intervalTime']);
    }

    // If eaten apple has reached end of snake, leave original snake tail to
    // increase length of snake
    let snakeTail = snake.pop();
    let eatenApples = gameMetrics['eatenApples'];
    if (eatenApples.includes(snakeTail)) {
      snake.push(snakeTail)
      eatenApples.splice(eatenApples.indexOf(snakeTail), 1);
    } else {
      blocks[snakeTail].classList.remove('snake');
    }

    // Check for collision with self
    if (snake.includes(snakeHead)) {
      return clearInterval(interval);
    }

    snake.unshift(snakeHead);
    blocks[snakeHead].classList.add('snake');
  }

  // Generate new apple
  function genApple() {
    let appleIndex;
    do {
      appleIndex = Math.floor(Math.random() * blocks.length);
    } while (gameMetrics['snake'].includes(appleIndex) ||
        gameMetrics['apples'].includes(appleIndex))

    gameMetrics['apples'].push(appleIndex);
    blocks[appleIndex].classList.add('apple');
  }

  // Assign functions to keycodes
  function control (event) {

    if (gameMetrics['nextDirection']) {
      return;
    }

    let currDirection = gameMetrics['direction']
    switch(event.keyCode) {
      case 37:
        if (currDirection != 1) {
          gameMetrics['nextDirection'] = -1;
        }
        break;
      case 38:
        if (currDirection != gameMetrics['width']) {
          gameMetrics['nextDirection'] = -gameMetrics['width'];
        }
        break;
      case 39:
        if (currDirection != -1) {
          gameMetrics['nextDirection'] = 1;
        }
        break;
      case 40:
        if (currDirection != -gameMetrics['width']) {
          gameMetrics['nextDirection'] = gameMetrics['width'];
        }
        break;
      default:
        break;
    }
  }
})
