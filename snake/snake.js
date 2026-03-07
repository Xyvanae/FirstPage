const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;

let snake = [{ x: 9 * box, y: 9 * box }];
let direction = "RIGHT";
let food = spawnFood();
let game = setInterval(draw, 160);

// 🔹 Sterowanie
document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
    const key = event.key;
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// 🔹 Funkcja rysująca zaokrąglony prostokąt
function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

// 🔹 Losowanie jedzenia
function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box,
    };
}

// 🔹 Rysowanie gry
function draw() {
    // tło
    ctx.fillStyle = "#0d090e";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // jedzenie
    ctx.fillStyle = "pink"; // zmień kolor jeśli chcesz
    drawRoundedRect(food.x, food.y, box, box, 6);

    // wąż
    ctx.fillStyle = "lime"; // zmień kolor jeśli chcesz
    snake.forEach((segment, index) => {
        const radius = index === 0 ? 8 : 6; // głowa bardziej okrągła
        drawRoundedRect(segment.x, segment.y, box, box, radius);
    });

    moveSnake();
}

// 🔹 Ruch węża i logika
function moveSnake() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    const newHead = { x: headX, y: headY };

    // kolizja
    if (
        headX < 0 || headY < 0 ||
        headX >= canvasSize || headY >= canvasSize ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        alert("Koniec gry!");
        return;
    }

    snake.unshift(newHead);

    // jedzenie
    if (headX === food.x && headY === food.y) {
        food = spawnFood();
    } else {
        snake.pop();
    }
}

// 🔹 Sprawdzenie kolizji z ogonem
function collision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}
