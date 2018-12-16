const DEBUG = false;

let player;
let score = 0;
let moveTime = 10;
let speed = 0;
let moving = false;
let gameover = false;
let trail = [];

let maxSpeed = 5;
let framesup = 0;
let framesdown = 0;
const acceleration = maxSpeed / 20;

const obstacles = [];
const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c", "#f39c12", "#d35400", "#c0392b"];

function setup() {
    canvas = new Canvas(document.getElementById("canvas"), 300, 500);
    player = new Player(canvas);
    combo = new Combo();

    const nameElem = document.getElementById("name");

    // Keyboard
    window.addEventListener("keydown", evt => {
        if (document.activeElement != nameElem && nameElem.value !== "") {
            moving = true;
            if (gameover) {
                gameover = false;
                obstacles.push(new Obstacle(canvas, Math.randomBetween(30, 60), center.x + Math.randomBetween(-canvas.width / 3, canvas.width / 3)));
                loop();
            } 
        }
    });

    window.addEventListener("keyup", evt => {
       moving = false;
    });

    // Touch
    window.addEventListener("touchstart", evt => {
        if (document.activeElement != nameElem && nameElem.value !== "") {
            moving = true;
            if (gameover) {
                gameover = false;
                obstacles.push(new Obstacle(canvas, Math.randomBetween(30, 60), center.x + Math.randomBetween(-canvas.width / 3, canvas.width / 3)));
                loop();
            } 
        }
    });

    window.addEventListener("touchend", evt => {
        moving = false;
    });

    obstacles.push(new Obstacle(canvas, Math.randomBetween(30, 60), center.x + Math.randomBetween(-canvas.width / 3, canvas.width / 3)));

    // Highscores
    updateInterface();
    showUsernameMessage(nameElem);
}

function draw() {
    canvas.background("#CCCCCC");
    DEBUG? debugDraw() : ()=>{};
    if (moving) {
        framesup = 0;
        framesdown++;
        moveTime = 10;
    } else {
        framesdown = framesdown - 5 >= 0 ? framesdown - 5 : 0;
        framesup++;
    }
    canvas.connect(trail, 4, "#2196f3");
    for(let i = 0; i<trail.length;i++) {
        trail[i].y += speed;
        if (trail[i].y > canvas.height) {
            trail.splice(i--, 1);
            continue;
        }
    }

    player.update();
    player.draw();

    if (!moving && score !== 0) moveTime -= 0.06;

    // For collision detection
    const circle = {
        x: player.pos.x,
        y: player.pos.y,
        r: player.size
    };

    for(let i = 0; i<obstacles.length;i++) {
        obstacles[i].draw();
        if (moving) {
            obstacles[i].move();
            score += maxSpeed / 100;
        } else {
            obstacles[i].stop();
        }
        // Check off-screen
        if ((obstacles[i].pos.y - obstacles[i].size) > canvas.height) {
            obstacles.splice(i--, 1);
            continue;
        }

        const rect = {
            x: obstacles[i].pos.x,
            y: obstacles[i].pos.y,
            w: obstacles[i].size,
            h: obstacles[i].size
        };

        // Check collision
        if (Math.rectCircleColliding(circle, rect)) gameOver();

        // Check if past a certain point and spawn a new obstacle
        if (!gameover && rect.y >= Math.randomBetween(-10, 10) + ((canvas.height / 3)) && obstacles[i].hasSpawned === false) {
            obstacles[i].hasSpawned = true;
            obstacles.push(new Obstacle(canvas, Math.randomBetween(30, 60), center.x + Math.randomBetween(-canvas.width / 3, canvas.width / 3)));
        }

    }
    combo.update();

    if (moveTime <= 0) gameOver();

    canvas.background("rgba(255, 255, 255, 0.5)");
    canvas.text(Math.round(moveTime), 10, 25, (moveTime <= 5) ? "red" : "white", 20, "left");
    canvas.text(Math.round(score), canvas.width - 10, 25, "white", 20, "right");
}

