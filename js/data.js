var game = {};

function getStartGame() {
    return {
        boards: {},
        stats: {
            level: 0n,
            exp: 0n,
            totalExp: 0n,
        }
    }
}

function deepCopy(target, source) {
    for (item in source) {
        if (target[item] === undefined) target[item] = source[item];
        else if (source[item] instanceof BigInt) target[item] = BigInt(target[item]);
        else if (typeof source[item] == "object") target[item] = deepCopy(target[item], source[item]);
    }
    return target;
}

function load() {
    try {
        game = deepCopy(JSON.parse(atob(localStorage.getItem("yam3c"))), getStartGame());
        console.log(game);
    } catch (e) {
        console.log(e);
        game = getStartGame();
    }
}

function save() {
    localStorage.setItem("yam3c", btoa(JSON.stringify(game)));
}

BigInt.prototype.toJSON = function () {
    return this.toString();
};
  