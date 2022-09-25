class GameSpace {
    grid_x; grid_y;
    mines = []; // location of all mines
    GAME_GRID_CONTAINER = document.querySelector('#game_container');
    GAME_GRIDS;
    isGameStarted = false;

    constructor(size_x=10, size_y=10) {
        // Create game space (x,y size is adjustable)
        this.grid_x = size_x;
        this.grid_y = size_y;
        this.GAME_GRIDS = new Array(this.grid_x);
        this.GAME_GRID_CONTAINER.style.width = (this.grid_x * 20).toString();
        this.GAME_GRID_CONTAINER.style.height = (this.grid_y * 20).toString();
        for(let y=0;y < this.grid_y;y++) {
            let newSpan = document.createElement('span');
            for (let x=0;x < this.grid_x;x++) {
                let newDiv = document.createElement('div');
                newDiv.classList.add("tile");
                newDiv.onclick = function() { clickTile(x, size_y-y-1); };
                newSpan.appendChild(newDiv);
            }
            this.GAME_GRID_CONTAINER.appendChild(newSpan);
        }

        let gridsTemp = document.querySelectorAll('#game_container span div');
        let i = this.grid_x * (this.grid_y);
        for (let x=1; x <= this.grid_x; x++) {
            let arrayTemp = new Array(this.grid_y);
            for(let y=1;y <= this.grid_y;y++) {
                i -= this.grid_x;
                arrayTemp[y] = gridsTemp[i];
            }
            i += 1 + this.grid_x * this.grid_y;

            this.GAME_GRIDS[x] = (arrayTemp);
        }
    }

    // NOTICE: spawning too many mine may freeze the system
    // maybe I'll fix this in the future
    spawnMine(startingPoint, amount=10) {
        let max = this.grid_x + this.grid_y - 2;
        let mine_set = 0; // counter for mines that have been set by this function

        while(mine_set < amount) {
            let random_number = Math.floor(max * Math.random());

            // check if a mine is spawned at the starting tile
            if(random_number == startingPoint) {
                continue;
            }
            // check if a mine is already there
            if(this.mines.includes(random_number)) {
                continue;
            }

            this.mines.push(random_number);
            mine_set++;
        }


        this.mines.sort(function(a, b) { return a - b; }); // sort array "mines"
        console.log("mine spawned: ", this.mines);
    }

    clickTile(x, y) {
        console.log(x + ", " + y + " is clicked");
        if(!this.isGameStarted) {
            this.isGameStarted = true;
            this.spawnMine(x + y*this.grid_y); // spawn mines on first click
        }
        this.GAME_GRIDS[x+1][y+1].className = "tile tile-revealed";
        
        // check if this tile is a mine
        if(this.mines.includes(x + y*this.grid_x)) {
            this.GAME_GRIDS[x+1][y+1].className = "tile tile-revealed tile-mine";
            return;
        }


        // check for surrounding mines
        let check = [
            [x-1, y+1],
            [x, y+1],
            [x+1, y+1],
            [x-1, y],
            [x+1, y],
            [x-1, y-1],
            [x, y-1],
            [x+1, y-1],
        ];
        let temp = [];
        // remove negative numbers
        for(let i=0;i < check.length;i++) {
            if(check[i][0] < 0 || check[i][1] < 0 || check[i][0] >= this.grid_x || check[i][1] >= this.grid_x ) continue;
            temp.push(check[i]);
        }
        check = temp;

        let mine_count = 0;
        console.log(this.mines);
        for(let i=0;i < check.length;i++) {
            console.log(check[i][0] + check[i][1]*this.grid_x);
            if(this.mines.includes(check[i][0] + check[i][1]*this.grid_x)) {
                mine_count++;
            }
        }

        // for(let i=0;i < check.length;i++) {
        //     this.GAME_GRIDS[check[i][0]+1][check[i][1]+1].className = "tile tile-revealed tile-8";
        // }


        this.GAME_GRIDS[x+1][y+1].className = "tile tile-revealed tile-" + mine_count;
        if(mine_count != 0) this.GAME_GRIDS[x+1][y+1].innerHTML = mine_count;
    }
}



