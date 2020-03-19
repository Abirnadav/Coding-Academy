'use strict'


function showModal(value) {
    var modal = document.querySelector(".modal");
    // if value is bigger than 0 Means win!
    if (value > 0) {
        var pModal = document.querySelector(".textmodal");
        pModal.innerText = "You Win!"

        var pModal1 = document.querySelector(".textmodal1");
        pModal1.innerText = 'Time: ' + gGame.time + 's Hints Left: ' + (gGame.hints) + ' Lives Left: ' + (gGame.lives);
    }
    modal.style.display = "block";
}

function hideModal() {
    var modal = document.querySelector(".modal");
    modal.style.display = "none";
}
window.onclick = function(event) {
    var modal = document.querySelector(".modal");
    if (event.target == modal) {
        win.pause()
        modal.style.display = "none";
    }
}



/// Local Storage /// Its UI isnt at is best..
// Store Best Score // Currently every last score :D
function storeBestPlayerScore() {
    localStorage.setItem("time", gGame.time);
    localStorage.setItem("lives", gGame.lives);
    localStorage.setItem("hints", gGame.hints);


}


// Get best time and Render
window.onload = getBestTime()

function getBestTime() {
    var bestTime = localStorage.getItem("time");
    var hints = localStorage.getItem("hints");
    var lives = localStorage.getItem("lives");

    document.querySelector(".bestTime").innerText = 'Time: ' + bestTime + 's Hints Left: ' + hints + ' Lives Left: ' + lives;
}