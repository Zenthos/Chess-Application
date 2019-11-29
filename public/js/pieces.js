
class Piece {
    constructor(name, color, tx, ty, image, px, py) {
        this.pieceType = name;
        this.player = color;
        this.tile = {x: tx, y: ty, s: 56};
        this.image = image;
        this.position = {x: px, y: py};
        this.initial = {x: px, y: py};
        this.selected = false;
        this.captured = false;
        this.moveCount = 0;
    }

    selectPiece = function(currentPlayer) {
        if (!this.captured && currentPlayer == this.player)
            this.selected = true;
        else 
            this.selected = false;
    }

    getPiecePos = function() {
        return {
            x: 28 + this.position.x * this.tile.s,
            y: 28 + this.position.y * this.tile.s
        }
    }

    move = function(spotClicked, currentPlayer, socket) {
        this.position = spotClicked;
        this.moveCount++;
        socket.emit('player moved', this);
        return currentPlayer == 'White' ? 'Black' : 'White';
    }

    capture = function(pieces, spotClicked, currentPlayer, socket) {
        let capturedIndex = this.getObjectIndex(pieces, spotClicked);
        if (typeof pieces[capturedIndex] === 'object' && pieces[capturedIndex].player != this.player) {
            pieces[capturedIndex].captured = true;
            socket.emit('piece captured', pieces[capturedIndex]);
            return this.move(spotClicked, currentPlayer, socket);
        }
        return currentPlayer;
    }

    getObjectIndex = function(pieces, tileToMoveTo) {
        for (let i = 0; i < pieces.length; i++) {
            if (tileToMoveTo.x == pieces[i].position.x && tileToMoveTo.y == pieces[i].position.y && !pieces[i].captured)
                return i;
        }
        return NaN;
    }

    validMove = function(obj, xoffSet=0, yoffSet=0) {
        if (this.position.x + xoffSet == obj.x && this.position.y + yoffSet == obj.y)
            return true;
        else
            return false;
    }

    draw = function(ctx) {
        if (!this.captured) {
            let img = {
                tx: this.tile.x * this.tile.s,
                ty: this.tile.y * this.tile.s,
                x: 28 + this.position.x * this.tile.s, 
                y: 28 + this.position.y * this.tile.s,
                s: this.tile.s
            }
            ctx.drawImage(this.image, img.tx, img.ty, img.s, img.s, img.x, img.y, img.s, img.s);
    
            if (this.selected) {
                ctx.lineWidth = 6;
                ctx.strokeStyle = 'rgba(0, 255, 0)';
                ctx.strokeRect(img.x, img.y, img.s, img.s);
            }
        }
    }
}

class Pawn extends Piece {
    moveTo = function(pieces, spotClicked, currentPlayer, socket) {
        if (this.player == 'Black') {
            if (this.validMove(spotClicked, 0, 2) && this.validMove(this.initial) && !spotClicked.occupied)
                return this.move(spotClicked, currentPlayer, socket);
            else if (this.validMove(spotClicked, 0, 1) && !spotClicked.occupied)
                return this.move(spotClicked, currentPlayer, socket);
            else if (this.validMove(spotClicked, 1, 1) || this.validMove(spotClicked, -1, 1) && spotClicked.occupied)
                return this.capture(pieces, spotClicked, currentPlayer, socket);
        } else {
            if (this.validMove(spotClicked, 0, -2) && this.validMove(this.initial) && !spotClicked.occupied) 
                return this.move(spotClicked, currentPlayer, socket);
            else if (this.validMove(spotClicked, 0, -1) && !spotClicked.occupied)
                return this.move(spotClicked, currentPlayer, socket);
            else if (this.validMove(spotClicked, 1, -1) || this.validMove(spotClicked, -1, -1) && spotClicked.occupied)
                return this.capture(pieces, spotClicked, currentPlayer, socket);
        }

        return currentPlayer;
    }
}

