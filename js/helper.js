
function Ex(x, y, ex = 0, ey = 0) {
    return { x, y, ex, ey };
}

function Rect(x, y, width = 0, height = 0) {
    return { x, y, width, height };
}

function getRankData() {
    let level, goal;

    while (true) {
        level = game.stats.level - 1n;
        goal = 2500n + 1475n * level + 25n * level * level;
        if (game.stats.exp >= goal) {
            game.stats.exp -= goal;
            game.stats.level ++;
        } else break;
    }

    return {level, goal}
}

function rankBarLevelPopup(exp, onDone, popup = null) {
    game.stats.exp += exp;
    game.stats.totalExp += exp;

    if (!popup) {
        scene.append(popup = controls.rect({
            position: Ex(-270, -90, 50, 50),
            size: Ex(540, 180),
            fill: "#fff4",
            alpha: 0,
        }))
        popup.append(controls.rect({
            position: Ex(4, 4),
            size: Ex(-8, -8, 100, 100),
            fill: "#0007",
        }), "fill")
    
        popup.append(controls.gembar({
            position: Ex(-249, -28, 50, 50),
            size: Ex(498, 56),
            fill: "#fff4",
        }), "progress")
        popup.$progress.append(controls.label({
            position: Ex(10, -25),
            align: "left",
            scale: 25,
        }), "rank")
        popup.$progress.append(controls.label({
            position: Ex(-10, -25, 100),
            align: "right",
            style: "italic",
            scale: 25,
        }), "title")
        popup.$progress.append(controls.label({
            position: Ex(0, 30, 50, 100),
            scale: 25,
        }), "goal")
    }

    let popup2;
    scene.append(popup2 = controls.rect({
        position: Ex(-150, -180, 50, 50),
        size: Ex(300, 60),
        fill: "#444",
        alpha: 0,
    }))
    popup2.append(controls.rect({
        position: Ex(4, 4),
        size: Ex(-8, -8, 100, 100),
        fill: "#0007",
    }), "fill")
    popup2.append(controls.label({
        position: Ex(0, 0, 50, 50),
        scale: 25,
    }), "add")

    function init() {
        game.stats.exp -= exp;
        let {level, goal} = getRankData();
        popup.$progress.progress = Number(game.stats.exp) / Number(goal);
        popup.$progress.$rank.text = "Rank " + game.stats.level.toLocaleString("en-US");
        popup.$progress.$title.text = titles[level] || titles[titles.count - 1];
        popup.$progress.$goal.text = (goal - game.stats.exp).toLocaleString("en-US") + " XP to next level";
        popup2.$add.text = "+" + (exp).toLocaleString("en-US") + " XP";
        startAnimation(anim1);
    }

    function anim1(x) {
        popup.alpha = ease.quart.inout(clamp01(x / 300));
        popup.position.y = -40 - 50 * ease.quart.inout(clamp01(x / 300));
        popup2.alpha = ease.quart.inout(clamp01((x - 300) / 300));
        popup2.position.y = -230 + 50 * ease.quart.inout(clamp01((x - 300) / 300));
        if (x > 600) {
            setTimeout(() => startAnimation(anim2), 1000);
            return true;
        }
    }

    let totalExp = Number(exp);
    let levelUpCooldown = 0;
    function anim2(x) {
        levelUpCooldown -= delta;
        if (levelUpCooldown > 0) return;

        let {level, goal} = getRankData();
        let inc = BigInt(Math.ceil(Math.max(totalExp / 5000, Number(goal) / 5000) * delta));
        if (inc > exp) inc = exp;
        if (inc > goal - game.stats.exp) inc = goal - game.stats.exp;
        game.stats.exp += inc;
        exp -= inc;
        
        popup.$progress.progress = Number(game.stats.exp) / Number(goal);
        popup.$progress.$rank.text = "Rank " + game.stats.level.toLocaleString("en-US");
        popup.$progress.$title.text = titles[level] || titles[titles.count - 1];
        popup.$progress.$goal.text = (goal - game.stats.exp).toLocaleString("en-US") + " XP to next level";
        popup2.$add.text = "+" + (exp).toLocaleString("en-US") + " XP";

        if (game.stats.exp >= goal) {
            levelUpCooldown = 800;
        } else if (exp == 0) {
            setTimeout(() => startAnimation(anim3), 1500);
            return true;
        }
    }

    function anim3(x) {
        popup.alpha = 1 - ease.quart.in(clamp01(x / 500));
        popup.position.y = -90 + 50 * ease.quart.in(clamp01(x / 500));
        popup2.alpha = 1 - ease.quart.in(clamp01(x / 500));
        popup2.position.y = -180 - 50 * ease.quart.in(clamp01(x / 500));
        if (x > 500) {
            scene.remove(popup);
            scene.remove(popup2);
            onDone?.();
            return true;
        }
    }

    requestAnimationFrame(init)
}

function formatDuration(ms) {
    let txt = Math.floor((ms /= 60000) % 60) + "m";
    if ((ms /= 60) >= 1) txt = Math.floor(ms % 24) + "h " + txt;
    if ((ms /= 24) >= 1) txt = Math.floor(ms) + "d " + txt;
    return txt
}

function getAwardXP(exp) {
    let min = (...args) => args.reduce((m, e) => e < m ? e : m);

    if (currentMode == "classic") exp = exp * min(100n + scene.$board.data.level * 5n, 200n) / 100n;
    if (currentMode == "classier") exp = exp * min(100n + scene.$board.data.level * 10n, 200n) / 100n;
    if (currentMode == "action") exp = exp * min(75n + scene.$board.data.level * 5n, 200n) / 100n;
    if (currentMode == "speed") exp = exp * min(80n + scene.$board.data.maxLevel * 2n, 200n) / 100n;
    if (currentMode == "sandbox") exp = 0;
    return exp;
}

function getLevelGoal(level) {
    return currentMode == "classic" ? 150 + 150 * level : 
           currentMode == "classier" ? 150 + 150 * level : 
           currentMode == "action" ? 150 + 250 * level :
           currentMode == "endless" ? Math.min(250 + 250 * level, 5000) :
           Infinity;
}

function colorMix(a, b, t) {
    let ans = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        ans[i] = a[i] + (b[i] - a[i]) * t;
    }
    return ans;
}