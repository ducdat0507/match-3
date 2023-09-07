popups.profile = function (parent) {
    if (popupAnim) return;

    let popup = doPopup(parent);
    popup.$title.text = "Profile";

    let level, goal;

    while (true) {
        level = game.stats.level - 1n;
        goal = 2000n + 975n * level + 25n * level * level;
        if (game.stats.exp >= goal) {
            game.stats.exp -= goal;
            game.stats.level ++;
        } else break;
    }
    
    popup.$content.append(controls.rect({
        position: Ex(-200, 0, 50, 25),
        size: Ex(400, 2),
        fill: "#777a",
    }), "namebox")
    popup.$content.$namebox.append(controls.label({
        position: Ex(10, -10),
        align: "left", 
        baseline: "alphabetic",
        style: "700",
        text: meta.players[meta.currentPlayer].name,
        scale: 40,
    }), "name")
    
    popup.$content.append(controls.gembar({
        position: Ex(-249, 100, 50, 25),
        size: Ex(498, 56),
        progress: Number(game.stats.exp) / Number(goal),
        fill: "#777a",
    }), "progress")
    popup.$content.$progress.append(controls.label({
        position: Ex(10, -25),
        align: "left",
        text: "Rank " + game.stats.level.toLocaleString("en-US"),
        scale: 25,
    }), "rank")
    popup.$content.$progress.append(controls.label({
        position: Ex(-10, -25, 100),
        align: "right",
        style: "italic",
        text: titles[level] || titles[titles.count - 1],
        scale: 25,
    }), "title")
    popup.$content.$progress.append(controls.label({
        position: Ex(0, 35, 50, 100),
        text: (goal - game.stats.level).toLocaleString("en-US") + " XP to next level",
        scale: 25,
    }), "goal")
    
    ButtonWithText(popup.$content, {
        position: Ex(30, 40, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Statistics", () => {
        popups.stats(popup);
    });

    ButtonWithText(popup.$content, {
        position: Ex(30, 120, 0, 75),
        size: Ex(-60, 60, 100),
    }, "Back", () => {
        popup.close();
    });
}