function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timeCount() {
    if (gGame.isOn) return;
    var elMlSeconds = document.querySelector('.timer');
    elMlSeconds.innerHTML = CLOCK + gGame.time + 's'
    gTimer = setInterval(() => {

        elMlSeconds.innerHTML = CLOCK + gGame.time + 's'
        gGame.time += 1
    }, 1000);
}



function toggleDiff() {
    var elDiff = document.querySelector('.easy')
    elDiff.classList.toggle('hide')
}


function toggleTable() {
    var elTable = document.querySelector('.table')
    elTable.classList.toggle('hide')
    toggleSmiley()
}

function toggleBtn() {
    var elBtn = document.querySelector('.btn')
    elBtn.classList.toggle('hide')
}

// Stop Start Game + Change Text on BTN
function toggleGame(elBtn) {
    elBtn.innerText = 'Clean The Mines To Escape!!'
    var elDiff = document.querySelector('.easy')
    elDiff.classList.remove('hide')
        // elBtn.innerText = 'Click Here to Rest'
}

function toggleSmiley() {
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = COOL
    elSmiley.classList.remove('hide')
        // elBtn.innerText = 'Click Here to Rest'
}

// Set Difficulty
function setDifficulty(size, mines) {
    gMinesCount = mines
    gBoardSize = size

    toggleDiff()
    toggleTable()
    toggleBtn()

    init()
}