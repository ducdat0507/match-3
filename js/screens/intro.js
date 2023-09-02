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

    scene.append(controls.base({
        position: Ex(0, 0),
        size: Ex(0, 0, 100, 100),
        onpointerdown () {
            loadScreen("game");
        },
        onupdate() {
            let tWidth = Math.min(window.innerWidth / scale, 1000);
            scene.$title.scale = tWidth / 10;
            scene.$title.size = Ex(tWidth, 0);

            scene.$action.position = Ex(0, 50 + Math.sin(Date.now() / 1000) * 10, 50, 70);
        }
    }), "logic");

}