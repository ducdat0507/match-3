screens.intro = function () {

    // The board
    scene.append(controls.board({
        position: Ex(-300, -300, 50, 50),
        size: Ex(600, 600),
    }), "board")

    // The hint button
    scene.append(controls.button({
        position: Ex(110, 310, 50, 50),
        size: Ex(180, 60),
        fill: "#aaaaaa77",
        onclick() {
            scene.$board.showHint();
        }
    }), "hint")
    scene.$hint.append(controls.rect({
        position: Ex(2, 2),
        size: Ex(-4, -4, 100, 100),
        fill: "#000000aa",
    }), "fill")
    scene.$hint.append(controls.label({
        position: Ex(0, 0, 50, 50),
        scale: 30,
        style: "900",
        text: "Hint",
    }), "text")
}