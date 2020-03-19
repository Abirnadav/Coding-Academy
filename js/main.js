'use strict'
// Const VARS with Image Sources
const NUM0 = '<img class="small" src="img/backCell.png" />';
const NUM1 = '<img class="small" src="img/num1.jpg" />';
const NUM2 = '<img class="small" src="img/num2.jpg" />';
const NUM3 = '<img class="small" src="img/num3.jpg" />';
const NUM4 = '<img class="small" src="img/num4.jpg" />';
const NUM5 = '<img class="small" src="img/num5.jpg" />';
const NUM6 = '<img class="small" src="img/num6.jpg" />';
const NUM7 = '<img class="small" src="img/num7.jpg" />';
const NUM8 = '<img class="small" src="img/num8.jpg" />';
const MINE = '<img class="small" src="img/bomb.png" />';
const FLAG = '<img class="small" src="img/flag.png" />';
const EMPTY = '<img class="small" src="img/frontCell.png" />';
const EMPTYDONE = '<img class="small" src="img/backCell.png" />';
const HINT = '<img class="sidebtn" src="img/hint.png" />';

// Audio
const bomb = new Audio('sound/bomb.wav');
const fail = new Audio('sound/fail.mp3');
const click = new Audio('sound/Click.wav');
const win = new Audio('sound/win.mp3');
const hover = new Audio('sound/hover.mp3');

// Create Cell Object
function createCell() {
    var gCell = {
        type: EMPTY,
        show: false,
        isFlagged: false,
    }
    return gCell
}

// GAME global vars and objects
var gBoard;
var gBoardSize = 8
var gMinesCount = 0
var gMinesCountCreated = 0
var gTimer;
var gGame = {
    isOn: false,
    time: 0,
    shownCount: 0,
    markedCount: 0,
    lives: 3,
    hints: 10,
    hintMode: false,
}

function gameWon() {
    clearInterval(gTimer)
    storeBestPlayerScore()
    showModal(1)
    smileyWin()
    win.play()
}

//Check If Flag = total Mines and IF open cells = total 
function checkWin() {
    var shownNumForWIn = ((gBoardSize * gBoardSize) - gMinesCountCreated)
    if (gGame.shownCount === shownNumForWIn) {
        if (gGame.markedCount === gMinesCountCreated) {
            gameWon()
        }
    }
}

// Initialize Game
function init() {
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard)
    renderLivesCount()
    renderHintsCount()
    renderTimerCount()
}

// Shuffle Mines In the Board
function shuffleMines() {
    for (var i = 0; i < gMinesCount; i++) {
        var iIdx = getRandomIntInclusive(0, gBoardSize - 1)
        var jIdx = getRandomIntInclusive(0, gBoardSize - 1)
        if (gBoard[iIdx][jIdx].type !== EMPTY) {
            i--
            continue;
        }
        if (gBoard[iIdx][jIdx].type === EMPTY) {
            gBoard[iIdx][jIdx].type = MINE;
            gMinesCountCreated++
        }
    }
    return;
}

// Creates the board

function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = createCell()
        }
    }
    return board;
}
// Gets a Number Gives Back a Value 
function numSumToValue(currNeighborsSum) {
    var value
    if (currNeighborsSum === 0) {
        value = NUM0
    } else if (currNeighborsSum === 1) {
        value = NUM1
    } else if (currNeighborsSum === 2) {
        value = NUM2
    } else if (currNeighborsSum === 3) {
        value = NUM3
    } else if (currNeighborsSum === 4) {
        value = NUM4
    } else if (currNeighborsSum === 5) {
        value = NUM5
    } else if (currNeighborsSum === 6) {
        value = NUM6
    } else if (currNeighborsSum === 7) {
        value = NUM7
    } else if (currNeighborsSum === 8) {
        value = NUM8
    }
    return value;
}


// Scan the board and change its Cell Value To num of Neighbors
function scanBoardRenderNegMineSum() {
    var value;
    for (var i = 0; i < gBoardSize; i++) {
        for (var j = 0; j < gBoardSize; j++) {
            if (gBoard[i][j].type === MINE) continue;
            if (gBoard[i][j].type === EMPTYDONE) continue;
            var currNeighborsSum = countNeighborsMines(i, j, gBoard)
            value = numSumToValue(currNeighborsSum)
            gBoard[i][j].type = value;
            if (gBoard[i][j].show) {
                renderCell(i, j, value)
            }
        }
    }
}
// Show all At Game over
function showMinesGameOver() {
    var value;
    for (var i = 0; i < gBoardSize; i++) {
        for (var j = 0; j < gBoardSize; j++) {
            if (gBoard[i][j].type === MINE) {
                value = gBoard[i][j].type
                gBoard[i][j].show = true;
                renderCell(i, j, value)
            }
        }
    }
}


