popups.stats = function (parent) {
    if (popupAnim) return;

    let popup = doPopup(parent);
    popup.$title.text = "Statistics";

    popup.$content.append(controls.scroller({
        position: Ex(0, -100, 0, 25),
        size: Ex(0, 200, 100, 50),
        fill: 0
    }), "view");

    let holder = popup.$content.$view.$content

    function addStatEntry(title, data) {
        let y = holder.size.y;
        holder.append(controls.label({
            position: Ex(30, y + 20),
            text: title,
            scale: 25,
            align: "left",
        }));
        holder.append(controls.label({
            position: Ex(-30, y + 20, 100),
            text: data,
            scale: 25,
            align: "right",
        }));
        holder.size.y += 40;
    }

    holder.size.y += 20;

    addStatEntry("Total tiles matched", game.stats.total.toLocaleString("en-US"));
    let powerSubs = {
        flame: "Fire tiles",
        star: "Lightning tiles",
        cube: "Dark cubes",
        nova: "Supernovas",
        sphere: "Dark spheres",
        fourd: "Tesseracts",
    }
    for (let a in powerSubs) if (game.stats.powers[a]) {
        addStatEntry("    " + powerSubs[a], BigInt(game.stats.powers[a]).toLocaleString("en-US"));
    }
    holder.size.y += 20;

    addStatEntry("Total EXP gained", game.stats.totalExp.toLocaleString("en-US"));
    holder.size.y += 20;

    ButtonWithText(popup.$content, {
        position: Ex(30, 120, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Back", () => {
        popup.close();
    });
}