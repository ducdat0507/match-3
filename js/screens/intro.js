screens.intro = function () {

    scene.append(controls.label({
        position: Ex(0, -100, 50, 45),
        size: Ex(600, 0),
        scale: 70,
        text: "YET ANOTHER MATCH-3 CLONE",
        font: "'Trebuchet MS'",
        style: "italic 900",
        wrap: true,
    }), "title")

    scene.append(controls.label({
        position: Ex(0, 50, 50, 70),
        size: Ex(0, 200),
        scale: 25,
        text: "Click or touch the screen to start",
        style: "italic",
    }), "action")

    let isStarting = true;

    scene.append(controls.base({
        position: Ex(0, 0),
        size: Ex(0, 0, 100, 100),
        onpointerdown () {
            if (!isStarting) {
                isStarting = true;
                startAnimation(outtro);
            }
        },
        onupdate() {
            let tWidth = Math.min(window.innerWidth / scale, 1000);
            scene.$title.scale = tWidth / 10;
            scene.$title.size = Ex(tWidth, 0);

            scene.$action.position.y = 50 + Math.sin(Date.now() / 1000) * 10;
        }
    }), "logic");

    startAnimation(x => {
        scene.$title.alpha = ease.quad.out(x / 500);
        scene.$action.alpha = ease.cubic.out(x / 500);
        if (x >= 500) isStarting = false;
        return x >= 500;
    });

    function outtro(x) {
        scene.$title.position.ex = 50 + ease.quart.in(x / 1000) * 100;
        scene.$action.position.ex = 50 - ease.quart.in(x / 1000) * 100;
        scene.$action.alpha = Math.cos(x / 20) / 2 + .5;
        if (x >= 1000) loadScreen("game");
        return x >= 1000;
    }
}