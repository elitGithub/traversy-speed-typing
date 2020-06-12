const startGameBtn = document.querySelector('.startGame');
const currentWord = document.querySelector('#current-word');
const wordInput = document.querySelector('#word-input');
const difficulty = document.querySelector('.difficulty-select');
const scoreBoard = document.querySelector('#score');
const timeBoard = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
let score = 0;
let intervalID = 0;
let isPlaying = false;
let difficultySetting;
let timeLeft;
startGameBtn.addEventListener('click', startGame);
wordInput.addEventListener('input', typingStarted);



function startGame() {
    isPlaying = true;
    difficultySetting = selectDifficulty(difficulty.value);
    timeLeft = difficultySetting.time;
    scoreBoard.textContent = 0;
    fetchRandomString();
}

function selectDifficulty(difficulty) {
    switch (difficulty) {
        case 'easy':
            seconds.innerHTML = 15;
            return {wordLength: 5, time: 16};
        case 'medium':
            seconds.innerHTML = 10;
            return {wordLength: 8, time: 11};
        case 'hard':
            seconds.innerHTML = 8;
            return {wordLength: 12, time: 9};
        default:
            seconds.innerHTML = 15;
            return {wordLength: 5, time: 15};
    }
}

function typingStarted() {
    if (currentWord.textContent === wordInput.value) {
        score++;
        scoreBoard.textContent = score;
        wordInput.value = '';
        stopTimer();
        if (isPlaying) {
            fetchRandomString();
        }
    }
}

function startTimer() {
    if (isPlaying !== false) {
        intervalID = setInterval(countdown, 1000);
        timeBoard.textContent = intervalID;
    }
    timeBoard.textContent = timeLeft;
}

function countdown() {
    if (difficultySetting.time === 0) {
        isPlaying = false;
        message.textContent = 'Game Over';
        stopTimer();
    } else {
        difficultySetting.time--;
    }
    timeBoard.innerHTML = difficultySetting.time;
}

function stopTimer() {
    clearInterval(intervalID);
    timeBoard.textContent = difficultySetting.time;
}

function fetchRandomString() {
    fetch('https://api.random.org/json-rpc/2/invoke', {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "generateStrings",
            "params": {
                "apiKey": "cbdfe498-4bb3-4a27-8603-6ebfb2140f73",
                "n": 1,
                "length": difficultySetting.wordLength,
                "characters": "abcdefghijklmnopqrstuvwxyz",
            },
            id: 666,
        }),
    }).then(response => {
        return response.json();
    }).then(data => {
        clearInterval(intervalID);
        wordInput.disabled = false;
        wordInput.focus();
        startTimer();
        currentWord.textContent = data.result.random.data;
    });
}
