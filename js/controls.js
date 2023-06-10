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
                ctx.textBaseline = "top";
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

            score: 0,
            cascade: 0,
            onupdate() {
                
                let matched = false;
                let matchScores = [];
                let matchTiles = {};
                for (let id in this.matches) {
                    if (id == "count") continue;
                    let match = this.matches[id];
                    let matchable = true;
                    let tiles = {};
                    if (match.hozLength) {
                        for (let c = 0; c - match.hozLength; c++) {
                            let tile = this.board.tiles[match.hozStart + c];
                            matchable &&= tile && !tile.offset.y && !tile.fade;
                            tiles[match.hozStart + c] = (tiles[match.hozStart + c] ?? 0) + 1;
                        }
                    }
                    if (match.vetLength) {
                        for (let c = 0; c - match.vetLength; c++) {
                            let tile = this.board.tiles[match.vetStart + c * 100];
                            matchable &&= tile && !tile.offset.y && !tile.fade;
                            tiles[match.vetStart + c * 100] = (tiles[match.vetStart + c * 100] ?? 0) + 1;
                        }
                    }
                    if (matchable) {
                        if (match.hozLength) matchScores.push(50 * 3 ** (match.hozLength - 3));
                        if (match.vetLength) matchScores.push(50 * 3 ** (match.vetLength - 3));
                        for (let tile in tiles) {
                            matchTiles[tile] = (matchTiles[tile] ?? 0) + tiles[tiles];
                        }
                    }
                }
                
                for (let tile in matchTiles) {
                    if (!this.board.tiles[tile].fade) {
                        this.board.tiles[tile].fade = 1e-6;
                    }
                }
                
                if (matchScores.length > 0) {
                    matchScores.sort((a, b) => b - a);
                    for (let id in matchScores) {
                        this.cascade++;
                        this.score += matchScores[id] * this.cascade;
                    }
                }

                let fallCount = 0;
                for (let id in this.board.tiles) {
                    let tile = this.board.tiles[id];
                    if (!tile) continue;
                    if (tile.fade) {
                        tile.fade += delta / 500;
                        if (tile.fade > 1) {
                            this.board.tiles[id] = null;
                            matched = true;
                        }
                    } else if (tile.offset.y > 0) {
                        let limit = 0;
                        let count = 1;
                        while (count * 100 + id < this.board.height * 100) {
                            limit = Math.max((this.board.tiles[count * 100 + id]?.offset.y ?? 0) - count + 1, limit);
                            count++;
                        }
                        tile.offset.y = Math.max(tile.offset.y + tile.velocity.y * delta / 1000, limit);
                        tile.velocity.y = tile.offset.y > limit ? tile.velocity.y - delta / 30 : 0;
                        fallCount ++;
                    }
                }

                if (matched) {
                    this.board.refill();
                    this.matches = this.board.findMatches();
                }

                if (fallCount == 0 && this.fallCount != 0) {
                    this.moves = this.board.findValidMoves();
                }
                this.fallCount = fallCount;
            },
            onpointerdown(e) {
                let size = Math.min(this.rect.width / this.board.width, this.rect.height / this.board.height);
                let pos = {
                    x: Math.floor((e.x - this.rect.x) / size),
                    y: Math.floor((e.y - this.rect.y) / size),
                }
                if (this.swapPos && Math.abs(pos.x - this.swapPos.x) + Math.abs(pos.y - this.swapPos.y) == 1) {
                    let oldPos = this.swapPos.x + this.swapPos.y * 100;
                    let newPos = pos.x + pos.y * 100;
                    let oldTile = this.board.tiles[newPos];
                    let newTile = this.board.tiles[newPos];
                    if (!oldTile || oldTile.offset.y || oldTile.fade || !newTile || newTile.offset.y || newTile.fade) return;
                    let swap = () => {
                        [this.board.tiles[newPos], this.board.tiles[oldPos]] = 
                            [this.board.tiles[oldPos], this.board.tiles[newPos]];
                    }
                    swap();
                    let matches = this.board.findMatches();
                    console.log(matches);
                    if (matches.count > this.matches.count) {
                        this.cascade = 0;
                        this.matches = matches;
                    } else swap();
                    this.swapPos = null;
                } else {
                    this.swapPos = pos;
                }
                console.log(pos);
            },
            render() {
                let size = Math.min(this.rect.width / this.board.width, this.rect.height / this.board.height);

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

                // Tiles
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = 32 * scale + "px Arial";
                ctx.lineWidth = 5 * scale;

                function ease(x) {
                    const c1 = 2.5;
                    const c3 = c1 + 1;
                    
                    return c3 * x * x * x - c1 * x * x;
                }

                for (let x = 0; x < this.board.width; x++) {
                    for (let y = this.board.height - 1; y >= 0; y--) {
                        let tile = this.board.tiles[x + y * 100];
                        if (!tile) continue;

                        let tScale = (1 - ease(tile.fade ?? 0)) * .8;

                        ctx.fillStyle = "#000000";
                        ctx.fillRect(
                            this.rect.x + size * (x + tile.offset.x + .525 - tScale / 2), 
                            this.rect.y + size * (y - tile.offset.y + .525 - tScale / 2), 
                            size * tScale, 
                            size * tScale, 
                        );

                        ctx.fillStyle = tile.fade ? "#000000" : [
                            "#ff0000", "#49e400", "#0065eb", "#ff00e4", "#fb5500", "#eecb00", "#fff7ea"
                        ][tile.type];
                        ctx.fillRect(
                            this.rect.x + size * (x + tile.offset.x + .5 - tScale / 2), 
                            this.rect.y + size * (y - tile.offset.y + .5 - tScale / 2), 
                            size * tScale, 
                            size * tScale, 
                        );

                        ctx.fillStyle = tile.fade ? "#000000" : "#ffffff";
                        ctx.strokeStyle = tile.fade ? "#ffffff" : "#000000";
                        ctx.font = 40 * scale * tScale + "px Arial";
                        ctx.lineWidth = 6 * scale * tScale;
                        ctx.strokeText(
                            tile.type,
                            this.rect.x + size * (x + tile.offset.x + .5), 
                            this.rect.y + size * (y - tile.offset.y + .5), 
                        );
                        ctx.fillText(
                            tile.type,
                            this.rect.x + size * (x + tile.offset.x + .5), 
                            this.rect.y + size * (y - tile.offset.y + .5), 
                        );
                    }
                }

                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#000000";
                ctx.font = "bold " + 50 * scale + "px Arial";
                ctx.lineWidth = 10 * scale;
                ctx.strokeText(
                    this.score.toLocaleString("en-US"),
                    this.rect.x + this.rect.width / 2, 
                    this.rect.y - 30 * scale, 
                );
                ctx.fillText(
                    this.score.toLocaleString("en-US"),
                    this.rect.x + this.rect.width / 2, 
                    this.rect.y - 30 * scale, 
                );

                if (this.moves.count == 0) {
                    ctx.fillStyle = "#ffffff";
                    ctx.strokeStyle = "#000000";
                    ctx.font = "bold " + 70 * scale + "px Arial";
                    ctx.lineWidth = 10 * scale;
                    ctx.strokeText(
                        "NO MORE MOVES LOL",
                        this.rect.x + this.rect.width / 2, 
                        this.rect.y + this.rect.height / 2, 
                    );
                    ctx.fillText(
                        "NO MORE MOVES LOL",
                        this.rect.x + this.rect.width / 2, 
                        this.rect.y + this.rect.height / 2, 
                    );
                }
            },
            ...args
        }
    }
}