// this class is not used
class SnakeBody {
    static speed = 15; // frame per grid (the lower the faster)
    static grow = 3; // length in grids (starts with 3)
    static environment;
    x;
    y;
    constructor(environment, pos_x, pos_y) {
        this.life = SnakeBody.grow;
        this.x = pos_x;
        this.y = pos_y;
        SnakeBody.environment = environment;
    }
    move() {
        SnakeBody.environment.GAME_GRIDS[this.x][this.y].classList = 'occupied snake';
        this.life--;
        if(this.life <= 0) {
            SnakeBody.environment.GAME_GRIDS[this.x][this.y].classList = '';
            delete this;
        }
    }
}
class SnakeHead extends SnakeBody {
    orientation = 0; // 0 up, 1 right, 2 down, 3 left
    x;
    y;
    bodies = [];
    environment;
    constructor(environment, starting_x, starting_y) {
        super();
        this.x = starting_x;
        this.y = starting_y;
        this.environment = environment;
    }
    turn(move_ori) {
        if( Math.abs(move_ori - this.orientation) === 2 ) return; // stop if move is invalid
        this.orientation = move_ori;
        turnCd = true;
    }
    move() {
        this.bodies.push(new SnakeBody(this.environment, this.x, this.y));

        let next_x = this.x,
            next_y = this.y;

        // move x or y
        if(this.orientation % 2) next_x -= this.orientation - 2;
        if(!(this.orientation % 2)) next_y -= this.orientation - 1;
        // cycle back if out of bound
        if(next_x < 1) next_x = this.environment.grid_x;
        else if(next_x > this.environment.grid_x) next_x = 1;
        if(next_y < 1) next_y = this.environment.grid_y;
        else if(next_y > this.environment.grid_y) next_y = 1;

        this.checkCollision(next_x, next_y);
        this.x = next_x;
        this.y = next_y;
        this.environment.GAME_GRIDS[this.x][this.y].classList = 'occupied snake';

        for(let i=0;i < this.bodies.length;i++) {
            this.bodies[i].move();
        }
        turnCd = false;
    }
    checkCollision(x, y) {
        if(this.environment.GAME_GRIDS[x][y].classList.contains('occupied')) {
            // game over
            this.environment.GAME_GRIDS[this.x][this.y].classList = 'hit'; // TODO ??? why the fuck is this not working
            gameOver();
        }else if(this.environment.GAME_GRIDS[x][y].classList.contains('food')) {
            // eat, grow longer
            SnakeBody.grow++;
            this.environment.spawnFood();
            if(SnakeBody.speed > 1) SnakeBody.speed--;
        }
    }
}



function clickTile(x, y) {
    currentGame.clickTile(x, y);
}

const GAME_SPACE = new GameSpace(20, 10);
let currentGame = GAME_SPACE;



// let lastUpdate = Date.now();
// let intervalTick = setInterval(tick, 16.6); // about 60 fps, this should be terminated when game ends
// let timer = 0; // game timer
// let timer_move = 0; // timer (frames) until snake move one grid
// let turnCd = false;

function tick() {
    let now = Date.now(); // [ms]
    let dt = now - lastUpdate;
    lastUpdate = now;
    timer += dt;

    if(!turnCd) {
        if(keyMap["ArrowUp"]) {
            SNAKE.turn(0);
        }else if(keyMap["ArrowRight"]) {
            SNAKE.turn(1);
        }else if(keyMap["ArrowDown"]) {
            SNAKE.turn(2);
        }else if(keyMap["ArrowLeft"]) {
            SNAKE.turn(3);
        }
    }

    timer_move--;
}

function gameOver() {
    clearInterval(intervalTick);
    console.log("Game Over");
}

// Key press detector
let keyMap = {}; // a array for keys' stats
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    keyMap[e.key] = e.type === "keydown";
}