const TURN_LIMIT_LOWER_BOUND = 5;
const DEFAULT_TOLERANCE = 3;


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


let end_message = document.getElementById('gg');
function gameover() {
    end_message.innerHTML = "Congratulations!<br>You did it!";
    end_message.style.display = 'block';
}


let Game = document.getElementById("game");
let Lockpick_container = document.getElementById("lockpick_container");
let Lockpick = document.getElementById("lockpick");
let Keyway = document.getElementById("keyway");
let Left_threshold = document.getElementById("left_threshold");
let Right_threshold = document.getElementById("right_threshold");


// Key press detector
let keyPress = false; // This controls the turning of the lock
onkeydown = function(e) {
    keyPress = true;
}
onkeyup = function(e) {
    keyPress = false;
}


// mouse position
let mouseX = null;
Game.onmousemove = handleMouseMove;
Game.onmouseenter = resetMousePos;
function resetMousePos(event) {
    event = event || window.event; // ie
    lastMouseX = event.pageX;
}
function handleMouseMove(event) {
    event = event || window.event; // ie
    mouseX = event.pageX;
    // console.log(event.pageX + "," + event.pageY);
}


// settings
let SettingsForm = document.querySelector("#settings_container form");
function set_target(checkbox) {
    let visibility = checkbox.checked;
    visibility = (visibility) ? "visible" : "hidden";
    Left_threshold.style.visibility = visibility;
    Right_threshold.style.visibility = visibility;   
}


function move_lockpick(mouseMoveX) {
    lockpickPosition += mouseMoveX * 0.8;
    if(lockpickPosition == null) lockpickPosition = 0;
    if(lockpickPosition > 90) lockpickPosition = 90;
    else if(lockpickPosition < -90) lockpickPosition = -90;
}


// display variables
let stuckTimer = 0;


let settings_stuck_timer_s = document.getElementById("stuck_timer_s");
let settings_stuck_timer_ms = document.getElementById("stuck_timer_ms");
function update_display() {
    settings_stuck_timer_s.innerText = Math.floor(stuckTimer / 1000);
    settings_stuck_timer_ms.innerText = stuckTimer % 1000;
}


// game variables
let turnProgress = 0; // 0-100, [int]
let lastMouseX = null;
let lockpickPosition = 0;
let spotPosition = 0; // -90 - +90, [float]
let spotTolerance = 10; // 0 - 90, [float]
let previousTime = Date.now();
// game tick
function tick() {
    // for timers
    let now = Date.now(); // [ms]
    let dt = now - previousTime;
    previousTime = now;

    let mouseMoveX = mouseX - lastMouseX; // displacement on x axis of mouse
    lastMouseX = mouseX;
    if(!keyPress)
        move_lockpick(mouseMoveX);

    // calculates the shortest distance between <target spot +- tolerance> and <current lockpick position>
    let error = Math.min(Math.abs(lockpickPosition - spotPosition - spotTolerance), Math.abs(lockpickPosition - spotPosition + spotTolerance));
    if(spotPosition - spotTolerance < lockpickPosition && lockpickPosition < spotPosition + spotTolerance) error = 0;
    let turnLimit = (90 - error*error*0.3);
    if(turnLimit > 90) turnLimit = 90;
    if(turnLimit < TURN_LIMIT_LOWER_BOUND) turnLimit = TURN_LIMIT_LOWER_BOUND;

    // turn the keyway;
    if(keyPress) {
        turnProgress += 5;
        if(turnProgress > turnLimit) {
            turnProgress = turnLimit;
            if(turnProgress == "90") {
                lock_solved();
            }else {
                Lockpick.classList.add("lockpick_stuck");
                stuckTimer += dt;
            }
        }
        
    }else {
        turnProgress -= 5;
        if(turnProgress < 0) turnProgress = 0;
        Lockpick.classList.remove("lockpick_stuck");
    }    

    Keyway.style.transform = "rotate("+turnProgress+"deg)";
    Lockpick_container.style.transform = "rotate("+turnProgress+"deg) translateY(-70px)";
    Lockpick.style.transform = "rotate("+(lockpickPosition)+"deg)";

    update_display(dt);
}


function init_game(pos=-1, tol=DEFAULT_TOLERANCE) {
    Popup.classList.remove("popup");
    ResetButton.classList.add("hidden");
    lockpickPosition = 0;

    reset_display_variables();

    console.log("game initialized: pos=", pos, ", tor=", tol);

    if(pos == -1 || pos < -90 || 90 < pos)
        pos = -90 + 180*Math.random();
    spotPosition = pos;
    spotTolerance = tol;

    if(spotPosition < -90 || 90 < spotPosition) spotPosition = 10;
    if(spotTolerance < 0 || 90 < spotTolerance) spotTolerance = 90;

    Left_threshold.style.transform = "rotate("+ (spotPosition - spotTolerance) +"deg)";
    Right_threshold.style.transform = "rotate("+ (spotPosition + spotTolerance) +"deg)";
}


function reset_display_variables() {
    stuckTimer = 0;
}


let Popup = document.getElementById("popup");
let ResetButton = document.getElementById("reset_button");
function lock_solved() {
    Popup.classList.add("popup");
    ResetButton.classList.remove("hidden");
}


let intervalTick = setInterval(tick, 16.6); // start tick; // about 60 fps
init_game();