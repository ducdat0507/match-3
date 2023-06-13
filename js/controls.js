let controls = {
    base(args) {
        return {
            id: "",
            controls: [],
            append(ct, id = "") {
                this.controls.push(ct);
                if (id) {
                    this["$" + id] = ct;
                    ct.id = id;
                }
            },
            remove(ct) {
                let index = this.controls.indexOf(ct);
                if (index > 0) {
                    this.controls.splice(index, 1);
                    if (ct.id && this.controls["$" + id]) delete this.controls["$" + id];
                }
            },

            position: Ex(0, 0),
            size: Ex(0, 0),
            rect: Rect(0, 0),

            alpha: 1,
            clickthrough: false,

            render() {},

            onupdate() {},
            onpointerdown() {},
            onpointermove() {},
            onpointerup() {},
            ...args
        }
    },
    rect(args) {
        return {
            ...controls.base(),
            fill: "white",
            radius: 0,

            render() {
                ctx.fillStyle = this.fill;
                if (this.radius) {
                    let radius = this.radius * scale;
                    ctx.beginPath();
                    ctx.moveTo(this.rect.x + radius, this.rect.y);
                    ctx.arc(
                        this.rect.x + this.rect.width - radius, 
                        this.rect.y + radius,
                        radius, Math.PI * -.5, 0
                    );
                    ctx.arc(
                        this.rect.x + this.rect.width - radius, 
                        this.rect.y + this.rect.height - radius,
                        radius, 0, Math.PI * .5
                    );
                    ctx.arc(
                        this.rect.x + radius,
                        this.rect.y + this.rect.height - radius, 
                        radius, Math.PI * .5, Math.PI
                    );
                    ctx.arc(
                        this.rect.x + radius, 
                        this.rect.y + radius,
                        radius, Math.PI, Math.PI * 1.5
                    );
                    ctx.fill();
                } else {
                    ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                }
            },
            ...args
        }
    },
    button(args) {
        return {
            ...controls.rect(),

            onpointerup() {
                this.onclick();
            },

            onclick() {},

            ...args
        }
    },
    label(args) {
        return {
            ...controls.base(),
            fill: "white",
            text: "",
            scale: 16,
            style: "normal",
            font: "Arial, sans-serif",
            align: "center",
            wrap: false,

            render() {
                ctx.fillStyle = this.fill;
                ctx.textAlign = this.align;
                ctx.textBaseline = "middle";
                ctx.font = this.style + " " + (this.scale * scale) + "px " + this.font;
                if (this.wrap) {
                    let words = this.text.split(" ");
                    let line = "";
                    let pos = this.rect.y;
                    for (let word of words) {
                        if (ctx.measureText(line + word).width > this.rect.width) {
                            ctx.fillText(line, this.rect.x, pos);
                            pos += this.scale * scale * 1.2;
                            line = word + " ";
                        } else {
                            line += word + " ";
                        }
                    }
                    ctx.fillText(line, this.rect.x, pos);
                } else {
                    ctx.fillText(this.text, this.rect.x, this.rect.y, this.rect.width || undefined);
                }
            },
            ...args
        }
    },
    counter(args) {
        return {
            ...controls.base(),
            fillMain: "white",
            fillSub: "#ffffff18",
            value: 0,
            design: {
                width: 12,
                height: 30,
                charSpace: 2,
                sepSpace: 5,
                segments: [
                    [
                        ["moveTo", "1.5x", "0y"],
                        ["lineTo", "9.5x", "0y"],
                        ["lineTo", "9.5x", "2y"],
                        ["lineTo", "0x", "2y"],
                        ["lineTo", "0x", "1.5y"],
                    ],
                    [
                        ["moveTo", "10.5x", "0y"],
                        ["lineTo", "12x", "1.5y"],
                        ["lineTo", "12x", "14.6y"],
                        ["lineTo", "11x", "14.6y"],
                        ["lineTo", "10x", "13.6y"],
                        ["lineTo", "10x", "0y"],
                    ],
                    [
                        ["moveTo", "11x", "15.4y"],
                        ["lineTo", "12x", "15.4y"],
                        ["lineTo", "12x", "28.5y"],
                        ["lineTo", "10.5x", "30y"],
                        ["lineTo", "10x", "30y"],
                        ["lineTo", "10x", "16.4y"],
                    ],
                    [
                        ["moveTo", "0x", "28y"],
                        ["lineTo", "9.5x", "28y"],
                        ["lineTo", "9.5x", "30y"],
                        ["lineTo", "1.5x", "30y"],
                        ["lineTo", "0x", "28.5y"],
                    ],
                    [
                        ["moveTo", "1x", "15.4y"],
                        ["lineTo", "2x", "16.4y"],
                        ["lineTo", "2x", "27.5y"],
                        ["lineTo", "0x", "27.5y"],
                        ["lineTo", "0x", "15.4y"],
                    ],
                    [
                        ["moveTo", "0x", "2.5y"],
                        ["lineTo", "2x", "2.5y"],
                        ["lineTo", "2x", "13.6y"],
                        ["lineTo", "1x", "14.6y"],
                        ["lineTo", "0x", "14.6y"],
                    ],
                    [
                        ["moveTo", "2.7x", "14y"],
                        ["lineTo", "9.3x", "14y"],
                        ["lineTo", "10.3x", "15y"],
                        ["lineTo", "9.3x", "16y"],
                        ["lineTo", "2.7x", "16y"],
                        ["lineTo", "1.7x", "15y"],
                    ],
                ],
                digits: {
                    0: [1, 1, 1, 1, 1, 1, 0],
                    1: [0, 1, 1, 0, 0, 0, 0],
                    2: [1, 1, 0, 1, 1, 0, 1],
                    3: [1, 1, 1, 1, 0, 0, 1],
                    4: [0, 1, 1, 0, 0, 1, 1],
                    5: [1, 0, 1, 1, 0, 1, 1],
                    6: [1, 0, 1, 1, 1, 1, 1],
                    7: [1, 1, 1, 0, 0, 0, 0],
                    8: [1, 1, 1, 1, 1, 1, 1],
                    9: [1, 1, 1, 1, 0, 1, 1],
                },
            },
            scale: 16,

            render() {
                let str = this.value.toFixed(0);
                let unit = this.scale * scale / this.design.height;
                let width = (
                    str.length * this.design.width
                    + (str.length - 1) * this.design.charSpace
                    + Math.floor((str.length - 1) / 3) * this.design.sepSpace
                ) * unit;
                let offset = width / 2 - (this.design.width - this.design.sepSpace) * unit;

                for (let a = 0; a < str.length; a++) {
                    let digit = str[str.length - 1 - a];
                    if (a % 3 == 0) offset -= (this.design.sepSpace) * unit;
                    for (let s in this.design.segments) {
                        let seg = this.design.segments[s];
                        ctx.beginPath();
                        for (let ins of seg) {
                            let cmd = ins[0];
                            let args = [];
                            for (let i = 1; i < ins.length; i++) {
                                let code = ins[i][ins[i].length - 1];
                                if (code == "x") {
                                    args.push(ins[i].slice(0, ins[i].length - 1) * unit + offset + this.rect.x + this.rect.width / 2);
                                } else if (code == "y") {
                                    args.push(((ins[i].slice(0, ins[i].length - 1)) - this.design.height / 2) * unit + this.rect.y + this.rect.height / 2);
                                } else if (code == " ") {
                                    args.push(ins[i].slice(0, ins[i].length - 1));
                                } else {
                                    args.push(ins[i]);
                                }
                            }
                            ctx[cmd](...args);
                        }
                        ctx.fillStyle = this.design.digits[digit]?.[s] ? this.fillMain : this.fillSub;
                        ctx.shadowBlur = this.design.digits[digit]?.[s] ? 50 : 0;
                        ctx.shadowColor = ctx.fillStyle;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                        ctx.shadowColor = "";
                    }
                    offset -= (this.design.width + this.design.charSpace) * unit;
                }
            },
            ...args
        }
    },
    board(args) {
        return {
            ...controls.base(),
            board: Board(),
            back1: "#666666cc",
            back2: "#888888cc",

            swapPos: null,
            matches: {count: 0},
            moves: {count: -1},
            fallCount: 0,

            score: 0n,
            lerpScore: 0,
            cascade: 0,
            powerCascade: 0,
            scorePopups: [],
            hint: null,
            hintCooldown: 0,

            __mouseActive: false,
            onupdate() {
                
                let matched = false;
                let matchScores = [];
                let matchTiles = {};
                let powerScores = [];
                for (let id in this.matches) {
                    if (id == "count") continue;
                    let match = this.matches[id];
                    let matchable = true;
                    let tiles = {};
                    if (match.hozLength) {
                        for (let c = 0; c - match.hozLength; c++) {
                            let tile = this.board.tiles[match.hozStart + c];
                            matchable &&= tile && !tile.offset.y && !tile.animTime;
                            tiles[match.hozStart + c] = (tiles[match.hozStart + c] ?? 0) + 1;
                            if (tile && tile.swapCheck !== undefined) {
                                this.cascade = this.powerCascade = 0;
                                delete tile.swapCheck;
                            }
                        }
                    }
                    if (match.vetLength) {
                        for (let c = 0; c - match.vetLength; c++) {
                            let tile = this.board.tiles[match.vetStart + c * 100];
                            matchable &&= tile && !tile.offset.y && !tile.animTime;
                            tiles[match.vetStart + c * 100] = (tiles[match.vetStart + c * 100] ?? 0) + 1;
                            if (tile && tile.swapCheck !== undefined) {
                                this.cascade = this.powerCascade = 0;
                                delete tile.swapCheck;
                            }
                        }
                    }
                    if (matchable) {
                        if (match.hozLength) matchScores.push({
                            pos: {
                                x: (match.hozStart % 100) + match.hozLength / 2,
                                y: Math.floor(match.hozStart / 100) + .5,
                            },
                            color: this.board.tiles[match.hozStart].type,
                            score: 50n * 3n ** BigInt(match.hozLength - 3)
                        });
                        if (match.vetLength) matchScores.push({
                            pos: {
                                x: (match.vetStart % 100) + .5,
                                y: Math.floor(match.vetStart / 100) + match.vetLength / 2,
                            },
                            color: this.board.tiles[match.vetStart].type,
                            score: 50n * 3n ** BigInt(match.vetLength - 3)
                        });
                        for (let tile in tiles) {
                            matchTiles[tile] = (matchTiles[tile] ?? 0) + tiles[tile];
                        }
                    }
                }
                
                for (let tile in matchTiles) {
                    if (matchTiles[tile] >= 2) {
                        this.board.tiles[tile].power = "star";
                    } else {
                        if (this.board.tiles[tile].power == "star") {
                            let [x, y] = [
                                tile % 100,
                                Math.floor(tile / 100) + Math.round(this.board.tiles[tile].offset.y),
                            ]
                            for (let tid in this.board.tiles) {
                                let tTile = this.board.tiles[tid];
                                if (tid == tile || !tTile) continue;
                                let [px, py] = [
                                    tid % 100,
                                    Math.floor(tid / 100) + Math.round(tTile.offset.y),
                                ]
                                console.log(tid, x, y, px, py)
                                if ((x == px || y == py) && (!tTile.anim || tTile.anim == "fade")) {
                                    tTile.anim = "power-fade";
                                    tTile.animTime = 1 - (Math.abs(x - px) + Math.abs(y - py)) / 5;
                                    tTile.animArgs = { manual: false };
                                    powerScores.push({
                                        pos: {
                                            x: px + .5,
                                            y: py + .5,
                                        },
                                        color: tTile.type,
                                        score: 20n
                                    })
                                }
                            }
                        }
                        if (!["fade", "power-fade"].includes(this.board.tiles[tile].anim)) {
                            this.board.tiles[tile].anim = "fade";
                            this.board.tiles[tile].animTime = 1e-6;
                            this.board.tiles[tile].animArgs = { manual: this.cascade <= 0 };
                        }
                    }
                }
                
                if (matchScores.length > 0) {
                    matchScores.sort((a, b) => Number(b.score - a.score));
                    for (let id in matchScores) {
                        this.cascade++;
                        matchScores[id].score *= BigInt(this.cascade);
                        this.score += matchScores[id].score;
                        this.lerpScore += Number(matchScores[id].score);
                        this.scorePopups.push(matchScores[id]);
                    }
                }
                
                if (powerScores.length > 0) {
                    for (let id in powerScores) {
                        this.powerCascade++;
                        powerScores[id].score += BigInt(this.powerCascade);
                        powerScores[id].type = "power";
                        this.score += powerScores[id].score;
                        this.lerpScore += Number(powerScores[id].score);
                        this.scorePopups.push(powerScores[id]);
                    }
                }

                this.lerpScore *= 0.01 ** (delta / 1000);

                let fallCount = 0;
                let swaps = {};
                for (let id of Object.keys(this.board.tiles).reverse()) {
                    let tile = this.board.tiles[id];
                    if (!tile) continue;

                    if (tile.swapCheck !== undefined) {
                        if (this.board.tiles[tile.swapCheck]?.swapCheck == id) {
                            let swap = this.board.tiles[tile.swapCheck];
                            tile.anim = "swap";
                            tile.animTime = 1e-6;
                            tile.animArgs = { 
                                revert: true,
                                offset: { 
                                    x: (tile.swapCheck % 100) - (id % 100), 
                                    y: Math.floor(tile.swapCheck / 100) - Math.floor(id / 100), 
                                }
                            };
                            swap.anim = "swap";
                            swap.animTime = 1e-6;
                            swap.animArgs = { 
                                revert: true,
                                offset: { 
                                    x: (id % 100) - (tile.swapCheck % 100), 
                                    y: Math.floor(id / 100) - Math.floor(tile.swapCheck / 100), 
                                }
                            };
                            delete this.board.tiles[tile.swapCheck].swapCheck;
                        }
                        delete this.board.tiles[id].swapCheck;
                    } 
                    
                    if (tile.anim == "fade") {
                        tile.animTime += delta / (tile.animArgs.manual ? 250 : 500);
                        if (tile.animTime > 1) {
                            this.board.tiles[id] = null;
                            matched = true;
                        }
                    } else if (tile.anim == "power-fade") {
                        tile.animTime += delta / 500;
                        if (tile.animTime > 1) {
                            this.board.tiles[id] = null;
                            matched = true;
                        }
                    } else if (tile.anim == "swap") {
                        tile.animTime += delta / 250;
                        if (tile.animTime > 1) {
                            swaps[+id + tile.animArgs.offset.x + tile.animArgs.offset.y * 100] = tile;
                            if (!tile.animArgs.revert) tile.swapCheck = id;
                            delete tile.anim;
                            delete tile.animTime;
                            delete tile.animArgs;
                            matched = true;
                        }
                    } else if (tile.offset.y > 0 || tile.velocity.y != 0) {
                        let limit = 0;
                        let count = 1;
                        while (count * 100 + +id < this.board.height * 100) {
                            limit = Math.max((this.board.tiles[count * 100 + id]?.offset.y || 0), limit);
                            count++;
                        }
                        tile.offset.y = Math.max(tile.offset.y + tile.velocity.y * delta / 1000, limit);
                        tile.velocity.y = tile.offset.y > limit ? tile.velocity.y - delta / 30 : 0;
                        fallCount ++;
                    }
                }
;
                for (let id in swaps) {
                    console.log(swaps, id);
                    this.board.tiles[id] = swaps[id];
                }

                if (matched) {
                    this.board.refill();
                    this.matches = this.board.findMatches();
                }

                if (fallCount == 0 && this.fallCount != 0) {
                    this.moves = this.board.findValidMoves();
                }

                if (fallCount > 0) {
                    this.hint = null;
                }

                this.fallCount = fallCount;
                this.hintCooldown -= delta;
            },
            makeMatch(oldPos, newPos) {
                let oldTile = this.board.tiles[oldPos.x + oldPos.y * 100];
                let newTile = this.board.tiles[newPos.x + newPos.y * 100];
                if (
                    !oldTile || oldTile.offset.y || oldTile.anim || oldTile.swapCheck ||
                    !newTile || newTile.offset.y || newTile.anim || newTile.swapCheck
                ) return;
                
                oldTile.anim = "swap";
                oldTile.animTime = 1e-6;
                oldTile.animArgs = { offset: { x: newPos.x - oldPos.x, y: newPos.y - oldPos.y } };
                newTile.anim = "swap";
                newTile.animTime = 1e-6;
                newTile.animArgs = { offset: { x: -oldTile.animArgs.offset.x, y: -oldTile.animArgs.offset.y } };
            },
            showHint() {
                if (this.fallCount || this.hintCooldown > 0) return;
                let list = Object.keys(this.moves);
                list.splice(list.indexOf("count"), 1);
                let chosen = list[Math.floor(Math.random() * list.length)];
                this.hint = {
                    x: chosen % 100,
                    y: Math.floor(chosen / 100),
                    time: 0,
                    type: this.moves[chosen].vet ? (
                        this.moves[chosen].hoz ? ["vet", "hoz"][Math.floor(Math.random() * 2)] : "vet"
                    ) : "hoz"
                }
                console.log(list, chosen, this.hint);
                this.hintCooldown = 5000;
            },
            onpointerdown(e) {
                let size = Math.min(this.rect.width / this.board.width, this.rect.height / this.board.height);
                let pos = {
                    x: Math.floor((e.x - this.rect.x) / size),
                    y: Math.floor((e.y - this.rect.y) / size),
                }
                
                if (this.swapPos) {
                    if (Math.abs(pos.x - this.swapPos.x) + Math.abs(pos.y - this.swapPos.y) == 1) {
                        this.makeMatch(this.swapPos, pos);
                        this.swapPos = null;
                    } else if (Math.abs(pos.x - this.swapPos.x) + Math.abs(pos.y - this.swapPos.y) == 0) {
                        this.swapPos = null;
                    } else {
                        this.swapPos = pos;
                    }
                } else {
                    this.swapPos = pos;
                }
                this.__mouseActive = true;
                let handler = (e) => {
                    this.__mouseActive = false;
                    document.removeEventListener("pointerup", handler);
                }
                document.addEventListener("pointerup", handler);
                this.hint = null;
            },
            onpointermove(e) {
                let size = Math.min(this.rect.width / this.board.width, this.rect.height / this.board.height);
                let pos = {
                    x: Math.floor((e.x - this.rect.x) / size),
                    y: Math.floor((e.y - this.rect.y) / size),
                }
                if (this.__mouseActive && this.swapPos && Math.abs(pos.x - this.swapPos.x) + Math.abs(pos.y - this.swapPos.y) == 1) {
                    this.makeMatch(this.swapPos, pos);
                    this.swapPos = null;
                } 
            },
            onpointerup(e) {
                let size = Math.min(this.rect.width / this.board.width, this.rect.height / this.board.height);
                let pos = {
                    x: Math.floor((e.x - this.rect.x) / size),
                    y: Math.floor((e.y - this.rect.y) / size),
                }
                if (this.swapPos) {
                    if (Math.abs(pos.x - this.swapPos.x) + Math.abs(pos.y - this.swapPos.y) == 1) {
                        this.makeMatch(this.swapPos, pos);
                    }
                }
            },
            render() {
                let size = Math.min(this.rect.width / this.board.width, this.rect.height / this.board.height);
                let colors = ["#ff0000", "#49e400", "#0065eb", "#ff00e4", "#fb5500", "#eecb00", "#fff7ea"];

                // Background
                for (let x = 0; x < this.board.width; x++) {
                    for (let y = 0; y < this.board.height; y++) {
                        ctx.fillStyle = (x + y) % 2 ? this.back2 : this.back1;
                        ctx.fillRect(
                            this.rect.x + size * x, 
                            this.rect.y + size * y, 
                            size, 
                            size, 
                        );
                    }
                }

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = 32 * scale + "px Arial";
                ctx.lineWidth = 5 * scale;

                function ease(x) {
                    const c1 = 2.5;
                    const c3 = c1 + 1;
                    
                    return c3 * x * x * x - c1 * x * x;
                }

                // Tiles
                for (let x = 0; x < this.board.width; x++) {
                    for (let y = this.board.height - 1; y >= 0; y--) {
                        let tile = this.board.tiles[x + y * 100];
                        if (!tile) continue;
                        let fade = ["fade", "power-fade"].includes(tile.anim) ? tile.animTime : 0;
                        let tScale = (fade <= 0 ? 1 : 1 - ease(fade)) * .8;
                        let offset = {
                            x: tile.offset.x,
                            y: tile.offset.y
                        }

                        if (tile.anim == "swap") {
                            let lerp = 0.5 - Math.cos(tile.animTime * Math.PI) / 2;
                            console.log(tile.animTime, lerp);
                            offset.x += tile.animArgs.offset.x * lerp;
                            offset.y -= tile.animArgs.offset.y * lerp;
                            tScale *= 0.8 ** ((offset.x + offset.y) * Math.sin(tile.animTime * Math.PI));
                        }

                        ctx.fillStyle = fade ? "#ffffff" : "#000000";
                        ctx.fillRect(
                            this.rect.x + size * (x + offset.x + .525 - tScale / 2), 
                            this.rect.y + size * (y - offset.y + .525 - tScale / 2), 
                            size * tScale, 
                            size * tScale, 
                        );

                        ctx.fillStyle = fade ? "#000000" : colors[tile.type];
                        ctx.fillRect(
                            this.rect.x + size * (x + offset.x + .5 - tScale / 2), 
                            this.rect.y + size * (y - offset.y + .5 - tScale / 2), 
                            size * tScale, 
                            size * tScale, 
                        );
                        
                        ctx.fillStyle = fade ? "#000000" : "#ffffff";
                        ctx.font = 80 * scale * tScale + "px Arial";
                        if (tile.power == "star") {
                            ctx.fillText(
                                "S",
                                this.rect.x + size * (x + offset.x + .5), 
                                this.rect.y + size * (y - offset.y + .5), 
                            );
                        }

                        ctx.fillStyle = fade ? "#000000" : "#ffffff";
                        ctx.strokeStyle = fade ? "#ffffff" : "#000000";
                        ctx.font = 40 * scale * tScale + "px Arial";
                        ctx.lineWidth = 6 * scale * tScale;
                        ctx.strokeText(
                            tile.type,
                            this.rect.x + size * (x + offset.x + .5), 
                            this.rect.y + size * (y - offset.y + .5), 
                        );
                        ctx.fillText(
                            tile.type,
                            this.rect.x + size * (x + offset.x + .5), 
                            this.rect.y + size * (y - offset.y + .5), 
                        );
                    }
                }

                if (this.hint) {
                    this.hint.time += delta;
                    ctx.globalAlpha = 0.5 + Math.sin(time / 50) / 2;
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 2 * scale;
                    let margin = Math.max(500 - this.hint.time, 0) * scale;
                    ctx.strokeRect(
                        this.rect.x + size * this.hint.x - margin, 
                        this.rect.y + size * this.hint.y - margin, 
                        size * (this.hint.type == "hoz" ? 2 : 1) + margin * 2, 
                        size * (this.hint.type == "vet" ? 2 : 1) + margin * 2,  
                    );
                    ctx.globalAlpha = 1;
                }

                if (this.swapPos) {
                    ctx.strokeStyle = "#aaaaaa";
                    ctx.lineWidth = 4 * scale;
                    ctx.strokeRect(
                        this.rect.x + size * (this.swapPos.x) + 2 * scale, 
                        this.rect.y + size * (this.swapPos.y) + 2 * scale, 
                        size - 4 * scale, 
                        size - 4 * scale, 
                    );
                }
                
                ctx.fillStyle = "#000000";

                ease = (x) => {
                    const c4 = (2 * Math.PI) / 3;
                    
                    return x === 0
                        ? 0
                        : x === 1
                        ? 1
                        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
                }
                
                while (this.scorePopups.length > 0 && this.scorePopups[0].time >= 1) {
                    this.scorePopups.shift();
                }
                for (let popup of this.scorePopups) {
                    let tScale = ease(Math.min(popup.time ?? 0, 1)) * scale;
                    if (popup.type == "power") tScale *= .75;
                    ctx.globalAlpha = Math.min(2 - popup.time * 2, 1);
                    ctx.font = "bold " + 40 * tScale + "px Arial";
                    ctx.strokeStyle = colors[popup.color] + "77";
                    ctx.lineWidth = (popup.type == "power" ? 8 : 10) * tScale;
                    ctx.strokeText(
                        popup.score.toLocaleString("en-US"),
                        this.rect.x + popup.pos.x * size, 
                        this.rect.y + (popup.pos.y - (popup.time ?? 0)) * size, 
                    );
                    ctx.strokeStyle = (popup.type == "power" ? "#ffffff77" : "#ffffff");
                    ctx.lineWidth = 5 * tScale;
                    ctx.strokeText(
                        popup.score.toLocaleString("en-US"),
                        this.rect.x + popup.pos.x * size, 
                        this.rect.y + (popup.pos.y - (popup.time ?? 0)) * size, 
                    );
                    ctx.fillText(
                        popup.score.toLocaleString("en-US"),
                        this.rect.x + popup.pos.x * size, 
                        this.rect.y + (popup.pos.y - (popup.time ?? 0)) * size, 
                    );
                    popup.time = (popup.time ?? 0) + delta / 2000
                }
                ctx.globalAlpha = 1;

                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#000000";
                ctx.font = "bold " + 50 * scale + "px Arial";
                ctx.lineWidth = 8 * scale;
                ctx.textAlign = "right";
                let scoreDisp = this.score - BigInt(Math.round(this.lerpScore));
                ctx.strokeText(
                    scoreDisp.toLocaleString("en-US"),
                    this.rect.x + this.rect.width - 25 * scale, 
                    this.rect.y - 40 * scale, 
                );
                ctx.globalAlpha = Math.min(this.lerpScore / 20, 0.5);
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 4 * scale;
                ctx.strokeText(
                    scoreDisp.toLocaleString("en-US"),
                    this.rect.x + this.rect.width - 25 * scale, 
                    this.rect.y - 40 * scale, 
                );
                ctx.globalAlpha = 1
                ctx.fillText(
                    scoreDisp.toLocaleString("en-US"),
                    this.rect.x + this.rect.width - 25 * scale, 
                    this.rect.y - 40 * scale, 
                );

                if (this.moves.count == 0 && this.matches.count == 0 && this.fallCount == 0) {
                    ctx.fillStyle = "#ffffff";
                    ctx.strokeStyle = "#000000";
                    ctx.font = "bold " + 70 * scale + "px Arial";
                    ctx.lineWidth = 10 * scale;
                    ctx.strokeText(
                        "NO MORE\nMOVES LOL",
                        this.rect.x + this.rect.width / 2, 
                        this.rect.y + this.rect.height / 2, 
                    );
                    ctx.fillText(
                        "NO MORE\nMOVES LOL",
                        this.rect.x + this.rect.width / 2, 
                        this.rect.y + this.rect.height / 2, 
                    );
                }
            },
            ...args
        }
    }
}