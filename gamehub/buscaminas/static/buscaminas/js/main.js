const canvas = document.querySelector("canvas");
const scoreElement = document.getElementById("score");
const finalScore = document.getElementById("final-score");
const gameOver = document.getElementById("game-over");

let score = 0;
const context = canvas.getContext("2d");

const BLOCK_SIZE = 28;
const BOARD_WIDTH = 24;
const BOARD_HEIGHT = 20;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// Text colors
const COLORS = [
  "green",
  "orange",
  "blue",
  "violet",
  "red",
  "pink",
  "black",
  "yellow",
];

// Mine Colors
const MINE_COLORS = [
  "#3948FF",
  "#7239FF",
  "#CC39FF",
  "#FF39D8",
  "#FF3978",
  "#FF5739",
  "#D9AE00",
  "#FF1818",
];

const ICON_MINE_COLORS = [
  "#3D1134",
  "#25113D",
  "#7D4000",
  "#00097D",
  "#46007D",
  "#7B007D",
  "#7D0031",
  "#7D0000",
];

function startBoard(size) {
  return [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
}

// BOARD
let board = startBoard(10);

function generateMines(num) {
  for (let i = 0; i < num; i++) {
    board[Math.floor(Math.random() * board.length)][
      Math.floor(Math.random() * board[0].length)
    ] = 2;
  }
}

function paint(color, x, y) {
  context.fillStyle = color;
  context.fillRect(x, y, 1, 1);
}

function update() {
  draw();
  window.requestAnimationFrame(update);
}

function calculateAdyacentMines(x, y) {
  let counter = 0;
  const combinations = [
    {
      indexX: x - 1,
      indexY: y,
    },
    {
      indexX: x - 1,
      indexY: y - 1,
    },
    {
      indexX: x - 1,
      indexY: y + 1,
    },
    {
      indexX: x + 1,
      indexY: y,
    },
    {
      indexX: x + 1,
      indexY: y - 1,
    },
    {
      indexX: x + 1,
      indexY: y + 1,
    },
    {
      indexX: x,
      indexY: y + 1,
    },
    {
      indexX: x,
      indexY: y - 1,
    },
  ];

  for (const c of combinations) {
    // const value = board[c?.indexX][c?.indexY]
    if (
      c.indexX >= 0 &&
      c.indexX < board.length &&
      c.indexY >= 0 &&
      c.indexY < board[0].length
    ) {
      if (board[c.indexX][c.indexY] === 2 || board[c.indexX][c.indexY] === 3) {
        counter += 1;
      }
    }
  }

  return counter;
}

function recursive(x, y) {
  const combinations = [
    {
      indexX: x - 1,
      indexY: y,
    },
    {
      indexX: x - 1,
      indexY: y - 1,
    },
    {
      indexX: x - 1,
      indexY: y + 1,
    },
    {
      indexX: x + 1,
      indexY: y,
    },
    {
      indexX: x + 1,
      indexY: y - 1,
    },
    {
      indexX: x + 1,
      indexY: y + 1,
    },
    {
      indexX: x,
      indexY: y + 1,
    },
    {
      indexX: x,
      indexY: y - 1,
    },
  ];

  const counter = calculateAdyacentMines(x, y);

  // Base case
  if (counter > 0) {
    board[x][y] = 1;
    score += 5;
    scoreElement.innerText = score;
    return;
  }

  for (const c of combinations) {
    if (
      c.indexX >= 0 &&
      c.indexX < board.length &&
      c.indexY >= 0 &&
      c.indexY < board[0].length
    ) {
      if (board[c.indexX][c.indexY] === 0) {
        board[x][y] = 1;
        recursive(c.indexX, c.indexY);
      }
    }
  }
}

function showMines() {
  board.forEach((row, y) => {
    row.forEach((col, x) => {
      setTimeout(() => {
        if (col === 2) {
          board[y][x] = 3;
        }
      }, 1000);
    });
  });
  // update()
}

// Obtener el csrf token de la cookie
function getCSRFToken() {
  const cookieValue = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrftoken="))
    .split("=")[1];
  return cookieValue;
}

canvas.addEventListener("mousedown", (e) => {
  const ax = e.clientX - 300 - canvas.offsetLeft;
  const ay = e.clientY - 106 - canvas.offsetTop;
  const x = parseInt(Math.floor(ax, BLOCK_SIZE) / BLOCK_SIZE);
  const y = parseInt(Math.floor(ay, BLOCK_SIZE) / BLOCK_SIZE);

  console.log(e.clientX, canvas.offsetLeft, e.clientY, canvas.offsetTop);
  if (board[y][x] === 2 || board[y][x] === 3) {
    board[y][x] = 3;
    finalScore.innerText = score;
    gameOver.classList.toggle("modal-show");
    showMines();
    
    const csrfToken = getCSRFToken()

    fetch("/matchcore/match/buscaminas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        game: "Buscaminas",
        duration: 0,
        player1_attempts: 1,
        points_awarded: score,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    recursive(y, x);
  }

  update();
});

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "bold 0.7pt Arial";
  context.textBaseline = "top";
  context.textAlign = "start";

  board.forEach((row, y) => {
    row.forEach((col, x) => {
      const counter = calculateAdyacentMines(y, x);
      context.strokeStyle = "#fff";

      if (((y % 2 === 0) & (x % 2 !== 0)) | ((y % 2 !== 0) & (x % 2 === 0))) {
        if (col === 1) {
          paint("#d7b899", x, y);
          context.fillStyle = COLORS[counter - 1];
          context.fillText(counter.toString(), x + 0.2, y + 0.1);
        } else {
          paint("#a2d149", x, y);
        }
      } else {
        if (col === 1) {
          paint("#e5c29f", x, y);

          context.fillStyle = COLORS[counter - 1];
          context.fillText(counter.toString(), x + 0.2, y + 0.1);
        } else {
          paint("#aad751", x, y);
        }
      }

      if (col === 3) {
        const color = MINE_COLORS[Math.floor((x * y) % COLORS.length)];
        paint(color, x, y);
        context.fillStyle =
          ICON_MINE_COLORS[Math.floor((x * y) % COLORS.length)];
        context.fillText("⊗", x + 0.1, y + 0.1);
      }
    });
  });
}

function start() {
  generateMines(100);
  update();
}

document.getElementById("btn-restart").addEventListener("click", () => {
  score = 0;
  board = startBoard(10);
  gameOver.classList.toggle("modal-show");
  start();
});

document.getElementById("btn-exit").addEventListener("click", () => {
  window.location.href = "http://10.241.24.109:8000/dashboard/";
});

start();
