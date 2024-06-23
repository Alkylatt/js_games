let SHOTGUN = document.getElementById("shotgun");
let INV_OPPONENT = document.getElementById("inventory_opponent");
let INV_PLAYER = document.getElementById("inventory_player");
let SHELL_DISPLAY = document.getElementById("shell_display");
let HEALTH_DISPLAY = document.getElementById("health_display");
// ascii shotgun
SHOTGUN.innerHTML = " ,______________________________________       \n|_________________,----------._ [____]  \"\"-,__  __....-----=====\n               (_(||||||||||||)___________/   \"\"                |\n                  `----------' Krogg98[ ))\"-,                   |\n                                       \"\"    `,  _,--....___    |\n                                               `/           \"\"\"\"";
// shotgun ascii animation
let frame = 1;
let animationInterval;
// mouse coords
let mouseX = 0;
let mouseY = 0;
// health
let health_player;
let health_opponent;

initialize();



function shotgunAnimation(facing) {
    switch(facing) {
        case 'up':
            SHOTGUN.classList = "aimForward";
            break;
        case 'down':
            SHOTGUN.classList = "aimBackward";
            break;
        case 'pump':
            frame = 1;
            animationInterval = setInterval(shotgunPumpAnimation, 20);
            break;
        default:
            SHOTGUN.classList = "";
    }
}


function shotgunPumpAnimation() {
    switch(frame) {
        case 1:
        case 7:
            SHOTGUN.innerHTML = " ,______________________________________       \n|_________________,----------._ [____]  \"\"-,__  __....-----=====\n               (_(||||||||||||)___________/   \"\"                |\n                  `----------' Krogg98[ ))\"-,                   |\n                                       \"\"    `,  _,--....___    |\n                                               `/           \"\"\"\"";
            break;
        case 2:
        case 6:
            SHOTGUN.innerHTML = " ,______________________________________       \n|_________________,----------._ [____]  \"\"-,__  __....-----=====\n               (__(||||||||||||)__________/   \"\"                |\n                  `----------' Krogg98[ ))\"-,                   |\n                                       \"\"    `,  _,--....___    |\n                                               `/           \"\"\"\"";
            break;
        case 3:
        case 5:
            SHOTGUN.innerHTML = " ,______________________________________       \n|_________________,----------._ [____]  \"\"-,__  __....-----=====\n               (___(||||||||||||)_________/   \"\"                |\n                  `----------' Krogg98[ ))\"-,                   |\n                                       \"\"    `,  _,--....___    |\n                                               `/           \"\"\"\"";
            break;
        case 4:
            SHOTGUN.innerHTML = " ,______________________________________       \n|_________________,----------._ [____]  \"\"-,__  __....-----=====\n               (____(||||||||||||)________/   \"\"                |\n                  `----------' Krogg98[ ))\"-,                   |\n                                       \"\"    `,  _,--....___    |\n                                               `/           \"\"\"\"";
            break;
    }
    frame += 1;
    if(frame > 7) {
        console.log("animation done.");
        clearInterval(animationInterval);
    }
}


function getMousePos(evt) {
    var gun = SHOTGUN.getBoundingClientRect();
    //mouseX = evt.clientX - gun.left;
    gunMid = (gun.top + gun.bottom)/2;
    //console.log("mouseX: ",mouseX,"; mouseY: ", mouseY);
    console.log("mid: ",gunMid, "; mouseY: ", evt.clientY);
    return (evt.clientY < gunMid);
}


function shotgunAim(evt) {
    isClickingUpperPart = getMousePos(evt);
    if(isClickingUpperPart) {
        shotgunAnimation("up");
    }else {
        shotgunAnimation("down");
    }
}


// display all shells to the player
function showShells(shells) {
    if(shells.length <= 0) return;
    SHELL_DISPLAY.innerHTML = "";
    for(let i=0;i < shells.length;i++) {
        let newShell = document.createElement("div");
        newShell.classList = (shells[i]=="live") ? "live" : "blank";
        SHELL_DISPLAY.appendChild(newShell);
    }
}


// generate an array of random shells, then display it
function generateShells(amount=5) {
    if(amount < 2) {
        console.log("Should not generate less than 2 shells");
        return;
    }

    let shells = [];
    for(let i=0;i < amount;i++) {
        if(Math.floor(Math.random() * 2) == 1)
            shells.push("live");
        else
            shells.push("blank");
    }

    // swap out one shell if all shells are the same
    let allShellsAreTheSame = true;
    for(let i=1;i < shells.length;i++) {
        if(shells[0] != shells[i]) {
            allShellsAreTheSame = false;
            break;
        }
    }

    if(allShellsAreTheSame) {
        let swapOut = Math.floor(Math.random() * shells.length);
        shells[swapOut] = (shells[swapOut] == "live") ? "blank" : "live";
        console.log("swapped out 1 shell due to all shells being the same");
    }

    showShells(shells);
}


function initializeInventory(slotAmount=8) {
    for(let i=0;i < slotAmount;i++) {
        let newSlot = document.createElement("div");
        INV_OPPONENT.appendChild(newSlot);
    }
    for(let i=0;i < slotAmount;i++) {
        let newSlot = document.createElement("div");
        INV_PLAYER.appendChild(newSlot);
    }
}


function initializeHealth(startingHealth=5) {
    health_opponent = startingHealth;
    health_player = startingHealth;

    // Opponent
    let newNameDisplay = document.createElement("div");
    HEALTH_DISPLAY.appendChild(newNameDisplay);
    newNameDisplay.innerHTML = "Opponent";

    let newHealthBar = document.createElement("div");
    HEALTH_DISPLAY.appendChild(newHealthBar);
    let HealthString = "";
    for(let i=0;i < health_opponent;i++) {
        HealthString += "I";
    }
    newHealthBar.innerHTML = HealthString;

    // Player
    newNameDisplay = document.createElement("div");
    HEALTH_DISPLAY.appendChild(newNameDisplay);
    newNameDisplay.innerHTML = "Player";

    newHealthBar = document.createElement("div");
    HEALTH_DISPLAY.appendChild(newHealthBar);
    HealthString = "";
    for(let i=0;i < health_opponent;i++) {
        HealthString += "I";
    }
    newHealthBar.innerHTML = HealthString;
}


function initialize() {
    initializeInventory();
    initializeHealth();
}


function setItem(giveTo="player", slot=0) {
    let target = null;
    if(giveTo == "opponent") {
        target = INV_OPPONENT;
    }else {
        target = INV_PLAYER;
    }
    
    target.children[slot].classList = "item";
    let tooltip = document.createElement("span");

    target.children[slot].innerHTML = "Beer";
    target.children[slot].appendChild(tooltip);
    tooltip.classList = "tooltip";
    tooltip.innerHTML = "Racks the shotgun one time";
}