class Rook extends Piece {
    linearCheck = function(pieces, spotClicked) {
        let x = this.position.x - spotClicked.x;
        let y = this.position.y - spotClicked.y;

        // Horizontal Movement - Right Obstacle
        if (spotClicked.y == this.position.y && x < 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (this.position.y == piece.position.y && this.position.x + i == piece.position.x && !piece.captured) {
                        console.log(piece.pieceType, piece.position, x, y)
                        return false;
                    }
                }
            }
        }

        // Horizontal Movement - Left Obstacle
        if (spotClicked.y == this.position.y && x > 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (this.position.y == piece.position.y && this.position.x - i == piece.position.x && !piece.captured) {
                        console.log(piece.pieceType, piece.position, x, y)
                        return false;
                    }
                }
            }
        }

        // Vertical Movement - Up Obstacle
        if (spotClicked.x == this.position.x && y > 0) {
            for (let i = 1; i < Math.abs(y); i++) {
                for (let piece of pieces) {
                    if (this.position.x == piece.position.x && this.position.y - i == piece.position.y && !piece.captured){
                        console.log(piece.pieceType, piece.position, x, y)
                        return false;
                    }
                }
            }
        }

        // Vertical Movement - Down Obstacle
        if (spotClicked.x == this.position.x && y < 0) {
            for (let i = 1; i < Math.abs(y); i++) {
                for (let piece of pieces) {
                    if (this.position.x == piece.position.x && this.position.y + i == piece.position.y && !piece.captured){
                        console.log(piece.pieceType, piece.position, x, y)
                        return false;
                    }
                }
            }
        }

        return true;
    }

    moveTo = function(pieces, spotClicked, currentPlayer, socket) {
        if (this.position.y == spotClicked.y && !spotClicked.occupied && this.linearCheck(pieces, spotClicked))
            return this.move(spotClicked, currentPlayer, socket);
        else if (this.position.x == spotClicked.x && !spotClicked.occupied && this.linearCheck(pieces, spotClicked))
            return this.move(spotClicked, currentPlayer, socket);
        else if (this.position.x == spotClicked.x && spotClicked.occupied && this.linearCheck(pieces, spotClicked))
            return this.capture(pieces, spotClicked, currentPlayer, socket);
        else if (this.position.y == spotClicked.y && spotClicked.occupied && this.linearCheck(pieces, spotClicked))
            return this.capture(pieces, spotClicked, currentPlayer, socket);
        
        return currentPlayer;
    }
}

class Knight extends Piece {
    moveTo = function(pieces, spotClicked, currentPlayer, socket) {
        let possibleMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];

        for (let move of possibleMoves) {
            let x = move[0];
            let y = move[1];
            if (this.validMove(spotClicked, x, y) && !spotClicked.occupied)
                return this.move(spotClicked, currentPlayer, socket);
            else if (this.validMove(spotClicked, x, y))
                return this.capture(pieces, spotClicked, currentPlayer, socket);
        }

        return currentPlayer;
    }
}

class Bishop extends Piece {
    diagonalCheck = function(pieces, spotClicked) {
        let x = this.position.x - spotClicked.x;
        let y = this.position.y - spotClicked.y;

        if (x < 0 && y < 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (piece.position.x == this.position.x + i && piece.position.y == this.position.y + i && !piece.captured)
                        return false
                }
            }
        } else if (x > 0 && y < 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (piece.position.x == this.position.x - i && piece.position.y == this.position.y + i && !piece.captured)
                        return false
                }
            }
        } else if (x > 0 && y > 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (piece.position.x == this.position.x - i && piece.position.y == this.position.y - i && !piece.captured)
                        return false
                }
            }
        } else if (x < 0 && y > 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (piece.position.x == this.position.x + i && piece.position.y == this.position.y - i && !piece.captured)
                        return false
                }
            }
        }

        return true;
    }

    moveTo = function(pieces, spotClicked, currentPlayer, socket) {
        let x = this.position.x - spotClicked.x;
        let y = this.position.y - spotClicked.y;

        if (Math.abs(x) == Math.abs(y) && !spotClicked.occupied && this.diagonalCheck(pieces, spotClicked))
            return this.move(spotClicked, currentPlayer, socket);
        else if (Math.abs(x) == Math.abs(y) && spotClicked.occupied && this.diagonalCheck(pieces, spotClicked))
            return this.capture(pieces, spotClicked, currentPlayer, socket);

        return currentPlayer;
    }
}

