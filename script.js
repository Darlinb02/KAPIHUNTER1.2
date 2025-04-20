// Variables globales al principio del archivo
let scores = {
    1: 0,
    2: 0
};

let teamNames = {
    1: "Equipo 1",
    2: "Equipo 2"
};

const MAX_POINTS_PER_ROUND = 200; // Máximo de puntos por ronda
const WINNING_SCORE = 200;
let gameHistory = [];
let currentGame = {
    rounds: [],
    startTime: new Date()
};

let timerInterval;
let startTime;
let currentTeam = null; // Para el teclado numérico
let diamondRainInterval; // Para controlar la lluvia de diamantes
let timerPaused = false; // Estado del temporizador
let pausedTime = 0; // Tiempo acumulado cuando está pausado

// Función para iniciar el temporizador
function startTimer() {
    if (timerPaused) return; // No iniciar si está pausado
    
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Actualiza inmediatamente
}

// Función para actualizar el temporizador
function updateTimer() {
    if (timerPaused) return; // No actualizar si está pausado
    
    const now = new Date();
    const elapsed = now - startTime + pausedTime;
    
    // Convertir milisegundos a formato HH:MM:SS
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    document.getElementById('timer').textContent = 
        (hours < 10 ? '0' : '') + hours + ':' +
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds;
}

// Función para pausar/reanudar el temporizador
function toggleTimer() {
    const button = document.getElementById('timer-toggle');
    
    if (timerPaused) {
        // Reanudar el temporizador
        timerPaused = false;
        button.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Guardar el tiempo acumulado y reiniciar
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
    } else {
        // Pausar el temporizador
        timerPaused = true;
        button.innerHTML = '<i class="fas fa-play"></i>';
        
        // Calcular el tiempo transcurrido y detener el intervalo
        const now = new Date();
        pausedTime += (now - startTime);
        clearInterval(timerInterval);
    }
}

// Función para detener el temporizador
function stopTimer() {
    clearInterval(timerInterval);
    timerPaused = true;
    document.getElementById('timer-toggle').innerHTML = '<i class="fas fa-play"></i>';
}

