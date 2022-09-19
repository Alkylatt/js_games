const BODY = document.getElementsByTagName("body")[0];
const piece_p = '♙',
    piece_n = '♘',
    piece_b = '♗',
    piece_r = '♖',
    piece_q = '♕',
    piece_k = '♔',
    piece_K = '♚',
    piece_Q = '♛',
    piece_R = '♜',
    piece_B = '♝',
    piece_N = '♞',
    piece_P = '♟';

class ChessBoard {
    state = []; // pieces placement (char)
    state_render = []; // chess board divs (div)
    white_king_moved = false;
    white_left_rook_moved = false;
    white_right_rook_moved = false;
    black_king_moved = false;
    black_left_rook_moved = false;
    black_right_rook_moved = false;


    constructor() {
        // uppercase = black; lowercase = white
        this.state = [
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'], // H8
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'] // H1
        ]
        this.state_render = [
            ['', '', '', '', '', '', '', ''], // H8
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''] // H1
        ]
        let chess_board = document.createElement("div");
        chess_board.className = "chess_board";
        BODY.appendChild(chess_board);
        for(let i=0;i < 8;i++) {
            let new_row = document.createElement("span");
            chess_board.appendChild(new_row);
            for(let j=0;j < 8;j++) {
                let new_square = document.createElement("div");
                new_row.appendChild(new_square);
                this.state_render[i][j] = new_square;
            }
        }
    }

    render_board() { // read state and print them onto html divs
        for(let i=0;i < 8;i++) { // row
            for(let j=0;j < 8;j++) { // file
                switch (this.state[i][j]) {
                    case 'K':
                        this.state_render[i][j].innerText = piece_K;
                        break;
                    case 'Q':
                        this.state_render[i][j].innerText = piece_Q;
                        break;
                    case 'R':
                        this.state_render[i][j].innerText = piece_R;
                        break;
                    case 'B':
                        this.state_render[i][j].innerText = piece_B;
                        break;
                    case 'N':
                        this.state_render[i][j].innerText = piece_N;
                        break;
                    case 'P':
                        this.state_render[i][j].innerText = piece_P;
                        break;
                    case 'k':
                        this.state_render[i][j].innerText = piece_k;
                        break;
                    case 'q':
                        this.state_render[i][j].innerText = piece_q;
                        break;
                    case 'r':
                        this.state_render[i][j].innerText = piece_r;
                        break;
                    case 'b':
                        this.state_render[i][j].innerText = piece_b;
                        break;
                    case 'n':
                        this.state_render[i][j].innerText = piece_n;
                        break;
                    case 'p':
                        this.state_render[i][j].innerText = piece_p;
                }
            }
        }
    }

    move_piece(coord_src, coord_dst) { // move piece (coord: string)
        let next_state = this.state;
        next_state[7 - coord_src[1].charCodeAt(0) + '1'.charCodeAt(0)][coord_src[0].charCodeAt(0) - 'A'.charCodeAt(0)] = '';
        next_state[7 - coord_dst[1].charCodeAt(0) + '1'.charCodeAt(0)][coord_dst[0].charCodeAt(0) - 'A'.charCodeAt(0)] = this.get_state(coord_dst);
        this.check_state(next_state);
    }

    check_state(st) { // check if a state is valid
        // get kings' coord
        let coord_k, coord_K;
        for(let i=0;i < 8;i++) for(let j=0;j < 8;j++) {
            if(st[i][j] === 'k') {
                coord_k = [j, i];
            }
        }
        for(let i=0;i < 8;i++) for(let j=0;j < 8;j++) {
            if(st[i][j] === 'K') {
                coord_K = [j, i];
            }
        }
        // check if king is in check
        // state_render[7][0] == A1 ([y][x])
        for(let i=1;i < 8;i++) {
            let piece = st[coord_k[0]][coord_k[1] + i];
            if('a' < piece && piece < 'z') break;
            if(piece === 'R' || piece === 'Q') {} // TODO this line is supposed to check if the king is in check (horizontal +x)
        }
    }

    get_state(coord) { // coord to state
        return this.state[7 - coord[1].charCodeAt(0) + '1'.charCodeAt(0)][coord[0].charCodeAt(0) - 'A'.charCodeAt(0)];
    }
    set_state(coord, ch) { // set state (ch -> state[coord])
        this.state[7 - coord[1].charCodeAt(0) + '1'.charCodeAt(0)][coord[0].charCodeAt(0) - 'A'.charCodeAt(0)] = ch;
    }
    get_square(coord) { // coord to state_render (div)
        return this.state_render[7 - coord[1].charCodeAt(0) + '1'.charCodeAt(0)][coord[0].charCodeAt(0) - 'A'.charCodeAt(0)];
    }

    color_square(coord) {
        let square = this.get_square(coord);
        if(square === undefined) {
            console.log("color_square: unable to read the coordinate from state: ", coord[0], coord[1]);
            return;
        }
        square.style.backgroundColor = "rgb(255,103,103)";
    }
}



let BOARD = new ChessBoard();
