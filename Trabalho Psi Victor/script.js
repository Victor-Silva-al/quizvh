let score = 0;
let timeLeft = 0;
let intervaloTimer;
let i = 0;
let questions = [];

const botoesResposta = document.querySelectorAll('.answer');
const scoreElem = document.getElementById('score');
const highScoreElem = document.getElementById('high-score');
const timeElem = document.getElementById('time');
const startButton = document.getElementById('start');

if (localStorage.getItem('highScore')) {
    highScoreElem.innerText = localStorage.getItem('highScore');
}

async function readJsonFile(nameOfJsonFile) {
    try {
        const response = await fetch(nameOfJsonFile);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation: ', error);
    }
}

document.getElementById("content-game").style.display = "none";

async function startGame() {
    document.getElementById("content-game").style.display = "block";
    document.getElementById("title").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    score = 0;
    i = 0;    
    scoreElem.innerText = score;
    startButton.style.display = "none";
    timeLeft = 90;
    timeElem.innerText = timeLeft;
    questions = await readJsonFile("questions.json")
    intervaloTimer = setInterval(updateTimer, 1000);
    loadQuestion();
}

function loadQuestion() {
    questionData = document.getElementById("question");
    questionData.innerHTML = questions[i].pergunta;
  
    document.getElementById("0").innerHTML = questions[i].opcoes[0];
    document.getElementById("1").innerHTML = questions[i].opcoes[1];
    document.getElementById("2").innerHTML = questions[i].opcoes[2];
    document.getElementById("3").innerHTML = questions[i].opcoes[3];
};

function updateTimer() {
    timeLeft--;
    timeElem.innerText = timeLeft;
    if (timeLeft === 0) {
        clearInterval(intervaloTimer);
        acabaJogo();
    }
}

function checkAnswer(respostaSelecionada) {
    const correctAnswer = questions[i].resposta_correta;
    const textoSelecionado = botoesResposta[respostaSelecionada].innerText;

    if (textoSelecionado === correctAnswer) {
        score++;
        scoreElem.innerText = score;
    }

    nextQuestion();
}

function nextQuestion() {
    i++;
    if (i < questions.length) {
        loadQuestion();
    } else {
        acabaJogo();
    }
}

function acabaJogo() {
    clearInterval(intervaloTimer);
    document.getElementById("quiz").style.display = "none";
    document.getElementById("content-game").style.display = "none";
    document.getElementById("title").style.display = "block";
    startButton.style.display = "inline";

    const highScore = parseInt(localStorage.getItem('highScore')) || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        highScoreElem.innerText = score;
    }
    document.getElementById("title").innerHTML = `Fim do jogo! O seu score é ${score} e o high score é ${highScore}`;
}

botoesResposta.forEach((button, index) => {
    button.addEventListener("click", () => {
        checkAnswer(index);
    });
});