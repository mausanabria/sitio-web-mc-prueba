let isTimerRunning = false; // Estado del cronómetro
let timerInterval = null;   // Referencia al intervalo del cronómetro
let remainingTime = 120;    // Tiempo inicial en segundos (2 minutos)
let blueScore = 0;
let redScore = 0;
let warningsBlue = 0;
let warningsRed = 0;
let judgesScores = [
  { blue: 0, red: 0 },
  { blue: 0, red: 0 },
  { blue: 0, red: 0 },
  { blue: 0, red: 0 },
];

// Obtener los botones
const setTimeButton = document.getElementById("set-time-button");
const resultsButton = document.getElementById("show-results-button");
const resetButton = document.getElementById("reset-button");

// Función para habilitar un botón y aplicar el estilo correspondiente
function enableButton(button) {
  button.disabled = false;
  button.classList.remove("disabled");
  button.classList.add("enabled");
}

// Función para deshabilitar un botón y aplicar el estilo correspondiente
function disableButton(button) {
  button.disabled = true;
  button.classList.remove("enabled");
  button.classList.add("disabled");
}


// Ajustar puntajes generales
function adjustScore(color, value) {
  if (color === "blue") {
    blueScore = Math.max(0, blueScore + value);
  } else {
    redScore = Math.max(0, redScore + value);
  }
  updateScores();
}

// Agregar advertencias
function addWarning(color) {
  if (color === "blue") {
    warningsBlue++;
    if (warningsBlue % 3 === 0) adjustScore("blue", -1);
  } else {
    warningsRed++;
    if (warningsRed % 3 === 0) adjustScore("red", -1);
  }
  updateScores();
}


function adjustDirectScore(color, value) {
  if (!isTimerRunning) {
    alert("¡El cronómetro debe estar corriendo para marcar puntos!");
    return;
  }

  // Determinar el oponente
  let opponentColor = color === "blue" ? "red" : "blue";

  // Sumar puntos al oponente en cada juez
  judgesScores.forEach((judge) => {
    if (opponentColor === "blue") {
      judge.blue += Math.abs(value); // Asegurarse de que se sume siempre un valor positivo
    } else if (opponentColor === "red") {
      judge.red += Math.abs(value);
    }
  });

  // Actualizar la pantalla
  updateJudgeScores();
  calculateOverallScores();
}




// Ajustar puntos por juez
function addJudgeScore(judgeIndex, color, value) {
  if (!isTimerRunning) {
    alert("¡El cronómetro debe estar corriendo para marcar puntos!");
    return;
  }

  const judge = judgesScores[judgeIndex - 1];
  if (color === "blue") {
    judge.blue += value;
  } else if (color === "red") {
    judge.red += value;
  }

  updateJudgeScores();
  calculateOverallScores();
}

// Actualizar puntajes generales de los competidores según los jueces
function calculateOverallScores() {
  let blueWinningJudges = 0;
  let redWinningJudges = 0;

  judgesScores.forEach((score) => {
    const diff = score.blue - score.red;
    if (diff > 0) {
      blueWinningJudges++; // Juez favorece a azul
    } else if (diff < 0) {
      redWinningJudges++; // Juez favorece a rojo
    }
  });

  // Ajustar los puntajes generales con los jueces que los favorecen
  blueScore = blueWinningJudges;
  redScore = redWinningJudges;
  updateScores();
}

// Actualizar la pantalla
function updateScores() {
  document.getElementById("blue-score").textContent = blueScore;
  document.getElementById("red-score").textContent = redScore;
}

// Actualizar resultados por juez y las barras
function updateJudgeScores() {
  judgesScores.forEach((score, index) => {
    const diff = score.blue - score.red;
    const barsContainer = document.getElementById(`judge${index + 1}-bars`);
    barsContainer.innerHTML = ""; // Limpia las barras

    const barsCount = Math.abs(diff);
    for (let i = 0; i < barsCount; i++) {
      const bar = document.createElement("div");
      bar.className = "bar " + (diff > 0 ? "blue" : "red");
      barsContainer.appendChild(bar);
    }
  });
}

function toggleTimer() {
  const timerDisplay = document.getElementById("timer");

  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerDisplay.classList.remove("running");
    timerDisplay.classList.add("stopped");

    // Habilitar el botón "Establecer tiempo"
    enableButton(setTimeButton);

    // Deshabilitar botones relacionados con acciones del combate
    disableButton(document.querySelector(".control-button-blue"));
    disableButton(document.querySelector(".control-button-red"));
  } else {
    isTimerRunning = true;
    timerInterval = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
        const seconds = (remainingTime % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerDisplay.classList.remove("running");
        timerDisplay.classList.add("stopped");

        // Habilitar el botón de resultados
        enableButton(resultsButton);
      }
    }, 1000);
    timerDisplay.classList.remove("stopped");
    timerDisplay.classList.add("running");

    // Deshabilitar el botón "Establecer tiempo"
    disableButton(setTimeButton);

    // Habilitar botones relacionados con acciones del combate
    enableButton(document.querySelector(".control-button-blue"));
    enableButton(document.querySelector(".control-button-red"));
  }
}




