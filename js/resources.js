function loadRes() {
    for (let cat in res) {
        for (let id in res[cat]) {
            let img = new Image();
            img.src = res[cat][id];
            res[cat][id] =img;
        }
    }
}

let res = {
    tiles: {
        0: "res/tiles/0.svg",
        1: "res/tiles/1.svg",
        2: "res/tiles/2.svg",
        3: "res/tiles/3.svg",
        4: "res/tiles/4.svg",
        5: "res/tiles/5.svg",
        6: "res/tiles/6.svg",
    },
    tilesFade: {
        0: "res/tiles-fade/0.svg",
        1: "res/tiles-fade/1.svg",
        2: "res/tiles-fade/2.svg",
        3: "res/tiles-fade/3.svg",
        4: "res/tiles-fade/4.svg",
        5: "res/tiles-fade/5.svg",
        6: "res/tiles-fade/6.svg",
    },
}