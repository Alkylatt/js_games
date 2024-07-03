// Status: 0 Prototype, 1 Alpha, 2 Beta
const STATUS = [
    "TODO",
    "WIP",
    "Functional"
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
    ["Lockpicking", "15_lockpicking", 2],
    ["Game of Life", "16_gameOfLife", 3]
];

const DISPLAY = document.getElementById("display");
const STARTING_TEXT = [
    "Welcome, user.",
    ""
];
let currentLine;


for(let line=0;line < STARTING_TEXT.length;line++) {
    writeLine(STARTING_TEXT[line])
}


function writeLine(textline) {
    // handle entered text
    if(currentLine != null)
        console.log(currentLine.innerText);

    let newLine = document.createElement("pre");
    DISPLAY.appendChild(newLine);
    newLine.innerText = textline;
    currentLine = DISPLAY.lastChild;
}


document.onkeydown = myKeyDown;
function myKeyDown(e){
    let keynum;
    if(e.which){ // Netscape/Firefox/Opera                 
        keynum = e.which;
    }else if(window.event) { // IE                  
        keynum = e.keyCode;
    }
    
    // disable firefox's quick search (/') and tab shortcut
    if(keynum == 191 || keynum == 222 || keynum == 9) {
        event.preventDefault();
    }

    if(65 <= keynum && keynum <= 90) // alphabets
        terminalInput(String.fromCharCode(keynum + 32));
    else if(48 <= keynum && keynum <= 58) // numbers
        terminalInput(String.fromCharCode(keynum));
    else // other
        terminalFunction(keynum); // is a function key
}


// param = detected key press
// relay the k into the terminal 
function terminalInput(k) {
    document.getElementById("display").lastChild.innerText += k;
    return;
}
function terminalFunction(k) {
    // console.log(k);
    switch(k) {
        case 32: // Space
            terminalInput(" ");
            break;
        case 8: // Backspace
            let textTemp = document.getElementById("display").lastChild.innerText;
            if(textTemp.length == 0)
                break;
            document.getElementById("display").lastChild.innerText = textTemp.substring(0, textTemp.length-1);
            break;
        case 13: // Enter
            currentLine.classList.add("cmd");
            processCommand(currentLine.innerText);
            writeLine("");
            window.scrollTo(0, document.body.scrollHeight);
            break;
    }
}


function processCommand(cmd) {
    if(cmd == "")
        return;

    console.log("cmd("+cmd.length+")=",cmd);

    let commands = cmd.split(" ");

    switch(commands[0]) {
        case "help":
            command_help();
            break;
        case "ls":
        case "dir":
            if(commands.length > 1)
                command_reject();
            else
                command_ls();
            break;
        case "cd":
            command_cd(commands);
            break;
        case "makedir":
        case "rm":
            command_reject();
            break;
        case "cat":
            command_cat();
            break;
        default:
            writeLine("'"+commands[0]+"' command not found.");            
    }
}


function command_ls() {
    writeLine("index /  prog  / title");
    for(let i=0;i < GAMES.length;i++) {
        let index = "";
        if(i+1 < 10)
            index = "0";
        index += i+1;
        while(index.length < 5) index += " ";
        
        let progress = "";
        for(let p=0;p < GAMES[i][2];p++) progress += "█";
        while(progress.length < 3) progress += "░";
        progress += "["+GAMES[i][2]+"]";

        writeLine(index+' / '+progress+' / '+GAMES[i][0]);
    }
}


function command_cd(commands) {
    // no parameters
    if(commands.length < 2) {
        writeLine("~$");
        return;
    }

    let par = commands[1];
    switch(par) {
        // add other files here with case
        default:
            if(!isNaN(par) && 0 < par && par <= GAMES.length) {
                writeLine("opening file "+par);
                window.location.href = "../"+GAMES[par-1][1]+"/index.html ";
            }else {
                writeLine("'"+par+"' file not found");
            }
    }
}


function command_help() {
    writeLine("help\tshow this message");
    writeLine("ls\tshow all available games");
    writeLine("cd <index>\topen a game");
}


function command_reject() {
    writeLine("no permission.");
}


function command_cat() {
    let cat = [
        "  ／l、",
        "（ﾟ､ ｡ ７",
        "  l  ~ヽ",
        "  じしf_,)ノ"
    ];
    for(let i=0;i < cat.length;i++) {
        writeLine(cat[i]);
    }
}