// Función para reiniciar el temporizador
function resetTimer() {
    clearInterval(timerInterval);
    pausedTime = 0;
    timerPaused = false;
    document.getElementById('timer-toggle').innerHTML = '<i class="fas fa-pause"></i>';
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// Función para editar el nombre del equipo
function editTeamName(teamNumber) {
    const newName = prompt(`Nuevo nombre para ${teamNames[teamNumber]}:`, teamNames[teamNumber]);
    if (newName !== null && newName.trim() !== '') {
        teamNames[teamNumber] = newName.trim();
        document.getElementById(`teamName${teamNumber}`).textContent = newName.trim();
    }
}

// Función para mostrar el teclado numérico
function showNumpad(teamNumber) {
    currentTeam = teamNumber;
    document.getElementById('numpad-title').textContent = `Puntos para ${teamNames[teamNumber]} (1-${MAX_POINTS_PER_ROUND})`;
    document.getElementById('numpad-input').value = '';
    document.getElementById('numpad-modal').classList.remove('hidden');
}

// Función para ocultar el teclado numérico
function hideNumpad() {
    document.getElementById('numpad-modal').classList.add('hidden');
    currentTeam = null;
}

// Función para agregar un número al teclado
function addNumber(number) {
    const input = document.getElementById('numpad-input');
    // Limitar a 3 dígitos (máximo 200)
    if (input.value.length < 3) {
        input.value += number;
    }
}

// Función para limpiar el teclado
function clearNumpad() {
    document.getElementById('numpad-input').value = '';
}

// Función para enviar los puntos desde el teclado
function submitPoints() {
    if (currentTeam === null) return;
    
    const input = document.getElementById('numpad-input');
    let points = parseInt(input.value);
    
    // Validar entrada
    if (isNaN(points) || points < 1 || points > MAX_POINTS_PER_ROUND) {
        alert(`Por favor, ingrese un número válido entre 1 y ${MAX_POINTS_PER_ROUND}`);
        return;
    }
    
    // Registrar la ronda
    currentGame.rounds.push({
        team: currentTeam,
        teamName: teamNames[currentTeam],
        points: points,
        time: new Date()
    });
    
    // Actualizar puntaje
    scores[currentTeam] += points;
    document.getElementById(`score${currentTeam}`).textContent = scores[currentTeam];
    
    // Ocultar teclado
    hideNumpad();
    
    // Verificar si hay un ganador
    checkForWinner();
}

// Función para crear la lluvia de diamantes
function createDiamondRain() {
    const container = document.getElementById('diamond-rain');
    container.innerHTML = '';
    container.classList.remove('hidden');
    
    // Crear 50 diamantes
    for (let i = 0; i < 50; i++) {
        createDiamond(container);
    }
    
    // Agregar más diamantes periódicamente
    diamondRainInterval = setInterval(() => {
        if (container.childElementCount < 100) { // Limitar a 100 diamantes máximo
            createDiamond(container);
        }
    }, 300);
}

// Función para crear un solo diamante
function createDiamond(container) {
    const diamond = document.createElement('i');
    diamond.className = 'fas fa-gem diamond';
    
    // Posición aleatoria horizontal
    const left = Math.random() * 100;
    diamond.style.left = `${left}%`;
    
    // Tamaño aleatorio
    const size = 10 + Math.random() * 20;
    diamond.style.fontSize = `${size}px`;
    
    // Velocidad aleatoria (duración de la animación)
    const duration = 3 + Math.random() * 5;
    diamond.style.animationDuration = `${duration}s, 2s`;
    
    // Retraso aleatorio
    const delay = Math.random() * 2;
    diamond.style.animationDelay = `${delay}s, ${delay}s`;
    
    // Eliminar diamante después de que termine su animación
    setTimeout(() => {
        if (diamond.parentNode === container) {
            container.removeChild(diamond);
        }
    }, (duration + delay) * 1000);
    
    container.appendChild(diamond);
}

// Función para detener la lluvia de diamantes
function stopDiamondRain() {
    clearInterval(diamondRainInterval);
    const container = document.getElementById('diamond-rain');
    container.classList.add('hidden');
    setTimeout(() => {
        container.innerHTML = '';
    }, 1000);
}

// Función para verificar si hay un ganador
function checkForWinner() {
    let winner = null;
    
    if (scores[1] >= WINNING_SCORE) {
        winner = 1;
    } else if (scores[2] >= WINNING_SCORE) {
        winner = 2;
    }
    
    if (winner) {
        // Detener el temporizador
        stopTimer();
        
        // Guardar la partida en el historial
        saveGameToHistory(winner);
        
        // Iniciar la lluvia de diamantes
        createDiamondRain();
        
        // Mostrar mensaje de ganador en el centro de la pantalla
        const winnerElement = document.getElementById('winner');
        document.getElementById('winner-text').innerHTML = `¡${teamNames[winner]} ha ganado la partida!`;
        winnerElement.classList.remove('hidden');
    }
}

// Función para ocultar el mensaje del ganador
function hideWinner() {
    document.getElementById('winner').classList.add('hidden');
    stopDiamondRain();
}

// Función para guardar la partida en el historial
function saveGameToHistory(winner) {
    const endTime = new Date();
    const duration = endTime - currentGame.startTime;
    
    // Calcular duración en formato legible
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    const durationText = 
        (hours < 10 ? '0' : '') + hours + ':' +
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds;
    
    // Crear objeto para el historial
    const gameRecord = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        duration: durationText,
        winner: winner,
        winnerName: teamNames[winner],
        finalScores: {...scores},
        teamNames: {...teamNames},
        rounds: [...currentGame.rounds]
    };
    
    // Añadir al historial y guardar en localStorage
    gameHistory.unshift(gameRecord);
    localStorage.setItem('dominoGameHistory', JSON.stringify(gameHistory));
    
    // Actualizar la vista del historial
    updateHistoryView();
}

// Función para iniciar un nuevo juego
function newGame() {
    // Reiniciar puntajes
    scores = {1: 0, 2: 0};
    document.getElementById('score1').textContent = '0';
    document.getElementById('score2').textContent = '0';
    
    // Ocultar el mensaje del ganador y detener la lluvia
    hideWinner();
    
    // Reiniciar el juego actual
    currentGame = {
        rounds: [],
        startTime: new Date()
    };
    
    // Reiniciar y comenzar el temporizador
    resetTimer();
}

// Función para mostrar/ocultar el historial
function toggleHistory() {
    const modal = document.getElementById('history-modal');
    if (modal.classList.contains('hidden')) {
        updateHistoryView();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

// Función para actualizar la vista del historial
function updateHistoryView() {
    const historyContainer = document.getElementById('gameHistory');
    historyContainer.innerHTML = '';
    
    if (gameHistory.length === 0) {
        historyContainer.innerHTML = '<div class="empty-history">No hay partidas registradas</div>';
        return;
    }
    
    gameHistory.forEach((game, index) => {
        const gameElement = document.createElement('div');
        gameElement.className = 'history-item';
        
        gameElement.innerHTML = `
            <div class="history-header">
                <div class="history-date">${game.date} - ${game.time}</div>
                <div class="history-duration">Duración: ${game.duration}</div>
            </div>
            <div class="history-winner">Ganador: ${game.winnerName}</div>
            <div class="history-scores">
                <div>${game.teamNames[1]}: ${game.finalScores[1]}</div>
                <div>${game.teamNames[2]}: ${game.finalScores[2]}</div>
            </div>
        `;
        
        historyContainer.appendChild(gameElement);
    });
}

// Cargar historial desde localStorage al iniciar
window.onload = function() {
    const savedHistory = localStorage.getItem('dominoGameHistory');
    if (savedHistory) {
        gameHistory = JSON.parse(savedHistory);
    }
    
    // Iniciar el temporizador
    startTimer();
}; 