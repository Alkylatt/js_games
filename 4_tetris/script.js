// game script
// initialize internal game grid array
let gameSpace = ['']; // this is the current game state (important data for multiplayer); lowercase letter means solidified blocks, uppercase letter means moving piece
while(gameSpace.length < 220) { gameSpace.push(''); }

let gameSpace2 = ['']; // gameSpace data of Opponent
while(gameSpace2.length < 220) { gameSpace2.push(''); }



// get elements on html page
let counter_lineCleared = 0;
const UI_LINE_CLEARED = document.querySelector('#ui_lineCleared');
UI_LINE_CLEARED.innerHTML = "0";

let counter_tSpin = 0;
const UI_T_SPIN = document.querySelector('#ui_tSpin');
UI_T_SPIN.innerHTML = "0";

let counter_quad = 0;
const UI_QUAD = document.querySelector('#ui_quad');
UI_QUAD.innerHTML = "0";



// initialize game grid on html page
const GRIDS_CONTAINER = document.querySelector('#gridsContainer');
const GRIDS_CONTAINER2 = document.querySelector('#gridsContainer2');
// 2 extra out-of-bound lines for piece to spawn in,
// 20 real lines for gameplay
for(let i=0;i < 220;i++) {
    let newDiv = GRIDS_CONTAINER.appendChild(document.createElement("div"));
    newDiv.classList.add("grid");
}
let grids = Array.from(document.querySelectorAll('#gridsContainer div')) // this is just for rendering

// do those again for the opponent
for(let i=0;i < 220;i++) {
    let newDiv = GRIDS_CONTAINER2.appendChild(document.createElement("div"));
    newDiv.classList.add("grid");
}
let grids2 = Array.from(document.querySelectorAll('#gridsContainer2 div')) // this is just for rendering

// document.addEventListener('DOMContentLoaded', () => {
//     console.log(gameSpace);
//     console.log(grids);
// })



// get next pieces display
const NEXT_PIECES = document.querySelector('#nextPieces');
const NEXT_PIECES_DISPLAY = NEXT_PIECES.children;

function updateNextPieces(next) {
    NEXT_PIECES_DISPLAY[0].className = "next_" + next[pieceBag.length-2];
    NEXT_PIECES_DISPLAY[1].className = "next_" + next[pieceBag.length-3];
    NEXT_PIECES_DISPLAY[2].className = "next_" + next[pieceBag.length-4];
    NEXT_PIECES_DISPLAY[3].className = "next_" + next[pieceBag.length-5];
    NEXT_PIECES_DISPLAY[4].className = "next_" + next[pieceBag.length-6];
}



// get hold piece display
const HOLD_PIECE = document.querySelector('#holdPiece').children;
let holdingPiece = [''];

function holdPiece() {
    if(holdingPiece[0] === '') {
        holdingPiece[0] = pieceBag[pieceBag.length-1];
    }else { // switch holding piece and last piece from bag
        let pieceTemp = holdingPiece[0];
        holdingPiece[0] = pieceBag[pieceBag.length-1];
        pieceBag = pieceBag.concat(pieceTemp);
    }
    holdingPiece[0] = currentColor.toUpperCase();
    HOLD_PIECE[0].className = "next_" + holdingPiece;
    clearCurrentRender();
    spawnPiece();
    holdCd = true;
}



function checkTspin() {
    // this function is called after spins/kicks, to check if t-spin condition is met
    if(currentColor !== 't') {
        isTspin = false;
        return false;
    }
    if(isTspin) return isTspin; // isT-spin is true when it's the 5th condition thing (extra condition)
    let check = [
        gameSpace[horizontalPosition + verticalPosition] !== '',
        gameSpace[horizontalPosition + verticalPosition + 2] !== '',
        gameSpace[horizontalPosition + verticalPosition + 20] !== '',
        gameSpace[horizontalPosition + verticalPosition + 22] !== ''
    ];
    // one of these occupied: top left, top right
    // both of these occupied: bottom left, bottom right
    if((check[0] || check[1]) && check[2] && check[3]) {
        isTspin = true;
        return true;
    }else {
        return false;
    }
}