// Nueva función para incrementar advertencias
function incrementWarning(color) {
  if (!isTimerRunning) {
    alert("¡El cronómetro debe estar corriendo para emitir advertencias!");
    return;
  }

  if (color === "blue") {
    warningsBlue++;
    if (warningsBlue % 3 === 0) {
      applyJudgePenalty("blue");
    }
  } else if (color === "red") {
    warningsRed++;
    if (warningsRed % 3 === 0) {
      applyJudgePenalty("red");
    }
  }

  // Actualizar los puntajes en pantalla
  updateScores();
  updateJudgeScores();
}


// Aplicar penalización a todos los jueces
function applyJudgePenalty(color) {
  judgesScores.forEach((judge) => {
    if (color === "blue") {
      if (judge.blue > 0) {
        judge.blue = Math.max(0, judge.blue - 1); // Resta un punto a azul si tiene puntos
      } else {
        judge.red += 1; // Si azul no tiene puntos, da un punto a rojo
      }
    } else if (color === "red") {
      if (judge.red > 0) {
        judge.red = Math.max(0, judge.red - 1); // Resta un punto a rojo si tiene puntos
      } else {
        judge.blue += 1; // Si rojo no tiene puntos, da un punto a azul
      }
    }
  });

  // Actualizar los puntajes de los jueces y el marcador general
  updateJudgeScores();
  calculateOverallScores();
}


document.querySelector(".control-button-blue").addEventListener("click", () => incrementWarning("blue"));
document.querySelector(".control-button-red").addEventListener("click", () => incrementWarning("red"));

function showResults() {
  // Elimina cualquier mensaje previo
  const existingMessage = document.querySelector(".winner-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Determina el ganador
  let winnerText = "";
  let winnerColor = "white";
  if (blueScore > redScore) {
    winnerText = "Ganador Azul";
    winnerColor = "blue";
  } else if (redScore > blueScore) {
    winnerText = "Ganador Rojo";
    winnerColor = "red";
  } else {
    winnerText = "Empate";
  }

  // Crea el mensaje del ganador
  const messageElement = document.createElement("div");
  messageElement.classList.add("winner-message");
  messageElement.textContent = winnerText;
  messageElement.style.color = winnerColor;

  // Inserta el mensaje en el contenedor principal de la TV
  const tvContainer = document.querySelector(".tv");
  tvContainer.appendChild(messageElement);
}

function setCustomTime() {
  // Obtener los valores de los campos de entrada
  const inputMinutes = parseInt(document.getElementById("input-minutes").value);
  const inputSeconds = parseInt(document.getElementById("input-seconds").value);

  // Validar que los valores sean números válidos
  if (isNaN(inputMinutes) || isNaN(inputSeconds)) {
    alert("Por favor, ingresa un valor válido para minutos y segundos.");
    return;
  }

  // Validar que los segundos estén en el rango 0-59
  if (inputSeconds < 0 || inputSeconds > 59) {
    alert("Los segundos deben estar entre 0 y 59.");
    return;
  }

  // Calcular el tiempo total en segundos
  const totalSeconds = (inputMinutes * 60) + inputSeconds;

  // Asignar el tiempo calculado al cronómetro
  remainingTime = totalSeconds;

  // Mostrar el tiempo en el formato adecuado (mm:ss)
  const timerDisplay = document.getElementById("timer");
  const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
  const seconds = (remainingTime % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function resetCombat() {
  // Eliminar cualquier mensaje de ganador
  const existingMessage = document.querySelector(".winner-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Restablecer puntajes
  blueScore = 0;
  redScore = 0;
  warningsBlue = 0;
  warningsRed = 0;

  // Restablecer los puntajes de los jueces
  judgesScores.forEach((judge) => {
    judge.blue = 0;
    judge.red = 0;
  });

  // Restablecer el tiempo
  remainingTime = 10;
  const timerDisplay = document.getElementById("timer");
  const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
  const seconds = (remainingTime % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;

  // Actualizar la pantalla de puntajes
  updateScores();
  updateJudgeScores();

  // Detener el cronómetro si está corriendo
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerDisplay.classList.remove("running");
    timerDisplay.classList.add("stopped");
  }

  // Habilitar el botón de "Establecer tiempo"
  enableButton(setTimeButton);

  // Habilitar el botón de resultados
  disableButton(resultsButton);
}
