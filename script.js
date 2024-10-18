let score = 0;
let safety = 0;
let gameActive = false;
const oneSecond = 1000;
const hightOfGame = 585;
const timeOfVerification = 50;
const speedOfPlane = 10;

function updateScore() {
    setInterval(function () {
        if (gameActive && !gameOver()) {
            document.getElementById("scoreTable").innerHTML = "Score : " + score;
        }
    }, timeOfVerification);
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
    }
    if (score % 10 === 0) {
        ++speed;
    }
    directionsOfEnemy(enemy, direction, speed, enemyLeft, enemyTop);
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
        if (enemyTop > hightOfGame) {
            clearInterval(enemyInterval);
            enemy.remove();
        }
        warningSpeed();
    }, timeOfVerification);
}
function isColliding(downPositionEnemy, topPositionPlane, leftPositionEnemy, rightPositionPlane,
    rightPositionEnemy, leftPositionPlane) {
    return downPositionEnemy >= topPositionPlane && leftPositionEnemy < rightPositionPlane &&
        rightPositionEnemy > leftPositionPlane;
}
function collision() {
    setInterval(function () {
        const airplane = document.getElementById('airPlane');
        const enemies = document.getElementsByClassName('enemy');
        let topPositionPlane = airplane.offsetTop;
        let leftPositionPlane = airplane.offsetLeft;
        let rightPositionPlane = leftPositionPlane + airplane.offsetWidth;

        for (let i = 0; i < enemies.length; ++i) {
            let enemy = enemies[i];
            let downPositionEnemy = enemy.offsetTop + enemy.offsetHeight;
            let leftPositionEnemy = enemy.offsetLeft;
            let rightPositionEnemy = leftPositionEnemy + enemy.offsetWidth;

            if (isColliding(downPositionEnemy, topPositionPlane, leftPositionEnemy, rightPositionPlane,
                rightPositionEnemy, leftPositionPlane)) {
                messageGameOver();
            }
        }
    }, timeOfVerification);
}

function gameOver() {
    let gameOverMess = document.getElementById('gameOverMess');
    return window.getComputedStyle(gameOverMess).visibility === 'visible';
}

function messageGameOver() {
    let gameOverMess = document.getElementById('gameOverMess');
    gameOverMess.innerHTML = "Game Over<br>Your score: " + score + "<br>Press R to restart."
    gameOverMess.style.visibility = 'visible';
}

function warningSpeed() {
    let warningSpeed = document.getElementById('increaseSpeedMess');
    if (score % 10 === 0 && score > 9) {
        warningSpeed.style.visibility = 'visible';
    } else {
        warningSpeed.style.visibility = 'hidden';
    }
}

function startEnemyGeneration() {
    let intervalBetweenEnemies = oneSecond * 3;
    setInterval(function () {
        if (gameActive && gameOver() === false) {
            spawnEnemy();
            if (score % 4 === 0) {
                intervalBetweenEnemies = Math.max(500, intervalBetweenEnemies - score * 50);
            }
        }
    }, intervalBetweenEnemies);
}

function hideStartMessage() {
    document.getElementById("startingGameMess").style.display = "none";
}

function moveAirplane(direction) {
    if (gameOver() === false) {
        const airplane = document.getElementById('airPlane');
        const airplaneWidth = airplane.offsetWidth;
        const gameWidth = document.getElementById('airplaneGame').offsetWidth;
        let leftPosition = airplane.offsetLeft;
        if (direction === "right") {
            if (leftPosition + airplaneWidth < gameWidth) {
                airplane.style.left = (leftPosition + speedOfPlane) + 'px';
            }
        } else if (direction === "left") {
            if (leftPosition > 0) {
                airplane.style.left = (leftPosition - speedOfPlane) + 'px';
            }
        }
    }

}

function spawnProjectiles() {
    let projectil = document.createElement('div');
    projectil.classList.add('projectile');
    const airplane = document.getElementById('airPlane');
    const airplanePosition = airplane.getBoundingClientRect();

    projectil.style.left = (airplanePosition.left + airplane.offsetWidth / 2 - 10) + 'px';
    projectil.style.bottom = (airplane.offsetHeight + 10) + 'px';
    const gameContainer = document.getElementById('airplaneGame');
    gameContainer.appendChild(projectil);
    projectilesMovement(projectil, gameContainer);
    enemyHit();
}

function projectilesMovement(projectil, gameContainer) {
    let speed = 5;
    let projectileInterval = setInterval(function () {
        const currentBottom = parseInt(projectil.style.bottom);
        if (gameOver() === true) {
            clearInterval(projectileInterval);
            return;
        }
        if (currentBottom >= gameContainer.offsetHeight) {
            clearInterval(projectileInterval);
            projectil.remove();
        } else {
            projectil.style.bottom = (currentBottom + speed) + 'px';
        }
    }, 50);
}

function enemyHit() {
    const enemies = document.getElementsByClassName('enemy');
    const projectils = document.getElementsByClassName('projectile');

    setInterval(function () {
        for (let i = 0; i < projectils.length; ++i) {
            let projectil = projectils[i];
            let topPositionProjectil = projectil.offsetTop;
            let leftPositionProjectil = projectil.offsetLeft;
            let rightPositionProjectil = leftPositionProjectil + projectil.offsetWidth;

            for (let j = 0; j < enemies.length; ++j) {
                let enemy = enemies[j];
                let downPositionEnemy = enemy.offsetTop + enemy.offsetHeight;
                let leftPositionEnemy = enemy.offsetLeft;
                let rightPositionEnemy = leftPositionEnemy + enemy.offsetWidth;

                if (isColliding(downPositionEnemy, topPositionProjectil, leftPositionEnemy, rightPositionProjectil,
                    rightPositionEnemy, leftPositionProjectil)) {
                    enemy.remove();
                    projectil.remove();
                    ++score
                    break;
                }
            }
        }
    }, 50);
}

document.addEventListener('click', function (event) {
    if (gameOver() === false) {
        spawnProjectiles();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === "ArrowRight") {
        moveAirplane("right");
    } else if (event.key === "ArrowLeft") {
        moveAirplane("left");
    }

    if (event.key === "r" && safety === 0) {
        hideStartMessage();
        updateScore();
        collision();
        startEnemyGeneration();
        gameActive = true;
        ++safety;
    }

    if (event.key === 'r' && gameOver()) {
        this.location.reload();
    }
});
