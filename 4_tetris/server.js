const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:8080"], // 解決 CORS 阻擋連線的問題
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});


console.log("<server.js> Listening for connection");

let player1 = null, player2 = null;
let isReady = [false, false];

// runs everytime when a client connects to this server
io.on('connection', socket => {
    if(player1 == null) {
        player1 = socket.id;
        console.log(socket.id + "joined as player 1");
        socket.broadcast.emit("receive_message", "玩家1成功加入");
    }else if(player2 == null) {
        player2 = socket.id;
        console.log(socket.id + "joined as player 2");
        socket.broadcast.emit("receive_message", "玩家2成功加入");
    }else {
        console.log("(Room full) Rejected connection of " + socket.id);
        socket.emit("receive_message", "房間已滿");
        socket.disconnect(0);
    }


    socket.on("disconnect", () => {
        if(socket.id != player1 && socket.id != player2) return;
        console.log("player quitted, restarting");
        socket.to(player1).emit("receive_gameStop");
        socket.to(player2).emit("receive_gameStop");
        player1 = null;
        player2 = null;
    })


    socket.on("send_connectionEstablished", () => {
        if(socket.id == player1) isReady[0] = true;
        else if(socket.id == player2) isReady[1] = true;

        // Start the game if both players are ready
        if(isReady[0] && isReady[1]) {
            socket.broadcast.emit("receive_gameStart");
            console.log("game started");
        }
    })



    // game data
    socket.on("send_gameSpace", (gameSpace) => {
        if(socket.id == player1) socket.to(player2).emit("receive_gameSpace", gameSpace);
        else if(socket.id == player2) socket.to(player1).emit("receive_gameSpace", gameSpace);
    })

    socket.on("send_garbage", (lines) => {
        if(socket.id == player1) socket.to(player2).emit("receive_garbage", lines);
        else if(socket.id == player2) socket.to(player1).emit("receive_garbage", lines);
    })

    socket.on("send_gameOver", () => {
        socket.broadcast.emit("receive_gameOver");
        console.log("game over");
        player1 = null;
        player2 = null;
    })
});


