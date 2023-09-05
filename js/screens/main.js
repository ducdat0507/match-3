screens.main = function () {

    let modeButtons = [];

    function makeModeButton(target, name, position) {
        let button;
        scene.append(button = controls.button({
            position: Ex(position.x - 80, position.y - 80, 50, 50),
            size: Ex(160, 160),
            radius: 80,
            fill: "#aaa7",
            target,
            onclick() {
                if (!isAnimating) {
                    isAnimating = true;
                    button.onpointerout();
                    button.__mouseIn = false;
                    decideMode(target);
                }
            }
        }))
        button.append(controls.rect({
            position: Ex(2, 2),
            size: Ex(-4, -4, 100, 100),
            radius: 80,
            fill: "#000a",
        }), "fill")
        button.append(controls.label({
            position: Ex(0, 0, 50, 50),
            scale: 30,
            style: "900 italic",
            text: name
        }), "text")
        modeButtons.push(button);
    }

    let level, goal;

    while (true) {
        level = game.stats.level - 1n;
        goal = 2000n + 495n * level + 5n * level * level;
        if (game.stats.exp >= goal) {
            game.stats.exp -= goal;
            game.stats.level ++;
        } else break;
    }

    function decideMode(mode) {
        currentMode = mode;
        startAnimation(x => {
            for (let button of modeButtons) {
                button.clickthrough = true;
                let size = button.size.x = button.size.y;
                if (button.target == mode) {
                    button.position.x = (button.position.x + size / 2) / 1e6 ** (delta / 1000) - size / 2;
                    button.position.y = (button.position.y + size / 2) / 1e6 ** (delta / 1000) - size / 2;
                    button.position.ey = 50 - clamp01(ease.cubic.in((x - 1000) / 1000)) * 75;
                } else {
                    button.position.x = (button.position.x + size / 2) / 2 ** (delta / 1000) - size / 2;
                    button.position.y = (button.position.y + size / 2) / 2 ** (delta / 1000) - size / 2;
                    button.alpha = 1 - clamp01(ease.cubic.out(x / 200));
                }
            }
            scene.$progress.position.y = -94 + clamp01(ease.quint.out(x / 1000)) * 200;
            if (x >= 2500) loadScreen("game");
            return x >= 2500;
        })
    }

    makeModeButton("endless",     "ENDLESS",    Ex(0, 0));
    

    scene.append(controls.gembar({
        position: Ex(-170, -96, 50, 100),
        size: Ex(440, 56),
        fill: "#555a",
        progress: Number(game.stats.exp) / Number(goal)
    }), "progress")
    scene.$progress.append(controls.rect({
        position: Ex(-100, 0),
        size: Ex(100, 0, 0, 100),
        fill: "#555a",
    }), "rankbox")
    scene.$progress.append(controls.label({
        position: Ex(-50, 30),
        text: game.stats.level.toLocaleString("en-US"),
        scale: 25,
    }), "rank")
    scene.$progress.append(controls.label({
        position: Ex(-100, -20),
        align: "left",
        text: "Player",
        scale: 25,
    }), "name")
    scene.$progress.append(controls.label({
        position: Ex(0, -20, 100),
        align: "right",
        style: "italic",
        text: titles[level] || titles[titles.count - 1],
        scale: 25,
    }), "title")


    let isAnimating = true;

    startAnimation(x => {
        for (let a in modeButtons) {
            modeButtons[a].position.ey = 150 - clamp01(ease.cubic.out((x - 20 * a) / 1000)) * 100;
        }
        scene.$progress.position.y = 104 - clamp01(ease.cubic.out((x - 250) / 1000)) * 200;

        let length = Math.max(980 + 20 * modeButtons.length, 1250)
        if (x >= length) isAnimating = false;
        return x >= length;
    });
}