class GameSpace {
    grid_x; grid_y;
    mines = []; // location of all mines
    untouched_tiles = []; // tiles that are not yet clicked (booleans)
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

        // generate numbers for untouched_tiles
        for(let i=0;i < this.grid_x*this.grid_y;i++) {
            this.untouched_tiles.push(true);
        }
    }

    // NOTICE: spawning too many mine may freeze the system
    // maybe I'll fix this in the future
    spawnMine(startingTile, amount=10) {
        let max = this.grid_x*this.grid_y-1;
        let mine_set = 0; // counter for mines that have been set by this function

        // create a bag of mine candidate tiles
        let bag = [];
        for(let i=0;i < max;i++) {
            if(i==startingTile) continue;
            bag.push(i);
        }

        while(mine_set < amount) {
            let random_number = Math.floor(bag.length * Math.random());
            let tileFromBag = bag.splice(random_number, 1); // pop 1 item
            this.mines.push(tileFromBag[0]); // from bag into this.mines
            mine_set++;
        }

        this.mines.sort(function(a, b) { return a - b; }); // sort array "mines"
        console.log("mine spawned: ", this.mines);
    }

    clickTile(x, y) {
        console.log(x+this.grid_x*y);
        if(!this.untouched_tiles[x+this.grid_x*y]) return; // if this tile is already clicked, stop function
        this.untouched_tiles[x+this.grid_x*y] = true; // flag as touched

        console.log(x + ", " + y + " is clicked");
        if(!this.isGameStarted) {
            this.isGameStarted = true;
            this.spawnMine(x + y*this.grid_y, 30); // spawn mines on first click
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
        // remove out-of-bounds tiles from check
        for(let i=0;i < check.length;i++) {
            if(check[i][0] < 0 || check[i][1] < 0 || check[i][0] >= this.grid_x || check[i][1] >= this.grid_x ) continue;
            temp.push(check[i]);
        }
        check = temp;

        let mine_count = 0;
        for(let i=0;i < check.length;i++) {
            if(this.mines.includes(check[i][0] + check[i][1]*this.grid_x)) {
                mine_count++;
            }
        }

        this.GAME_GRIDS[x+1][y+1].className = "tile tile-revealed tile-" + mine_count;
        if(mine_count != 0) this.GAME_GRIDS[x+1][y+1].innerHTML = mine_count;
        else {
            for(let i=0;i < check.length;i++) {
                if(!this.untouched_tiles[check[i][0]+this.grid_x*check[i][1]]) continue;
                clickTile(check[i][0], check[i][1]);
            }
        }
    }
}


// code I stole from the internet for shuffling array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}



function clickTile(x, y) {
    currentGame.clickTile(x, y);
}


const GAME_SPACE = new GameSpace(20, 10);
let currentGame = GAME_SPACE;