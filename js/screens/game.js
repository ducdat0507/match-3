screens.game = function () {

    // The Score
    scene.append(controls.rect({
        position: Ex(-10000, -10000),
        size: Ex(180, 60),
        text: 0,
        fill: "#555a",
    }), "scorebox")
    scene.$scorebox.append(controls.rect({
        position: Ex(2, 2),
        size: Ex(-4, -4, 100, 100),
        fill: "#555a",
    }), "fill")
    scene.append(controls.label({
        position: Ex(-10000, -10000),
        scale: 30,
        text: 0,
    }), "score")
    scene.append(controls.label({
        position: Ex(-10000, -10000),
        scale: 20,
        text: 0,
    }), "level")

    // The hint button
    scene.append(controls.button({
        position: Ex(-10000, -10000),
        size: Ex(180, 60),
        fill: "#aaa7",
        onclick() {
            scene.$board.showHint();
        }
    }), "hintbtn")
    scene.$hintbtn.append(controls.rect({
        position: Ex(2, 2),
        size: Ex(-4, -4, 100, 100),
        fill: "#000a",
    }), "fill")
    scene.$hintbtn.$fill.append(controls.rect({
        size: Ex(0, 0, 100, 100),
        fill: "#000",
    }), "bar")
    scene.$hintbtn.append(controls.label({
        position: Ex(0, 0, 50, 50),
        scale: 25,
        style: "italic",
        text: "Hint",
    }), "text")

    // The menu button
    scene.append(controls.button({
        position: Ex(-10000, -10000),
        size: Ex(180, 60),
        fill: "#aaa7",
        onclick() {
            if (!isAnimating) {
                let popup = popups.gamemenu();
                scene.$board.paused = true;
                let close = popup.close;
                popup.close = () => {
                    setTimeout(() => scene.$board.paused = false, 300);
                    close();
                };
            }
        }
    }), "menubtn")
    scene.$menubtn.append(controls.rect({
        position: Ex(2, 2),
        size: Ex(-4, -4, 100, 100),
        fill: "#000a",
    }), "fill")
    scene.$menubtn.append(controls.label({
        position: Ex(0, 0, 50, 50),
        scale: 25,
        style: "italic",
        text: "Menu",
    }), "text")

    // The progress bar
    scene.append(controls.gembar({
        position: Ex(-10000, -10000),
        size: Ex(600, 40),
        fill: "#555a",
    }), "progress")

    // The board
    scene.append(controls.board({
        position: Ex(-10000, -10000),
        size: Ex(600, 600),
        data: {
            level: 1n,
        },
        clickthrough: true
    }), "board")

    // The splash text
    scene.$board.append(controls.label({
        position: Ex(0, 0, 50, 50),
        scale: 50,
        stroke: "black",
        style: "900",
        thickness: 8,
        wrap: true,
    }), "splash")


    var introFactor = 1;
    let isAnimating = true;
    let waiter = 0;
    
    scene.append(controls.base({
        onupdate() {
            if (!scene.$board.paused) game.stats.timePlayed += delta

            scene.$score.text = (scene.$board.score - BigInt(Math.round(scene.$board.lerpScore))).toLocaleString("en-US");
            scene.$hintbtn.$fill.$bar.size = Ex(0, 0, Math.min(Math.max(scene.$board.hintCooldown / 5000, 0), 1) * 100, 100);

            let level = Number(scene.$board.data.level) - 1;
            let goal = Math.min(250 + 250 * level, 5000);
            scene.$level.text = "Level " + scene.$board.data.level.toLocaleString("en-US");
            scene.$progress.progress += (Number(scene.$board.exp) / goal - scene.$progress.progress) * (1 - 0.01 ** (delta / 1000));

            if (window.innerWidth / scale >= 1000) {
                scene.$scorebox.position = Ex(-450, -300, 50, 50);
                scene.$scorebox.size = Ex(280, 100);
                scene.$score.position = Ex(-310, -265, 50, 50);
                scene.$score.scale = 30;
                scene.$level.position = Ex(-310, -230, 50, 50);
                scene.$level.scale = 20;
                scene.$hintbtn.position = Ex(-390, 90, 50, 50);
                scene.$hintbtn.size = Ex(180, 120);
                scene.$menubtn.position = Ex(-390, 230, 50, 50);
                scene.$menubtn.size = Ex(180, 60);
                scene.$progress.position = Ex(-150, 280, 50, 50);
                scene.$board.position = Ex(-150, -320, 50, 50);
            } else {
                scene.$scorebox.position = Ex(-300, -380, 50, 50);
                scene.$scorebox.size = Ex(600, 60),
                scene.$score.position = Ex(-150, -350, 50, 50);
                scene.$score.scale = 25;
                scene.$level.position = Ex(150, -350, 50, 50);
                scene.$level.scale = 25;
                scene.$hintbtn.position = Ex(-90, 210, 50, 65);
                scene.$hintbtn.size = Ex(180, 60);
                scene.$menubtn.position = Ex(-270, 210, 50, 65);
                scene.$menubtn.size = Ex(150, 60);
                scene.$progress.position = Ex(-300, 280, 50, 50);
                scene.$board.position = Ex(-300, -320, 50, 50);
            }

            if (introFactor > 0)
            {
                scene.$scorebox.position.ex -= 100 * introFactor;
                scene.$score.position.ex -= 100 * introFactor;
                scene.$level.position.ex -= 100 * introFactor;
                scene.$hintbtn.position.ex -= 100 * introFactor;
                scene.$menubtn.position.ex -= 100 * introFactor;
                scene.$progress.position.ex += 100 * introFactor;
                scene.$board.position.ex += 100 * introFactor;
            }

            if (scene.$board.fallCount == 0) {
                waiter++;
                if (waiter == 2) {
                    if (!isAnimating && Number(scene.$board.exp) >= goal) {
                        isAnimating = true;
                        levelUp();
                    } else if (scene.$board.moves.count == 0) {
                        if (currentMode == "classic") {
                            
                        } else {
                            let tiles = Object.values(scene.$board.board.tiles);
                            let tile;
                            while (!tile || tile.power)
                                tile = tiles[Math.floor(Math.random() * tiles.length)]
                            tile.type = 7;
                            tile.power = "cube"
                        }
                    } else {
                        scene.$board.save();
                    }
                }
            } else {
                waiter = 0;
            }
        }
    }), "logic")

    function intro(x) {
        introFactor = 1 - ease.quart.out(Math.min(x / 2000, 1));
        if (x >= 2000) {
            scene.$board.clickthrough = false;
            isAnimating = false;
            return true;
        }
    }

    function splash(text) {
        function bounce (x) {
            const c4 = (2 * Math.PI) / 3;
            
            return x === 0
                ? 0
                : x === 1
                ? 1
                : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
        }
        function anim1(x) {
            if (!scene.$board) return true;
            scene.$board.$splash.scale = 50 * bounce(x / 3000);
            scene.$board.$splash.size.x = 10 * scene.$board.$splash.scale;
            scene.$board.$splash.alpha = 3 - x / 1000;
            if (x >= 3000) {
                return true;
            }
        }

        scene.$board.$splash.text = text;
        startAnimation(anim1);
    }

    function levelUp() {
        function anim1(x) {
            introFactor = ease.quart.in(clamp01((x - 1000) / 1000));
            if (x >= 2500) {

                scene.$board.data.level++;
                rankBarLevelPopup(scene.$board.exp, () => {
                    for (let x = 0; x < board.width; x++) {
                        for (let y = 0; y < board.height; y++) {
                            let tile = board.tiles[x + y * 100];
                            tile.offset = { x: 0, y: board.height + (window.innerHeight / 1000) / scale * board.height + Math.random() };
                            tile.velocity = { x: 0, y: board.height - y * 2 - 5 };
                        }
                    }
                    startAnimation(intro);
                    setTimeout(() => splash("LEVEL " + scene.$board.data.level.toLocaleString("en-US")), 2000);
                });
                scene.$board.exp = 0n;
                scene.$board.speed = 0.25;
                
                let board = scene.$board.board;
                board.scramble();

                scene.$board.save();
                return true;
            }
        }

        scene.$board.clickthrough = true;
        splash("LEVEL COMPLETED");
        startAnimation(anim1);
    }

    scene.$board.load();
    scene.$logic.onupdate();
    startAnimation(intro);
    setTimeout(() => splash("GO"), 2000);
}
