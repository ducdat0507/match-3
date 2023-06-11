screens.intro = function () {
    scene.append(controls.board({
        position: Ex(-300, -300, 50, 50),
        size: Ex(600, 600),
    }), "board")
}