const oneSecond = 1000;
const heightOfGame = 585;
const timeOfVerification = 10;
const speedOfPlane = 10;
const MIN_SPAWN_INTERVAL = 500;
const SCORE_REDUCTION_FACTOR = 50;
const SPEED_INCREMENT = 0.25;
const TOTAL_DIRECTIONS = 3;
const DIRECTION_DOWN_RIGHT = 0;
const DIRECTION_DOWN_LEFT = 1;
const DIRECTION_DOWN = 2;
const TEN = 10;
let score = 0;
let safety = 0;
let gameActive = false;

function updateScore() {
    if (gameActive && !gameOver()) {
        document.getElementById("scoreTable").innerHTML
            = "Score : " + score;
    }
}

function onUpdateFrame() {
    frameInterval = setInterval(function () {
        updateScore();
        checkCollision();
        if (gameOver()) {
            clearInterval(frameInterval);
        }
    }, timeOfVerification)
}

function handleEnemyLogic() {
    let enemySpawnInterval = oneSecond * 3;
    let speed = 1;
    setInterval(function () {
        if (gameActive && gameOver() === false) {
            spawnEnemy(speed);
            if (score % 4 === 0 && score > 1) {
                enemySpawnInterval = Math.max(MIN_SPAWN_INTERVAL,
                    enemySpawnInterval - score * SCORE_REDUCTION_FACTOR);
            }
            if (score % TEN === 0 && score > 9) {
                speed += SPEED_INCREMENT;
            }
        }
    }, enemySpawnInterval);
}

function spawnEnemy(speed) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    const gameWidth = document.getElementById('airplaneGame').offsetWidth;
    const randomPosition = Math.floor(Math.random() * (gameWidth - 30));
    enemy.style.left = randomPosition + 'px';
    enemy.style.top = '0px';
    document.getElementById('airplaneGame').appendChild(enemy);
    updateEnemyPosition(enemy, speed);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function directionsOfEnemy(enemy, direction, speed, enemyLeft, enemyTop) {
    if (direction === DIRECTION_DOWN_RIGHT) {
        enemy.style.top = (enemyTop + speed) + 'px';
        enemy.style.left = (enemyLeft + speed) + 'px';
    } else if (direction === DIRECTION_DOWN_LEFT) {
        enemy.style.top = (enemyTop + speed) + 'px';
        enemy.style.left = (enemyLeft - speed) + 'px';
    } else if (direction === DIRECTION_DOWN) {
        enemy.style.top = (enemyTop + speed) + 'px';
    }
}

function changeDirectionEnemy(enemy, direction, speed) {
    let enemyTop = enemy.offsetTop;
    let enemyLeft = enemy.offsetLeft;
    if (gameOver()) {
        speed = 0;
    }
    directionsOfEnemy(enemy, direction, speed, enemyLeft, enemyTop);
}

function checkIfEnemyTouchesEdge(enemyLeft, enemyWidth, gameWidth, direction) {
    if (enemyLeft + enemyWidth >= gameWidth) {
        direction = DIRECTION_DOWN_LEFT;
    } else if (enemyLeft <= 0) {
        direction = DIRECTION_DOWN_RIGHT;
    }
    return direction;
}

function updateEnemyPosition(enemy, speed) {
    let direction = getRandomInt(TOTAL_DIRECTIONS);
    let enemyInterval = setInterval(function () {
        const gameWidth = document.getElementById('airplaneGame').offsetWidth;
        const enemyWidth = enemy.offsetWidth;
        let enemyTop = enemy.offsetTop;
        let enemyLeft = enemy.offsetLeft;

        direction = checkIfEnemyTouchesEdge(enemyLeft, enemyWidth,
            gameWidth, direction);
        changeDirectionEnemy(enemy, direction, speed);

        if (enemyTop > heightOfGame) {
            clearInterval(enemyInterval);
            enemy.remove();
        }

        showSpeedWarning();
    }, timeOfVerification);
}

function isColliding(downPositionEnemy, topPositionPlane, leftPositionEnemy,
    rightPositionPlane, rightPositionEnemy, leftPositionPlane) {
    return downPositionEnemy >= topPositionPlane && leftPositionEnemy < rightPositionPlane
        && rightPositionEnemy > leftPositionPlane;
}

function checkCollision() {
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

        if (isColliding(downPositionEnemy, topPositionPlane,
            leftPositionEnemy, rightPositionPlane,
            rightPositionEnemy, leftPositionPlane)) {
            messageGameOver();
        }
    }
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

function showSpeedWarning() {
    let showSpeedWarning = document.getElementById('increaseSpeedMess');
    if (score % TEN === 0 && score > 9) {
        showSpeedWarning.style.visibility = 'visible';
    } else {
        showSpeedWarning.style.visibility = 'hidden';
    }
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
        if (direction === "right" && leftPosition + airplaneWidth < gameWidth) {
            airplane.style.left = (leftPosition + speedOfPlane) + 'px';
        } else if (direction === "left" && leftPosition > 0) {
            airplane.style.left = (leftPosition - speedOfPlane) + 'px';
        }
    }

}

function spawnProjectiles() {
    let projectile = document.createElement('div');
    projectile.classList.add('projectile');
    const airplane = document.getElementById('airPlane');
    const airplanePosition = airplane.getBoundingClientRect();

    projectile.style.left = (airplanePosition.left +
        airplane.offsetWidth / 2 - TEN) + 'px';
    projectile.style.bottom = (airplane.offsetHeight + TEN) + 'px';
    const gameContainer = document.getElementById('airplaneGame');
    gameContainer.appendChild(projectile);
    projectileMovement(projectile, gameContainer);
    hitEnemy();
}

function projectileMovement(projectile, gameContainer) {
    let speed = 1;
    let projectileInterval = setInterval(function () {
        const currentBottom = parseInt(projectile.style.bottom);
        if (gameOver() === true) {
            clearInterval(projectileInterval);
            return;
        }
        if (currentBottom >= gameContainer.offsetHeight) {
            clearInterval(projectileInterval);
            projectile.remove();
        } else {
            projectile.style.bottom = (currentBottom + speed) + 'px';
        }
    }, timeOfVerification);
}

function hitEnemy() {
    const enemies = document.getElementsByClassName('enemy');
    const projectiles = document.getElementsByClassName('projectile');

    setInterval(function () {
        for (let i = 0; i < projectiles.length; ++i) {
            let projectile = projectiles[i];
            let topPositionProjectile = projectile.offsetTop;
            let leftPositionProjectile = projectile.offsetLeft;
            let rightPositionProjectile = leftPositionProjectile
                + projectile.offsetWidth;

            for (let j = 0; j < enemies.length; ++j) {
                let enemy = enemies[j];
                let downPositionEnemy = enemy.offsetTop + enemy.offsetHeight;
                let leftPositionEnemy = enemy.offsetLeft;
                let rightPositionEnemy = leftPositionEnemy + enemy.offsetWidth;

                if (isColliding(downPositionEnemy, topPositionProjectile,
                    leftPositionEnemy, rightPositionProjectile,
                    rightPositionEnemy, leftPositionProjectile)) {
                    enemy.remove();
                    projectile.remove();
                    ++score
                    break;
                }
            }
        }
    }, timeOfVerification);
}

document.addEventListener('click', function (event) {
    if (gameOver() === false && gameActive === true) {
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
        onUpdateFrame();
        handleEnemyLogic();
        gameActive = true;
        ++safety;
    }

    if (event.key === 'r' && gameOver()) {
        this.location.reload();
    }
});
