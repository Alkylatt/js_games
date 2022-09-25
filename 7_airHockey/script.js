let c = document.getElementById("game_display");
let ctx = c.getContext("2d");


class Player {
    id = 0;
    x = 0;
    y = 0;
    vx = 0;
    vy = 0;
    constructor(id) {
      this.id = id;
    }

    setPos(x, y) {
        this.vx = x - this.x;
        this.vy = y - this.y;
        this.x = x;
        this.y = y;
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
    vx = 10;
    vy = 10;
    constructor(x, y, r=35) {
      this.x = x;
      this.y = y;
      this.r = r;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        if( this.x < this.r) {
            this.x = this.r;
            this.vx *= -0.9
        }else if((500 - this.x) < this.r) {
            this.x = 500 - this.r;
            this.vx *= -0.9
        }
        if( this.y < this.r) {
            this.y = this.r;
            this.vy *= -0.9
        }else if((800 - this.y) < this.r) {
            this.y = 800 - this.r;
            this.vy *= -0.9
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.99;
        this.vy *= 0.99;
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




function getMousePos(evt) {
    var rect = c.getBoundingClientRect();
    Player1.setPos(evt.clientX - rect.left, evt.clientY - rect.top);
}


let tick = setInterval(() => {
    ctx.clearRect(0, 0, c.width, c.height);

    Ball1.move();

    Player1.draw();
    Player2.draw();
    Ball1.draw();

    // console.log("vx: ", Player1.vx, "; vy: ", Player1.vy);
}, 50/3)