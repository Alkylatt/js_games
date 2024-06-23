class SlidingPuzzle {
    grid_x;
    grid_y;
    DOCUMENT_GAMESPACE;


    constructor(size_x=3, size_y=3) {
        // Create game space (x,y size is adjustable)
        this.grid_x = size_x;
        this.grid_y = size_y;
        this.DOCUMENT_GAMESPACE = document.createElement('div');
        this.DOCUMENT_GAMESPACE.classList.add("sliding_puzzle");

        for(let y=0;y < this.grid_y;y++) {
            let newSpan = document.createElement('span');
            for (let x=0;x < this.grid_x;x++) {
                let newDiv = document.createElement('div');
                newSpan.appendChild(newDiv);
            }
            this.DOCUMENT_GAMESPACE.appendChild(newSpan);
        }

        return this.DOCUMENT_GAMESPACE;
    }


    func() {
        // do sth
    }
}


class SettingWindow {
    DOCUMENT_SETTING_WINDOW;

    constructor() {
        this.DOCUMENT_SETTING_WINDOW = document.createElement('div');
        this.DOCUMENT_SETTING_WINDOW.classList.add("settings");

        let title = document.createElement('div');
        this.DOCUMENT_SETTING_WINDOW.appendChild(title);
        title.innerHTML = "Settings - Puzzle size"

        let button = document.createElement('div');
        this.DOCUMENT_SETTING_WINDOW.appendChild(button);
        button.classList = "button";
        button.innerHTML = "Confirm";

        button.addEventListener('click', function(e) {
            document.body.removeChild(e.target.parentNode);
        }, false);

        return this.DOCUMENT_SETTING_WINDOW;
    }

    closeWindow() {
        this.DOCUMENT_SETTING_WINDOW.style.display = "none";
        console.log("ok");
    }
}





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



let Game = new SlidingPuzzle(3, 3);
document.body.appendChild(Game);

let Setting = new SettingWindow();
document.body.appendChild(Setting);

let Display = document.getElementById("display");
let canvas = document.querySelector("#display canvas");

let width = canvas.width;
let height = canvas.height;

console.log(width, "x", height);

if (canvas.getContext) {
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";

    let rows = 3;
    let columns = 3;

    let grid_border_width = 1;
    let grid_size_x, grid_size_y;
    grid_size_x = Math.floor(width / columns - grid_border_width * (columns-1));
    grid_size_y = Math.floor(height / rows - grid_border_width * (rows-1));

    let pos_x, pos_y;
    for(let x=0;x < columns;x++) {
        pos_x = x * (grid_border_width + grid_size_x);
        for(let y=0;y < rows;y++) {
            pos_y = y * (grid_border_width + grid_size_y);
            ctx.fillRect(pos_x,pos_y,grid_size_x,grid_size_y);
            console.log(pos_x,";",pos_y,";",grid_size_x,";",grid_size_y);
        }
    }
}


function clickCanvas(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)

    let rows = 3;
    let columns = 3;
    let grid_border_width = 1;
    let grid_size_x, grid_size_y;
    grid_size_x = Math.floor(width / columns - grid_border_width * (columns-1));
    grid_size_y = Math.floor(height / rows - grid_border_width * (rows-1));

    let pos_x = Math.floor(x / (grid_border_width + grid_size_x)) * (grid_border_width + grid_size_x);
    let pos_y = Math.floor(y / (grid_border_width + grid_size_y)) * (grid_border_width + grid_size_y);

    console.log("x,y: ",Math.floor(x / (grid_border_width + grid_size_x)),", ",Math.floor(y / (grid_border_width + grid_size_y)));

    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.fillRect(pos_x,pos_y,grid_size_x,grid_size_y);
}

canvas.addEventListener('mousedown', function(e) {
    clickCanvas(canvas, e)
})