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
      }
    }, 1000);
    timerDisplay.classList.remove("stopped");
    timerDisplay.classList.add("running");
  }
}

