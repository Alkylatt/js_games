const GAMES = [
    // Display name, Folder name, Status
    // Status: 0 Prototype, 1 Alpha, 2 Beta
    ["0a0b", "1_0a0b", 2],
    ["2048", "2_2048", 0],
    ["Tic Tac Toe", "3_tictactoe", 0],
    ["Tetris", "4_tetris", 1],
    ["Chess", "5_chess", 0],
	["Snake", "6_snake", 0],
	["Air Hockey", "7_airHockey", 0],
	["Mine Sweeper", "8_minesweeper", 0]
];

const MENU = document.getElementById("menu");

GAMES.forEach(game => {
    let div = document.createElement("div");
    let anchor = document.createElement("a");
    let p = document.createElement("p");
    MENU.appendChild(div);
    div.appendChild(anchor);
    div.appendChild(p);

    anchor.innerHTML = game[0];
    anchor.href = game[1] + "/index.html";

    switch(game[2]) {
        case 0:
            p.innerHTML = "Prototype";
            p.classList.add("prototype");
            break;
        case 1:
            p.innerHTML = "Alpha";
            p.classList.add("alpha");
            break;
        case 2:
            p.innerHTML = "Beta";
            p.classList.add("beta");
            break;
    }
});
