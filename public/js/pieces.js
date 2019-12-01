// -------------------------------------------- BASE --------------------------------------------

function Piece(name, color, tx, ty, px, py) {
    this.pieceType = name;
    this.player = color;
    this.tile = {x: tx, y: ty, s: 56};
    this.position = {x: px, y: py};
    this.initial = {x: px, y: py};
    this.selected = false;
    this.captured = false;
    this.moveCount = 0;
    this.index = NaN;
}

Piece.prototype.selectPiece = function(currentPlayer) {
    if (!this.captured && currentPlayer == this.player)
        this.selected = true;
    else 
        this.selected = false;
}

Piece.prototype.move = function(spotClicked, socket) {
    this.position = spotClicked;
    this.moveCount++;
    socket.emit('Moved', this);
}

Piece.prototype.capture = function(pieces, spotClicked, socket) {
    let capturedIndex = this.getObjectIndex(pieces, spotClicked);
    if (typeof pieces[capturedIndex] === 'object' && pieces[capturedIndex].player != this.player) {
        pieces[capturedIndex].captured = true;
        this.position = spotClicked;
        this.moveCount++;
        socket.emit('Captured', this, capturedIndex);
    }
}

Piece.prototype.getObjectIndex = function(pieces, tileToMoveTo) {
    for (let i = 0; i < pieces.length; i++) {
        if (tileToMoveTo.x == pieces[i].position.x && tileToMoveTo.y == pieces[i].position.y && !pieces[i].captured)
            return i;
    }
    return NaN;
}

Piece.prototype.validMove = function(obj, xoffSet=0, yoffSet=0) {
    if (this.position.x + xoffSet == obj.x && this.position.y + yoffSet == obj.y)
        return true;
    else
        return false;
}

Piece.prototype.draw = function(figures, ctx) {
    if (!this.captured) {
        let img = {
            tx: this.tile.x * this.tile.s,
            ty: this.tile.y * this.tile.s,
            x: 28 + this.position.x * this.tile.s, 
            y: 28 + this.position.y * this.tile.s,
            s: this.tile.s
        }
        ctx.drawImage(figures, img.tx, img.ty, img.s, img.s, img.x, img.y, img.s, img.s);

        if (this.selected) {
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'rgba(0, 255, 0)';
            ctx.strokeRect(img.x, img.y, img.s, img.s);
        }
    }
}

// ---------------------------------------- SHARED FUNCTIONS ----------------------------------------

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

// -------------------------------------------- PAWN --------------------------------------------

