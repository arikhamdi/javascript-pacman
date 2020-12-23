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
    speed: 4,
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
    player.play = requestAnimationFrame(move);
})

function createGhost() {
    let newGhost = g.ghost.cloneNode(true);
    newGhost.pos = 14 + ghosts.length;
    newGhost.style.display = 'block';
    newGhost.style.background = board[ghosts.length];
    newGhost.name = board[ghosts.length] = 'y';
    ghosts.push(newGhost);
    console.log(newGhost);
}

function move() {
    console.log(ghosts);
    ghosts.forEach((ghost) => {
        myBoard[ghost.pos].append(ghost);
    })
    g.pacman.style.display = 'block';
    myBoard[player.pos].append(g.pacman);
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
    div.t = val;
    div.idVal = myBoard.length;
    div.addEventListener('click', (e) => {
        console.log(div)
    })
    // console.log(div);
}

