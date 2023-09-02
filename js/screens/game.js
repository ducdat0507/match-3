screens.game = function () {

    // The Score
    scene.append(controls.rect({
        position: Ex(-300, -310, 50, 50),
        size: Ex(180, 60),
        text: 0,
        fill: "#555a",
    }), "scorebox")
    scene.$scorebox.append(controls.rect({
        position: Ex(2, 2),
        size: Ex(-4, -4, 100, 100),
        fill: "#555a",
    }), "fill")
    scene.append(controls.label({
        position: Ex(-300, -310, 50, 50),
        scale: 30,
        text: 0,
    }), "score")

    // The hint button
    scene.append(controls.button({
        position: Ex(110, 310, 50, 50),
        size: Ex(180, 60),
        fill: "#aaa7",
        onclick() {
            scene.$board.showHint();
        }
    }), "hint")
    scene.$hint.append(controls.rect({
        position: Ex(2, 2),
        size: Ex(-4, -4, 100, 100),
        fill: "#000a",
    }), "fill")
    scene.$hint.$fill.append(controls.rect({
        size: Ex(0, 0, 100, 100),
        fill: "#000",
    }), "bar")
    scene.$hint.append(controls.label({
        position: Ex(0, 0, 50, 50),
        scale: 25,
        style: "italic",
        text: "Hint",
    }), "text")

    // The board
    scene.append(controls.board({
        position: Ex(-300, -300, 50, 50),
        size: Ex(600, 600),
    }), "board")
    
    scene.append(controls.base({
        onupdate() {
            scene.$score.text = (scene.$board.score - BigInt(Math.round(scene.$board.lerpScore))).toLocaleString("en-US");
            scene.$hint.$fill.$bar.size = Ex(0, 0, Math.min(Math.max(scene.$board.hintCooldown / 5000, 0), 1) * 100, 100);

            if (window.innerWidth / scale >= 1000) {
                scene.$scorebox.position = Ex(-450, -300, 50, 50);
                scene.$scorebox.size = Ex(280, 100),
                scene.$score.position = Ex(-310, -265, 50, 50);
                scene.$hint.position = Ex(-400, 240, 50, 50);
                scene.$board.position = Ex(-150, -300, 50, 50);
            } else {
                scene.$scorebox.position = Ex(-300, -360, 50, 50);
                scene.$scorebox.size = Ex(600, 60),
                scene.$score.position = Ex(0, -330, 50, 50);
                scene.$hint.position = Ex(110, 190, 50, 65);
                scene.$board.position = Ex(-300, -300, 50, 50);
            }
        }
    }), "logic")

    scene.$logic.onupdate();
}