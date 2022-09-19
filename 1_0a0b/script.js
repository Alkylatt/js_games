let allow_dupes = false; // whether or not to allow duplicate digits in the answer
let numbers_to_guess = 4; // number of numbers to guess

// Inefficient code of radio like settings buttons stuff
function settings_dupe(allowDupe) {
    let btn = document.querySelectorAll('#settings_dupe span');
    if(allowDupe) {
        btn[0].classList.add('selected');
        btn[1].classList.remove('selected');
        allow_dupes = true;
    }else {
        btn[1].classList.add('selected');
        btn[0].classList.remove('selected');
        allow_dupes = false;
    }
}

function settings_digits(digits) {
    let btn = document.querySelectorAll('#settings_digits span');
    for(let i=0;i < 6;i++) {
        btn[i].classList.remove('selected');
    }
    btn[digits - 3].classList.add('selected');
    numbers_to_guess = digits;
}

let answer = "";
function settings_start() {
    // Generate random answer with "numbers_to_guess" digits

    if(allow_dupes) {
        for(let i=0;i < numbers_to_guess;i++) {
            answer += Math.floor(Math.random() * 9.9).toString();
        }
    }else {
        // no dupes
        let arr = [0,1,2,3,4,5,6,7,8,9];
        shuffle(arr);
        for(let i=0;i < numbers_to_guess;i++) {
            answer += arr[i];
        }
    }

    document.getElementById('settings').remove();

    // empty boxes initializing
    for(let i=0;i < numbers_to_guess;i++) {
        display.appendChild(document.createElement("div"));
    }
    console.log(answer);
}

// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
// See https://github.com/coolaj86/knuth-shuffle
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}



let btn = [];
for(let i=0;i < 10;i++) {
    btn[i] = document.getElementById("btn_" + i)
    btn[i].addEventListener("click", btn_clicked, false);
    btn[i].label = i;
}
let btn_del = document.getElementById("btn_del");
    btn_del.addEventListener("click", btn_clicked, false);
    btn_del.label = 'del';
let btn_enter = document.getElementById("btn_enter");
    btn_enter.addEventListener("click", btn_clicked, false);
    btn_enter.label = 'enter';



function btn_clicked(evt) {
    let btn = evt.currentTarget.label;
    input(btn);
}



let guess_field = "";
let display = document.getElementById('display');
display.innerText = "";



function input(par) {
    cd[par] = true;
    if(par === 'del') {
        guess_field = guess_field.substring(0, guess_field.length-1);
    }else if(par === 'enter') {
        if(guess_field.length === numbers_to_guess)
            check_answer(guess_field);
    }else {
        if(guess_field.length < numbers_to_guess)
            guess_field += par;
    }

    while(display.lastChild) {
        display.removeChild(display.lastChild);
    }
    for(let i=0;i < guess_field.length;i++) {
        let newDiv = display.appendChild(document.createElement("div"));
        newDiv.innerText = guess_field[i];
    }
    for(let i=guess_field.length;i < numbers_to_guess;i++) {
        display.appendChild(document.createElement("div"));
    }
}



// guess recording
let record = document.getElementById('guessed_record');
let guess_count = 0;

function add_record(nums, check_result) {
    guess_count++;
    nums = nums.toString();
    let newRow = record.appendChild(document.createElement("div"));
    for(let i=0;i < nums.length;i++) {
        let newBlock = newRow.appendChild(document.createElement("div"));
        newBlock.innerText = nums[i];
    }
    let newBlock = newRow.appendChild(document.createElement("div"));
    newBlock.className = "wrong";

    newBlock = newRow.appendChild(document.createElement("div"));
    newBlock.className = (check_result[0] !== 0) ? "A" : "wrong";
    newBlock.innerText = check_result[0];
    newBlock = newRow.appendChild(document.createElement("div"));
    newBlock.className = (check_result[0] !== 0) ? "A" : "wrong";
    newBlock.innerText = 'A';

    newBlock = newRow.appendChild(document.createElement("div"));
    newBlock.className = (check_result[1] !== 0) ? "B" : "wrong";
    newBlock.innerText = check_result[1];
    newBlock = newRow.appendChild(document.createElement("div"));
    newBlock.className = (check_result[1] !== 0) ? "B" : "wrong";
    newBlock.innerText = 'B';
}