function lineClear() {
    let linesToClear = [];
    let isAnyLineCleared = false;
    // check for lines cleared from bottom to top
    for(let i=21;i >= 0;i--) {
        let clear = true;
        for(let j=i*10;j < i*10+10;j++) {
            if(gameSpace[j] === "") {
                clear = false;
                break;
            }
        }
        if(clear) {
            linesToClear[linesToClear.length] = i;
            isAnyLineCleared = true;
        }
    }

    // go through every element in linesToClear
    for(let i=0;i < linesToClear.length;i++) {
        // clear the line
        for(let j=linesToClear[i]*10 + 10*i;j < linesToClear[i]*10 + 10*i + 10;j++) {
            gameSpace[j] = "";
        }
        // move everything above down 1 tile

        for(let j = linesToClear[i]*10 + 10*i - 1;j >= 0;j--) {
            gameSpace[j+10] = gameSpace[j];
            gameSpace[j] = "";
        }
    }

    if(linesToClear.length > 0 && checkTspin()) {
        // update line clear counter
        counter_tSpin++;
        UI_T_SPIN.innerHTML = counter_tSpin.toString();

        // send garbage to server (T-spins)
        if(linesToClear.length === 1) socket.emit("send_garbage", 2);
        else if(linesToClear.length === 2) socket.emit("send_garbage", 4);
        else if(linesToClear.length === 3) socket.emit("send_garbage", 6);
    }else if(linesToClear.length === 4) {
        counter_quad++;
        UI_QUAD.innerHTML = counter_quad.toString();

        // send garbage to server (quad)
        socket.emit("send_garbage", 4);
    }else {
        if(linesToClear.length === 2) socket.emit("send_garbage", 1);
        else if(linesToClear.length === 3) socket.emit("send_garbage", 2);
    }

    // update line clear counter
    counter_lineCleared += linesToClear.length;
    UI_LINE_CLEARED.innerHTML = counter_lineCleared.toString();


    // receive garbage from opponent attack if no line clear happens
    if(isAnyLineCleared === true) {
        isAnyLineCleared = false;
    }else {
        // cap emerging garbage at 8 lines per emerging
        let emergingGarbage = (garbageLines >= 8) ? 8 : garbageLines;
        garbageLines -= emergingGarbage;

        // lift grids up
        for(let i=0;i < (220 - 10*emergingGarbage);i++) {
            gameSpace[i] = gameSpace[i + (10*emergingGarbage)];
        }
        // generate garbage lines
        for(let i=(220 - 10*emergingGarbage);i < 220;i+=10) {
            let randomNum = Math.floor(Math.random() * 10);
            for(let j=0;j < 10;j++) {
                console.log(randomNum);
                if(j !== randomNum) {
                    gameSpace[i+j] = 'g';
                }else {
                    gameSpace[i+j] = '';
                }
            }
        }
        updateGarbageGauge();
    }
}
let t = 0; // debug


function render() {
    for(let i=0; i < 220 ;i++) {
        switch(gameSpace[i].toLowerCase()) {
            case "z":
                grids[i].className = "grid colorZ";
                break;
            case "s":
                grids[i].className = "grid colorS";
                break;
            case "l":
                grids[i].className = "grid colorL";
                break;
            case "j":
                grids[i].className = "grid colorJ";
                break;
            case "i":
                grids[i].className = "grid colorI";
                break;
            case "t":
                grids[i].className = "grid colorT";
                break;
            case "o":
                grids[i].className = "grid colorO";
                break;
            case "g":
                grids[i].className = "grid colorG";
                break;
            default:
                if(i < 20) {
                    grids[i].className = "grid gridSpawn";
                }else {
                    grids[i].className = "grid";
                }
                break;
        }
    }

    // again for the opponent
    for(let i=0; i < 220 ;i++) {
        switch(gameSpace2[i].toLowerCase()) {
            case "z":
                grids2[i].className = "grid colorZ";
                break;
            case "s":
                grids2[i].className = "grid colorS";
                break;
            case "l":
                grids2[i].className = "grid colorL";
                break;
            case "j":
                grids2[i].className = "grid colorJ";
                break;
            case "i":
                grids2[i].className = "grid colorI";
                break;
            case "t":
                grids2[i].className = "grid colorT";
                break;
            case "o":
                grids2[i].className = "grid colorO";
                break;
            case "g":
                grids2[i].className = "grid colorG";
                break;
            default:
                if(i < 20) {
                    grids2[i].className = "grid gridSpawn";
                }else {
                    grids2[i].className = "grid";
                }
                break;
        }
    }

    castShadow();
}



