let started = false;
let stoppable = false;

const DISPLAY = document.getElementById("display");
const TIMER = document.getElementById("timer");

let lastUpdate = Date.now();
let intervalTick = setInterval(tick, 10); // this should be terminated when game ends
let timer = 0; // game timer

let taps = []; // list storing the absolute time of all taps by user


function tick() {
    let now = Date.now(); // [ms]
    let dt = now - lastUpdate;
    lastUpdate = now;
    timer += dt;

    TIMER.innerText = timer;

    if(stoppable && timer > bpm_average*2) {
        clearInterval(intervalTick);
        console.log("Stopped");

        let sum = 0;
        for(let i=0;i < taps.length;i++) {
            sum += taps[i];
        }
        let final_average = sum / taps.length;
        console.log("Final average: ",(60000 / final_average));
    }
}


function gameOver() {
    clearInterval(intervalTick);
    console.log("Game Over");
}


let bpm_sum = 0; // sum of all taps intervals (for dividing)
let bpm_average = 0; // average tap interval
function tap() {
    if(!started) {
        started = true;
        // reset time at first tap
        lastUpdate = Date.now();
        timer = 0;
        return;
    }
    if(!stoppable && bpm_average > 0) {
        stoppable = true
    }

    bpm_sum += timer;
    taps.push(timer);
    timer = 0;
    
    bpm_average = bpm_sum / taps.length;
    console.log("avg: ",bpm_average);
    // convert average interval [ms/tap] to bpm [tap/60,000ms]
    DISPLAY.innerText = (60000 / bpm_average).toFixed(2);
}


// // Key press detector
// let keyMap = {}; // a array for keys' stats
// onkeydown = onkeyup = function(e){
//     e = e || event; // to deal with IE
//     keyMap[e.key] = e.type === "keydown";
// }