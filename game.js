const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const polarBearImg = new Image();
const fishImg = new Image();
polarBearImg.src = 'polar_bear.png'; // Ensure these images are in the same directory
fishImg.src = 'fish.png';

let polarBear = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 150, // Adjusted for better visibility
    height: 150, // Adjusted for better visibility
    speed: 5
};

let fishes = [];
let score = 0;
let gameDuration = 120000; // 2 minutes in milliseconds
let gameEndTime = Date.now() + gameDuration;
let gameEnded = false;

function spawnFish() {
    let fish = {
        x: Math.random() * (canvas.width - 50),
        y: 0,
        width: 50,
        height: 50,
        speed: 2
    };
    fishes.push(fish);
}

function drawPolarBear() {
    ctx.drawImage(polarBearImg, polarBear.x, polarBear.y, polarBear.width, polarBear.height);
}

function drawFish(fish) {
    ctx.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height);
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 20);
}

function drawTimer() {
    const timeRemaining = Math.max(0, Math.floor((gameEndTime - Date.now()) / 1000));
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Time: ' + timeRemaining + 's', 10, 50);
}

function update() {
    if (gameEnded) {
        return;
    }

    const currentTime = Date.now();
    if (currentTime >= gameEndTime) {
        gameEnded = true;
        displayFinalScore();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPolarBear();
    drawScore();
    drawTimer();

    for (let i = 0; i < fishes.length; i++) {
        fishes[i].y += fishes[i].speed;
        drawFish(fishes[i]);

        if (fishes[i].y > canvas.height) {
            fishes.splice(i, 1);
            i--;
        } else if (
            fishes[i].x < polarBear.x + polarBear.width &&
            fishes[i].x + fishes[i].width > polarBear.x &&
            fishes[i].y < polarBear.y + polarBear.height &&
            fishes[i].y + fishes[i].height > polarBear.y
        ) {
            score++;
            fishes.splice(i, 1);
            i--;
        }
    }
}

function displayFinalScore() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '40px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2 - 20);
    ctx.fillText('Final Score: ' + score, canvas.width / 2 - 120, canvas.height / 2 + 30);
}

function gameLoop() {
    update();
    if (!gameEnded) {
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && polarBear.x > 0) {
        polarBear.x -= polarBear.speed;
    }
    if (e.key === 'ArrowRight' && polarBear.x < canvas.width - polarBear.width) {
        polarBear.x += polarBear.speed;
    }
});

polarBearImg.onload = () => {
    fishImg.onload = () => {
        setInterval(spawnFish, 1000);
        gameLoop();
    };
};