// initial the first bag
let pieceBag = ['Z', 'S', 'L', 'J', 'I', 'T', 'O'];
shuffle(pieceBag);
// The 7-bag piece generator
function generateBag() {
    let tempBag = ['Z', 'S', 'L', 'J', 'I', 'T', 'O'];
    shuffle(tempBag);
    pieceBag = tempBag.concat(pieceBag);
}



const startingTime = new Date();
function getTime() {
    return (new Date().getTime()) - startingTime;
}

/* This clears the render of current piece, so it doesn't leave weird blocks behind */
function clearCurrentRender() {
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = ""; }
}

function checkRotateCollision(rotationNext) {
    // Checks for pre-existing blocks and prevents clipping
    // collision detection
    let check = [null,null,null,null];
    for(let i=0;i < 4;i++) check[i] = gameSpace[currentPiece[rotationNext][i] + verticalPosition + horizontalPosition];
    for (let i = 0;i < 4;i++) {
        if ('a' <= check[i] && check[i] <= 'z') { // lowercase means placed block (and uppercase means current piece)
            return true; // if the piece will be clipping after movement
        }
    }

    // check if the piece is at 0 and 9 simultaneously, then it's clipping
    let checkPos = [];
    for (let i = 0; i < 4; i++) {
        checkPos[i] = (currentPiece[rotationNext][i] + verticalPosition + horizontalPosition) % 10;
    }
    for (let i = 0; i < 4; i++) {
        if(checkPos[i] === 0) {
            for (let j = 0; j < 4; j++) {
                if(checkPos[j] === 9) {
                    return true; // is clipping
                }
            }
            break;
        }
    }
    // return false if no collision happens
    return false;
}

function checkMoveCollision(nextPos) {
    // check for corner clipping
    for (let i = 0; i < 4; i++) {
        if(nextPos[i] < 0 || nextPos[i] > 219) {
            return true; // is clipping at the left-top or right-bottom corner
        }
    }

    // Checks for pre-existing blocks and prevents clipping
    // collision detection
    let check = [null,null,null,null];
    for(let i=0;i < 4;i++) check[i] = gameSpace[nextPos[i]];
    for (let i = 0;i < 4;i++) {
        if ('a' <= check[i] && check[i] <= 'z') { // lowercase means placed block (and uppercase means current piece)
            return true; // if the piece will be clipping after movement
        }
    }

    // check if the piece is at 0 and 9 simultaneously, then it's clipping
    let checkPos = [];
    for (let i = 0; i < 8; i++) {
        if (i < 4) checkPos[i] = nextPos[i] % 10;
        else checkPos[i] = (currentPiece[rotation][i-4] + horizontalPosition + verticalPosition) % 10;
    }
    for (let i = 0; i < 8; i++) {
        if(checkPos[i] === 0) {
            for (let j = 0; j < 8; j++) {
                if(checkPos[j] === 9) {
                    return true; // is clipping
                }
            }
            break;
        }
    }

    // return false if no collision happens
    return false;
}

