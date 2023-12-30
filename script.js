// Status: 0 Prototype, 1 Alpha, 2 Beta
const STATUS = [
    "TODO",
    "WIP",
    "Functional"
];

const GAMES = [
    // Display name, Folder name, Status
    ["0a0b", "1_0a0b", 2],
    ["2048", "2_2048", 0],
    ["Tic Tac Toe", "3_tictactoe", 2],
    ["Tetris", "4_tetris", 1],
    ["Chess", "5_chess", 0],
	["Snake", "6_snake", 0],
	["Air Hockey", "7_airHockey", 1],
	["Mine Sweeper", "8_minesweeper", 1],
	["BPM Tapper", "9_bpmTapper", 2],
	["Tarot", "10_tarot", 0],
	["Chess Timer", "11_chessTimer", 2],
	["Breakout", "12_breakout", 0]
];

const MENU = document.getElementById("menu");

let current_filter = null; // current filtering tag

let FilterBtns = [];
FilterBtns.push(document.getElementById("filter_todo"));
FilterBtns.push(document.getElementById("filter_wip"));
FilterBtns.push(document.getElementById("filter_functional"));
// listeners
for(let status=0;status < STATUS.length;status++) {
    FilterBtns[status].addEventListener('click', function() {
        filter(STATUS[status]);
    });
}


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
            p.innerHTML = "TODO";
            p.classList.add("prototype");
            break;
        case 1:
            p.innerHTML = "WIP";
            p.classList.add("alpha");
            break;
        case 2:
            p.innerHTML = "Functional";
            p.classList.add("beta");
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
