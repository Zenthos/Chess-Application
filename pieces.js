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
}

Piece.prototype.select = function(currentPlayer, clientPlayer) {
    if (!this.selected && !this.captured && currentPlayer == this.player && clientPlayer == this.player)
        this.selected = true;
}

Piece.prototype.deselect = function() {
    this.selected = false;
}

Piece.prototype.positionEqual = function(obj2) {
    let obj1Position = JSON.stringify(this.position);
    if (obj2.hasOwnProperty('position')) {
        var obj2Position = JSON.stringify(obj2.position);
    } else { 
        var obj2Position = JSON.stringify(obj2);
    }

    if (obj1Position === obj2Position)
        return true;
    else 
        return false;
}

Piece.prototype.spotOccupied = function(pieces, spotClicked) {
    for (let piece of pieces) {
        if (piece.positionEqual(spotClicked))
            return true;
    }
    return false;
}

Piece.prototype.move = function(pieces, spotClicked, room) {
    this.position.x = spotClicked.x;
    this.position.y = spotClicked.y;
    room.switchColor();
}

Piece.prototype.capture = function(pieces, spotClicked, room) {
    for (let piece of pieces) if(piece.positionEqual(spotClicked)) piece.captured = true;
    this.position.x = spotClicked.x;
    this.position.y = spotClicked.y;
    room.switchColor();
}

Piece.prototype.legalMove = function(pieces, spotClicked, room) {
    // If the piece tries to move onto another piece and its the same color => not a legal move
    if (this.spotOccupied(pieces, spotClicked)) {
        for (let piece of pieces) {
            if (piece.positionEqual(spotClicked) && !piece.captured && piece.player == this.player) return false;
        }
    }
    
    return true;
}

Piece.prototype.moveOrCapture = function(pieces, spotClicked, room) {
    if (this.legalMove(pieces, spotClicked, room) && !this.spotOccupied(pieces, spotClicked))
        this.move(pieces, spotClicked, room);
    else if (this.legalMove(pieces, spotClicked, room) && this.spotOccupied(pieces, spotClicked))
        this.capture(pieces, spotClicked, room);
}

// ---------------------------------------- SHARED FUNCTIONS ----------------------------------------

linearMove = function(pieces, spotClicked, room) {
    let dx = this.position.x - spotClicked.x;
    let dy = this.position.y - spotClicked.y;

    // Must be a linear move
    if (Math.abs(dx) !== 0 && Math.abs(dy) !== 0) return false;

    // Move Horizontally
    if (dx !== 0 && dy === 0) {
        let i = dx > 0 ? -1 : 1;
        while(Math.abs(i) < Math.abs(dx)) {
            let nextX = this.position.x + i;
            for (let piece of pieces) if (piece.positionEqual({ x: nextX, y: this.position.y })) return false;
            if (dx < 0) i++;
            if (dx > 0) i--;
        }
    // Move Vertically
    } else if (dy !== 0 && dx === 0) {
        let i = dy > 0 ? -1 : 1;
        while(Math.abs(i) < Math.abs(dy)) {
            let nextY = this.position.y + i;
            for (let piece of pieces)if (piece.positionEqual({ x: this.position.x, y: nextY })) return false;
            if (dy < 0) i++;
            if (dy > 0) i--;
        }
    }

    return true;
}

diagonalMove = function(pieces, spotClicked, room) {
    let dx = this.position.x - spotClicked.x;
    let dy = this.position.y - spotClicked.y;

    // Must be a diagonal move
    if (Math.abs(dx) !== Math.abs(dy)) return false;

    // Determines Direction
    let i = dx > 0 ? -1 : 1;
    let k = dy > 0 ? -1 : 1;
    while(Math.abs(i) < Math.abs(dx) && Math.abs(k) < Math.abs(dy)) {
        let nextX = this.position.x + i;
        let nextY = this.position.y + k;
        for (let piece of pieces) if (piece.positionEqual({ x: nextX, y: nextY })) return false;
        if (dx < 0) i++;
        if (dx > 0) i--;
        if (dy < 0) k++;
        if (dy > 0) k--;
    }

    return true;
}

// -------------------------------------------- PAWN --------------------------------------------

function Pawn(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Pawn.prototype = Object.create(Piece.prototype);

Pawn.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;

    return true;
}


// -------------------------------------------- ROOK --------------------------------------------

function Rook(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Rook.prototype = Object.create(Piece.prototype);
Rook.prototype.linearMove = linearMove;

Rook.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;
    return this.linearMove(pieces, spotClicked, room)
}

// -------------------------------------------- KNIGHT --------------------------------------------

function Knight(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
    this.possibleMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
}

Knight.prototype = Object.create(Piece.prototype);

Knight.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;

    // Calculate distance of spotclicked from current position and see if result is in possible move
    let dx = this.position.x - spotClicked.x;
    let dy = this.position.y - spotClicked.y;
    for (let [x, y] of this.possibleMoves) {
        if (x == dx && y == dy) return true
    }

    return false;
}

// -------------------------------------------- BISHOP --------------------------------------------

function Bishop(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.diagonalMove = diagonalMove;

Bishop.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;
    return this.diagonalMove(pieces, spotClicked, room);
}

// -------------------------------------------- QUEEN --------------------------------------------
function Queen(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Queen.prototype = Object.create(Piece.prototype);
Queen.prototype.linearMove = linearMove;
Queen.prototype.diagonalMove = diagonalMove;

Queen.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;
    if (this.linearMove(pieces, spotClicked, room)) return true;
    if (this.diagonalMove(pieces, spotClicked, room)) return true;
    return false;
}

// -------------------------------------------- KING --------------------------------------------

function King(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
    this.checkMate = false;
    this.inCheck = false;
}

King.prototype = Object.create(Piece.prototype);

King.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;

    return false;
}

exports.module = {
    King: King,
    Queen: Queen,
    Knight: Knight,
    Bishop: Bishop,
    Rook: Rook,
    Pawn: Pawn
}