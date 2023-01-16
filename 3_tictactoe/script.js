let div_gameover = document.getElementById('div_gameover');

let div_game = document.getElementById('div_game');
for(let i=0;i < 3;i++) {
	let new_row = document.createElement('div');
	div_game.appendChild(new_row);
	
	for(let j=0;j < 3;j++) {
		let new_div = document.createElement('div');
		new_div.className = 'empty';
		let index_temp = 3*i + j;
		new_div.setAttribute("onclick","click_input(" + index_temp + ");");
		new_row.appendChild(new_div);
	}
}

let game_grid = document.querySelectorAll('#div_game > div > div'); // html element
let game_status = [0,0,0,0,0,0,0,0,0]; // range: -1, 0, 1

let isPlayersTurn = true;
let playerIsCircle = true;
let gameEnded = false;


function click_input(i) {
	// get mouse input from player
	if(!isPlayersTurn || gameEnded) return;
	if(game_status[i] !== 0) return; // Disallow illegal move of clicking on an occupied square
	isPlayersTurn = false;
	game_status[i] = 1;
	game_grid[i].innerText = playerIsCircle ? 'O' : 'X';
	game_grid[i].classList.remove("empty");

	winner = check_win(game_status);
	if(winner !== 0) gameover();
	
	if(!gameEnded) engine(game_status);
	
	winner = check_win(game_status);
	if(winner !== 0) gameover();
}


function gameover() {
	// set the gameEnded boolean, and show the gameover popup
	let winner = check_win(game_status);
	switch(winner) {
		case 1:
			div_gameover.innerText = "You Won\n";
			break;
		case -1:
			div_gameover.innerText = "You Lost\n";
			break;
		case 0:
			div_gameover.innerText = "Draw\n";
	}

	let reset_button = document.createElement('button');
	reset_button.innerText = "Reset";
	reset_button.setAttribute("onclick","resetGame();");
	div_gameover.appendChild(reset_button);

	div_gameover.style.display = "block";
	gameEnded = true;

	for(let i=0;i<9;i++)
		game_grid[i].classList.remove("empty");
}


function resetGame() {
	div_gameover.style.display = "none";
	div_gameover.innerText = "";

	for(let i=0;i<9;i++) {
		game_grid[i].classList = "empty";
		game_grid[i].innerHTML = "";
	}
	game_status = [0,0,0,0,0,0,0,0,0];
	isPlayersTurn = true;
	playerIsCircle = true;
	gameEnded = false;
}


function engine(game) {
	// game: current game status (0~8, with value of -1, 0 or 1)
	// win, if there is an immediate win
	let move = getBestMove(game, -1);

	if(move === -1) { gameover(); return; }
	game_grid[move].innerText = playerIsCircle ? 'X' : 'O';
	game_grid[move].classList.remove("empty");
	game[move] = -1;
	isPlayersTurn = true;

	// evaluate win rate (not very accurate)
	let eval = evaluate_win_rate(game, 1);
	console.log('eval:' + eval);
}


