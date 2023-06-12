function Ex(x, y, ex = 0, ey = 0) {
    return { x, y, ex, ey };
}

function Rect(x, y, width = 0, height = 0) {
    return { x, y, width, height };
}

function Board(args = {}) {
    let board = {
        width: 8,
        height: 8,
        types: 7,
        tiles: {},
        get(x, y) {
            return this.tiles[x + y * 100]
        },
        refill() {
            let fills = [];

            for (let x = 0; x < this.width; x++) {
                let cy = this.height - 1;
                for (let y = cy; y >= 0; y--) {
                    if (this.tiles[x + y * 100]) {
                        if (this.tiles[x + y * 100].fade) {
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
                    for (let y = 0; y <= cy; y++) {
                        let yPos = Math.max(
                            cy + (window.innerHeight / 800) / scale * this.height - 5,
                            this.tiles[x + (y - 1) * 100]?.offset.y ?? 0,
                        )
                        this.tiles[x + y * 100] = {
                            type: Math.floor(Math.random() * this.types),
                            offset: { x: 0, y: yPos },
                            velocity: { x: 0, y: cy - y },
                        }
                        fills.push(x + y * 100);
                    }
                }
            }

            while (this.findValidMoves().count == 0) {
                for (let tile of fills) {
                    this.tiles[tile].type = Math.floor(Math.random() * this.types);
                }
            }
        },
        findMatches() {
            let hozTiles = {}, vetTiles = {}, matches = { count: 0 };
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    if (hozTiles[x + y * 100] === undefined) {
                        let hoz = 1;
                        for (hoz; hoz < this.width - x; hoz++) {
                            if (this.get(x, y)?.type == this.get(x + hoz, y)?.type) {
                                hozTiles[x + hoz + y * 100] = x + y * 100;
                            } else {
                                break;
                            }
                        }
                        if (hoz >= 3) {
                            matches[x + y * 100] = {
                                hozStart: x + y * 100,
                                hozLength: hoz,
                            }
                            matches.count++;
                        }
                    }
                    if (vetTiles[x + y * 100] === undefined) {
                        let vet = 1;
                        let hozIndex = null;
                        for (vet; vet < this.height - y; vet++) {
                            if (this.get(x, y)?.type == this.get(x, y + vet)?.type) {
                                let ind = x + (y + vet) * 100
                                vetTiles[ind] = x + y * 100;
                                if (hozTiles[ind] != null) hozIndex = hozTiles[ind]
                            } else {
                                break;
                            }
                        }
                        if (vet >= 3) {
                            if (hozIndex != null && !matches[hozIndex]?.vetLength) {
                                matches[hozIndex] = {
                                    ...matches[hozIndex],
                                    vetStart: x + y * 100,
                                    vetLength: vet,
                                }
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
            console.log(matches);
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
                        moves[x + y * 100] = { vet: true };
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
                        moves[x + y * 100] = { vet: true };
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

        let matches;
        while ((matches = board.findMatches()).count) board.doMatches(matches);

        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                let tile = board.tiles[x + y * 100];
                tile.offset = { x: 0, y: board.height + (window.innerHeight / 1000) / scale * board.height + Math.random() };
                tile.velocity = { x: 0, y: board.height - y - 1 };
            }
        }
    }

    return board;
}