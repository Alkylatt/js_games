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
    x = 0; // y=750
    // length=120, height=25

    setPos(x) {
        this.x = x;
    }

    moveToward(x_dest) {
        let vec = new Vector(this.x, 0, x_dest, 0);
        vec.normalize(Math.min(vec.length, 30));
        
        this.setPos(this.x+vec.x);
    }

    draw() { // center if at the TOP-LEFT corner of the rectangle
        ctx.beginPath();
        ctx.rect(this.x-60, 750, 120, 25);
        ctx.fillStyle = "gray";
        ctx.fill();
    }
}


class Ball {
    r = 20;
    x = 0;
    y = 0;
    v = new Vector(0, 0, 10, 10); // velocity of Ball
    constructor(x, y, r=20) {
      this.x = x;
      this.y = y;
      this.r = r;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    collide(x, y, w) {
        if(Math.abs(this.y-y) < this.r && Math.abs(this.x-x) < w/2) {
            let force = new Vector(x, y, this.x, this.y);
            force.x *= 0.3;
            force.normalize( Math.min(force.length, 10) ); // cap maximum force
            force.normalize( Math.max(force.length, 5) ); // cap minimum force

            this.v.y = Math.min(this.v.y+force.y, 0); // ensure it bounces backward
        }

        // cap the ball's max velocity
        this.v.normalize( Math.min(this.v.length, 50) );
    }

    checkTouchingBottom() {
        if(this.y+this.r > 795) {
            console.log("The ball touched the ground");
            this.v.y=0;
            this.v.x=0;

            return true;
        }
        return false;
    }

    move() {
        // collide with walls (playable area)
        if( this.x < this.r) {
            this.x = this.r;
            this.v.x *= -1
        }else if((500 - this.x) < this.r) {
            this.x = 500 - this.r;
            this.v.x *= -1
        }
        if( this.y < this.r) {
            this.y = this.r;
            this.v.y *= -1
        }else if((800 - this.y) < this.r) {
            this.y = 800 - this.r;
            this.v.y *= -1
        }

        this.x += this.v.x;
        this.y += this.v.y;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, 2*Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}


let Player1 = new Player(1);
Player1.setPos(250, 700);

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
    Ball1.collide(Player1.x, 780, 120);
    Ball1.move();

    Player1.draw();
    Ball1.draw();

    if(Ball1.checkTouchingBottom())
        clearInterval(tick);
}, 11) // 50/3ms = 60 fps