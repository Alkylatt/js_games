class GameSpace {
    grid_x = 10;
    grid_y = 10;
    GAME_GRID_CONTAINER = document.querySelector('#game_canvas');
    GAME_GRIDS;

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
                newDiv.classList.add("grid");
                newSpan.appendChild(newDiv);
            }
            this.GAME_GRID_CONTAINER.appendChild(newSpan);
        }

        let gridsTemp = document.querySelectorAll('#game_canvas span div');
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
    spawnFood() { // TODO food sometimes just won't spawn, making the game unable to progress
        let x, y;
        do {
            x = 1 + Math.floor((this.grid_x-1) * Math.random());
            y = 1 + Math.floor((this.grid_y-1) * Math.random());
            console.log("get random coordinate");
        }while(this.GAME_GRIDS[x][y].classList.contains('occupied'))
        console.log(x + ", " + y);
        this.GAME_GRIDS[x][y].classList = 'food';
    }
}



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



const GAME_SPACE = new GameSpace(10, 10);
const SNAKE = new SnakeHead(GAME_SPACE, 1, 1);

GAME_SPACE.spawnFood(); // first spawn



let lastUpdate = Date.now();
let intervalTick = setInterval(tick, 16.6); // about 60 fps, this should be terminated when game ends
let timer = 0; // game timer
let timer_move = 0; // timer (frames) until snake move one grid
let turnCd = false;

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
    if(timer_move < 0) {
        SNAKE.move();
        timer_move += SnakeHead.speed;
    }
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