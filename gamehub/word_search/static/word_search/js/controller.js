let optionContainer = null;
let game = null;
let words = [];
const wordAttributes = [];
const gridSize = 10;
const board = document.getElementById("board");
const attemptsOutput = document.querySelector(".attempts output");
let grid = [];
let attempts = 0;
let foundWords = 0;
let interval = null;
let failedWordCount = 0;
let score = 0;
// Actualizar
function updateAttempts() {
  attempts++;
  attemptsOutput.textContent = attempts;
}

// Completar Selección
function checkCompletion() {
  if (foundWords === (words.length - failedWordCount)) {
    failedWordCount = 0;
    


    // Obtener información adicional
    const duration = calculateTimerInSeconds();
    
    const difficulty = document.getElementById("difficultySpan").textContent;
    const category = document.getElementById("categorySpan").textContent;

    
    let message = `¡Felicidades, has encontrado todas las palabras!\nTime: ${duration}\nAttempts: ${attempts}\nDifficulty: ${difficulty}\nCategory: ${category}`;

    
    alert(message);
    clearInterval(interval);
    checkResetButton();
    disableBoard();
  }
}

// Iniciar Grilla
function initGrid() {
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = { letter: "", element: null, partOfWord: false, x: i, y: j };
    }
  }
}

//  FillGrid
function fillGrid() {
  // Recorrer palabras
  words.forEach((word) => {
    let placed = false;
    let attemptCount = 0;
    const maxAttempts = 100;

    
    while (!placed && attemptCount < maxAttempts) {
      const direction = Math.floor(Math.random() * 4);
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);
      placed = tryPlaceWord(word, startRow, startCol, direction);
      attemptCount++;
    }

    if (!placed) {
      console.log(`No se pudo colocar la palabra: ${word}`);
      removeWordFromList(word);
      failedWordCount++;
    }
  });

  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (!grid[i][j].partOfWord) {
        grid[i][j].letter = getRandomLetter();
      }
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = grid[i][j].letter;
      cell.dataset.x = i;
      cell.dataset.y = j;
      board.appendChild(cell);
      grid[i][j].element = cell;

      cell.addEventListener("mousedown", startSelection);
      cell.addEventListener("mouseenter", expandSelection);
      cell.addEventListener("mouseup", endSelection);
    }
  }
}


function tryPlaceWord(word, row, col, dir) {
  let coords = [];
  for (let i = 0; i < word.length; i++) {
    let newRow = row;
    let newCol = col;

    if (dir === 0) newCol += i; 
    if (dir === 1) newRow += i; 
    if (dir === 2) {
      newRow += i;
      newCol += i;
    } 
    if (dir === 3) {
      newRow += i;
      newCol -= i;
    } 

    if (
      newCol < 0 ||
      newCol >= gridSize ||
      newRow < 0 ||
      newRow >= gridSize ||
      grid[newRow][newCol].partOfWord
    ) {
      return false;
    }
    coords.push({ row: newRow, col: newCol });
  }

  coords.forEach((coord, index) => {
    grid[coord.row][coord.col].letter = word[index];
    grid[coord.row][coord.col].partOfWord = true;
  });

  return true;
}

// Genérar letras aleatoria
function getRandomLetter() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

let currentSelection = [];
let selecting = false;
let lastSelected = null;


function areAdjacent(cell1, cell2) {
  const dx = Math.abs(cell1.dataset.x - cell2.dataset.x);
  const dy = Math.abs(cell1.dataset.y - cell2.dataset.y);
  return dx <= 1 && dy <= 1;
}

// Iniciar Selección
function startSelection(event) {
  if (!selecting) {
    selecting = true;
    currentSelection = [event.target];
    lastSelected = event.target;
    event.target.classList.add("selected");
    
  }
}

// Expandir Selección
function expandSelection(event) {
  if (
    selecting &&
    areAdjacent(lastSelected, event.target) &&
    !currentSelection.includes(event.target)
  ) {
    currentSelection.push(event.target);
    event.target.classList.add("selected");
    lastSelected = event.target;
  }
}

// Terminar Selección
function endSelection(event) {
  selecting = false;
  const selectedWord = currentSelection.map((el) => el.textContent).join("");

  let validSelection = false;

  // Verificar si la selección es horizontal, vertical o diagonal (pero solo una de ellas)
  if (currentSelection.length > 1) {
    const firstRow = parseInt(currentSelection[0].dataset.x);
    const firstCol = parseInt(currentSelection[0].dataset.y);
    const secondRow = parseInt(currentSelection[1].dataset.x);
    const secondCol = parseInt(currentSelection[1].dataset.y);

    const rowDiff = Math.abs(firstRow - secondRow);
    const colDiff = Math.abs(firstCol - secondCol);

    if (
      (rowDiff === 0 && colDiff > 0) ||
      (colDiff === 0 && rowDiff > 0) ||
      (rowDiff === colDiff && rowDiff > 0)
    ) {
      validSelection = true;
    }
  }

  if (validSelection && words.includes(selectedWord)) {
    actualColor = randomColor();
    currentSelection.forEach((el) => {
      el.classList.add("found");
      el.style.backgroundColor = actualColor;
    });
    const wordElement = document.querySelector(
      `li[data-word="${selectedWord}"]`
    );
    if (wordElement && !wordElement.classList.contains("found")) {
      wordElement.classList.add("found");
      foundWords++;
      checkCompletion();
    }
  } else {
    currentSelection.forEach((el) => el.classList.remove("selected"));
  }

  updateAttempts();
  currentSelection = [];
  lastSelected = null;
}

