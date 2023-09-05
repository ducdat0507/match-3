popups.gamemenu = function () {
    let popup = doPopup();
    let button;

    popup.$content.append(button = controls.button({
        position: Ex(30, -30, 0, 75),
        size: Ex(-60, 60, 100),
        fill: "#aaa7",
        onclick() {
            popup.close();
        }
    }), "continue")
    button.append(controls.rect({
        position: Ex(2, 2),
        size: Ex(-4, -4, 100, 100),
        fill: "#000a",
    }), "fill")
    button.append(controls.label({
        position: Ex(0, 0, 50, 50),
        scale: 25,
        text: "Continue",
    }), "text")

    popup.$content.append(button = controls.button({
        position: Ex(30, 40, 0, 75),
        size: Ex(-60, 60, 100),
        fill: "#aaa7",
        onclick() {
            loadScreen("main");
        }
    }), "lobby")
    button.append(controls.rect({
        position: Ex(2, 2),
        size: Ex(-4, -4, 100, 100),
        fill: "#000a",
    }), "fill")
    button.append(controls.label({
        position: Ex(0, 0, 50, 50),
        scale: 25,
        text: "Return to Main Menu",
    }), "text")
}
