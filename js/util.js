function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timeCount() {
    if (gGame.isOn) return;
    gTimer = setInterval(() => {
        renderTimerCount()
        gGame.time += 1
    }, 1000);
}

function renderTimerCount() {
    var elMlSeconds = document.querySelector('.timer');
    elMlSeconds.innerHTML = 'Time: ' + gGame.time + 's'

}

function renderLivesCount() {
    var elLives = document.querySelector('.lives');
    elLives.innerHTML = 'Lives Left: ' + gGame.lives

}

function renderHintsCount() {
    var elLives = document.querySelector('.hints');
    elLives.innerHTML = 'Hints Left: ' + gGame.hints

}



function toggleDiff() {
    var elDiff = document.querySelector('.easy')
    elDiff.classList.toggle('hide')
}

function restart() {
    click.play()
    toggleBtn()
    toggleTable()
    toggleDiff()
    gBoard = []
    gBoardSize = 8
    gMinesCount = 0
    gMinesCountCreated = 0
    clearInterval(gTimer)
    gGame = {
        isOn: false,
        time: 0,
        shownCount: 0,
        markedCount: 0,
        lives: 3,
        hints: 3,
        hintMode: false,
    }
    init()
}

function toggleTable() {
    toggleSmiley()
    toggleHint()
    var elTable = document.querySelector('.table')
    elTable.classList.toggle('hide')
}

function smileyWin() {
    var elSmiley = document.querySelector('.cool')
    elSmiley.src = "img/cool.png"
}

function faceGame() {
    var elSmiley = document.querySelector('.cool')
    elSmiley.src = "img/study.png"
}

function sadFace() {
    var elSmiley = document.querySelector('.cool')
    elSmiley.src = "img/cry.png"
}

function toggleHint() {
    var elHint = document.querySelector('.button2')
    elHint.classList.toggle('hide')
}

function toggleSmiley() {
    var elSmiley = document.querySelector('.smiley')
    elSmiley.classList.toggle('hide')
}

function toggleBtn() {
    var elBtn = document.querySelector('.btn')
    elBtn.classList.toggle('hide')
}
// Stop Start Game + Change Text on BTN
function toggleGame(elBtn) {
    click.play()
    elBtn.innerText = 'Set Difficulty'
    var elDiff = document.querySelector('.easy')
    elDiff.classList.remove('hide')
}
// Set Difficulty
function setDifficulty(size, mines) {
    click.play()
    gMinesCount = mines
    gBoardSize = size
    toggleDiff()
    toggleTable()
    toggleBtn()
    init()
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
            currCellContent = EMPTY;
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
// Game Over And check lives!
function gameOver() {
    bomb.play()
    gGame.lives--;
    renderLivesCount()
    if (gGame.lives === 0) {
        sadFace()
        showMinesGameOver()
        clearInterval(gTimer)
        showModal(0)
    }
}
// Hint mode ON 
function setHintModeOn() {
    if (gGame.hintMode === true) {
        fail.play()
        return;
    }
    click.play()
    if (gGame.isOn === false) return;
    if (gGame.hints > 0) {
        gGame.hintMode = true;
        gGame.hints--
            renderHintsCount()
        return;
    }
    fail.play()
}
// Hint mode Off!
function setHintModeOff() {
    gGame.hintMode = false;
}
// btn Hover click Sound :)
function clickHover() {
    hover.play()
}