var meta = {};

function getStartMeta() {
    return {
        currentPlayer: "",
        players: {},
        versionIndex: 0,
    }
}

function randomID() {
    let hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    let str = "";
    for (let a = 0; a < 16; a++) str += hex[Math.floor(Math.random() * hex.length)];
    return str;
}

function load() {
    try {
        meta = (JSON.parse(atob(localStorage.getItem("yam3c"))));
        if (meta.boards) {
            game = meta;
            meta = getStartMeta();
            createPlayer("Player 1", game);
        } else {
            meta = deepCopy(meta, getStartMeta());
        }
        console.log(meta);
    } catch (e) {
        console.log(e);
        meta = getStartMeta();
        meta.versionIndex = versionIndex;
    }
    if (!meta.currentPlayer) {
        createPlayer("Player 1");
    } else {
        loadPlayer();
    }
}

function save() {
    localStorage.setItem("yam3c", btoa(JSON.stringify(meta)));
    savePlayer();
}

var game = {};

function getStartGame() {
    return {
        boards: {},
        stats: {
            level: 1n,
            exp: 0n,
            totalExp: 0n,

            total: 0n,
            powers: {},
            colors: {},

            timePlayed: 0,
        },
        options: {
            autoHint: true,
            fpsCounter: false,
        },
    }
}

function createPlayer(name, startData = {}) {
    let id = randomID();
    meta.players[id] = {
        name
    }
    meta.currentPlayer = id;
    game = deepCopy(startData, getStartGame());
    save();
    return id;
}

function switchPlayer(id) {
    meta.currentPlayer = id;
    loadPlayer();
    save();
}

function deletePlayer(id) {
    localStorage.removeItem("yam3c-" + id);
    delete meta.players[id];
    save();
}


function loadPlayer() {
    try {
        game = deepCopy(JSON.parse(atob(localStorage.getItem("yam3c-" + meta.currentPlayer))), getStartGame());
        console.log(game);
    } catch (e) {
        console.log(e);
        game = getStartGame();
    }
}

function savePlayer() {
    localStorage.setItem("yam3c-" + meta.currentPlayer, btoa(JSON.stringify(game)));
}

BigInt.prototype.toJSON = function () {
    return this.toString();
};

function deepCopy(target, source) {
    for (item in source) {
        if (target[item] === undefined) target[item] = source[item];
        else if (typeof source[item] == "bigint") target[item] = BigInt(target[item]);
        else if (typeof source[item] == "object") target[item] = deepCopy(target[item], source[item]);
    }
    return target;
}

function addTileToStats(tile) {
    game.stats.total++;
    if (scene.$board?.board.types == 7) {
        game.stats.colors[tile.type] = BigInt(game.stats.colors[tile.type] || 0n) + 1n;
    }
    if (tile.power) {
        game.stats.powers[tile.power] = BigInt(game.stats.powers[tile.power] || 0n) + 1n;
    }
}
  