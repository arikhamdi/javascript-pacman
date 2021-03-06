const board = [
    'pink',
    'blue',
    'green',
    'red',
    'purple',
    'orange',
];

const myBoard = [];
const tempBoard = [];

const keyz = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false
};
const ghosts = [];

const g = {
    x: '',
    y: '',
    h: 50,
    size: 20,
    ghosts: 6,
    inplay: false,
    startGhost: 11
}

const player = {
    pos: 60,
    speed: 4,
    cool: 0,
    pause: false,
    score: 0,
    lives: 5,
    gameOver: false,
    gameWin: false,
    powerUp: false,
    powerCount: 0
}

const startButton = document.querySelector('.btn');
let demo = true;

/// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    g.grid = document.querySelector('.grid'); //gameBoard

    g.pacman = document.querySelector('.pacman'); //pacman
    g.eye = document.querySelector('.eye'); //pacman eye
    g.mouth = document.querySelector('.mouth'); //pacman mouth

    g.score = document.querySelector('.score'); // player score
    g.lives = document.querySelector('.lives'); // player lives

    g.ghost = document.querySelector('.ghost'); //ghost
    g.ghost.style.display = 'none';

    startButton.style.height = window.innerHeight + 'px';
    startButton.style.width = window.innerWidth + 'px';

    boardBuilder(); // build game board dynamically
    createGame();  // create game board


})

document.addEventListener('keydown', (e) => {
    if (e.code in keyz) {
        keyz[e.code] = true;
    }
    if (!g.inplay && !player.pause) {
        player.play = requestAnimationFrame(move);
        g.inplay = true;
    }

})

document.addEventListener('keyup', (e) => {
    if (e.code in keyz) {
        keyz[e.code] = false;
    }
})

startButton.addEventListener('click', startGame)

function boardBuilder() {
    tempBoard.length = 0;
    let boxSize = (document.documentElement.clientHeight < document.documentElement.clientWidth) ? document.documentElement.clientHeight : document.documentElement.clientWidth;
    console.log(boxSize)
    g.h = (boxSize / g.size) - (boxSize / (g.size * 5));
    console.log(g.h);
    for (let y = 0; y < g.size; y++) {
        let wallz = 0;

        for (let x = 0; x < g.size; x++) {
            let val = 2; // populate all area with dots

            // override the populated dots with random walls
            wallz--;
            if (wallz > 0 && (y - 1) % 2) {
                val = 1;
            } else {
                wallz = Math.floor(Math.random() * (g.size / 2));
            }

            // override the inner border of the game board 
            // and add a path with dots
            if (y === 1 || y === (g.size - 3) || x === 1 || x === (g.size - 2)) {
                val = 2;
            }
            // override bottom dots to add ghosts spawn
            if (y == (g.size - 2)) {
                val = 4;
            }
            // override preceing dots by 4 superdots
            if (x === 3 || x === (g.size - 4)) {
                if (y === 1 || y === (g.size - 3)) {
                    val = 3;
                }
            }
            // Finally override the border and delimit the game board 
            if (y === 0 || y === (g.size - 1) || x === 0 || x === (g.size - 1)) {
                val = 1; // border of the area
            }
            tempBoard.push(val);
        }
    }
}

