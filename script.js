let score = 0;
let safety = 0;
let gameActive = false;

function updateScore() {
    setInterval(function () {
        if (gameActive) {
            if (!gameOver()) {
                ++score;
                document.getElementById("scoreTable").innerHTML = "Score : " + score;
            }
        }
    }, 1000);
}

function spawnEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    const gameWidth = document.getElementById('airplaneGame').offsetWidth;
    const randomPosition = Math.floor(Math.random() * (gameWidth - 30));
    enemy.style.left = randomPosition + 'px';
    enemy.style.top = '0px';
    document.getElementById('airplaneGame').appendChild(enemy);
    enemyPossibleMoves(enemy);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function directionsOfEnemy(enemy, direction, speed, enemyLeft, enemyTop) {
    if (direction === 0) {
        enemy.style.top = (enemyTop + speed) + 'px';
        enemy.style.left = (enemyLeft + speed) + 'px';
    } else if (direction === 1) {
        enemy.style.top = (enemyTop + speed) + 'px';
        enemy.style.left = (enemyLeft - speed) + 'px';
    } else if (direction === 2) {
        enemy.style.top = (enemyTop + speed) + 'px';
    }
}

function changeDirectionEnemy(enemy, direction) {
    let enemyTop = enemy.offsetTop;
    let enemyLeft = enemy.offsetLeft;
    let speed = 5;
    if (gameOver()) {
        speed = 0;
    } else {
        if (score % 10 === 0) {
            ++speed;
        }
        directionsOfEnemy(enemy, direction, speed, enemyLeft, enemyTop);
    }
}

function enemyPossibleMoves(enemy) {
    let direction = getRandomInt(3);
    let enemyInterval = setInterval(function () {
        const gameWidth = document.getElementById('airplaneGame').offsetWidth;
        const enemyWidth = enemy.offsetWidth;
        let enemyTop = enemy.offsetTop;
        let enemyLeft = enemy.offsetLeft;

        if (enemyLeft + enemyWidth >= gameWidth) {
            direction = 1;
        } else if (enemyLeft <= 0) {
            direction = 0;
        }
        changeDirectionEnemy(enemy, direction);
        if (enemyTop > 585) {
            clearInterval(enemyInterval);
            enemy.remove();
        }
        warningSpeed();
    }, 50);
}

function airplaneHit() {
    setInterval(function () {
        const airplane = document.getElementById('airPlane');
        const enemies = document.getElementsByClassName('enemy');
        let topPositionPlane = airplane.offsetTop;
        let leftPositionPlane = airplane.offsetLeft;
        let rightPositionPlane = leftPositionPlane + airplane.offsetWidth;

        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            let downPositionEnemy = enemy.offsetTop + enemy.offsetHeight;
            let leftPositionEnemy = enemy.offsetLeft;
            let rightPositionEnemy = leftPositionEnemy + enemy.offsetWidth;

            if (downPositionEnemy >= topPositionPlane &&
                leftPositionEnemy < rightPositionPlane &&
                rightPositionEnemy > leftPositionPlane) {
                messageGameOver();
            }
        }
    }, 50);
}

function gameOver() {
    let gameOverMess = document.getElementById('gameOverMess');
    if (window.getComputedStyle(gameOverMess).visibility === 'visible') {
        return true;
    }
    return false;
}

function messageGameOver() {
    let gameOverMess = document.getElementById('gameOverMess');
    gameOverMess.innerHTML = "Game Over<br>Your score: " + score + "<br>Press R to restart."
    gameOverMess.style.visibility = 'visible';
}

function warningSpeed() {
    let warningSpeed = document.getElementById('increaseSpeedMess');
    if ((score % 10 === 0) && score > 9) {
        warningSpeed.style.visibility = 'visible';
    } else {
        warningSpeed.style.visibility = 'hidden';
    }
}

function startEnemyGeneration() {
    let intervalBetweenEnemies = 3000;
    setInterval(function () {
        if (gameActive && (gameOver() === false)) {
            spawnEnemy();
            if (score % 2 === 0 && score < 60) {
                intervalBetweenEnemies = Math.max(500, 3000 - score * 50);
            }
        }
    }, intervalBetweenEnemies);
}

function hideStartMessage() {
    document.getElementById("startingGameMess").style.display = "none";
}

function moveAirplane(direction) {
    const airplane = document.getElementById('airPlane');
    const airplaneWidth = airplane.offsetWidth;
    const gameWidth = document.getElementById('airplaneGame').offsetWidth;
    let leftPosition = airplane.offsetLeft;
    if ((direction === "right") && (gameOver() === false)) {
        if (leftPosition + airplaneWidth < gameWidth) {
            airplane.style.left = (leftPosition + 10) + 'px';
        }
    } else if ((direction === "left") && (gameOver() === false)) {
        if (leftPosition > 0) {
            airplane.style.left = (leftPosition - 10) + 'px';
        }
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === "ArrowRight") {
        moveAirplane("right");
    } else if (event.key === "ArrowLeft") {
        moveAirplane("left");
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === "r" && safety === 0) {
        hideStartMessage();
        updateScore();
        airplaneHit();
        startEnemyGeneration();
        gameActive = true;
        ++safety;
    }
});

document.addEventListener('keydown', function (event) {
    const gameOverMess = document.getElementById('gameOverMess');
    if (event.key === 'r' && gameOverMess.style.visibility === 'visible') {
        this.location.reload();
    }
});
//https://www.loom.com/share/50c9d39bae724441aa0b94e0d244f037
