popups.about = function (parent) {
    if (popupAnim) return;

    let popup = doPopup(parent);
    popup.$title.text = "About";

    popup.$content.append(controls.scroller({
        position: Ex(0, -100, 0, 25),
        size: Ex(0, 200, 100, 50),
        fill: 0
    }), "view");

    let holder = popup.$content.$view.$content

    function addTitle(title) {
        let y = holder.size.y;
        holder.append(controls.label({
            position: Ex(0, y + 20, 50),
            text: title,
            scale: 20,
            fill: "#aaa",
            baseline: "top",
        }));
        holder.size.y += 35;
    }
    function addLine(title) {
        let y = holder.size.y;
        holder.append(controls.label({
            position: Ex(0, y + 20, 50),
            text: title,
            scale: 25,
            baseline: "top",
        }));
        holder.size.y += 40;
    }
    
    holder.append(controls.label({
        position: Ex(100, 80),
        text: "Yet Another\nMatch-3 Clone.",
        align: "left",
        scale: 50,
        style: "700",
    }));

    holder.size.y += 180;

    addLine("Version " + version);
    
    holder.size.y += 40;

    addTitle("Created by");
    addLine("ducdat0507");
    
    holder.size.y += 40;

    addTitle("Inspired by other match-3 games (duh),");
    addTitle("most dominantly the Bejeweled series and such.");

    holder.size.y += 50;

    ButtonWithText(popup.$content, {
        position: Ex(30, 120, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Back", () => {
        popup.close();
    });
    
    return popup;
}