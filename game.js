const playerName = localStorage.getItem('playerName');
if (!playerName) {
    window.location.href = 'login.html';
}

document.getElementById('player-info').textContent = `Welcome, ${playerName}!`;

const apiUrl = 'https://marcconrad.com/uob/banana/api.php';
const animals = ['Lion', 'Elephant', 'Giraffe', 'Monkey', 'Penguin', 'Kangaroo', 'Zebra', 'Koala', 'Tiger', 'Panda'];
let currentAnimal, score = 0, attempts, currentLevel = 'easy', roundsPlayed = 0;
let timer, timeLeft;

const levels = {
    easy: { boxes: 6, attempts: 3, cols: 3, time: 25 },
    medium: { boxes: 9, attempts: 3, cols: 3, time: 15 },
    hard: { boxes: 12, attempts: 3, cols: 4, time: 10 }
};

const boxesContainer = document.getElementById('boxes');
const scoreDisplay = document.getElementById('score');
const attemptsDisplay = document.getElementById('attempts');
const messageDisplay = document.getElementById('message');
const timerDisplay = document.getElementById('timer');
const nextButton = document.getElementById('next-question');
const tryAgainButton = document.getElementById('try-again');
const levelButtons = document.querySelectorAll('#level-buttons button');

levelButtons.forEach(button => {
    button.addEventListener('click', () => setLevel(button.id));
});

function setLevel(level) {
    currentLevel = level;
    roundsPlayed = 0;
    levelButtons.forEach(btn => btn.classList.remove('active-level'));
    document.getElementById(level).classList.add('active-level');
    resetGame();
    fetchQuestion();
}

function createBoxes() {
    boxesContainer.innerHTML = '';
    boxesContainer.style.gridTemplateColumns = `repeat(${levels[currentLevel].cols}, 1fr)`;
    for (let i = 0; i < levels[currentLevel].boxes; i++) {
        const box = document.createElement('button');
        box.className = 'box';
        box.textContent = i + 1;
        box.addEventListener('click', () => openBox(i));
        boxesContainer.appendChild(box);
    }
}

function fetchQuestion() {
    if (roundsPlayed >= 3) {
        endRound();
        return;
    }

    boxesContainer.innerHTML = '<p>Loading...</p>';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data || typeof data.solution !== 'number') {
                throw new Error('Invalid API response');
            }

            currentAnimal = animals[data.solution % animals.length];
            attempts = levels[currentLevel].attempts;
            timeLeft = levels[currentLevel].time;
            updateDisplay();
            createBoxes();
            messageDisplay.textContent = '';
            nextButton.style.display = 'none';
            tryAgainButton.style.display = 'none';
            startTimer();
        })
        .catch(error => {
            console.error('Error fetching question:', error);
            messageDisplay.textContent = 'Error fetching the question. Please try again.';
            tryAgainButton.style.display = 'inline-block';
        });
}

function startTimer() {
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        } else {
            clearInterval(timer);
            messageDisplay.textContent = `Time's up! The animal was a ${currentAnimal}.`;
            endRound();
        }
    }, 1000);
}

function openBox(index) {
    if (attempts === 0 || !timer) return;

    const box = boxesContainer.children[index];
    if (box.disabled) return;

    box.disabled = true;
    if (index === animals.indexOf(currentAnimal) % levels[currentLevel].boxes) {
        box.classList.add('correct');
        box.textContent = '🐾';
        score += currentLevel === 'easy' ? 1 : currentLevel === 'medium' ? 3 : 5;
        messageDisplay.textContent = `Congratulations! You found the ${currentAnimal}!`;
        endRound();
    } else {
        box.classList.add('incorrect');
        box.textContent = '❌';
        attempts--;
        if (attempts === 0) {
            messageDisplay.textContent = `Sorry, you've used all your attempts. The animal was a ${currentAnimal}.`;
            endRound();
        }
    }
    updateDisplay();
}

function updateDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    attemptsDisplay.textContent = `Attempts left: ${attempts}`;
}


nextButton.addEventListener('click', () => {
    fetchQuestion();
    nextButton.style.display = 'none';
});

function endRound() {
    boxesContainer.querySelectorAll('.box').forEach(box => box.disabled = true);
    clearInterval(timer);
    roundsPlayed++;

    if (roundsPlayed < 3) {
        nextButton.style.display = 'inline-block';
    } else if (currentLevel === 'hard') {
        showCongratulationsPopup();
    } else {
        nextLevel();
    }
}

function resetGame() {
    attempts = levels[currentLevel].attempts;
    roundsPlayed = 0;
    updateDisplay();
    messageDisplay.textContent = '';
    tryAgainButton.style.display = 'none';
    nextButton.style.display = 'none';
    boxesContainer.innerHTML = '';
    if (timer) clearInterval(timer);
}

function nextLevel() {
    if (currentLevel === 'easy') {
        setLevel('medium');
    } else if (currentLevel === 'medium') {
        setLevel('hard');
    }
}

function showCongratulationsPopup() {
    const popup = document.getElementById('congratulations-popup');
    const popupMessage = document.getElementById('popup-message');
    const finalScoreDisplay = document.getElementById('final-score'); 

    popup.style.display = 'flex';
    popupMessage.textContent = 'Fetching your motivational message...';
    finalScoreDisplay.textContent = `Your Final Score: ${score}`; 

    // Use the provided API key
    const apiKey = 'FdYO3chxMwF4fPajcPs7/Q==JwFDjNShYXn455NR';
    const apiUrl = 'https://api.api-ninjas.com/v1/quotes?category=success';

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-Api-Key': apiKey,  
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        
        if (data && data.length > 0) {
          
            const quote = data[0].quote;
            const author = data[0].author;

         
            popupMessage.textContent = `"${quote}" - ${author}`;
        } else {
           
            popupMessage.textContent = 'No quotes available, try again later.';
        }
    })
    .catch(error => {
        console.error('Error fetching quote:', error);
        popupMessage.textContent = 'Could not fetch quote, try again later.';
    });
     
  
    document.getElementById('close-popup').addEventListener('click', () => {
        const playerName = localStorage.getItem('playerName');
        const finalScore = score;  

       
        savePlayerData(playerName, finalScore);

        
        popup.style.display = 'none';

        
        resetGame();
        clearInterval(timer);
        setLevel('easy');

      
        window.location.href = 'login.html';
    });
}


function savePlayerData(playerName, score) {
    fetch('save_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `name=${playerName}&score=${score}`
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);  
    })
    .catch(error => console.error('Error saving player data:', error));
}

setLevel('easy')