// display Words
function displayWords() {
  words.forEach((word) => {
    const wordElement = document.createElement("li");
    wordElement.textContent = word;
    wordElement.dataset.word = word;
   
  });
}


document
  .getElementById("start-game")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;

    if (!category || !difficulty) {
      alert("Por favor, selecciona una categoría y una dificultad.");
      return;
    }

    fetch(`/words/api/get-words?category=${category}&difficulty=${difficulty}`)
      .then((response) => response.json())
      .then((data) => {
        updateWordsList(data.words);
        document.getElementById("categorySpan").textContent = data.category;
        document.getElementById("difficultySpan").textContent = data.difficulty;
        document.getElementById("game").style.display = "flex";
        document.getElementById("options-container").style.display = "none";
        const wordElements = document.querySelectorAll("li[data-word]");
        const wordAttributes = Array.from(wordElements).map((el) =>
          normalizeWord(el.getAttribute("data-word"))
        );

        words = [...wordAttributes];

        // Iniciar el juego
        initGrid();
        fillGrid();

        startCronometer();
      })
      .catch((error) => console.error("Error de fetching de palabras:", error));
  });

function updateWordsList(words) {
  const wordList = document.getElementById("wordList");
  wordList.innerHTML = "";
  if (words.length > 0) {
    words = words.map((word) => normalizeWord(word));
    words.forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word;
      li.dataset.word = word;
      wordList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No hay palabras disponibles.";
    wordList.appendChild(li);
  }
}

// Agregar color aleatorio a la selección
function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  let brightness = 0;
  while (brightness < 128) {
    color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    brightness = calculateBrightness(color);
  }
  return color;
}

// Calcular Brightness
function calculateBrightness(color) {
  const hex = color.substring(1);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness;
}

// Normalizar las palabras
function normalizeWord(word) {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .trim()
    .toUpperCase();
}

// Función para mantener el tiempo transcurrido desde el inicio del juego
function startCronometer() {
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let cronometer = document.getElementById("cronometer");
  interval = setInterval(function () {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }
    cronometer.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
  return interval;
}

function removeWordFromList(word) {
  const wordList = document.getElementById("wordList");
  const wordElements = wordList.querySelectorAll(`li[data-word="${word}"]`);
  wordElements.forEach((el) => el.remove());
}

//Funcionalidad Fin del juego


let gameEnded = false;


document.getElementById("end-game").addEventListener("click", function () {
  gameEnded = true;
  console.log(gameEnded);
  
  alert("¡Juego terminado!");
  
  checkResetButton();
  
  disableBoard();
});

// Obtener el csrf token de la cookie
function getCSRFToken() {
  const cookieValue = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrftoken="))
    .split("=")[1];
  return cookieValue;
}

// Función para verificar y mostrar el botón de reinicio si es necesario
function checkResetButton() {
  console.log(gameEnded);
  const timeString = document.getElementById("cronometer").textContent;
  
  const resetButton = document.getElementById("reset-game");
  if (gameEnded === true || foundWords === (words.length - failedWordCount)) {
    const scoreContainer = document.getElementById("score-container");
    document.getElementById("end-game").style.display = "none";
    resetButton.style.display = "flex";
    scoreContainer.style.display = "flex";

    if (gameEnded || foundWords === (words.length - failedWordCount)) {
      clearInterval(interval);
    }
    const scoreElement = document.getElementById("score");

    scoreElement.textContent = calculateScore();
    
    const csrfToken = getCSRFToken()

    fetch("/matchcore/match/word_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        game: "Sopa de Letras",
        duration: timeString, // Duracion del juego
        player1_attempts: attempts, // Cantidad de intentos
        points_awarded: parseInt(scoreElement.textContent), // Puntuacion 
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// Función para deshabilitar el tablero
function disableBoard() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.removeEventListener("mousedown", startSelection);
    cell.removeEventListener("mouseenter", expandSelection);
    cell.removeEventListener("mouseup", endSelection);
    cell.style.pointerEvents = "none";
  });
}

const resetButton = document.getElementById("reset-game");
resetButton.addEventListener("click", function () {
  location.reload(); // Recargar la página para reiniciar el juego
});

resetButton.addEventListener("click", function () {
  location.reload();
});

// Función para calcular la puntuación
function calculateScore() {
  
  const difficulty = document
    .getElementById("difficultySpan")
    .textContent.toLowerCase();
  const wordsFound = foundWords; // Palabras encontradas
  const totalWords = words.length; // Palabras totales
  const totalAttempts = attempts; // Intentos
  const timer = calculateTimerInSeconds(); // Tiempo en segundos

  let scoreMultiplier = 0;
  if (difficulty === "easy") {
    scoreMultiplier = 2000;
  } else if (difficulty === "medium") {
    scoreMultiplier = 3000 / 1.5;
  } else if (difficulty === "hard") {
    scoreMultiplier = 4000 / 2;
  }

  if (totalAttempts === 0 || timer === 0 || wordsFound === 0) {
  } else {
    if (timer < 1) {
      score = scoreMultiplier * ((wordsFound * (0.6 - timer)) / totalWords);
    } else {
      score = scoreMultiplier * (wordsFound / (totalWords * (6 - timer / 60)));
    }
  }

  return Math.round(score);
}

// Función para calcular el tiempo transcurrido desde el inicio del juego en segundos
function calculateTimerInSeconds() {
  const timeString = document.getElementById("cronometer").textContent;
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds / 100;
}