function showUsernameMessage(nameElem) {
    if(nameElem.value.trim() !== "") {
        nameElem.style.border = "";
        canvas.canvas.focus();
    } else {
        alert("Add your name!\nIf you don't your score won't be saved!");
        nameElem.focus();
        nameElem.style.border = "red solid 2px";
    }
}

function gameOver() {
    noLoop();
    canvas.text("YOU LOST", center.x, center.y, "red", 50);
    canvas.text("SCORE: " + Math.round(score), center.x, center.y + 50, "white", 30);
    const nameElem = document.getElementById("name");
    const name = nameElem.value.trim();
    if (name !== "") {
        if (navigator.onLine) {
            updateInterface("?name=" + name + "&score=" + score);
        }
    } else {
        showUsernameMessage(nameElem);
    }
    trail.length = 0;
    gameover = true;
    obstacles.length = 0;
    score = 0;
    time = 0;
    combo.gameOver();
    framesup = 0;
    framesdown = 0;
}

class Combo {
    constructor() {
        this.scored = false;
        this.dispText = "";
        this.ticks = 0;
        this.comboCount = 0;
    }

    update() {
        if (framesup >= 60 && this.comboCount > 0) {
            this.comboCount = 0;
            this.ticks = this.ticks > 60 ? 60 : this.ticks;
            this.dispText = "Lost combo :("
        } else if ((framesdown + 1)% 200 === 0 && score!==0 ) {
            this.comboCount++;
            this.ticks = 0;
            this.scored = false;
            this.dispText = "Combo " + this.comboCount + "!";
        }
        if (this.dispText !== "") {
            this.ticks++;
            canvas.text(this.dispText, center.x, center.y, "blue", 20);
            if (this.ticks > 120) {
                this.dispText = "";
            }
            if (!this.scored) {
                this.scored = true;
                score += this.comboCount * 10;
            }
        }
    }
    gameOver() {
        this.scored = false;
        this.dispText = "";
        this.ticks = 0;
        this.comboCount = 0;
    }
}

class Player {
    constructor(canvas) {
        this.count = 0;
        this.size = 10;
        this.xSpeed = 0.03;
        this.canvas = canvas;
        this.pos = new Vector(center.x, center.y + canvas.height / 10);
    }

    update() {
        this.pos.x = Math.floor((this.canvas.width / 2) + (Math.sin(this.count)) * (this.canvas.width / 2 - 30));
        this.count += this.xSpeed;

        trail.push(this.pos.copy());
        trail = trail.splice(-50);
    }

    draw() {
        this.canvas.circle(this.pos.x, this.pos.y, this.size, "#2196f3", true);
    }
}

class Obstacle {
    constructor(canvas, size, xPos) {
        this.size = size;
        this.canvas = canvas;
        this.hasSpawned = false;
        this.color = colors.random();
        this.pos = new Vector(xPos, -this.size);
    }

    move() {
        speed = Math.min(speed + acceleration, maxSpeed);
        this.pos.y += speed;
    }

    stop() {
        speed = Math.max(speed - maxSpeed / 120, 0);
        this.pos.y += speed;
    }

    draw() {
        this.canvas.square(this.pos.x, this.pos.y, this.size, this.color, false);
    }
}
function debugDraw() {
    canvas.text(framesup,   10, 45, "blue", 20, "left");
    canvas.text(framesdown, 10, 65, "blue", 20, "left");
    canvas.text(combo.comboCount, 10, 85, "blue", 20, "left");
}
function updateInterface(params) {
    let xhr = new XMLHttpRequest();
    xhr.open("get", "scores.php"+(params||""), true);
    xhr.responseType = "json";
    if (!params) {
        xhr.onload = () => {
            if (xhr.status == 200) {
                let scoreboard = xhr.response.scoresCSV.split("\n");
                let result = "<tr><th><b>name</b></th><th><b>score</b></th></tr>";
                for (let i = 0; i < Math.min(scoreboard.length - 1,5); i++) {
                    let split = scoreboard[i].split(",");
                    result += "<tr><td>" + split[0]+"</th><td>" + split[1]+"</td></tr>";
                }
                document.getElementById("highscores").innerHTML = result;
            }
        };
    }
    else {
        xhr.onload = () => {
            updateInterface();
        };
    }
    xhr.send();
}