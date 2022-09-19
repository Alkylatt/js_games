let Game_space = document.getElementById('game_space');

// Initialize game grids
for(let i=0;i < 4;i++) {
    let new_row = document.createElement('div');
    Game_space.appendChild(new_row);
    for(let j=0;j < 4;j++) {
        let new_block = document.createElement('div');
        new_row.appendChild(new_block);
    }
}
let Game_grid = document.querySelectorAll('#game_space div > div');
let grid_value = [];
for (let i=0;i < 16;i++) {
    grid_value[i] = 0;
}



// convert x,y coordinate to index number
function coordinate(x, y) {
    return (16 - 4 * y) + (x - 1);
}



// generate random integer in range of min & max
function random(min, max) {
    let ran = 1;
    while(ran === 1) {
        ran = Math.random();
    }
    return min + Math.floor((max - min + 1)*ran);
}



function edit_value(index, value) {
    value = parseInt(value);

    if(value > 4096) Game_grid[index].className = 'block_undefined';
    else Game_grid[index].className = 'block_' + value;

    if(value !== 0) Game_grid[index].innerText = value;
    else Game_grid[index].innerText = '';

    grid_value[index] = value;
}



window.addEventListener("keydown", function(event) {
    switch(event.key) {
        case 'ArrowUp':
            move_up();spawn()
            break;
        case 'ArrowDown':
            move_down();spawn()
            break;
        case 'ArrowLeft':
            move_left();spawn()
            break;
        case 'ArrowRight':
            move_right();spawn()
            break;
    }
}, true);



function move_up() {
    for(let x=1;x <= 4;x++) {
        for(let y=3;y >= 1;y--) {
            if (grid_value[coordinate(x, y)] !== 0) {
                let i = y;

                while(i < 4 && (grid_value[coordinate(x, i+1)] === 0)) i++;

                if(grid_value[coordinate(x, y)] === grid_value[coordinate(x, i+1)]) {
                    edit_value(coordinate(x, i+1), grid_value[coordinate(x, y)]*2);
                    edit_value(coordinate(x, y), 0);
                }else if(i !== y) {
                    edit_value(coordinate(x, i), grid_value[coordinate(x, y)]);
                    edit_value(coordinate(x, y), 0);
                }
            }
        }
    }
}
function move_down() {
    for(let x=1;x <= 4;x++) {
        for(let y=2;y <= 4;y++) {
            if (grid_value[coordinate(x, y)] !== 0) {
                let i = y;

                while(i > 1 && (grid_value[coordinate(x, i-1)] === 0)) i--;

                if(grid_value[coordinate(x, y)] === grid_value[coordinate(x, i-1)]) {
                    edit_value(coordinate(x, i-1), grid_value[coordinate(x, y)]*2);
                    edit_value(coordinate(x, y), 0);
                }else if(i !== y) {
                    edit_value(coordinate(x, i), grid_value[coordinate(x, y)]);
                    edit_value(coordinate(x, y), 0);
                }
            }
        }
    }
}
function move_right() {
    for(let y=1;y <= 4;y++) {
        for(let x=3;x >= 1;x--) {
            if (grid_value[coordinate(x, y)] !== 0) {
                let i = x;

                while(i < 4 && (grid_value[coordinate(i+1, y)] === 0)) i++;

                if(grid_value[coordinate(x, y)] === grid_value[coordinate(i+1, y)]) {
                    edit_value(coordinate(i+1, y), grid_value[coordinate(x, y)]*2);
                    edit_value(coordinate(x, y), 0);
                }else if(i !== x) {
                    edit_value(coordinate(i, y), grid_value[coordinate(x, y)]);
                    edit_value(coordinate(x, y), 0);
                }
            }
        }
    }
}
function move_left() {
    for(let y=1;y <= 4;y++) {
        for(let x=2;x <= 4;x++) {
            if (grid_value[coordinate(x, y)] !== 0) {
                let i = x;

                while(i > 1 && (grid_value[coordinate(i-1, y)] === 0)) i--;

                if(grid_value[coordinate(x, y)] === grid_value[coordinate(i-1, y)]) {
                    edit_value(coordinate(i-1, y), grid_value[coordinate(x, y)]*2);
                    edit_value(coordinate(x, y), 0);
                }else if(i !== x) {
                    edit_value(coordinate(i, y), grid_value[coordinate(x, y)]);
                    edit_value(coordinate(x, y), 0);
                }
            }
        }
    }
}



function spawn() {
    let ran;
    while(grid_value[ran] !== 0) ran = random(0, 15);
    if(random(0,1)) edit_value(ran, 2);
    else edit_value(ran, 4);
}

edit_value(11, 2);
edit_value(7, 2);
edit_value(14, 2);
edit_value(10, 2);
