let c = document.getElementById("game_display");
let ctx = c.getContext("2d");


class Vector {
    x = 0;
    y = 0;
    length = null;
    constructor(x_src, y_src, x_dest, y_dest) {
        this.x = x_dest - x_src;
        this.y = y_dest - y_src;
        this.length = Math.sqrt(this.x*this.x + this.y*this.y);
    }
    
    normalize(len=1) {
        if(this.length == 1 || this.length == 0 || len==0)
            return;

        this.x /= this.length/len;
        this.y /= this.length/len;
    }
}


class Player {
    id = 0;
    x = 0;
    y = 0;
    r = 35;
    constructor(id) {
      this.id = id;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    moveToward(x_dest, y_dest) {
        let vec = new Vector(this.x, this.y, x_dest, y_dest);
        vec.normalize(Math.min(vec.length, 30));
        
        this.setPos(this.x+vec.x, this.y+vec.y);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 40, 0, 2*Math.PI);
        ctx.fillStyle = "gray";
        ctx.fill();
    }
}


class Ball {
    r = 35;
    x = 0;
    y = 0;
    v = new Vector(0, 0, 10, 10); // velocity of Ball
    constructor(x, y, r=35) {
      this.x = x;
      this.y = y;
      this.r = r;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    collide(x, y, r) {
        if(Math.pow(this.x-x, 2)+Math.pow(this.y-y, 2) < Math.pow(this.r+r,2)) {
            let force = new Vector(x, y, this.x, this.y);
            force.normalize( Math.min(force.length, 10) );

            this.v.x = Math.max(this.v.x+force.x, force.x);
            this.v.y = Math.max(this.v.y+force.y, force.y);
        }

        // cap the ball's max velocity
        this.v.normalize( Math.min(this.v.length, 50) );
    }

    move() {
        // collide with walls (playable area)
        if( this.x < this.r) {
            this.x = this.r;
            this.v.x *= -0.9
        }else if((500 - this.x) < this.r) {
            this.x = 500 - this.r;
            this.v.x *= -0.9
        }
        if( this.y < this.r) {
            this.y = this.r;
            this.v.y *= -0.9
        }else if((800 - this.y) < this.r) {
            this.y = 800 - this.r;
            this.v.y *= -0.9
        }

        this.x += this.v.x;
        this.y += this.v.y;
        // this.v.x *= 0.99;
        // this.v.y *= 0.99;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 35, 0, 2*Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}


let Player1 = new Player(1);
let Player2 = new Player(2);
Player1.setPos(250, 700);
Player2.setPos(250, 100);

let Ball1 = new Ball(250, 400);



let mouseX = 0;
let mouseY = 0;
function getMousePos(evt) {
    var rect = c.getBoundingClientRect();
    // Player1.setPos(evt.clientX - rect.left, evt.clientY - rect.top);
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
}


let tick = setInterval(() => {
    ctx.clearRect(0, 0, c.width, c.height);

    Player1.moveToward(mouseX, mouseY);
    Ball1.collide(Player1.x, Player1.y, Player1.r);
    Ball1.collide(Player2.x, Player2.y, Player2.r);
    Ball1.move();

    Player1.draw();
    Player2.draw();
    Ball1.draw();

    // console.log("vx: ", Player1.vx, "; vy: ", Player1.vy);
}, 25/3)