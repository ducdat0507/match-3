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
            if (x >= 2500) loadScreen("game");
            return x >= 2500;
        })
    }

    makeModeButton("endless",     "ENDLESS",    Ex(0, 0));

    let isAnimating = true;

    startAnimation(x => {
        for (let a in modeButtons) {
            modeButtons[a].position.ey = 150 - clamp01(ease.cubic.out((x - 20 * a) / 1000)) * 100;
        }
        if (x >= 980 + 20 * modeButtons.length) isAnimating = false;
        return x >= 980 + 20 * modeButtons.length;
    });
}