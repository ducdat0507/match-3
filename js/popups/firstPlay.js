popups.firstPlay = function (parent) {
    if (popupAnim) return;

    let popup = doPopup(parent);
    popup.$title.text = "Welcome!";

    popup.$content.append(controls.label({
        position: Ex(0, -40, 50, 25),
        scale: 25,
        text: "Please enter your name:"
    }), "subtitle")

    popup.$content.append(controls.input({
        position: Ex(30, 0, 0, 25),
        size: Ex(-60, 60, 100),
        fill: "#0007",
        maxlength: 16,
        value: "Player 1",
    }), "input")

    popup.$content.append(controls.label({
        position: Ex(0, 100, 50, 25),
        size: Ex(-60, 60, 100),
        scale: 25,
        wrap: true,
        text: "You can change your name later by clicking the progress bar button below the screen."
    }), "subtitle")

    popup.$content.append(controls.base({
        render() {
            popup.$content.$input.onclick();
            popup.$content.remove(popup.$content.$init);
        }
    }), "init");


    prefabs.textButton(popup.$content, {
        position: Ex(30, 120, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Confirm", () => {
        let value = popup.$content.$input.value;
        
        if (!value.trim() || value.includes("\n")) return;
        try {
            JSON.stringify({ name: value });
        } catch {
            return;
        }

        meta.players[meta.currentPlayer].name = popup.$content.$input.value;
        popup.close();
    });
    
    return popup;
}