const srsTable = [
    // J, L, T, S, Z, (and O maybe)
    [-1, -11, 20, 19], // 0-1
    [1, 11, -20, -19], // 1-0
    [1, 11, -20, -19], // 1-2
    [-1, -11, 20, 19], // 2-1
    [1, -9, 20, 21], // 2-3
    [-1, 9, -20, -21], // 3-2
    [-1, 9, -20, -21], // 3-0
    [1, -9, 20, 21], // 0-3
    // just for I :)
    [-2, 1, 8, -19], // 0-1
    [2, -1, -8, 19], // 1-0
    [-1, 2, -21, 12], // 1-2
    [1, -2, 21, -12], // 2-1
    [2, -1, -8, 19], // 2-3
    [-2, 1, 8, -19], // 3-2
    [1, -2, 21, -12], // 3-0
    [-1, 2, -21, 12] // 0-3
];
let isTspin = false;
// This is where the SRS kicks happens
function srsKick(nextRotation) {
    let tryTable = [0, 0, 0, 0];
    if(rotation === 0) {
        if(nextRotation === 1) {
            // 0 -> R
            if(currentPiece === 'I') tryTable = srsTable[8];
            else tryTable = srsTable[0];
        }else if(nextRotation === 3) {
            // 0 -> L
            if(currentPiece === 'I') tryTable = srsTable[15];
            else tryTable = srsTable[7];
        }else {
            // 0 -> 2
        }
    }else if(rotation === 1) {
        if(nextRotation === 2) {
            // R -> 2
            if(currentPiece === 'I') tryTable = srsTable[10];
            else tryTable = srsTable[2];
        }else if(nextRotation === 0) {
            // R -> 0
            if(currentPiece === 'I') tryTable = srsTable[9];
            else tryTable = srsTable[1];
        }else {
            // R -> L
        }
    }
    else if(rotation === 2) {
        if(nextRotation === 3) {
            // 2 -> L
            if(currentPiece === 'I') tryTable = srsTable[12];
            else tryTable = srsTable[4];
        }else if(nextRotation === 1) {
            // 2 -> R
            if(currentPiece === 'I') tryTable = srsTable[11];
            else tryTable = srsTable[3];
        }else {
            // 2 -> 0
        }
    }
    else if(rotation === 3) {
        if(nextRotation === 2) {
            // L -> 2
            if(currentPiece === 'I') tryTable = srsTable[13];
            else tryTable = srsTable[5];
        }else if(nextRotation === 0) {
            // L -> 0
            if(currentPiece === 'I') tryTable = srsTable[14];
            else tryTable = srsTable[6];
        }else {
            // L -> R
        }
    }

    let nextPos = [[], [], [], []];
    let nextCoordinate = []; // this is only useful when kick is successful
    for(let i=0;i < 4;i++) {
        nextCoordinate[i] = tryTable[i] + verticalPosition + horizontalPosition;
        for(let j=0;j < 4;j++) {
            nextPos[i][j] = nextCoordinate[i] + currentPiece[nextRotation][j];
        }
    }
    for(let test=0;test < 4;test++) {
        if(!checkMoveCollision(nextPos[test])) {
            // move the piece
            clearCurrentRender();
            rotation = nextRotation;
            verticalPosition = Math.floor(nextCoordinate[test] / 10) * 10;
            horizontalPosition = nextCoordinate[test] % 10;

            if(currentColor === "t" && test === 3) {isTspin = true;} // this is an extra condition for spin to be t-spin (5th kick condition)
            checkTspin();
            return true; // if the kick succeeded, then move the piece, and return true
        }
    }

    return false; // if all 4 tests failed, don't move the piece and return false
}

function rotate_cw() {
    let rotationNext = rotation;
    if(rotation < 3) rotationNext++;
    else rotationNext = 0;

    if(checkRotateCollision(rotationNext)) {
        srsKick(rotationNext);
        return;
    }

    // all clear, move the piece
    clearCurrentRender();
    rotation = rotationNext;
    checkTspin();
}
function rotate_ccw() {
    let rotationNext = rotation;
    if(rotation > 0) rotationNext--;
    else rotationNext = 3;

    if(checkRotateCollision(rotationNext)) {
        srsKick(rotationNext);
        return;
    }

    clearCurrentRender();
    rotation = rotationNext;
    checkTspin();
}
function rotate_180() {
    let rotationNext = (rotation + 2) % 4;

    if(checkRotateCollision(rotationNext)) {
        return;
    }

    clearCurrentRender();
    rotation = rotationNext;
}
function move_left() {
    let nextPos = [];
    for(let i=0;i < 4;i++) {
        nextPos[i] = currentPiece[rotation][i] + verticalPosition + horizontalPosition - 1;
    }
    if(checkMoveCollision(nextPos)) {
        return;
    }

    // all clear, move the piece
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = ""; }
    horizontalPosition--;
}
function move_right() {
    let nextPos = [];
    for(let i=0;i < 4;i++) {
        nextPos[i] = currentPiece[rotation][i] + verticalPosition + horizontalPosition + 1;
    }
    if(checkMoveCollision(nextPos)) {
        return;
    }

    // all clear, move the piece
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = ""; }
    horizontalPosition++;
}

