const DESKTOP = document.getElementById("desktop");
const DESC_TITLE = document.getElementById("desc_title");
const DESC_TEXT = document.getElementById("desc_text"); // for explaining the cards


// ids for every cards
const DECK_MAJOR_ARCANA = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
const DECK_WANDS = [22,23,24,25,26,27,28,29,30,31];
const DECK_SWORDS = [32,33,34,35,36,37,38,39,40,41];
const DECK_CUPS = [42,43,44,45,46,47,48,49,50,51];
const DECK_PENTACLES = [52,53,54,55,56,57,58,59,60,61];
const DECK_COURT = [62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77];

// id -> string name
const DECK_ZH = [
    // major arcana
    "愚者",
    "魔術師","女祭司","皇后","國王(皇帝)","教皇(大祭司)",
    "戀人","戰車","力量","隱修者","命運之輪",
    "正義","懸吊者","死亡","節制(調節)","惡魔",
    "高塔","星星","月亮","太陽","審判",
    "世界"
    // ...TODO
];
// id -> card's meaning
const DESC_ZH = [
    // major arcana
    "本質傾向\n中性形容 (大塔羅之表現)\n大塔羅的主角 (旅行者)\n關鍵意義\n旅程的起點、冒險、赤子之心、新生兒、主動性、機會\n其他意義\n本能\n感覺\n新鮮而嶄新的\n熱衷的\n未知的\n正面意義、實力、優勢\n勇敢\n有探索與冒險的精神\n一張白紙\n負面意義、弱點、阻礙\n冒失\n魯莽\n有風險",
    "魔術師","女祭司","皇后","國王(皇帝)","教皇(大祭司)",
    "戀人","戰車","力量","隱修者","命運之輪",
    "正義","懸吊者","死亡","節制(調節)","惡魔",
    "高塔","星星","月亮","太陽","審判",
    "世界"
    // ...TODO
];

let deck = [];


function setupDeck() {
    deck = [];    
    // deck setup
    deck = deck.concat(DECK_MAJOR_ARCANA); 
    deck = shuffle(deck); // shuffle
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


function drawCard() {
    if(deck.length == 0) {
        console.log("No card remaining");
        return;
    }
    let draw_card = deck.pop();

    // draw_card = DECK_ZH[draw_card];
    // console.log(draw_card)

    let new_card = DESKTOP.appendChild(document.createElement("div"));
    new_card.classList.add("card");
    new_card.innerText = DECK_ZH[draw_card];

    new_card.addEventListener("mouseover", (event) => {
        DESC_TITLE.innerText = DECK_ZH[draw_card];
        DESC_TEXT.innerText = DESC_ZH[draw_card];
    });
}


function reshuffleCard() {
    while (DESKTOP.firstChild) {
        DESKTOP.removeChild(DESKTOP.firstChild);
    }

    setupDeck();
}