function Pawn(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Pawn.prototype = Object.create(Piece.prototype);

Pawn.prototype.moveTo = function(pieces, spotClicked, socket) {
    if (this.player == 'Black') {
        if (this.validMove(spotClicked, 0, 2) && this.validMove(this.initial) && !spotClicked.occupied)
            this.move(spotClicked, socket);
        else if (this.validMove(spotClicked, 0, 1) && !spotClicked.occupied)
            this.move(spotClicked, socket);
        else if (this.validMove(spotClicked, 1, 1) || this.validMove(spotClicked, -1, 1) && spotClicked.occupied)
            this.capture(pieces, spotClicked, socket);
    } else {
        if (this.validMove(spotClicked, 0, -2) && this.validMove(this.initial) && !spotClicked.occupied) 
            this.move(spotClicked, socket);
        else if (this.validMove(spotClicked, 0, -1) && !spotClicked.occupied)
            this.move(spotClicked, socket);
        else if (this.validMove(spotClicked, 1, -1) || this.validMove(spotClicked, -1, -1) && spotClicked.occupied)
            this.capture(pieces, spotClicked, socket);
    }
}

// -------------------------------------------- ROOK --------------------------------------------

function Rook(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Rook.prototype = Object.create(Piece.prototype);
Rook.prototype.linearCheck = linearCheck;

Rook.prototype.moveTo = function(pieces, spotClicked, socket) {
    if (this.position.y == spotClicked.y && !spotClicked.occupied && this.linearCheck(pieces, spotClicked))
        this.move(spotClicked, socket);
    else if (this.position.x == spotClicked.x && !spotClicked.occupied && this.linearCheck(pieces, spotClicked))
        this.move(spotClicked, socket);
    else if (this.position.x == spotClicked.x && spotClicked.occupied && this.linearCheck(pieces, spotClicked))
        this.capture(pieces, spotClicked, socket);
    else if (this.position.y == spotClicked.y && spotClicked.occupied && this.linearCheck(pieces, spotClicked))
        this.capture(pieces, spotClicked, socket);
}

// -------------------------------------------- KNIGHT --------------------------------------------

function Knight(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Knight.prototype = Object.create(Piece.prototype);

Knight.prototype.moveTo = function(pieces, spotClicked, socket) {
    let possibleMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];

    for (let move of possibleMoves) {
        let x = move[0];
        let y = move[1];
        if (this.validMove(spotClicked, x, y) && !spotClicked.occupied)
            this.move(spotClicked, socket);
        else if (this.validMove(spotClicked, x, y))
            this.capture(pieces, spotClicked, socket);
    }
}

// -------------------------------------------- BISHOP --------------------------------------------

function Bishop(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.diagonalCheck = diagonalCheck;

Bishop.prototype.moveTo = function(pieces, spotClicked, socket) {
    let x = this.position.x - spotClicked.x;
    let y = this.position.y - spotClicked.y;

    if (Math.abs(x) == Math.abs(y) && !spotClicked.occupied && this.diagonalCheck(pieces, spotClicked))
        this.move(spotClicked, socket);
    else if (Math.abs(x) == Math.abs(y) && spotClicked.occupied && this.diagonalCheck(pieces, spotClicked))
        this.capture(pieces, spotClicked, socket);
}

// -------------------------------------------- QUEEN --------------------------------------------
function Queen(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Queen.prototype = Object.create(Piece.prototype);
Queen.prototype.linearCheck = linearCheck;
Queen.prototype.diagonalCheck = diagonalCheck;

Queen.prototype.moveTo = function(pieces, spotClicked, socket) {
    let x = this.position.x - spotClicked.x;
    let y = this.position.y - spotClicked.y;

    if (this.position.y == spotClicked.y && !spotClicked.occupied && this.linearCheck(pieces, spotClicked))
        this.move(spotClicked, socket);
    else if (this.position.x == spotClicked.x && !spotClicked.occupied && this.linearCheck(pieces, spotClicked))
        this.move(spotClicked, socket);
    else if (this.position.x == spotClicked.x && spotClicked.occupied && this.linearCheck(pieces, spotClicked))
        this.capture(pieces, spotClicked, socket);
    else if (this.position.y == spotClicked.y && spotClicked.occupied && this.linearCheck(pieces, spotClicked))
        this.capture(pieces, spotClicked, socket);
    else if (Math.abs(x) == Math.abs(y) && !spotClicked.occupied && this.diagonalCheck(pieces, spotClicked))
        this.move(spotClicked, socket);
    else if (Math.abs(x) == Math.abs(y) && spotClicked.occupied && this.diagonalCheck(pieces, spotClicked))
        this.capture(pieces, spotClicked, socket);
}

// -------------------------------------------- KING --------------------------------------------

function King(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

King.prototype = Object.create(Piece.prototype);

King.prototype.spotTaken = function(pieces, x, y) {
    for (let piece of pieces) {
        if (piece.position.x == this.position.x + x && piece.position.y == this.position.y + y)
            return true;
    }
    return false;
}

King.prototype.canCastle = function(pieces, spotClicked) {
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

King.prototype.castle = function(pieces, spotClicked) {
    // Castle KingSide
    if (this.validMove(spotClicked, 2, 0)) {
        let rook = pieces[pieces.findIndex(piece => piece.pieceType === "Rook" && piece.player == this.player && piece.position.x > this.position.x)];
        rook.move({x: this.position.x + 1, y: this.position.y})
        this.move(spotClicked, socket);
    } 

    // Castle QueenSide
    if (this.validMove(spotClicked, -2, 0)) {
        let rook = pieces[pieces.findIndex(piece => piece.pieceType === "Rook" && piece.player == this.player && piece.position.x < this.position.x)];
        rook.move({x: this.position.x - 1, y: this.position.y})
        this.move(spotClicked, socket);
    } 
}

King.prototype.moveTo = function(pieces, spotClicked, socket) {
    let possibleMoves = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [0, -1], [1, 1], [1, 0], [1, -1]]
    
    for (let i = 0; i < possibleMoves.length; i++) {
        let x = possibleMoves[i][0];
        let y = possibleMoves[i][1];
        if (this.validMove(spotClicked, x, y) && !spotClicked.occupied)
            this.move(spotClicked, socket);
        else if (this.validMove(spotClicked, x, y) && spotClicked.occupied)
            this.capture(pieces, spotClicked, socket);
        else if (this.canCastle(pieces, spotClicked))
            this.castle(pieces, spotClicked, currentPlayer);
    }
}