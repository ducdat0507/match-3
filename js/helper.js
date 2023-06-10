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
            for (let x = 0; x < this.width; x++) {
                let cy = this.height - 1;
                for (let y = cy; y >= 0; y--) {
                    if (this.tiles[x + y * 100]) {
                        if (this.tiles[x + y * 100].fade) {
                            cy = y - 1;
                        } else {
                            if (y != cy) {
                                this.tiles[x + cy * 100] = this.tiles[x + y * 100];
                                console.log(this.tiles[x + cy * 100]);
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
                            cy + (window.innerHeight / 900) / scale * this.height - 5,
                            this.tiles[x + (y - 1) * 100]?.offset.y ?? 0,
                        )
                        this.tiles[x + y * 100] = {
                            type: Math.floor(Math.random() * this.types),
                            offset: { x: 0, y: yPos },
                            velocity: { x: 0, y: cy - y },
                        }
                    }
                }
            }
        },
        findMatches() {
            let hozTiles = {}, vetTiles = {}, matches = { count: 0 };
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    if (!hozTiles[x + y * 100]) {
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
                    if (!vetTiles[x + y * 100]) {
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
            return matches;
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