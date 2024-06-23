// Status: 0-3
const STATUS = [
    "I'll do this later",
    "Somewhat works",
    "Works",
    "Good enough"
];

const GAMES = [
    // Display name, Folder name, Status
    ["0a0b", "1_0a0b", 3],
    ["2048", "2_2048", 1],
    ["Tic Tac Toe", "3_tictactoe", 3],
    ["Tetris", "4_tetris", 2],
    ["Chess", "5_chess", 1],
	["Snake", "6_snake", 0],
	["Air Hockey", "7_airHockey", 1],
	["Mine Sweeper", "8_minesweeper", 1],
	["BPM Tapper", "9_bpmTapper", 3],
	["Tarot", "10_tarot", 1],
	["Chess Timer", "11_chessTimer", 3],
	["Breakout", "12_breakout", 0],
    ["Roulette", "13_roulette", 1],
    ["Sliding Puzzle", "14_slidingPuzzle", 0],
    ["Lockpicking", "15_lockpicking", 2]
];

const MENU = document.getElementById("menu");
const FILTER_LIST = document.getElementById("filter_list");

for(let i=0;i < STATUS.length;i++) {
    let newButton = document.createElement("div");
    FILTER_LIST.appendChild(newButton);
    newButton.id = "filter_"+i;
    newButton.innerText = STATUS[i];
}

let FilterBtns = [];
FilterBtns.push(document.getElementById("filter_0"));
FilterBtns.push(document.getElementById("filter_1"));
FilterBtns.push(document.getElementById("filter_2"));
FilterBtns.push(document.getElementById("filter_3"));
// listeners
for(let status=0;status < STATUS.length;status++) {
    FilterBtns[status].addEventListener('click', function() {
        filter(STATUS[status]);
    });
}

let current_filter = null; // current filtering tag


GAMES.forEach(game => {
    let div = document.createElement("div");
    let anchor = document.createElement("a");
    let p = document.createElement("p");
    MENU.appendChild(div);
    div.appendChild(anchor);
    div.appendChild(p);

    anchor.innerHTML = game[0];
    anchor.href = game[1] + "/index.html";

    switch(game[2]) {
        case 0:
            p.innerHTML = STATUS[0];
            p.classList.add("status0");
            break;
        case 1:
            p.innerHTML = STATUS[1];
            p.classList.add("status1");
            break;
        case 2:
            p.innerHTML = STATUS[2];
            p.classList.add("status2");
            break;
        case 3:
            p.innerHTML = STATUS[3];
            p.classList.add("status3");
            break;
    }
});


function filter(allow_status) {
    updateFilter(allow_status);
    let childDivs = MENU.getElementsByTagName("div");

    // no filter, show all
    if(current_filter == null) {
        for (let i = 0; i < childDivs.length; i++) {
            childDivs[i].classList = "";
        }
        return;
    }

    // show only if tag == allow_status
    for (let i = 0; i < childDivs.length; i++) {
        let tag = childDivs[i].getElementsByTagName("p")[0].innerHTML;

        if(tag == current_filter)
            childDivs[i].classList = "";
        else
            childDivs[i].classList = "hide";
    }
}


function updateFilter(tag) {
    for(let i=0;i < FilterBtns.length;i++)
        FilterBtns[i].classList = "";

    if(tag != current_filter) // if current_filter already == tag, then reset current_filter
        for(let i=0;i < STATUS.length;i++) {
            if(tag == STATUS[i]) {
                current_filter = tag;
                FilterBtns[i].classList = "active";
                return;
            }
        }
    current_filter = null;
}


// link to 0_terminal/index.html
let terminal_button = document.getElementById("button_terminal");
terminal_button.onclick = function() {
    window.location.href = "0_terminal/index.html";
};