function moveDown() {
    // at-the-bottom detection
    for(let i=0;i < 4;i++) {
        if( (currentPiece[rotation][i] + verticalPosition + horizontalPosition) > 209) {
            return false; // if any part of the piece is already at the bottom
        }
    }
    // collision detection
    let check = [null,null,null,null];
    for(let i=0;i < 4;i++) check[i] = gameSpace[currentPiece[rotation][i] + verticalPosition+10 + horizontalPosition];
    for (let i = 0;i < 4;i++) {
        if ('a' <= check[i] && check[i] <= 'z') { // lowercase means placed block (and uppercase means current piece)
            return false;
        }
    }

    if(currentColor === "t" && isTspin) {isTspin = false;}
    clearCurrentRender();
    verticalPosition += 10;
    return true;
}
function hardDrop() {
    while(moveDown()) {}

    lockFrameCounter = lockFrame; // reset lockFrame

    update();
    placePiece();
}
function castShadow() {
    let isClipping = false;
    let shadow_offset = -10;
    while(isClipping === false) {
        shadow_offset += 10;
        // at-the-bottom detection
        for (let i = 0; i < 4; i++) {
            if ( (currentPiece[rotation][i] + verticalPosition+shadow_offset + horizontalPosition) > 209) {
                isClipping = true; // if any part of the piece is already at the bottom
            }
        }
        if(isClipping) break;

        // collision detection
        let check = [null,null,null,null];
        for(let i=0;i < 4;i++) check[i] = gameSpace[currentPiece[rotation][i] + verticalPosition+shadow_offset+10 + horizontalPosition];
        for (let i = 0;i < 4;i++) {
            if ('a' <= check[i] && check[i] <= 'z') { // lowercase means placed block (and uppercase means current piece)
                isClipping = true;
            }
        }
    }

    for(let i=0;i < 4;i++) {
        if(grids[currentPiece[rotation][i] + verticalPosition+shadow_offset + horizontalPosition].className === "grid")
            grids[currentPiece[rotation][i] + verticalPosition+shadow_offset + horizontalPosition].className = "grid shadow";
    }
}



const PIECE_Z = [[0,1,11,12], [2,11,12,21], [10,11,21,22], [1,10,11,20]];
const PIECE_S = [[1,2,10,11], [1,11,12,22], [11,12,20,21], [0,10,11,21]];
const PIECE_L = [[2,10,11,12], [1,11,21,22], [10,11,12,20], [0,1,11,21]];
const PIECE_J = [[0,10,11,12], [1,2,11,21], [10,11,12,22], [1,11,20,21]];
const PIECE_I = [[10,11,12,13], [2,12,22,32], [20,21,22,23], [1,11,21,31]];
const PIECE_T = [[1,10,11,12], [1,11,12,21], [10,11,12,21], [1,10,11,21]];
const PIECE_O = [[1,2,11,12], [1,2,11,12], [1,2,11,12], [1,2,11,12]];


let currentPiece;
let currentColor;
function setCurrentPiece(input) {
    currentColor = input.toLowerCase();
    switch(input) {
        case "Z":
            currentPiece = PIECE_Z;
            break;
        case "S":
            currentPiece = PIECE_S;
            break;
        case "L":
            currentPiece = PIECE_L;
            break;
        case "J":
            currentPiece = PIECE_J;
            break;
        case "I":
            currentPiece = PIECE_I;
            break;
        case "T":
            currentPiece = PIECE_T;
            break;
        case "O":
            currentPiece = PIECE_O;
            break;
    }
}

