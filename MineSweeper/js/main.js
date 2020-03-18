'use strict'
// Const VARS with Image Sources
const NUM0 = '<img src="img/backCell.png" />';
const NUM1 = '<img src="img/num1.jpg" />';
const NUM2 = '<img src="img/num2.jpg" />';
const NUM3 = '<img src="img/num3.jpg" />';
const NUM4 = '<img src="img/num4.jpg" />';
const NUM5 = '<img src="img/num5.jpg" />';
const MINE = '<img src="img/bomb.png" />';
const FLAG = '<img src="img/flag.png" />';
const EMPTY = '<img src="img/frontCell.png" />';
const EMPTYDONE = '<img src="img/backCell.png" />';
const CLOCK = '<img src="img/clock.png" />';
const HAPPY = '<img src="img/happy.png" />';
const CRY = '<img src="img/cry.png" />';
const COOL = '<img src="img/cool.png" />';
const HINT = '<img src="img/hint.png" />';


// GAME global vars and objects
var gBoard;
var gBoardSize = 8
var gMinesCount = 0
var gTimer;
var gGame = {
    isOn: false,
    time: 0,
    shownCount: 0,
    markedCount: 0,
    lives: 3,
    hints: 3,
}

function gameWon() {
    alert('YOU WIN!!!!')
}

//Check If Flag = total Mines and IF open cells = total 
function checkWin() {
    var shownNumForWIn = gBoardSize * gBoardSize - gMinesCount
    if (gGame.shownCount === shownNumForWIn && gGame.markedCount === gMinesCount) {
        console.log('you won')
        gameWon()
    }
}

// Create Cell Object
function createCell() {
    var gCell = {
        type: EMPTY,
        show: false,
        isFlagged: false,
    }
    return gCell
}

// Initialize Game
function init() {
    gBoard = createBoard(gBoardSize);
    // shuffleMines()
    // scanBoard()
    renderBoard(gBoard)
}

// Shuffle Mines In the Board
function shuffleMines() {
    for (var i = 0; i < gMinesCount; i++) {
        var iIdx = getRandomIntInclusive(0, gBoardSize - 1)
        var jIdx = getRandomIntInclusive(0, gBoardSize - 1)
        if (gBoard[iIdx][jIdx].type === EMPTY) {
            gBoard[iIdx][jIdx].type = MINE;
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

// Scan the board for and change its Cell Value To num of Neighbors
function scanBoard() {
    var value;
    for (var i = 0; i < gBoardSize; i++) {
        for (var j = 0; j < gBoardSize; j++) {
            if (gBoard[i][j].type === MINE) continue;
            if (gBoard[i][j].type === EMPTYDONE) continue;
            var currNeighborsSum = countNeighborsMines(i, j, gBoard)
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
            }
            gBoard[i][j].type = value;
            if (gBoard[i][j].show) {
                renderCell(i, j, value)
            }
        }
    }
}
/// BONUS DO LATER!
function countNeighborsZeros(cellI, cellJ, mat) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].type === NUM0) neighborsSum++;
        }
    }
    return neighborsSum;
}
// Show all At Game over
function showMinesGameOVer() {
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

function gameOver() {
    showMinesGameOVer()
    clearInterval(gTimer)
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

// Cell Click : gets a cell Location and calls to action
function cellClicked(elCell, cellI, cellJ, isFlagClick) {

    if (isFlagClick) {
        if (gBoard[cellI][cellJ].show) {
            return;
        }

        // If Cell is Flagged UnFlag
        if (gBoard[cellI][cellJ].isFlagged) {
            renderCell(cellI, cellJ, EMPTY)
            gBoard[cellI][cellJ].isFlagged = false
            gGame.markedCount--
                return;
        }
        // If Cell is UnFlagged : Flag
        renderCell(cellI, cellJ, FLAG)
        gBoard[cellI][cellJ].isFlagged = true;
        gGame.markedCount++
            return;
    }
    if (gBoard[cellI][cellJ].isFlagged) return;
    if (gBoard[cellI][cellJ].show) {
        return;
    }
    // If Cell is a Mine : Game Over
    if (gBoard[cellI][cellJ].type === MINE) {
        gBoard[cellI][cellJ].show = true;
        gameOver()
        renderCell(cellI, cellJ, MINE)
        return;
    }
    // If isnt a Mine Action
    if (gBoard[cellI][cellJ].type != MINE) {
        gGame.shownCount++
            //Update the model: TYPE + SHOW
            gBoard[cellI][cellJ].show = true;
        gBoard[cellI][cellJ].type = EMPTYDONE;
        //Update DOM
        elCell.innerHTML = EMPTYDONE
            // Put Mines , Set Game ON  , Start time count
        if (gGame.isOn === false) {
            shuffleMines()
            scanBoard()
        }
        timeCount()
        gGame.isOn = true;
        showNeighborsValue(cellI, cellJ, gBoard)
        scanBoard()
        checkWin()
    }
}

// Show Neighbors of given cell if They are not
function showNeighborsValue(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].type === MINE) continue;
            if (mat[i][j].isFlagged === true) continue;
            if (!mat[i][j].show === true) {
                gGame.shownCount++
            }
            mat[i][j].show = true;
            renderCell(i, j, EMPTYDONE)
        }
    }
}

// Renders Cell Value By location
function renderCell(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCell.innerHTML = value
}

// Render Board! Happens Once
function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            if (gBoard[i][j].show) {
                var currCellContent = gBoard[i][j].type
            } else {
                var currCellContent = EMPTY;
            }
            var className = (board[i][j]) ? 'occupied' : ''
            var dataName = `data-i="${i}" data-j="${j}"`
            strHtml += `<td ${dataName} oncontextmenu="cellClicked(this ,${i}, ${j}, true)" onclick="cellClicked(this ,${i}, ${j} , false)"
             class="${className}"  >
            ${currCellContent}
            </td> `
        }
        strHtml += '</tr>'
    }
    var elTbody = document.querySelector('.board')
    elTbody.innerHTML = strHtml

}