function evaluate_win_rate(game, turn) {
	// turn: indicates who is next to move
	let res = [[0,0]];
	
	// check immediate wins (returns: [player_win_rate, engine_win_rate], move_to_win)
	let empty_index, occupied_count;
	
	// check horizontal
	for(let i=0;i <= 8;i+=3) {
		occupied_count = 0; empty_index = -1;
		if (game[i]===turn) { occupied_count++; } else if(game[i]===0) { empty_index=i; }
		if (game[i+1]===turn) { occupied_count++; } else if(game[i+1]===0) { empty_index=i+1; }
		if (game[i+2]===turn) { occupied_count++; } else if(game[i+2]===0) { empty_index=i+2; }
		
		if(occupied_count === 2 && empty_index !== -1) {
			if(turn === -1) { res[0][0] = 0; res[0][1] = 1; } // engine
			else { res[0][0] = 1; res[0][1] = 0; } // player
			res[1] = empty_index;
			return res;
		}
	}
	
	// check vertical
	for(let i=0;i <= 2;i++) {
		occupied_count = 0; empty_index = -1;
		if (game[i]===turn) { occupied_count++; } else if(game[i]===0) { empty_index=i; }
		if (game[i+3]==turn) { occupied_count++; } else if(game[i+3]===0) { empty_index=i+3; }
		if (game[i+6]==turn) { occupied_count++; } else if(game[i+6]===0) { empty_index=i+6; }
		
		if(occupied_count === 2 && empty_index !== -1) {
			if(turn === -1) { res[0][0] = 0; res[0][1] = 1; } // engine
			else { res[0][0] = 1; res[0][1] = 0; } // player
			res[1] = empty_index;
			return res;
		}
	}

	// check diagonal
	for(let i=0;i <= 2;i+=2) {
		occupied_count = 0; empty_index=-1;
		if (game[i]===turn) { occupied_count++; } else if(game[i]===0) { empty_index=i; }
		if (game[4]===turn) { occupied_count++; } else if(game[4]===0) { empty_index=4; }
		if (game[8-i]===turn) { occupied_count++; } else if(game[8-i]===0) { empty_index=8-i; }
		
		if(occupied_count === 2 && empty_index !== -1) {
			if(turn === -1) { res[0][0] = 0; res[0][1] = 1; } // engine
			else { res[0][0] = 1; res[0][1] = 0; } // player
			res[1] = empty_index;
			return res;
		}
	}
		
	// check possible win outcomes
	let positive = 0,
		negative = 0;
	// check horizontal wins
	for(let i=0;i <= 8;i+=3) {
		if(game[i]!=-1 && game[i+1]!=-1 && game[i+2]!=-1) positive++;
		if(game[i]!=1 && game[i+1]!=1 && game[i+2]!=1) negative++;
	}
	// check vertical wins
	for(let i=0;i <= 2;i++) {
		if(game[i]!=-1 && game[i+3]!=-1 && game[i+6]!=-1) positive++;
		if(game[i]!=1 && game[i+3]!=1 && game[i+6]!=1) negative++;
	}
	// check diagonal wins
	if(game[0]!=-1 && game[4]!=-1 && game[8]!=-1) positive++;
	if(game[0]!=1 && game[4]!=1 && game[8]!=1) negative++;
	if(game[2]!=-1 && game[4]!=-1 && game[6]!=-1) positive++;
	if(game[2]!=1 && game[4]!=1 && game[6]!=1) negative++;
	
	res[0][0] = positive / (positive + negative);
	res[0][1] = negative / (positive + negative);
	return res;
} // end of evalueate_win_rate()


