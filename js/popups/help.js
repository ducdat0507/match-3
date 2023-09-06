popups.help = function (parent) {
    if (popupAnim) return;

    let popup = doPopup(parent);
    popup.$title.text = "How to Play";
    
    popup.$content.append(controls.label({
        position: Ex(0, -50, 50, 25),
        size: Ex(-60, 0, 100),
        scale: 25,
        wrap: true,
        text: 
            "Swap adjacent tiles to make matches of 3 in a row.\n\n" +
            "Earn more points by matching more than 3 tiles in a row or making chain reactions.\n\n" +
            "Match 4 or more tiles of the same color in a row to obtain special tiles with different properties!"
    }))

    ButtonWithText(popup.$content, {
        position: Ex(30, 120, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Back", () => {
        popup.close();
    });
}