/// Will Count The Neighbor mines Of a given Cell  and returns a Sum
function countNeighborsMines(cellI, cellJ, mat) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].type === MINE) neighborsSum++;
        }
    }
    return neighborsSum;
}
// Call for render after 1.5 seconds
function unRenderTimeout(cellI, cellJ, clickCelli, clickCellJ) {
    setTimeout(unRenderHint, 1500, cellI, cellJ);
    setTimeout(unRenderHint, 1500, clickCelli, clickCellJ);
}

// Unrender The hint Cells
function unRenderHint(cellI, cellJ) {
    gBoard[cellI][cellJ].show = false;
    renderCell(cellI, cellJ, EMPTY)
    setHintModeOff()
}
// Show Cells around hint cell
function hintNeighborsCell(cellI, cellJ, mat) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].show === true) continue;
            mat[i][j].show = true;
            var clickedCellValue = gBoard[cellI][cellJ].type
            var value = mat[i][j].type
            renderCell(i, j, value)
            renderCell(cellI, cellJ, clickedCellValue)
            unRenderTimeout(i, j, cellI, cellJ)
        }
    }
}

// Cell Click : gets a cell Location and calls to action
function cellClicked(elCell, cellI, cellJ, isFlagClick) {
    click.play()
    if (gGame.hintMode === true) {
        hintNeighborsCell(cellI, cellJ, gBoard)
        gGame.hintMode = false;
        return;
    }
    if (isFlagClick) {
        timeCount()
        checkWin()
        gGame.isOn = true;
        if (gBoard[cellI][cellJ].show) {
            return;
        }

        // If Cell is Flagged UnFlag
        if (gBoard[cellI][cellJ].isFlagged) {
            renderCell(cellI, cellJ, EMPTY)
            gBoard[cellI][cellJ].isFlagged = false
            gGame.markedCount--
                checkWin()
            gameStartHelper()
            return;
        }
        // If Cell is UnFlagged : Flag
        renderCell(cellI, cellJ, FLAG)
        gBoard[cellI][cellJ].isFlagged = true;
        gGame.markedCount++
            checkWin()
        gameStartHelper()
        return;
    }
    if (gBoard[cellI][cellJ].isFlagged) return;
    if (gBoard[cellI][cellJ].show) {
        return;
    }
    // If Cell is a Mine : Game Over
    if (gBoard[cellI][cellJ].type === MINE) {
        gameOver()
        return;
    }
    // If isnt a Mine Action
    if (gBoard[cellI][cellJ].type !== MINE) {
        var currNeighborsSum = countNeighborsMines(cellI, cellJ, gBoard)
        if (currNeighborsSum > 0) {
            gGame.shownCount++
                gBoard[cellI][cellJ].type = numSumToValue(currNeighborsSum)
            gBoard[cellI][cellJ].show = true;
            elCell.innerHTML = numSumToValue(currNeighborsSum)
                // If no mines Around me
        } else if (currNeighborsSum === 0) {
            gGame.shownCount++
                gBoard[cellI][cellJ].show = true;
            gBoard[cellI][cellJ].type = EMPTYDONE; //Update the model: TYPE + SHOW
            elCell.innerHTML = EMPTYDONE //Update DOM
            showNeighborsCell(cellI, cellJ, gBoard, 0)
        }
    }
    gameStartHelper()
    checkWin()
}
// Block of code That repears itself Regarding Game start
function gameStartHelper() {
    // Put Mines , Set Game ON  , Start time count
    if (gGame.isOn === false) {
        shuffleMines()
    }
    timeCount() // Im Checked inside :)
    gGame.isOn = true;
    scanBoardRenderNegMineSum()
}

// Show Neighbors of given cell if They are in standard 
function showNeighborsCell(cellI, cellJ, mat, dontShowNextNeg) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].type === MINE) continue;
            if (mat[i][j].isFlagged === true) continue;
            if (mat[i][j].show === true) continue;
            if (mat[i][j].type === EMPTYDONE) continue;
            if (mat[i][j].type !== EMPTY) continue;
            // Check If qualifies for another Expansion
            var currNeighborsSum = countNeighborsMines(i, j, gBoard)
            if (currNeighborsSum === 0) {
                // Shows next cells Values if its Zero paramter 1 indicates if its first cell or second cell
                if (dontShowNextNeg === 0) {
                    showNeighborsCell(i, j, mat, 1) // paramter 1  Indicates if its first cell clicked  or second cell
                }
            }
            gGame.shownCount++
                mat[i][j].show = true;
            renderCell(i, j, EMPTYDONE)
        }
    }
}