function placePiece() {
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = currentColor; }
    lineClear();
    spawnPiece();
}

function spawnPiece() {
    // console.log("spawnPiece called, pieceBag: " + pieceBag);
    if(pieceBag.length < 7) {
        generateBag();
    }
    updateNextPieces(pieceBag);

    horizontalPosition = 3;
    verticalPosition = 0;
    rotation = 0;
    setCurrentPiece(pieceBag.pop());


    // collision detection
    for(let i=0;i < 4;i++) {
        if(gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] !== "") {
            // if spawn is blocked
            // send lose message to server
            socket.emit("send_gameOver");

            gameOver();
        }
    }

    holdCd = false;
}


let rotation = 0;
let horizontalPosition = 3; // x coordinate
let verticalPosition = -10; // always 10's multiple



// This updates the grid class and thus game board color
function update() {
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = ""; }
    for(let i=0;i < 4;i++) { gameSpace[currentPiece[rotation][i] + verticalPosition + horizontalPosition] = currentColor.toUpperCase(); }
}



let lastUpdate = Date.now();
let intervalTick = setInterval(tick, 16.6); // start tick; // about 60 fps

let gravity = 1000; // move down every ? ms
let gravityTimer = 0;

let lockFrame = 150; // frames until a piece locks down
let lockFrameCounter = lockFrame;

let das = 8; // [frames]
let dasTimer_left = das;
let dasTimer_right = das;

let arr = 0; // [frames]
let arrTimer_left = arr;
let arrTimer_right = arr;

let hardDropCd = false; // to prevent unintended hard-drop spam
// rotate cool-downs
let cwCd = false;
let ccwCd = false;
let r180Cd = false;
// hold piece cool-down
let holdCd = false;

// first spawn
spawnPiece();

function tick() {
    let now = Date.now(); // [ms]
    let dt = now - lastUpdate;
    lastUpdate = now;
    gravityTimer -= dt;


    if(gravityTimer < 0) {
        moveDown();
        gravityTimer += gravity;
    }
    
    if(lockFrameCounter > 0) {
        // at-the-bottom detection
        for(let i=0;i < 4;i++) {
            if( (currentPiece[rotation][i] + verticalPosition + horizontalPosition) > 209) {
                lockFrameCounter--; // if any part of the piece is already at the bottom
            }
        }
        // collision detection
        let check = [null,null,null,null];
        for(let i=0;i < 4;i++) check[i] = gameSpace[currentPiece[rotation][i] + verticalPosition+10 + horizontalPosition];
        for (let i = 0;i < 4;i++) {
            if ('a' <= check[i] && check[i] <= 'z') { // lowercase means placed block (and uppercase means current piece)
                lockFrameCounter--;
            }
        }
    }else {
        hardDrop();
    }

    if(keyMap["ArrowDown"]) {
        moveDown();
    }


    // L/R movement
    if(keyMap["ArrowLeft"] && !keyMap["ArrowRight"]) {
        if(dasTimer_left === das) {
            move_left();
            dasTimer_left--;
        }else if(dasTimer_left > 0) {
            dasTimer_left--;
        }else {
            if (arr === 0) { // if arr is 0 frames then teleport the piece to the border
                for(let i=0;i < 9;i++) {
                    move_left();
                }
            } else { // if arr is not 0, then use the arrTimer
                if (arrTimer_left <= 0) {
                    move_left();
                    arrTimer_left = arr;
                } else {
                    arrTimer_left--;
                }
            }
        }
    }
    if(keyMap["ArrowRight"] && !keyMap["ArrowLeft"]) {
        if(dasTimer_right === das) {
            move_right();
            dasTimer_right--;
        }else if(dasTimer_right > 0) {
            dasTimer_right--;
        }else {
            if (arr === 0) { // if arr is 0 frames then teleport the piece to the border
                for(let i=0;i < 9;i++) {
                    move_right();
                }
            } else { // if arr is not 0, then use the arrTimer
                if (arrTimer_right <= 0) {
                    move_right();
                    arrTimer_right = arr;
                } else {
                    arrTimer_right--;
                }
            }
        }
    }
    if(!keyMap["ArrowLeft"]) {
        dasTimer_left = das;
    }
    if(!keyMap["ArrowRight"]) {
        dasTimer_right = das;
    }

    if(keyMap["b"] || keyMap[" "]) {
        if(!hardDropCd) hardDrop();
        hardDropCd = true; // this stops unintended hard-drop spam every frame
    }else {
        hardDropCd = false;
    }

    if(keyMap["ArrowUp"]) {
        if(!cwCd) rotate_cw();
        cwCd = true;
    }else {
        cwCd = false;
    }
    if(keyMap["z"] || keyMap["x"]) {
        if(!ccwCd) rotate_ccw();
        ccwCd = true;
    }else {
        ccwCd = false;
    }
    if(keyMap["a"]) {
        if(!r180Cd) rotate_180();
        r180Cd = true;
    }else {
        r180Cd = false;
    }

    if(keyMap["c"]) {
        if(!holdCd) {
            // holdCd = true; // this is done in holdPiece() function
            holdPiece();
        }
    }

    update();
    render();

    socket.emit("send_gameSpace", gameSpace); // send game state to server
}


