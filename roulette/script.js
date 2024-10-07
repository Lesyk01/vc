// Get DOM elements
const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');
const radius = canvas.width / 2;
const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('result');
const betTable = document.getElementById('betTable');

// Define the sectors for European Roulette
const sectors = [
    { number: "0", color: "green" },
    { number: "32", color: "red" },
    { number: "15", color: "black" },
    { number: "19", color: "red" },
    { number: "4", color: "black" },
    { number: "21", color: "red" },
    { number: "2", color: "black" },
    { number: "25", color: "red" },
    { number: "17", color: "black" },
    { number: "34", color: "red" },
    { number: "6", color: "black" },
    { number: "27", color: "red" },
    { number: "13", color: "black" },
    { number: "36", color: "red" },
    { number: "11", color: "black" },
    { number: "30", color: "red" },
    { number: "8", color: "black" },
    { number: "23", color: "red" },
    { number: "10", color: "black" },
    { number: "5", color: "red" },
    { number: "24", color: "black" },
    { number: "16", color: "red" },
    { number: "33", color: "black" },
    { number: "1", color: "red" },
    { number: "20", color: "black" },
    { number: "14", color: "red" },
    { number: "31", color: "black" },
    { number: "9", color: "red" },
    { number: "22", color: "black" },
    { number: "18", color: "red" },
    { number: "29", color: "black" },
    { number: "7", color: "red" },
    { number: "28", color: "black" },
    { number: "12", color: "red" },
    { number: "35", color: "black" },
    { number: "3", color: "red" },
    { number: "26", color: "black" }
];

let bets = [];
let spinning = false;
let ballAngle = 0;
let ballSpeed = 0;
const friction = 0.995; // Friction to slow down the ball

// Draw the roulette wheel
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sectors
    const arc = 2 * Math.PI / sectors.length;
    for (let i = 0; i < sectors.length; i++) {
        const angle = i * arc - Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius - 5, angle, angle + arc, false);
        ctx.fillStyle = sectors[i].color;
        ctx.fill();
        ctx.save();

        // Draw numbers
        ctx.translate(
            radius + Math.cos(angle + arc / 2) * (radius - 40),
            radius + Math.sin(angle + arc / 2) * (radius - 40)
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillStyle = "#fff";
        ctx.font = '14px Arial';
        ctx.fillText(
            sectors[i].number,
            -ctx.measureText(sectors[i].number).width / 2,
            0
        );
        ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(radius, radius, 50, 0, 2 * Math.PI);
    ctx.fillStyle = '#2b2b2b';
    ctx.fill();
    ctx.closePath();

    // Draw ball
    const ballRadius = 10;
    const ballX = radius + (radius - 60) * Math.cos(ballAngle);
    const ballY = radius + (radius - 60) * Math.sin(ballAngle);
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

// Spin the wheel
function spin() {
    if (bets.length === 0) {
        alert("Please place at least one bet before spinning.");
        return;
    }
    if (spinning) return;

    spinning = true;
    spinButton.disabled = true;
    resultDiv.textContent = "";
    ballAngle = Math.random() * 2 * Math.PI;
    ballSpeed = (Math.random() * 0.1) + 0.3;

    animateSpin();
}

function animateSpin() {
    if (ballSpeed <= 0.02) {
        spinning = false;
        determineResult();
        spinButton.disabled = false;
        return;
    }
    ballAngle -= ballSpeed; // Reverse the direction
    ballSpeed *= friction;
    drawWheel();
    requestAnimationFrame(animateSpin);
}

// Determine the winning number based on the ball's final position
function determineResult() {
    const arc = 2 * Math.PI / sectors.length;

    // Adjust the ball angle to start from -Math.PI / 2 (top of the wheel)
    let adjustedAngle = (ballAngle - (-Math.PI / 2) + 2 * Math.PI) % (2 * Math.PI);

    // Calculate the sector index and ensure it is within bounds
    let index = Math.floor(adjustedAngle / arc) % sectors.length;

    if (index < 0) {
        index += sectors.length; // Ensure the index is non-negative
    }

    const winningNumber = sectors[index].number;

    drawWheel();
    resultDiv.textContent = "Result: " + winningNumber;

    // Check bets
    if (bets.includes(winningNumber)) {
        alert("You won! The number is " + winningNumber);
    } else {
        alert("You lost! The number is " + winningNumber);
    }
}

// Generate the betting table
function generateBettingTable() {
    sectors.forEach((sector) => {
        const cell = document.createElement('div');
        cell.classList.add('betCell');
        cell.textContent = sector.number;
        cell.dataset.number = sector.number;
        cell.addEventListener('click', selectBet);
        betTable.appendChild(cell);
    });
}

// Handle bet selection
function selectBet(event) {
    const cell = event.currentTarget;
    const number = cell.dataset.number;
    if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        bets = bets.filter(bet => bet !== number);
    } else {
        cell.classList.add('selected');
        bets.push(number);
    }
}

// Initialize the game
spinButton.addEventListener('click', spin);
generateBettingTable();
drawWheel();
