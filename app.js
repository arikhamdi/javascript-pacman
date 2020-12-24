const board = [
    'pink',
    'blue',
    'green',
    'red',
    'purple',
    'orange',
];

const myBoard = [];
const tempBoard = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 2, 3, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];

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
    h: 100,
    size: 11,
    ghosts: 6,
    inplay: false
}

const player = {
    pos: 60,
    speed: 10,
    cool: 0,
    pause: false
}


document.addEventListener('DOMContentLoaded', () => {
    g.grid = document.querySelector('.grid'); //gameBoard

    g.pacman = document.querySelector('.pacman'); //pacman
    g.eye = document.querySelector('.eye'); //pacman eye
    g.mouth = document.querySelector('.mouth'); //pacman mouth

    g.ghost = document.querySelector('.ghost'); //ghost
    g.ghost.style.display = 'none';
    g.pacman.style.display = 'none';


    createGame();  //create game board

    // console.log(g);
})
document.addEventListener('keydown', (e) => {
    // console.log(e.code);
    if (e.code in keyz) {
        keyz[e.code] = true;
    }
    if (!g.inplay && !player.pause) {
        g.pacman.style.display = 'block';
        player.play = requestAnimationFrame(move);
        g.inplay = true;
    }

})

document.addEventListener('keyup', (e) => {
    if (e.code in keyz) {
        keyz[e.code] = false;
    }
})

function createGhost() {
    let newGhost = g.ghost.cloneNode(true);
    newGhost.pos = parseInt(g.size / 3 + g.size) + ghosts.length;
    newGhost.style.display = 'block';
    newGhost.counter = 0;

    newGhost.style.background = board[ghosts.length];
    newGhost.name = board[ghosts.length] = 'y';
    ghosts.push(newGhost);
    // console.log(newGhost);
}

function changeDirection(enemy) {
    enemy.dx = Math.floor(Math.random() * 4);
    enemy.counter = (Math.random() * 10) + 2;
}

function move() {
    if (g.inplay) {
        // console.log(player.cool);
        player.cool--; //player cooldown slowdown
        if (player.cool < 0) {
            //console.log(ghosts);
            // Placing movement of ghosts
            ghosts.forEach((ghost) => {
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
                    let valGhost = myBoard[ghost.pos]; // Future of ghost position
                    if (valGhost.t === 1) {
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
            if (newPlace.t == 1) {
                // console.log('wall');
                player.pos = tempPos;
            }
            if (newPlace.t == 2) {
                console.log('dot');
                myBoard[player.pos].innerHTML = '';
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
            // console.log(newPlace.t);
        }

        console.log(player.pos);
        myBoard[player.pos].append(g.pacman);
        player.play = requestAnimationFrame(move);
    }
}

function createGame() {
    for (let i = 0; i < g.ghosts; i++) {
        createGhost();
    }
    tempBoard.forEach((cell) => {
        createSquare(cell);
    })

    for (let i = 0; i < g.size; i++) {
        g.x += ` ${g.h}px`;
    }
    g.grid.style.gridTemplateColumns = g.x;
    g.grid.style.gridTemplateRows = g.x;
}

function createSquare(val) {
    const div = document.createElement('div');
    div.classList.add('box');
    if (val == 1) {
        div.classList.add('wall');
    }
    if (val == 2) { // add dot
        const dot = document.createElement('div');
        dot.classList.add('dot');
        div.append(dot);
    }
    if (val == 3) { // add superdot
        const superdot = document.createElement('div');
        superdot.classList.add('superdot');
        div.append(superdot);
    }
    g.grid.append(div);
    myBoard.push(div);
    div.t = val; // element type of content
    div.idVal = myBoard.length;
    div.addEventListener('click', (e) => {
        console.log(div)
    })
    // console.log(div);
}