function getBestMove(game, turn) {
	// game = [0,0,0,0,0,0,0,0,0]; // range: -1, 0, 1
	// turn indicates which player is next to move
	// returns the index of best move (int)
	
	let good = turn; // engine side
	let bad = (turn === 1) ? -1 : 1; // opponent side

	let bestMove = -1;

	// check for immediate wins
	// check horizontally
	for(let row=0;row < 3;row++) {
		let good_count = 0;
		let empty_count = 0;
		for(let col=0;col < 3;col++) {
			if(game[3*row + col] === good) 
				good_count++;
			else if(game[3*row + col] === 0) {
				empty_count++;
				bestMove = 3*row + col;
			}
		}
		if(good_count === 2 && empty_count === 1) {
			return bestMove;
		}
	}
	// check vertically
	for(let col=0;col < 3;col++) {
		let good_count = 0;
		let empty_count = 0;
		for(let row=0;row < 3;row++) {
			if(game[3*row + col] === good) 
				good_count++;
			else if(game[3*row + col] === 0) {
				empty_count++;
				bestMove = 3*row + col;
			}
		}
		if(good_count === 2 && empty_count === 1) {
			return bestMove;
		}
	}
	// check diagonally
	for(let diag=0;diag < 2;diag++) {
		let good_count = 0;
		let empty_count = 0;
		for(let i=0;i < 3;i++) {
			let check_index = 2*diag+(4-2*diag)*i;
			if(game[check_index] === good) 
				good_count++;
			else if(game[check_index] === 0) {
				empty_count++;
				bestMove = check_index;
			}
		}
		if(good_count === 2 && empty_count === 1) {
			return bestMove;
		}
	}
	
	// check for imminent loss
	// check horizontally
	for(let row=0;row < 3;row++) {
		let bad_count = 0;
		let empty_count = 0;
		for(let col=0;col < 3;col++) {
			if(game[3*row + col] === bad) 
				bad_count++;
			else if(game[3*row + col] === 0) {
				empty_count++;
				bestMove = 3*row + col;
			}
		}
		if(bad_count === 2 && empty_count === 1) {
			return bestMove;
		}
	}
	// check vertically
	for(let col=0;col < 3;col++) {
		let bad_count = 0;
		let empty_count = 0;
		for(let row=0;row < 3;row++) {
			if(game[3*row + col] === bad) 
				bad_count++;
			else if(game[3*row + col] === 0) {
				empty_count++;
				bestMove = 3*row + col;
			}
		}
		if(bad_count === 2 && empty_count === 1) {
			return bestMove;
		}
	}
	// check diagonally
	for(let diag=0;diag < 2;diag++) {
		let bad_count = 0;
		let empty_count = 0;
		for(let i=0;i < 3;i++) {
			let check_index = 2*diag+(4-2*diag)*i;
			if(game[check_index] === bad) 
				bad_count++;
			else if(game[check_index] === 0) {
				empty_count++;
				bestMove = check_index;
			}
		}
		if(bad_count === 2 && empty_count === 1) {
			return bestMove;
		}
	}

	// No immediate win or loss, then choose a random move and getBestMove again
	// get all legal moves
	let draw_moves = [];
	for(let i=0;i < 9;i++) {
		if(game[i] === 0) {
			let game_adv = Array.from(game);
			game_adv[i] = good; // assuming i is the best move
			
			let bad_move; // opponent's best move
			let good_move;
			while(bad_move !== -1) {
				bad_move = getBestMove(game_adv, bad);
				if(good_move === -1) break; // no legal moves
				game_adv[bad_move] = bad;
				if(check_win(game_adv) !== 0) break;

				good_move = getBestMove(game_adv, good);
				if(good_move === -1) break; // no legal moves
				game_adv[good_move] = good;
				if(check_win(game_adv) !== 0) break;
			}
			
			if(check_win(game_adv) === good) { // move i leads to winning
				return i;
			}
			if(check_win(game_adv) === 0) { // move i leads to a draw
				draw_moves.push(i);
			}
		}
	}

	// if the center is empty, take it
	if(game[4] === 0)
		return 4;

	if(draw_moves.length !== 0)
		return draw_moves[0]; // no winning move, go for a drawing move
	
	for(let i=0;i < 9;i++)
		if(game[i] === 0) return i; // no good move, return any legal move

	return -1; // no legal move available
}


function check_win(game) {
	// returns: 1/-1 if someone won, or 0 if it's a draw
	for(let player=-1;player <= 1;player+=2) {
		let count;
		// check horizontal
		for(let i=0;i <= 8;i+=3) {
			count = 0;
			if(game[i] === player) count++;
			if(game[i+1] === player) count++;
			if(game[i+2] === player) count++;
			if(count === 3) return player;
		}
		
		// check vertical
		for(let i=0;i <= 2;i++) {
			count = 0;
			if(game[i] === player) count++;
			if(game[i+3] === player) count++;
			if(game[i+6] === player) count++;
			if(count === 3) return player;
		}
		
		// check diagonal
		for(let i=0;i <= 2;i+=2) {
			count = 0;
			if(game[i] === player) count++;
			if(game[4] === player) count++;
			if(game[8-i] === player) count++;
			if(count === 3) return player;
		}
	}
	
	return 0; // if no one won
}