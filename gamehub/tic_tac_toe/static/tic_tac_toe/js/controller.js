document.addEventListener("DOMContentLoaded", function () {
  let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  let currentPlayer = "X";

  const boardElement = document.getElementById("board");
  const startGameButton = document.getElementById("start-game");
  const optionsForm = document.getElementById("options-form");

  const rollDiceButton = document.getElementById("roll-dice");
  rollDiceButton.addEventListener("click", rollDice);
  function drawBoard() {
    boardElement.innerHTML = "";
    board.forEach(function (row, rowIndex) {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");
      row.forEach(function (cell, colIndex) {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.row = rowIndex;
        cellElement.dataset.col = colIndex;
        cellElement.textContent = cell || "";
        cellElement.addEventListener("click", handleCellClick);
        rowElement.appendChild(cellElement);
      });
      boardElement.appendChild(rowElement);
    });
  }

  function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    if (!board[row][col] && !getWinner() && currentPlayer === "X") {
      makeMove(row, col);
    }
  }

  function makeMove(row, col) {
    board[row][col] = currentPlayer;
    drawBoard();
    const winner = getWinner();
    let result = "";
    if (winner) {
      result = "GANADOR";
      highlightWinningCells(winner);
      document.getElementById("sidebar").style.display = "flex";
      document.getElementById("winner-message").innerText =
        "GANADOR: " + winner;
      document.getElementById("winner-message").style.display = "block";
      if (winner !== "X") {
        result = "PERDEDOR";
      }
      const puntuacion = calcularPuntuacion(result, 0);
      document.getElementById("score").textContent =
        "Puntuación: " + puntuacion;
    } else if (isBoardFull()) {
      result = "EMPATE";
      document.getElementById("sidebar").style.display = "flex";
      document.getElementById("winner-message").innerText = "EMPATE";
      document.getElementById("winner-message").style.display = "block";
      if (document.getElementById("opponent").value === "hard") {
        showDiceButton();
      }
    } else {
      document.getElementById("sidebar").style.display = "none";
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (currentPlayer === "O") {
        if (document.getElementById("opponent").value === "easy") {
          makeComputerMoveEasy();
        } else if (document.getElementById("opponent").value === "hard") {
          makeComputerMoveHard();
        }
      }
    }
  }

  // Obtener el csrf token de la cookie
  function getCSRFToken() {
    const cookieValue = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("csrftoken="))
      .split("=")[1];
    return cookieValue;
  }

  function calcularPuntuacion(result, dado) {
    const dificultad = document.getElementById("opponent").value;
    let puntuacion = 0;

    const csrfToken = getCSRFToken();
    
    switch (result) {
      case "GANADOR":
        puntuacion = dificultad === "easy" ? 300 : 1000;
        fetch("/matchcore/match/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            game: "Tic Tac Toe",
            duration: 0,
            player1_attempts: 1,
            points_awarded: puntuacion,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Respuesta del servidor:", data.message);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        break;
      case "PERDEDOR":
        puntuacion = dificultad === "easy" ? 5 : 100;
        break;
      case "EMPATE":
        puntuacion = dificultad === "easy" ? 100 : 100 * dado;

        fetch("/matchcore/match/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            game: "Tic Tac Toe",
            points_awarded: puntuacion,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Respuesta del servidor:", data.message);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        break;
      default:
        break;
    }

    return puntuacion;
  }

  function showDiceButton() {
    document.getElementById("dice-container").style.display = "flex";
  }

  function rollDice() {
    var dice = document.getElementById("dice");
    document.getElementById("roll-dice").disabled = false;
    var randomNumber = Math.floor(Math.random() * 6) + 1;
    var finalRotationX =
      randomNumber === 1 || randomNumber === 3
        ? 0
        : randomNumber === 2 || randomNumber === 5
        ? 720
        : 1440;
    var finalRotationY =
      randomNumber === 1 || randomNumber === 6
        ? 0
        : randomNumber === 2 || randomNumber === 4
        ? 720
        : 1440;
    dice.style.transition = "transform 1.5s";
    dice.style.transform =
      "rotateX(" + finalRotationX + "deg) rotateY(" + finalRotationY + "deg)";

    setTimeout(function () {
      var faces = document.querySelectorAll(".face");
      faces.forEach((face) => {
        //Ocultar el número actual
        face.textContent = "";
      });
    }, 750);

    setTimeout(function () {
      updateDice(randomNumber);
    }, 760);
    document.getElementById("roll-dice").disabled = true;
  }

  function updateDice(number) {
    var faces = document.querySelectorAll(".face");
    faces.forEach((face) => {
      face.textContent = number; // Establece el contenido de todas las caras al número deseado
    });
    document.getElementById("result").innerHTML = number;
    document.getElementById("result").value = number;
    const puntuacion = calcularPuntuacion("EMPATE", number);
    document.getElementById("score").textContent = "Puntuación: " + puntuacion;
  }

  function highlightWinningCells(winner) {
    switch (winner) {
      case "X":
      case "O":
        for (let i = 0; i < 3; i++) {
          if (
            board[i][0] === winner &&
            board[i][1] === winner &&
            board[i][2] === winner
          ) {
            for (let j = 0; j < 3; j++) {
              document
                .querySelector(`.cell[data-row="${i}"][data-col="${j}"]`)
                .classList.add("winning");
            }
          }
        }

        for (let j = 0; j < 3; j++) {
          if (
            board[0][j] === winner &&
            board[1][j] === winner &&
            board[2][j] === winner
          ) {
            for (let i = 0; i < 3; i++) {
              document
                .querySelector(`.cell[data-row="${i}"][data-col="${j}"]`)
                .classList.add("winning");
            }
          }
        }

        if (
          board[0][0] === winner &&
          board[1][1] === winner &&
          board[2][2] === winner
        ) {
          for (let i = 0; i < 3; i++) {
            document
              .querySelector(`.cell[data-row="${i}"][data-col="${i}"]`)
              .classList.add("winning");
          }
        }
        if (
          board[0][2] === winner &&
          board[1][1] === winner &&
          board[2][0] === winner
        ) {
          for (let i = 0; i < 3; i++) {
            document
              .querySelector(`.cell[data-row="${i}"][data-col="${2 - i}"]`)
              .classList.add("winning");
          }
        }
        break;
      default:
        break;
    }
  }

  function getWinner() {
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] &&
        board[i][0] === board[i][1] &&
        board[i][0] === board[i][2]
      ) {
        return board[i][0];
      }
    }

    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i]
      ) {
        return board[0][i];
      }
    }

    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2]
    ) {
      return board[0][0];
    }
    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      return board[0][2];
    }
    return null;
  }

  function isBoardFull() {
    for (let row of board) {
      for (let cell of row) {
        if (!cell) {
          return false;
        }
      }
    }
    return true;
  }

  function resetOptions() {
    document.getElementById("opponent").value = "easy";
    optionsForm.style.display = "block";
    document.getElementById("board-container").style.display = "none";
    document.getElementById("reset-container").style.display = "none";
  }

  function resetGame() {
    board.forEach(function (row) {
      row.fill(null);
    });
    currentPlayer = "X";
    document.getElementById("options-container").style.display = "flex";
    document.getElementById("winner-message").style.display = "none";
    document.getElementById("sidebar").style.display = "none";
    document.getElementById("dice-container").style.display = "none";
    document.getElementById("roll-dice").disabled = false;
    calcularPuntuacion("EMPATE", 0);
    document.getElementById("score").textContent = 0;
    drawBoard();
    resetOptions();
  }

  document.getElementById("reset").addEventListener("click", resetGame);

  function setupGame() {
    currentPlayer = "X";
    startGameButton.disabled = true;
    document.getElementById("options-container").style.display = "none";
    document.getElementById("board-container").style.display = "flex";
    document.getElementById("reset-container").style.display = "flex";
    boardElement.style.pointerEvents = "none";
    document.getElementById("reset").disabled = false;

    drawBoard();

    if (currentPlayer === "X") {
      startGameButton.disabled = false;
      boardElement.style.pointerEvents = "auto";
      document.getElementById("reset").disabled = false;
      drawBoard();
      if (
        currentPlayer === "O" &&
        document.getElementById("opponent").value === "easy"
      ) {
        makeComputerMoveEasy();
      } else if (
        currentPlayer === "O" &&
        document.getElementById("opponent").value === "hard"
      ) {
        makeComputerMoveHard();
      }
    }
  }

  optionsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    setupGame();
  });

  startGameButton.addEventListener("click", function () {
    setupGame();
  });

  // Dificultad- Algoritmo de la PC
  function makeComputerMoveEasy() {
    setTimeout(() => {
      let emptyCells = [];
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!board[i][j]) {
            emptyCells.push({ row: i, col: j });
          }
        }
      }
      
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      makeMove(row, col);
    }, 1000);
  }

  function makeComputerMoveHard() {
    setTimeout(() => {
      let bestScore = -Infinity;
      let bestMove;

      
      function minimax(board, depth, isMaximizing) {
        const winner = getWinner();
        if (winner !== null) {
          return winner === "O" ? 1 : winner === "X" ? -1 : 0;
        }

        if (isBoardFull()) {
          return 0;
        }

        if (isMaximizing) {
          let maxScore = -Infinity;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              if (!board[i][j]) {
                board[i][j] = "O";
                const score = minimax(board, depth + 1, false);
                board[i][j] = null;
                maxScore = Math.max(score, maxScore);
              }
            }
          }
          return maxScore;
        } else {
          let minScore = Infinity;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              if (!board[i][j]) {
                board[i][j] = "X";
                const score = minimax(board, depth + 1, true);
                board[i][j] = null;
                minScore = Math.min(score, minScore);
              }
            }
          }
          return minScore;
        }
      }

      // Encuentra el mejor movimiento para la computadora usando el algoritmo minimax
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!board[i][j]) {
            board[i][j] = "O";
            const score = minimax(board, 0, false);
            board[i][j] = null;
            if (score > bestScore) {
              bestScore = score;
              bestMove = { row: i, col: j };
            }
          }
        }
      }

      
      makeMove(bestMove.row, bestMove.col);
    }, 1000); 
  }

  drawBoard();
});