// Key press detector
let keyMap = {}; // a array for keys' stats
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    keyMap[e.key] = e.type === "keydown";
}

let cd = {};

// Keyboard Input support
let intervalTick = setInterval(tick, 8); // about 30 tps
function tick() {
    if(keyMap["0"] && !cd['0']) input('0');
    if(keyMap["1"] && !cd['1']) input('1');
    if(keyMap["2"] && !cd['2']) input('2');
    if(keyMap["3"] && !cd['3']) input('3');
    if(keyMap["4"] && !cd['4']) input('4');
    if(keyMap["5"] && !cd['5']) input('5');
    if(keyMap["6"] && !cd['6']) input('6');
    if(keyMap["7"] && !cd['7']) input('7');
    if(keyMap["8"] && !cd['8']) input('8');
    if(keyMap["9"] && !cd['9']) input('9');
    if( (keyMap["Backspace"] || keyMap["Delete"]) && !cd['del']) input('del');
    if(keyMap["Enter"]) input('enter');

    for(let i=0;i < 10;i++) {
        i = i.toString();
        if (!keyMap[i]) { cd[i] = false; }
    }
    if(!keyMap["Backspace"] && !keyMap["Delete"]) cd['del'] = false;


    if(keyMap["0"]) btn[0].classList.add('hover'); else btn[0].classList.remove('hover');
    if(keyMap["1"]) btn[1].classList.add('hover'); else btn[1].classList.remove('hover');
    if(keyMap["2"]) btn[2].classList.add('hover'); else btn[2].classList.remove('hover');
    if(keyMap["3"]) btn[3].classList.add('hover'); else btn[3].classList.remove('hover');
    if(keyMap["4"]) btn[4].classList.add('hover'); else btn[4].classList.remove('hover');
    if(keyMap["5"]) btn[5].classList.add('hover'); else btn[5].classList.remove('hover');
    if(keyMap["6"]) btn[6].classList.add('hover'); else btn[6].classList.remove('hover');
    if(keyMap["7"]) btn[7].classList.add('hover'); else btn[7].classList.remove('hover');
    if(keyMap["8"]) btn[8].classList.add('hover'); else btn[8].classList.remove('hover');
    if(keyMap["9"]) btn[9].classList.add('hover'); else btn[9].classList.remove('hover');
    if( (keyMap["Backspace"] || keyMap["Delete"])) btn_del.classList.add('hover'); else btn_del.classList.remove('hover');
    if(keyMap["Enter"]) btn_enter.classList.add('hover'); else btn_enter.classList.remove('hover');
}



function check_answer(guess) {
    guess_field = "";

    let temp = answer;
    let a = 0, b = 0;
    let res = [[""],[]]; // 0: A&Bs for every digit, 1: A&B counts

    for(let i=0;i < answer.length;i++) {
        res[0] += '-';
    }
    for(let i=0;i < answer.length;i++) {
        if(guess[i] === temp[i]) {
            temp = temp.replaceChar(i, 'A');
            res[0] = res[0].replaceChar(i, 'A');
            a++;
        }
    }
    for(let i=0;i < guess.length;i++) {
        for(let j=0;j < answer.length;j++) {
            if(temp[i] !== 'A' && guess[i] === temp[j]) {
                temp = temp.replaceChar(j, 'B');
                res[0] = res[0].replaceChar(i, 'B');
                b++;
                break;
            }
        }
    }

    res[1][0] = a;
    res[1][1] = b;

    add_record(guess, res[1]);
    if(a === numbers_to_guess) {
        gameover();
    }
    return res;
}



String.prototype.replaceChar = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}



let end_message = document.getElementById('gg');
function gameover() {
    end_message.innerHTML = "Congratulations!<br>You did it!<br>The answer was: " + answer + "<br><br><br>Guess attempted: " + guess_count;
    end_message.style.display = 'block';
}