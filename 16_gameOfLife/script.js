const GRID_ROWS = 50; // range of y
const GRID_COLS = 50; // range of x

let tile_height = 500 / GRID_ROWS;
let tile_width = 500 / GRID_COLS;

// document elements
let CANVAS = document.querySelector("#game_canvas");
let PLAY_BUTTON = document.querySelector("#play_button");

// some internal vars
let intervalTick;
let isPaused = true;

// game state grid
let grid = Array.apply(null, Array(GRID_ROWS)).map(function () {
    return Array.apply(null, Array(GRID_COLS)).map(function () {
        return 0
    });
});


// first draw call, draw the first frame
draw_canvas();


function clickCanvas(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    let pos_x = Math.floor(x / tile_width);
    let pos_y = Math.floor(y / tile_height);

    grid[pos_y][pos_x] = (grid[pos_y][pos_x] == 0) ? 1 : 0;
    
    draw_canvas();
}


function play_pause() {
    if(isPaused) {
        intervalTick = setInterval(tick, 100);
        isPaused = false;
        PLAY_BUTTON.innerHTML = "Pause";
    }else {
        clearInterval(intervalTick);
        isPaused = true;
        PLAY_BUTTON.innerHTML = "Play";
    }
}


CANVAS.addEventListener('mousedown', function(e) {
    clickCanvas(CANVAS, e)
})

PLAY_BUTTON.addEventListener('mousedown', function(e) {
    play_pause()
})


// evaluate and update grid
function update_state() {
    let next_grid = Array.apply(null, Array(GRID_ROWS)).map(function () {return Array(GRID_COLS)});

    for(let x=0;x < GRID_COLS;x++) {
        for(let y=0;y < GRID_ROWS;y++) {
            let neighboring_living = evaluate_tile_neighbor(x, y);
            
            // living cell: dies if 0, 1, 4, 4+... (i.e. stay unchange if 2 or 3)
            // dead cell: lives if 3
            if(grid[y][x] == 1 && (neighboring_living < 2 || neighboring_living > 3) ) {
                next_grid[y][x] = 0;
            }else if(grid[y][x] == 0 && (neighboring_living == 3) ) {
                next_grid[y][x] = 1;
            }else {
                next_grid[y][x] = grid[y][x];
            }
        }
    }

    grid = next_grid;
}


// returns the number of neighboring, living cell
function evaluate_tile_neighbor(x, y) {
    // let tiles_to_check = [];
    let living_count = 0;
    let x_candidates = [];
    let y_candidates = [];

    x_candidates.push(x);
    y_candidates.push(y);
    if(x-1 >= 0) x_candidates.push(x-1);
    if(x+1 < GRID_COLS) x_candidates.push(x+1);
    if(y-1 >= 0) y_candidates.push(y-1);
    if(y+1 < GRID_ROWS) y_candidates.push(y+1);

    for(let i=0;i < x_candidates.length;i++) {
        for(let j=0;j < y_candidates.length;j++) {
            if(i==0 && j==0) continue; // skip [x, y]

            if(grid[y_candidates[j]][x_candidates[i]] == 1) {
                living_count++;
            }
            // tiles_to_check.push([ x_candidates[i], y_candidates[j] ]);
        }
    }

    return living_count;
}


// draw squares on canvas
function draw_canvas() {
    if (CANVAS.getContext) {
        let ctx = CANVAS.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 500, 500);

        ctx.fillStyle = "white";
        for (let y=0;y < grid.length;y++){
            for (let x=0;x < grid[0].length;x++) {
                if(grid[y][x] == 1) {
                    ctx.fillRect(x*tile_width, y*tile_height, tile_width, tile_height);
                }
            }
        }
        //  
    }
}


function tick() {
    draw_canvas();
    update_state();
}


function stopGame() {
    clearInterval(intervalTick);
    console.log("Game stopped");
}