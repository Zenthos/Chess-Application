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

Piece.prototype.selectPiece = function(currentPlayer, clientPlayer) {
    if (!this.captured && currentPlayer == this.player && clientPlayer == this.player)
        this.selected = true;
    else    
        this.selected = false;
}

Piece.prototype.moveTo = function(pieces, spotClicked, room) {
    this.position.x = spotClicked.x;
    this.position.y = spotClicked.y;
    room.switchColor();
}

// ---------------------------------------- SHARED FUNCTIONS ----------------------------------------



// -------------------------------------------- PAWN --------------------------------------------

function Pawn(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Pawn.prototype = Object.create(Piece.prototype);

// -------------------------------------------- ROOK --------------------------------------------

function Rook(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Rook.prototype = Object.create(Piece.prototype);

// -------------------------------------------- KNIGHT --------------------------------------------

function Knight(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
    this.possibleMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
}

Knight.prototype = Object.create(Piece.prototype);

// -------------------------------------------- BISHOP --------------------------------------------

function Bishop(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Bishop.prototype = Object.create(Piece.prototype);

// -------------------------------------------- QUEEN --------------------------------------------
function Queen(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Queen.prototype = Object.create(Piece.prototype);

// -------------------------------------------- KING --------------------------------------------

function King(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
    this.checkMate = false;
    this.inCheck = false;
}

King.prototype = Object.create(Piece.prototype);

exports.module = {
    King: King,
    Queen: Queen,
    Knight: Knight,
    Bishop: Bishop,
    Rook: Rook,
    Pawn: Pawn
}