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
    console.log('Moving...');
    this.position.x = spotClicked.x;
    this.position.y = spotClicked.y;
}

Piece.prototype.capture = function(pieces, spotClicked, room) {
    console.log('Capturing...');
    this.position.x = spotClicked.x;
    this.position.y = spotClicked.y;
}

Piece.prototype.legalMove = function(pieces, spotClicked, room) {
    // Checks if the two pieces are different colors
    if (this.spotOccupied(pieces, spotClicked)) {
        for (let piece of pieces) {
            if (piece.positionEqual(spotClicked) && piece.player == this.player) return false;
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



// -------------------------------------------- PAWN --------------------------------------------

function Pawn(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Pawn.prototype = Object.create(Piece.prototype);

Pawn.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;

    return false;
}


// -------------------------------------------- ROOK --------------------------------------------

function Rook(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Rook.prototype = Object.create(Piece.prototype);

Rook.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;

    return false;
}

// -------------------------------------------- KNIGHT --------------------------------------------

function Knight(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
    this.possibleMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
}

Knight.prototype = Object.create(Piece.prototype);

Knight.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;

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

Bishop.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;

    return false;
}

// -------------------------------------------- QUEEN --------------------------------------------
function Queen(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Queen.prototype = Object.create(Piece.prototype);

Queen.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;

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