function gameOver() {
    clearInterval(intervalTick);

    if(win) {
        document.getElementById("gameOverPopup").children[0].innerHTML = "You Win";
    }else {
        document.getElementById("gameOverPopup").children[0].innerHTML = "You Lost";
    }
    document.getElementById("gameOverPopup").style.display = "block";
}


// Key press detector
let keyMap = {}; // an array for keys' stats
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    keyMap[e.key] = e.type === "keydown";
}



// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
// See https://github.com/coolaj86/knuth-shuffle
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}



const garbageGauge = document.getElementById("garbageGauge");
function updateGarbageGauge() {
    garbageGauge.children[0].style.height = (garbageLines * 40) + "px";
}


// show message, not really related to the game's mechanics
MESSAGE_BOX = document.querySelector("#messageBox");
let messages = []; // message queue
let timeout_hideMessageBox;
function showMessage(msg) {
    clearTimeout(timeout_hideMessageBox);
    messages.unshift(msg);
    setTimeout(() => {
        messages.pop();
    }, 3000)

    MESSAGE_BOX.innerHTML = "";
    messages.forEach(message => {
        MESSAGE_BOX.innerHTML += "<br>" + message;
    });

    MESSAGE_BOX.style.display = "block";
    timeout_hideMessageBox = setTimeout(() => {
        MESSAGE_BOX.style.display = "none";
    }, 3000)
}


const OVERLAY_MENU = document.getElementById("overlay_menu");
// Overlay menu
function hideOverlay() {
    OVERLAY_MENU.style.display = "none";
}
function showOverlay() {
    OVERLAY_MENU.style.display = "block";
}
function setOverlayMessage(msg) {
    OVERLAY_MENU.children[0].innerHTML = msg;
}
hideOverlay(); // idk why it won't hide so this


// show second board when connection is made
function showSecondBoard() {
    document.getElementById("secondBoard").style.display = "block";
}



// Socket script
const socket = io('http://25.68.222.197:3000', { transports : ['websocket'] });
socket.on('connect', () => {
    showMessage("成功建立連線 (Client ID: " + socket.id + ")");
    showSecondBoard();
    setOverlayMessage("正在等待其他玩家");
    
    socket.emit("send_connectionEstablished");
	console.log(socket.id);
});


socket.on('receive_message', (msg) => {
    showMessage(msg);
});


socket.on('receive_gameSpace', (received_gameSpace) => {
    gameSpace2 = received_gameSpace;
});


let garbageLines = 0;
socket.on('receive_garbage', (received_garbage_lines) => {
    garbageLines += received_garbage_lines;
    updateGarbageGauge();
});


let win = false;
socket.on('receive_gameOver', () => {
    win = true;
    gameOver();
});


socket.on('receive_gameStart', () => {
    hideOverlay();
    showMessage("配對成功，遊戲開始");
});
socket.on('receive_gameStop', () => {
    setOverlayMessage("對手連線中斷，停止遊戲");
    showOverlay();
    clearInterval(intervalTick);
});






