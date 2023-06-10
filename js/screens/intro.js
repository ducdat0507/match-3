screens.intro = function () {
    scene.append(controls.board({
        position: Ex(-320, -320, 50, 50),
        size: Ex(640, 640),
    }), "board")
}