/// Main GamePlay
function move() {
    if (g.inplay) {
        player.cool--; //player cooldown slowdown
        if (player.cool < 0) {
            if (player.powerUp) {
                player.powerCount--;
                g.pacman.style.backgroundColor = 'red';
                if (player.powerCount <= 15 && player.powerCount % 2) {
                    g.pacman.style.backgroundColor = 'orange';
                }
                if (player.powerCount <= 0) {
                    player.powerUp = false;
                    g.pacman.style.backgroundColor = 'yellow';
                    console.log("power down");
                }
            }
            // Placing movement of ghosts
            ghosts.forEach((ghost, index) => {
                if (player.powerUp) {
                    if (player.powerCount % 2) {
                        ghost.style.backgroundColor = 'white';
                    } else {
                        ghost.style.backgroundColor = 'blue';
                    }

                } else {
                    ghost.style.backgroundColor = ghost.defaultColor;
                }
                myBoard[ghost.pos].append(ghost);
                ghost.counter--;
                let oldPos = ghost.pos; // Original ghost position
                if (ghost.counter <= 0) {
                    changeDirection(ghost);
                } else {
                    if (ghost.dx === 0) {
                        ghost.pos -= g.size;
                    } else if (ghost.dx === 1) {
                        ghost.pos += g.size;
                    } else if (ghost.dx === 2) {
                        ghost.pos += 1;
                    } else if (ghost.dx === 3) {
                        ghost.pos -= 1;
                    }
                    if (ghost.spawn > 0) {
                        ghost.spawn--;
                        ghost.pos = oldPos;
                    }
                    let valGhost = myBoard[ghost.pos]; // Future of ghost position

                    if (player.pos == ghost.pos || player.pos == oldPos) {
                        if (player.powerUp) { // player eat ghosts
                            player.score += 100;
                            ghost.spawn = 100;
                            ghost.pos = (g.startGhost + (g.size / 2 - g.ghosts / 2)) - 1 + index;
                        } else {
                            player.lives--;
                            gameReset();
                        }
                        updateScore();
                    }
                    if (valGhost.t == 1) {
                        ghost.pos = oldPos;
                        changeDirection(ghost);
                    }
                    myBoard[ghost.pos].append(ghost);
                }
            })
            // Keyboar events movements of player
            let tempPos = player.pos; // current position
            if (keyz.ArrowRight) {
                player.pos += 1;
                // move pacman eye and mouth
                g.eye.style.left = '20%';
                g.mouth.style.left = '60%';
            } else if (keyz.ArrowLeft) {
                player.pos -= 1;
                // move pacman eye and mouth
                g.eye.style.left = '60%';
                g.mouth.style.left = '0';
            } else if (keyz.ArrowUp) {
                player.pos -= g.size;
            } else if (keyz.ArrowDown) {
                player.pos += g.size;
            }

            let newPlace = myBoard[player.pos]; // futur postiion
            if (newPlace.t === 1 || newPlace.t === 4) {
                player.pos = tempPos;
            }
            // PowerUp
            if (newPlace.t === 3) {
                player.powerCount = 100;
                player.powerUp = true;
                myBoard[player.pos].innerHTML = '';
                player.score += 10;
                newPlace.t = 0;
            }
            if (newPlace.t == 2) {
                myBoard[player.pos].innerHTML = '';
                // dots left
                let tempDots = document.querySelectorAll('.dot');
                if (tempDots.length <= 0) {
                    playerWins();
                }
                player.score++;
                updateScore();
                newPlace.t = 0;
            }
            if (player.pos != tempPos) {  //check if pacman moved
                // Open and Close mouth 
                if (player.tog) {
                    g.mouth.style.height = '30%';
                    player.tog = false;
                } else {
                    g.mouth.style.height = '10%';
                    player.tog = true;
                }
            }
            player.cool = player.speed; // set cooloff
        }

        if (!player.pause) {
            myBoard[player.pos].append(g.pacman);
            player.play = requestAnimationFrame(move);
        }
    }
}

/// Ghost AI
function findDirection(a) {
    let val = [a.pos % g.size, Math.ceil(a.pos / g.size)]; // col, row
    return val;
}

function changeDirection(enemy) {
    let gg = findDirection(enemy);
    let pp = findDirection(player);

    let ran = Math.floor(Math.random() * 2);
    if (ran === 0) {
        enemy.dx = (gg[0] < pp[0]) ? 2 : 3; //horizontal position
    } else {
        enemy.dx = (gg[1] < pp[1]) ? 1 : 0; //vertical position
    }

    enemy.dx = Math.floor(Math.random() * 4);
    enemy.counter = (Math.random() * 10) + 2;
}


