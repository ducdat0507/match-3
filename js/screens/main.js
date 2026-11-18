screens.main = function () {
    
    targetColor = [0.1, 0.1, 0.3];

    let modeButtons = [];
    let anchorButtons = [];

    let currentPage = 0;
    let pageCount = 3;
    let scroller;

    scene.append(scroller = controls.base({
        position: Ex(0, 0),
        size: Ex(0, 0, 100, 100),
        scrollSpd: 0,
        __mouseActive: false,
        onupdate() {
            if (!this.__mouseActive) {
                let pageOfs = Math.round(currentPage) - currentPage;
                if (Math.abs(this.scrollSpd) < 1 - Math.abs(pageOfs) * 2) {
                    this.scrollSpd = 0;
                    currentPage += pageOfs * (1 - 1e-3 ** (delta / 1000));
                } else {
                    currentPage += this.scrollSpd * delta / 1000;
                    this.scrollSpd *= 0.001 ** (delta / 1000);
                }
            }
            if (!isAnimating) targetColor = [0.1, 0.1, 0.3];
        },
        onpointerdown(pos, args) {
            if (isAnimating) return;
            isAnimating = true;
            this.__mouseActive = true;
            let startPos = mousePos;
            let startScr = currentPage;
            let scrTime = time;
            let isScrolling = false;
            let movehandler = (e) => {
                let pos = {
                    x: e.clientX * resScale,
                    y: e.clientY * resScale,
                }
                if (!isScrolling && Math.abs(startPos.x - pos.x) < 10 * scale) return;
                isScrolling = true;
                let pageSize = Math.min(mainCanvas.width, mainCanvas.height);
                let d = startScr - (pos.x - startPos.x) / pageSize;
                this.scrollSpd = (d - currentPage) / delta * 1000;
                currentPage = d;
                scrTime = time;
            }
            let uphandler = (e) => {
                isAnimating = false;
                this.__mouseActive = false;
                if (Math.abs(this.scrollSpd) * mainCanvas.width < 20 / scale || time - scrTime > 100) this.scrollSpd = 0;

                document.removeEventListener("pointermove", movehandler);
                document.removeEventListener("pointerup", uphandler);
            }
            document.addEventListener("pointermove", movehandler);
            document.addEventListener("pointerup", uphandler);
        },
    }));

    function makeAnchorButton(name, page) {
        let button;
        scene.append(button = controls.button({
            position: Ex(-80, -80, 50, 45),
            size: Ex(160, 160),
            radius: 80,
            fill: "#aaa",
            data: {
                page,
            },
            onclick() {
                if (isAnimating) return;
                scroller.scrollSpd += 6.5;
            }
        }))
        button.append(controls.rect({
            position: Ex(2, 2),
            size: Ex(-4, -4, 100, 100),
            radius: 80,
            fill: "#000a"
        }), "fill")
        button.append(controls.label({
            position: Ex(0, 0, 50, 50),
            scale: 30,
            style: "700",
            text: name,
            stroke: "#000",
            thickness: 8,
        }), "text")
        anchorButtons.push(button);
    }

    function makeModeButton(target, action, name, page, radius, angle) {
        let button;
        scene.append(button = controls.button({
            position: Ex(0, 0, 50, 45),
            size: Ex(120, 120),
            radius: 60,
            fill: "#aaa7",
            target,
            data: {
                page,
                radius,
                angle: Math.PI * angle,
            },
            onclick() {
                if (isAnimating) return;
                action();
            }
        }))
        button.append(controls.rect({
            position: Ex(2, 2),
            size: Ex(-4, -4, 100, 100),
            radius: 60,
            fill: "#000a"
        }), "fill")
        button.append(controls.label({
            position: Ex(0, 0, 50, 50),
            scale: 30,
            style: "700",
            text: name,
            stroke: "#000",
            thickness: 8,
        }), "text")
        modeButtons.push(button);
    }

    let {level, goal} = getRankData();

    function decideMode(mode, force = false) {
        if (mode == "?????") {
            popups.tbd();
            return;
        }
        isAnimating = true;
        currentMode = mode;
        if (!force && !["endless", "sandbox"].includes(mode) && game.boards[mode]) {
            isAnimating = false;
            popups.continue(false, mode, decideMode);
            return;
        }
        targetColor = modeColors[mode];
        startAnimation(x => {
            for (let button of modeButtons) {
                button.clickthrough = true;
                let size = button.size.x = button.size.y;
                button.position.ey = 45 + clamp01(ease.cubic.out(x / 1000)) * 5;
                if (button.target == mode) {
                    button.radius = button.$fill.radius = 60 + 20 * ease.quart.out(clamp01(x / 500));
                    size = button.size.x = button.size.y = button.radius * 2;
                    button.data.radius = button.data.radius / 1e3 ** (delta / 1000);
                    button.position.ey = button.position.ey - clamp01(ease.quint.in((x - 500) / 1500)) * 75;
                } else if (button.alpha > 0) {
                    button.data.radius = button.data.radius / 2 ** (delta / 1000);
                    button.alpha = 1 - clamp01(ease.cubic.out(x / 200));
                }
            }
            for (let button of anchorButtons) {
                button.clickthrough = true;
                button.position.ey = 45 + clamp01(ease.cubic.out(x / 1000)) * 5;
                button.alpha = 1 - clamp01(ease.cubic.out(x / 200));
            }
            scene.$profile.position.y = scene.$switchbtn.position.y = scene.$menubtn.position.y = 
                -94 + clamp01(ease.quint.out(x / 1000)) * 200;
            if (x >= 2500) loadScreen("game");
            return x >= 2500;
        })
    }

    makeModeButton("classic",    () => decideMode("classic"),     "CLASSIC",    0, 160, -0.25);
    makeModeButton("speed",      () => decideMode("speed"),       "SPEED",      0, 160, 0.25);
    makeModeButton("action",     () => decideMode("action"),      "ACTION",     0, 160, 0.75);
    makeModeButton("endless",    () => decideMode("endless"),     "ENDLESS",    0, 160, -0.75);
    
    makeModeButton("?????",      () => popups.tbd(),              "?????",      1, 170, 0);
    makeModeButton("?????",      () => popups.tbd(),              "?????",      1, 170, 0.667);
    makeModeButton("?????",      () => popups.tbd(),              "?????",      1, 170, 1.333);
    
    if (secretModeReq.classier()) makeModeButton("classier",   () => decideMode("classier"),    "CLASSIER",   2, 210, 0.125);
    else makeModeButton("?????", () => popups.secret(null, "Reach a high level in a certain main game mode"), "?????", 2, 210, 0.125);

    makeAnchorButton("FREE-PLAY",    0);
    makeAnchorButton("?????",        1);
    makeAnchorButton("SECRETS",      2);
    

    scene.append(controls.button({
        position: Ex(-110, -96, 50, 100),
        size: Ex(300, 60),
        fill: "#aaa7",
        onclick() {
            popups.profile();
        }
    }), "profile")
    scene.$profile.append(controls.gembar({
        position: Ex(98, 2),
        size: Ex(-100, -4, 100, 100),
        progress: Number(game.stats.exp) / Number(goal),
        fill: "#000a",
    }), "progress")
    scene.$profile.append(controls.rect({
        position: Ex(2, 2),
        size: Ex(94, -4, 0, 100),
        fill: "#000a",
    }), "rankbox")
    scene.$profile.$rankbox.append(controls.label({
        position: Ex(0, 0, 50, 50),
        text: game.stats.level.toLocaleString("en-US"),
        scale: 25,
    }), "rank")

    prefabs.textButton(scene, {
        position: Ex(-390, -96, 50, 100),
        size: Ex(60, 60),
    }, "⇆", () => {
        popups.switcher();
    }, "switchbtn");

    prefabs.textButton(scene, {
        position: Ex(210, -96, 50, 100),
        size: Ex(60, 60),
    }, "☰", () => {
        popups.miscmenu();
    }, "menubtn");
    
    
    scene.append(controls.base({
        onupdate() {
            if (mainCanvas.width / scale >= 800) {
                scene.$profile.position.x = -278;
                scene.$profile.size.x = 556;
                scene.$switchbtn.position.x = -350;
                scene.$menubtn.position.x = 290;
            } else {
                scene.$profile.position.x = -198;
                scene.$profile.size.x = 396;
                scene.$switchbtn.position.x = -270;
                scene.$menubtn.position.x = 210;
            }
            
            let pageSize = Math.min(mainCanvas.width, mainCanvas.height);
            for (let button of modeButtons) {
                let offset = currentPage - button.data.page;
                offset -= Math.round(offset / pageCount) * pageCount;
                button.alpha = 1 - (Math.abs(offset) - (button.position.x + button.size.x / 2) * scale / pageSize * offset) * 2;
                button.clickthrough = button.alpha <= 0;
                if (button.clickthrough) continue;
                let angle = button.data.angle + time / 100000;
                let radius = button.data.radius * (1 - offset * offset * 2);
                button.position.ex = 50 - offset * 100 * pageSize / mainCanvas.width;
                button.position.x = Math.sin(angle) * radius * (1 - offset * offset) - button.size.x / 2;
                button.position.y = Math.cos(angle) * radius;
                button.position.y += (button.position.x + button.size.x / 2)  * offset * button.position.y / mainCanvas.height - button.size.y / 2;
                if (button.__mouseIn) {
                    button.$text.stroke = "hsl(" + (time / 10) + "deg, 100%, 15%)";
                    button.$text.fill = "hsl(" + (time / 10 + 40) + "deg, 100%, 85%)";
                } else {
                    button.$text.stroke = "#000";
                    button.$text.fill = "#fff";
                }
            }
            for (let button of anchorButtons) {
                let offset = currentPage - button.data.page;
                offset -= Math.round(offset / pageCount) * pageCount;
                button.alpha = (1 - Math.abs(offset)) ** 2;
                button.clickthrough = button.alpha <= 0;
                if (button.clickthrough) continue;
                button.position.ex = 50 - offset * 100 * pageSize / mainCanvas.width;
            }
        }
    }), "logic")


    let isAnimating = true;

    startAnimation(x => {
        for (let a in modeButtons) {
            modeButtons[a].position.ey = 145 - clamp01(ease.cubic.out(x / 1250)) * 100;
        }
        for (let a in anchorButtons) {
            anchorButtons[a].position.ey = 145 - clamp01(ease.cubic.out(x / 1250)) * 100;
        }
        scene.$profile.position.y = scene.$switchbtn.position.y = scene.$menubtn.position.y =
            104 - clamp01(ease.cubic.out((x - 250) / 1000)) * 200;

        let length = 1250;
        if (x >= length) isAnimating = false;
        return x >= length;
    });
    
    if (meta.versionIndex != versionIndex) {
        meta.versionIndex = versionIndex;
        popups.changelog();
        save();
    }
    if (isFirstPlay) {
        popups.firstPlay();
        isFirstPlay = false;
    }
}