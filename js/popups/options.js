popups.options = function (parent) {
    if (popupAnim) return;

    let popup = doPopup(parent);
    popup.$title.text = "Options";

    popup.$content.append(controls.scroller({
        position: Ex(0, -100, 0, 25),
        size: Ex(0, 200, 100, 50),
        fill: 0
    }), "view");

    let holder = popup.$content.$view.$content

    function addTitle(title) {
        let y = holder.size.y;
        holder.append(controls.label({
            position: Ex(30, y + 60),
            text: title,
            scale: 35,
            style: "700",
            align: "left",
        }));
        holder.size.y += 85;
    }

    function addToggle(id, title) {
        let y = holder.size.y;
        holder.append(controls.label({
            position: Ex(30, y + 30),
            text: title,
            scale: 25,
            align: "left",
        }));
        let button = ButtonWithText(holder, {
            position: Ex(-150, y, 100),
            size: Ex(120, 60),
        }, "", () => {
            game.options[id] = !game.options[id];
            save();
            update();
        });
        function update() {
            button.$text.text = game.options[id] ? "ON" : "OFF";
        }
        update();
        holder.size.y += 80;
    }

    addTitle("General");
    addToggle("autoHint", "Auto-Hint");

    addTitle("Display");
    addToggle("fpsCounter", "Show FPS counter");

    holder.size.y += 50;

    ButtonWithText(popup.$content, {
        position: Ex(30, 120, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Back", () => {
        popup.close();
    });
    
    return popup;
}