// Starting and Restarting de game
function startGame() {
    stopDemo();

    myBoard.length = 0;
    ghosts.length = 0;
    g.grid.innerHTML = '';
    g.x = '';

    player.score = 0;
    player.lives = 5;
    player.gameOver = false;

    createGame();

    g.grid.focus();
    startButton.style.display = "none";

}

function startPosition() {
    player.pause = false;
    let firstStartPosition = ((g.size * 7) + g.size / 2) - 1;
    player.pos = startPositionAndCheckWall(firstStartPosition);
    myBoard[player.pos].append(g.pacman);
    ghosts.forEach((ghost, index) => {
        const tempPosition = (g.startGhost + (g.size / 2 - g.ghosts / 2)) - 1 + index;
        ghost.pos = startPositionAndCheckWall(tempPosition);
        myBoard[ghost.pos].append(ghost);
    })

    // demo Before starting the game
    if (demo == true) {
        startDemo();
    }
}

function startPositionAndCheckWall(val) {
    // Check if player start position is in a wall value
    if (myBoard[val].t != 1) {
        return val;
    }
    return startPositionAndCheckWall(val + 1);
}

function playerWins() {
    g.inplay = false;
    player.pause = true;
    startButton.innerHTML = "You Won<br><small style='font-size:0.5em;'>play again ?</small>";
    startButton.style.display = "block";
}

function endGame() {
    startButton.style.display = "block";
}

function gameReset() {
    window.cancelAnimationFrame(player.play);
    g.inplay = false;
    player.pause = true;
    if (player.lives <= 0) {
        player.gameOver = true;
        endGame();
    }

    if (!player.gameOver) {
        setTimeout(startPosition, 3000);
    }

}

/// Game Updates
function updateScore() {
    if (player.lives <= 0) {
        player.gameOver = true;
        g.lives.innerHTML = "<br>GAME OVER";
    } else {
        g.score.innerHTML = `Score : ${player.score}`;
        g.lives.innerHTML = `Lives : ${player.lives}`;
    }
}


/// Game board Setup
function createGame() {
    for (let i = 0; i < g.ghosts; i++) {
        createGhost();
    }
    tempBoard.forEach((cell) => {
        createSquare(cell);
    })

    for (let i = 0; i < g.size; i++) {
        g.x += ` ${g.h}px`; // Cell grid height
    }
    g.grid.style.gridTemplateColumns = g.x;
    g.grid.style.gridTemplateRows = g.x;
    startPosition();
    updateScore();
}

function createSquare(val) {
    const div = document.createElement('div');
    div.classList.add('box');
    if (val === 1) {
        div.classList.add('wall');
    }
    if (val === 2) { // add dot
        const dot = document.createElement('div');
        dot.classList.add('dot');
        div.append(dot);
    }
    if (val === 3) { // add superdot
        const superdot = document.createElement('div');
        superdot.classList.add('superdot');
        div.append(superdot);
    }
    if (val === 4) {
        //hideout
        div.classList.add('hideout');
        if (g.startGhost === 11) {
            g.startGhost = myBoard.length;
        }
    }
    g.grid.append(div);
    myBoard.push(div);
    div.t = val; // element type of content
    div.idVal = myBoard.length;

    div.addEventListener('click', (e) => {
        console.log(div)
    })
}

function createGhost() {
    let newGhost = g.ghost.cloneNode(true);
    newGhost.style.display = 'block';
    newGhost.style.opacity = '0.8';
    newGhost.counter = 0;
    newGhost.defaultColor = board[ghosts.length];
    newGhost.style.background = board[ghosts.length];
    newGhost.name = board[ghosts.length] + 'y';
    ghosts.push(newGhost);
}

/// Game demo
function startDemo() {
    g.score.style.color = 'black';
    g.lives.style.color = 'black';
    g.inplay = true;
    setTimeout(() => {
        player.play = requestAnimationFrame(move);

        if (player.lives < 6) {
            player.lives = 5;
        }
    }, 100);
}

function stopDemo() {
    g.score.style.color = 'white';
    g.lives.style.color = 'white';
    window.cancelAnimationFrame(player.play);
    g.inplay = false;
    player.pause = true;
    demo = false;
}
