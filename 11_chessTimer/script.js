let current = 0; // 0 or 1, indicates current timer
let timer = [0, 0];

// document.elements
const TIMER = [
    [document.querySelector("#timer1>.min"),
    document.querySelector("#timer1>.sec"),
    document.querySelector("#timer1>.ms")],
    [document.querySelector("#timer2>.min"),
    document.querySelector("#timer2>.sec"),
    document.querySelector("#timer2>.ms")],
];
const BUTTON = [
    document.getElementById("button1"),
    document.getElementById("button2")
];
const CONTAINER_MENU = document.getElementById('container_menu');
const CONTAINER_CLOCK = document.getElementById('container_clock')

let started = false;
let tick_func = null; // function pointer

let intervalTick = null;
let lastUpdate = null;

// onclick don't look good on mobile, use eventlistener instead
BUTTON[0].addEventListener("click", function() {buttonPushed(1);} ); 
BUTTON[1].addEventListener("click", function() {buttonPushed(2);} ); 


function menuButtonPushed(msg) {
    switch(msg) {
        case 'countup':
        case '1m':
        case '10s':
            clock_mode = msg; // so that buttons like 'set time' can be added
    }
    CONTAINER_MENU.style.display = 'none';
    CONTAINER_CLOCK.style.display = 'flex';
    
    switch(clock_mode) {
        case 'countup':
            tick_func = tick_count_up_mode;
            break;
        case '1m':
            timer = [60000, 60000];
            tick_func = tick_count_down_mode;
            break;
        case '10s':
            timer = [10000, 10000];
            tick_func = tick_count_down_mode;
    }
    updateTimer(0);
    updateTimer(1);
}


// different func for different mode
function tick_count_up_mode() {
    let now = Date.now(); // [ms]
    let dt = now - lastUpdate;
    lastUpdate = now;
    
    timer[current] += dt;
    updateTimer(current);
}

function tick_count_down_mode() {
    let now = Date.now(); // [ms]
    let dt = now - lastUpdate;
    lastUpdate = now;
    
    timer[current] -= dt;
    if(timer[current] < 0) {
        timer[current] = 0;
        stopClock();
    }
    updateTimer(current);
}


function stopClock() {
    clearInterval(intervalTick);
    console.log("Clock stopped");
}

function buttonPushed(n) {
    if(!started) { // initiate clock on the first button push
        started = true;
        lastUpdate = Date.now();
        intervalTick = setInterval(tick_func, 10); // interval: 0.1 second
    }
    
    // switch side
    BUTTON[current].classList.remove("disabled");
    current = (n+1) % 2;
    BUTTON[current].classList.add("disabled");    
}

function updateTimer(clk) {
    let temp = timer[clk];
    TIMER[clk][0].innerText = Math.floor(temp/60000);  // min
    temp %= 60000;
    if(Math.floor(temp/1000) < 10)
        TIMER[clk][1].innerText = '0'+Math.floor(temp/1000);
    else
        TIMER[clk][1].innerText = Math.floor(temp/1000); // sec

    temp %= 1000;
    TIMER[clk][2].innerText = temp; // ms
    while(TIMER[clk][2].innerText.length < 3) TIMER[clk][2].innerText = '0'+TIMER[clk][2].innerText;
}