class Queen extends Piece {
    linearCheck = function(pieces, spotClicked) {
        let x = this.position.x - spotClicked.x;
        let y = this.position.y - spotClicked.y;

        // Horizontal Movement - Right Obstacle
        if (spotClicked.y == this.position.y && x < 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (this.position.y == piece.position.y && this.position.x + i == piece.position.x && !piece.captured)
                        return false;
                }
            }
        }

        // Horizontal Movement - Left Obstacle
        if (spotClicked.y == this.position.y && x > 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (this.position.y == piece.position.y && this.position.x - i == piece.position.x && !piece.captured)
                        return false;
                }
            }
        }

        // Vertical Movement - Up Obstacle
        if (spotClicked.x == this.position.x && y > 0) {
            for (let i = 1; i < Math.abs(y); i++) {
                for (let piece of pieces) {
                    if (this.position.x == piece.position.x && this.position.y - i == piece.position.y && !piece.captured)
                        return false;
                }
            }
        }

        // Vertical Movement - Down Obstacle
        if (spotClicked.x == this.position.x && y < 0) {
            for (let i = 1; i < Math.abs(y); i++) {
                for (let piece of pieces) {
                    if (this.position.x == piece.position.x && this.position.y + i == piece.position.y && !piece.captured)
                        return false;
                }
            }
        }

        return true;
    }

    diagonalCheck = function(pieces, spotClicked) {
        let x = this.position.x - spotClicked.x;
        let y = this.position.y - spotClicked.y;

        if (x < 0 && y < 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (piece.position.x == this.position.x + i && piece.position.y == this.position.y + i && !piece.captured)
                        return false
                }
            }
        } else if (x > 0 && y < 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (piece.position.x == this.position.x - i && piece.position.y == this.position.y + i && !piece.captured)
                        return false
                }
            }
        } else if (x > 0 && y > 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (piece.position.x == this.position.x - i && piece.position.y == this.position.y - i && !piece.captured)
                        return false
                }
            }
        } else if (x < 0 && y > 0) {
            for (let i = 1; i < Math.abs(x); i++) {
                for (let piece of pieces) {
                    if (piece.position.x == this.position.x + i && piece.position.y == this.position.y - i && !piece.captured)
                        return false
                }
            }
        }

        return true;
    }

    moveTo = function(pieces, spotClicked, currentPlayer, socket) {
        let x = this.position.x - spotClicked.x;
        let y = this.position.y - spotClicked.y;

        if (this.position.y == spotClicked.y && !spotClicked.occupied && this.linearCheck(pieces, spotClicked))
            return this.move(spotClicked, currentPlayer, socket);
        else if (this.position.x == spotClicked.x && !spotClicked.occupied && this.linearCheck(pieces, spotClicked))
            return this.move(spotClicked, currentPlayer, socket);
        else if (this.position.x == spotClicked.x && spotClicked.occupied && this.linearCheck(pieces, spotClicked))
            return this.capture(pieces, spotClicked, currentPlayer, socket);
        else if (this.position.y == spotClicked.y && spotClicked.occupied && this.linearCheck(pieces, spotClicked))
            return this.capture(pieces, spotClicked, currentPlayer, socket);
        else if (Math.abs(x) == Math.abs(y) && !spotClicked.occupied && this.diagonalCheck(pieces, spotClicked))
            return this.move(spotClicked, currentPlayer, socket);
        else if (Math.abs(x) == Math.abs(y) && spotClicked.occupied && this.diagonalCheck(pieces, spotClicked))
            return this.capture(pieces, spotClicked, currentPlayer, socket);
        
        return currentPlayer;
    }
}

class King extends Piece {

    inCheck = function(pieces) {

        for (let piece of pieces) {
            if (piece.player != this.player) {
                
            }
        }

        return false;
    }

    spotTaken = function(pieces, x, y) {
        for (let piece of pieces) {
            if (piece.position.x == this.position.x + x && piece.position.y == this.position.y + y)
                return true;
        }
        return false;
    }

    canCastle = function(pieces, spotClicked) {
        // Castling KingSide
        let rook = pieces[pieces.findIndex(piece => piece.pieceType === "Rook" && piece.player == this.player && piece.position.x > this.position.x)];
        if (this.moveCount == 0 && rook.moveCount == 0) {
            if (this.validMove(spotClicked, 2, 0) && !this.spotTaken(pieces, 2, 0) && !this.spotTaken(pieces, 1, 0))
                return true
        }

        // Castling QueenSide
        rook = pieces[pieces.findIndex(piece => piece.pieceType === "Rook" && piece.player == this.player && piece.position.x < this.position.x)];
        if (this.moveCount == 0 && rook.moveCount == 0) {
            if (this.validMove(spotClicked, -2, 0) && !this.spotTaken(pieces, -3, 0) && !this.spotTaken(pieces, -2, 0) && !this.spotTaken(pieces, -1, 0))
                return true
        }

        return false;
    }

    castle = function(pieces, spotClicked, currentPlayer) {
        // Castle KingSide
        if (this.validMove(spotClicked, 2, 0)) {
            let rook = pieces[pieces.findIndex(piece => piece.pieceType === "Rook" && piece.player == this.player && piece.position.x > this.position.x)];
            rook.move({x: this.position.x + 1, y: this.position.y})
            return this.move(spotClicked, currentPlayer, socket);
        } 

        // Castle QueenSide
        if (this.validMove(spotClicked, -2, 0)) {
            let rook = pieces[pieces.findIndex(piece => piece.pieceType === "Rook" && piece.player == this.player && piece.position.x < this.position.x)];
            rook.move({x: this.position.x - 1, y: this.position.y})
            return this.move(spotClicked, currentPlayer, socket);
        } 
    }

    moveTo = function(pieces, spotClicked, currentPlayer, socket) {
        let possibleMoves = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [0, -1], [1, 1], [1, 0], [1, -1]]
        
        for (let i = 0; i < possibleMoves.length; i++) {
            let x = possibleMoves[i][0];
            let y = possibleMoves[i][1];
            if (this.validMove(spotClicked, x, y) && !spotClicked.occupied)
                return this.move(spotClicked, currentPlayer, socket);
            else if (this.validMove(spotClicked, x, y) && spotClicked.occupied)
                return this.capture(pieces, spotClicked, currentPlayer, socket);
            else if (this.canCastle(pieces, spotClicked))
                return this.castle(pieces, spotClicked, currentPlayer);
        }

        return currentPlayer;
    }
}