
function Board(args = {}) {
    let board = {

        width: 8,
        height: 8,
        types: 7,
        tiles: {},

        alwaysHaveMoves: true,

        get(x, y) {
            return this.tiles[x + y * 100]
        },
        refill() {
            let fills = [];
            let check = true;

            function canFall(tile) {
                return tile && tile.type < 9 && !tile.anim && tile.swapCheck === undefined
                    && tile.offset.x == 0
            }

            // Vertical gravity
            for (let x = 0; x < this.width; x++) {
                let cy = this.height - 1;
                for (let y = cy; y >= 0; y--) {
                    if (this.tiles[x + y * 100]) {
                        check &&= !["fade", "power-fade"].includes(this.tiles[x + y * 100].anim);
                        
                        if (!canFall(this.tiles[x + y * 100])) {
                            cy = y - 1;
                        } else {
                            if (y != cy) {
                                this.tiles[x + cy * 100] = this.tiles[x + y * 100];
                                this.tiles[x + cy * 100].offset.y += cy - y;
                                this.tiles[x + y * 100] = null;
                            }
                            cy--;
                        }
                    }
                }
                if (cy >= 0) {
                    let h = scene.$board?.rect.height ?? 800;
                    let sp = (mainCanvas.height - h) / h / 2 * this.height + 1;
                    for (let y = 0; y <= cy; y++) {
                        let yPos = Math.max(
                            cy - y + sp,
                            this.tiles[x + (y - 1) * 100]?.offset.y ?? 0,
                        )
                        this.tiles[x + y * 100] = {
                            type: Math.floor(Math.random() * this.types),
                            offset: { x: 0, y: yPos },
                            velocity: { x: 0, y: cy - y },
                            lifetime: 0,
                        }
                        fills.push(x + y * 100);
                    }
                }
            }

            if (this.alwaysHaveMoves && check && fills.length > 0) {
                let trials = 0;
                while (this.findValidMoves().count == 0 && trials < 100) {
                    for (let tile of fills) {
                        this.tiles[tile].type = Math.floor(Math.random() * this.types);
                    }
                    trials++;
                }
            }

            return fills;
        },
        scramble() {
            do {
                let keys = Object.keys(this.tiles).filter(x => this.tiles[x] && !this.tiles[x].anim);
                let values = keys.map(x => this.tiles[x]);
                for (let key of keys) {
                    let index = Math.floor(Math.random() * values.length);
                    if (this.tiles[key].power == "countdown") this.tiles[key].power = "";
                    this.tiles[key] = values.splice(index, 1)[0];
                }
                console.log(this.tiles);
            } while (this.findMatches().count > 0 || this.findValidMoves().count == 0);
        },
        findMatches() {
            let hozTiles = {}, vetTiles = {}, matches = { count: 0 };
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    let tile = this.get(x, y);

                    if (!tile) continue;
                    if (tile.type >= 7) continue;

                    if (hozTiles[x + y * 100] === undefined && x < this.width - 2) {
                        let hoz = 1;
                        for (hoz; hoz < this.width - x; hoz++) {
                            if (tile.type == this.get(x + hoz, y)?.type) {
                                hozTiles[x + hoz + y * 100] = x + y * 100;
                            } else {
                                break;
                            }
                        }
                        if (hoz >= 3) {
                            for (let h = 0; h < hoz; h++) {
                                hozTiles[x + h + y * 100] = x + y * 100;
                            }
                            matches[x + y * 100] = {
                                hozStart: x + y * 100,
                                hozLength: hoz,
                            }
                            matches.count++;
                        }
                    }
                    if (vetTiles[x + y * 100] === undefined && y < this.height - 2) {
                        let vet = 1;
                        let hozIndex = x + y * 100;
                        for (vet; vet < this.height - y; vet++) {
                            if (tile.type == this.get(x, y + vet)?.type) {
                                let ind = x + (y + vet) * 100
                                vetTiles[ind] = x + y * 100;
                                if (hozTiles[ind]) hozIndex = hozTiles[ind];
                            } else {
                                break;
                            }
                        }
                        if (vet >= 3) {
                            vetTiles[x + y * 100] = x + y * 100;
                            if (matches[hozIndex] && !matches[hozIndex].vetLength) {
                                matches[hozIndex].vetStart = x + y * 100;
                                matches[hozIndex].vetLength = vet;
                                matches.count++;
                            } else if (matches[x + y * 100] && !matches[x + y * 100].vetLength) {
                                matches[x + y * 100].vetStart = x + y * 100;
                                matches[x + y * 100].vetLength = vet;
                                matches.count++;
                            } else {
                                matches[x + y * 100] = {
                                    vetStart: x + y * 100,
                                    vetLength: vet,
                                }
                                matches.count++;
                            }
                        }
                    }
                }
            }
            return matches;
        },
        findValidMoves() {
            let moves = { count: 0 };
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width - 1; x++) {
                    let tileA = this.tiles[x + y * 100];
                    let tileB = this.tiles[x + y * 100 + 1];
                    if (!tileA || tileA.fade || !tileB || tileB.fade) continue;
                    if (tileA.type == tileB.type) continue;
                    
                    if (tileA.type == 7 || tileB.type == 7) {
                        moves[x + y * 100] = { hoz: true };
                        moves.count++;
                        continue;
                    }
                    if (tileA.type >= 8 || tileB.type >= 8) {
                        continue;
                    }

                    let counter = 0;
                    if (tileA.type == this.tiles[x + y * 100 - 99]?.type) {
                        counter++;
                        if (tileA.type == this.tiles[x + y * 100 - 199]?.type) {
                            counter++;
                        }
                    }
                    if (tileA.type == this.tiles[x + y * 100 + 101]?.type) {
                        counter++;
                        if (tileA.type == this.tiles[x + y * 100 + 201]?.type) {
                            counter++;
                        }
                    }
                    if (counter >= 2 || (
                        tileA.type == this.tiles[x + y * 100 + 2]?.type && 
                        tileA.type == this.tiles[x + y * 100 + 3]?.type
                    )) {
                        moves[x + y * 100] = { hoz: true };
                        moves.count++;
                        continue;
                    }

                    counter = 0;
                    if (tileB.type == this.tiles[x + y * 100 + 100]?.type) {
                        counter++;
                        if (tileB.type == this.tiles[x + y * 100 + 200]?.type) {
                            counter++;
                        }
                    }
                    if (tileB.type == this.tiles[x + y * 100 - 100]?.type) {
                        counter++;
                        if (tileB.type == this.tiles[x + y * 100 - 200]?.type) {
                            counter++;
                        }
                    }
                    if (counter >= 2 || (
                        tileB.type == this.tiles[x + y * 100 - 1]?.type && 
                        tileB.type == this.tiles[x + y * 100 - 2]?.type
                    )) {
                        moves[x + y * 100] = { hoz: true };
                        moves.count++;
                        continue;
                    }
                }
            }
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height - 1; y++) {
                    let tileA = this.tiles[x + y * 100];
                    let tileB = this.tiles[x + y * 100 + 100];
                    if (!tileA || tileA.fade || !tileB || tileB.fade) continue;
                    if (tileA.type == tileB.type) continue;
                    
                    if (tileA.type == 7 || tileB.type == 7) {
                        moves[x + y * 100] = { ...moves[x + y * 100], vet: true };
                        moves.count++;
                        continue;
                    }
                    if (tileA.type >= 8 || tileB.type >= 8) {
                        continue;
                    }

                    let counter = 0;
                    if (tileA.type == this.tiles[x + y * 100 + 99]?.type) {
                        counter++;
                        if (tileA.type == this.tiles[x + y * 100 + 98]?.type) {
                            counter++;
                        }
                    }
                    if (tileA.type == this.tiles[x + y * 100 + 101]?.type) {
                        counter++;
                        if (tileA.type == this.tiles[x + y * 100 + 102]?.type) {
                            counter++;
                        }
                    }
                    if (counter >= 2 || (
                        tileA.type == this.tiles[x + y * 100 + 200]?.type && 
                        tileA.type == this.tiles[x + y * 100 + 300]?.type
                    )) {
                        moves[x + y * 100] = { ...moves[x + y * 100], vet: true };
                        moves.count++;
                        continue;
                    }

                    counter = 0;
                    if (tileB.type == this.tiles[x + y * 100 - 1]?.type) {
                        counter++;
                        if (tileB.type == this.tiles[x + y * 100 - 2]?.type) {
                            counter++;
                        }
                    }
                    if (tileB.type == this.tiles[x + y * 100 + 1]?.type) {
                        counter++;
                        if (tileB.type == this.tiles[x + y * 100 + 2]?.type) {
                            counter++;
                        }
                    }
                    if (counter >= 2 || (
                        tileB.type == this.tiles[x + y * 100 - 100]?.type && 
                        tileB.type == this.tiles[x + y * 100 - 200]?.type
                    )) {
                        moves[x + y * 100] = { ...moves[x + y * 100], vet: true };
                        moves.count++;
                        continue;
                    }
                }
            }
            return moves
        },
        doMatches(matches) {
            if (matches.count == 0) return;

            for (let id in matches) {
                let match = matches[id];
                if (match.hozLength) {
                    for (let c = 0; c - match.hozLength; c++) {
                        this.tiles[match.hozStart + c] = null;
                    }
                }
                if (match.vetLength) {
                    for (let c = 0; c - match.vetLength; c++) {
                        this.tiles[match.vetStart + c * 100] = null;
                    }
                }
            }

            this.refill();
        },
        ...args,
    }

    // Initialization
    {
        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                board.tiles[x + y * 100] = {
                    type: Math.floor(Math.random() * board.types),
                    offset: { x: 0, y: 0 },
                    velocity: { x: 0, y: 0 },
                }
            }
        }

        if (board.types <= 2) {
            for (let x = 0; x < board.width; x++) {
                for (let y = 0; y < board.height; y++) {
                    board.tiles[x + y * 100].type = Math.floor(x + y / 2) % board.types;
                }
            }
        } else {
            let matches;
            let a = 0;
            while ((matches = board.findMatches()).count > a / 100) {
                board.doMatches(matches);
                a++;
                if (a % 1000 == 0) console.log(a + " trials", matches.count);
            }
        }

        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                let tile = board.tiles[x + y * 100];
                tile.offset = { x: 0, y: board.height + (mainCanvas.height / 1000) / scale * board.height + Math.random() };
                tile.velocity = { x: 0, y: board.height - y * 2 - 5 };
            }
        }
    }

    return board;
}