popups.secret = function (parent, hint) {
    if (popupAnim) return;

    let popup = doPopup(parent);
    popup.$title.text = "Locked";

    popup.$content.append(controls.label({
        position: Ex(0, -40, 50, 25),
        size: Ex(-60, 0, 100),
        scale: 25,
        text: 
            "This game mode is locked.\n\nMaybe it'll be unlocked once until some conditions are met...?",
        wrap: true,
    }), "subtitle")

    popup.$content.append(controls.label({
        position: Ex(0, 110, 50, 25),
        size: Ex(-60, 0, 100),
        scale: 25,
        style: "italic",
        text: 
            "Hint: " + hint,
        wrap: true,
    }), "subtitle")

    prefabs.textButton(popup.$content, {
        position: Ex(30, 120, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Back", () => {
        popup.close();
    });
    
    return popup;
}