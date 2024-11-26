// Variables globales
let judgeDecisions = ["", "", ""]; // Almacena la decisión de cada juez
let resultsLocked = false; // Bloquea cambios cuando se muestran los resultados

// Función para manejar la selección de decisión de un juez
function selectJudgeDecision(judgeIndex, decision) {
  if (resultsLocked) return; // No permitir cambios si los resultados están bloqueados

  // Guardar la decisión del juez
  judgeDecisions[judgeIndex - 1] = decision;

  // Obtener todos los botones del juez correspondiente
  const buttons = document.querySelectorAll(`.mobile:nth-child(${judgeIndex}) .judge-button`);
  buttons.forEach(button => {
    // Remover la clase "selected" de todos los botones
    button.classList.remove("selected");
    button.classList.add("faded"); // Opacar todos los botones
  });

  // Resaltar el botón seleccionado
  const selectedButton = document.querySelector(`.mobile:nth-child(${judgeIndex}) .judge-button.${decision}`);
  if (selectedButton) {
    selectedButton.classList.add("selected");
    selectedButton.classList.remove("faded");
  }

  // Actualizar resultados en tiempo real en la Tablet
  updateTabletJudgeResult(judgeIndex, decision);

  // Verificar si todos los jueces han decidido
  checkAllJudgesDecided();
}

// Función para actualizar los resultados en la Tablet
function updateTabletJudgeResult(judgeIndex, decision) {
  const barsContainer = document.querySelector(`.tablet #judge${judgeIndex}-bars`);
  barsContainer.innerHTML = ""; // Limpiar contenido anterior

  // Mostrar barras en la Tablet como en la TV
  if (decision === "blue" || decision === "red") {
    const bar = document.createElement("div");
    bar.className = `bar ${decision}`; // Clase basada en la decisión del juez
    bar.style.height = "20px";
    bar.style.width = "100%";
    barsContainer.appendChild(bar); // Añadir la barra al contenedor
  } else if (decision === "draw") {
    // Crear una barra dividida para empate
    const barBlue = document.createElement("div");
    barBlue.className = "bar blue";
    barBlue.style.height = "20px";
    barBlue.style.width = "50%";
    barBlue.style.float = "left";

    const barRed = document.createElement("div");
    barRed.className = "bar red";
    barRed.style.height = "20px";
    barRed.style.width = "50%";
    barRed.style.float = "left";

    barsContainer.appendChild(barBlue);
    barsContainer.appendChild(barRed);
  }
}

// Función para mostrar resultados en la TV
function showResults() {
  if (resultsLocked) return; // Evitar ejecutar múltiples veces

  resultsLocked = true; // Bloquear cambios en las decisiones

  // Contar los votos de cada juez
  const blueVotes = judgeDecisions.filter(decision => decision === "blue").length;
  const redVotes = judgeDecisions.filter(decision => decision === "red").length;
  const totalJudges = judgeDecisions.length;
  const halfJudges = Math.ceil(totalJudges / 2); // La mitad o más necesaria para ganar

  // Determinar el ganador
  let winnerText = "Empate"; // Por defecto es empate
  let winnerColor = "white"; // Color del texto por defecto

  if (blueVotes >= halfJudges) {
    winnerText = "Ganador Azul";
    winnerColor = "blue";
  } else if (redVotes >= halfJudges) {
    winnerText = "Ganador Rojo";
    winnerColor = "red";
  }

  // Mostrar el mensaje del ganador
  const winnerElement = document.querySelector(".winner-message");
  winnerElement.textContent = winnerText;
  winnerElement.style.color = winnerColor;
  winnerElement.style.display = "block"; // Asegurarse de que el mensaje sea visible

  // Actualizar los puntajes en la TV
  document.getElementById("blue-score").textContent = blueVotes;
  document.getElementById("red-score").textContent = redVotes;

  // Mostrar las barras de los jueces en la TV
  judgeDecisions.forEach((decision, index) => {
    const barsContainer = document.getElementById(`judge${index + 1}-bars`);
    barsContainer.innerHTML = ""; // Limpiar las barras existentes

    if (decision === "blue" || decision === "red") {
      const bar = document.createElement("div");
      bar.className = `bar ${decision}`; // Clase basada en la decisión del juez
      bar.style.height = "20px";
      bar.style.width = "100%";
      barsContainer.appendChild(bar); // Añadir la barra al contenedor
    } else if (decision === "draw") {
      // Crear una barra dividida para empate
      const barBlue = document.createElement("div");
      barBlue.className = "bar blue";
      barBlue.style.height = "20px";
      barBlue.style.width = "50%";
      barBlue.style.float = "left";

      const barRed = document.createElement("div");
      barRed.className = "bar red";
      barRed.style.height = "20px";
      barRed.style.width = "50%";
      barRed.style.float = "left";

      barsContainer.appendChild(barBlue);
      barsContainer.appendChild(barRed);
    }
  });
}

// Función para reiniciar el combate
function resetCombat() {
  // Restablecer decisiones y desbloquear resultados
  judgeDecisions = ["", "", ""];
  resultsLocked = false;

  // Limpiar puntajes
  document.getElementById("blue-score").textContent = "0";
  document.getElementById("red-score").textContent = "0";

  // Limpiar barras en la Tablet y TV
  for (let i = 1; i <= 3; i++) {
    // Limpiar la Tablet
    const tabletBarsContainer = document.querySelector(`.tablet #judge${i}-bars`);
    if (tabletBarsContainer) tabletBarsContainer.innerHTML = "";

    // Limpiar la TV
    const tvBarsContainer = document.getElementById(`judge${i}-bars`);
    if (tvBarsContainer) tvBarsContainer.innerHTML = "";
  }

  // Restablecer los botones de los celulares de los jueces
  const buttons = document.querySelectorAll(".judge-button");
  buttons.forEach(button => {
    button.classList.remove("selected"); // Quitar resaltado
    button.classList.remove("faded"); // Quitar opacidad
  });

  // Ocultar el mensaje de ganador
  const winnerElement = document.querySelector(".winner-message");
  winnerElement.textContent = ""; // Vaciar el texto del mensaje
  winnerElement.style.display = "none"; // Ocultar el mensaje

  // Deshabilitar el botón de "Mostrar Resultados"
  const showResultsButton = document.getElementById("show-results-button");
  showResultsButton.disabled = true;
  showResultsButton.classList.remove("enabled");
  showResultsButton.classList.add("disabled");
}

// Función para verificar si todos los jueces han decidido
function checkAllJudgesDecided() {
  const allDecided = judgeDecisions.every(decision => decision !== ""); // Verificar que no haya valores vacíos
  const showResultsButton = document.getElementById("show-results-button");

  if (allDecided) {
    showResultsButton.disabled = false; // Habilitar el botón
    showResultsButton.classList.remove("disabled");
    showResultsButton.classList.add("enabled");
  } else {
    showResultsButton.disabled = true; // Deshabilitar el botón
    showResultsButton.classList.remove("enabled");
    showResultsButton.classList.add("disabled");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".display-section, .tablet-section, .mobile-section"); // Seleccionamos todas las secciones

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible"); // Cuando entra en la vista, se agrega la clase para la animación
      }
    });
  }, {
    threshold: 0 // La sección debe empezar a ser visible (su borde superior) para que la animación se active
  });

  sections.forEach((section) => {
    section.classList.add("section-animate"); // Aseguramos que las secciones tengan la clase de animación al cargar
    observer.observe(section); // Observar cada sección
  });
});