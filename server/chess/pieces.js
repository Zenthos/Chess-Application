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
    // Only Selects if the Client, Server, and Piece are all the same color
    // if (!this.selected && !this.captured && currentPlayer == this.player && clientPlayer == this.player)
        this.selected = true;
}

Piece.prototype.deselect = function() {
    this.selected = false;
}

Piece.prototype.positionEqual = function(obj2) {
    let obj1Position = JSON.stringify(this.position);
    if (obj2.hasOwnProperty('position')) var obj2Position = JSON.stringify(obj2.position);
    else var obj2Position = JSON.stringify(obj2);

    if (obj1Position === obj2Position) return true;
    else return false;
}

Piece.prototype.spotOccupied = function(pieces, spotClicked) {
    for (let piece of pieces) {
        if (piece.positionEqual(spotClicked)) return true;
    }
    return false;
}

Piece.prototype.listOfMoves = function(pieces, spotClicked, room) {
    let moves = [];
    for (let [x, y] of this.possibleMoves) {
        let nextSpot = { x: this.position.x + x, y: this.position.y + y };
        if (nextSpot.x > 7 || nextSpot.x < 0 || nextSpot.y > 7 || nextSpot.y < 0) continue;
        if (this.legalMove(pieces, nextSpot, room)) moves.push([x, y]);
    }
    return {piece: `${this.player} ${this.pieceType}`, moves};
}

Piece.prototype.move = function(pieces, spotClicked, room) {
    let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');

    this.position.x = spotClicked.x;
    this.position.y = spotClicked.y;
    this.moveCount = this.moveCount + 1;
    room.switchColor();

    if (enemyKing.kingChecked(pieces, spotClicked, room) && this.pieceType !== 'King') {
        enemyKing.inCheck = true;
        room.sendUpdate(`${this.player} ${this.pieceType} checked ${enemyKing.player} King`);
    } 
}

Piece.prototype.capture = function(pieces, spotClicked, room) {
    for (let [index, piece] of pieces.entries()) {
        if (JSON.stringify(this.initial) === JSON.stringify(piece.initial)) continue; // Skip Self
        if (piece.positionEqual(spotClicked) && !piece.captured && piece.pieceType !== 'King') {
            let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');

            piece.captured = true;
            this.position.x = spotClicked.x;
            this.position.y = spotClicked.y;
            this.moveCount = this.moveCount + 1;
            room.switchColor();
            room.sendUpdate(`${piece.player} ${piece.pieceType} was captured`);

            if (enemyKing.kingChecked(pieces, spotClicked, room) && this.pieceType !== 'King') {
                enemyKing.inCheck = true;
                room.sendUpdate(`${this.player} ${this.pieceType} checked ${enemyKing.player} King`);
            }

            pieces.splice(index, 1);
            return;
        }
    }
}

Piece.prototype.legalMove = function(pieces, spotClicked, room) {
    // Cannot move a captured piece
    if (this.captured === true) return false;

    // If the piece tries to move onto another piece and its the same color => not a legal move
    if (this.spotOccupied(pieces, spotClicked)) {
        for (let piece of pieces) {
            if (piece.positionEqual(spotClicked) && !piece.captured && piece.player == this.player) return false;
        }
    }
    
    // Not legal move if the move causes friendly king to be in check
    if (this.doesMoveCheckSelf(pieces, spotClicked, room)) return false;

    return true;
}

Piece.prototype.doesMoveCheckSelf = function(pieces, spotClicked, room) {
    let previousPosition = { x: this.position.x, y: this.position.y };
    let friendlyKing = this.findKing(pieces, this.player);

    this.position.x = spotClicked.x;
    this.position.y = spotClicked.y;
    for (let piece of pieces) if (piece.positionEqual(this.position)) piece.captured = true;

    let result = friendlyKing.kingChecked(pieces, spotClicked, room)

    this.position.x = previousPosition.x;
    this.position.y = previousPosition.y;
    for (let piece of pieces) if (piece.captured) piece.captured = false;

    if (result) return true;
    else return false;
}

Piece.prototype.moveOrCapture = function(pieces, spotClicked, room) {
    let legal = this.legalMove(pieces, spotClicked, room);
    let occupied = this.spotOccupied(pieces, spotClicked);

    if (legal && !occupied) this.move(pieces, spotClicked, room);
    else if (legal && occupied) this.capture(pieces, spotClicked, room);

    // Check if the opposite color has reached a checkmate or stalemate
    room.isGameFinished(this.player == 'White' ? 'Black':'White'); 
}

Piece.prototype.findKing = function(pieces, color) {
    for (let piece of pieces) {
        if (piece.pieceType === 'King' && piece.player === color) return piece;
    }
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
Pawn.prototype.linearMove = linearMove;

Pawn.prototype.listOfMoves = function(pieces, spotClicked, room) {
    if (this.player === 'White') var possibleMoves = [[-1, -1], [1, -1],  [0, -1], [0, -2]];
    if (this.player === 'Black') var possibleMoves = [[-1, 1], [1, 1], [0, 1], [0, 2]];
    let moves = [];
    for (let [x, y] of possibleMoves) {
        let nextSpot = { x: this.position.x + x, y: this.position.y + y };
        if (nextSpot.x > 7 || nextSpot.x < 0 || nextSpot.y > 7 || nextSpot.y < 0) continue;
        if (this.legalMove(pieces, nextSpot, room)) moves.push([x, y]);
    }
    return {piece: `${this.player} ${this.pieceType}`, moves};
}

Pawn.prototype.kingChecked = function(pieces, spotClicked, room) {
    if (this.captured === true) return;

    let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');

    if (this.player === 'White') var attackableSpots = [[-1, -1], [1, -1]];
    if (this.player === 'Black') var attackableSpots = [[-1, 1], [1, 1]];

    for (let [x, y] of attackableSpots) {
        let spotAttacking = { x: this.position.x + x, y: this.position.y + y};
        if (enemyKing.positionEqual(spotAttacking)) return this; 
    }
}

Pawn.prototype.verticalMove = function(pieces, spotClicked, room) {
    let dx = this.position.x - spotClicked.x;
    let dy = this.position.y - spotClicked.y;

    if (Math.abs(dx) === 0 && !this.spotOccupied(pieces, spotClicked)) {
        if (dy == 2 && this.player == 'White' && this.linearMove(pieces, spotClicked, room) && this.positionEqual(this.initial)) return true;
        if (dy == -2 && this.player == 'Black' && this.linearMove(pieces, spotClicked, room) && this.positionEqual(this.initial)) return true;
        if (dy == 1 && this.player == 'White') return true;
        if (dy == -1 && this.player == 'Black') return true;
    }

    if (Math.abs(dx) == 1 && Math.abs(dy) == 1 && this.spotOccupied(pieces, spotClicked)) {
        if (this.player == 'White' && dy > 0) return true;
        if (this.player == 'Black' && dy < 0) return true;
    }

    return false;
}

Pawn.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;
    return this.verticalMove(pieces, spotClicked, room);
}


// -------------------------------------------- ROOK --------------------------------------------

function Rook(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
    this.possibleMoves = [[-7, 0], [-6, 0], [-5, 0], [-4, 0], [-3, 0], [-2, 0], [-1, 0],
                          [7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0],
                          [0, -7], [0, -6], [0, -5], [0, -4], [0, -3], [0, -2], [0, -1],
                          [0, 7], [0 ,6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1]];
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

Knight.prototype.kingChecked = function(pieces, spotClicked, room) {
    if (this.captured === true) return;

    let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');

    for (let [x, y] of this.possibleMoves) {
        let spotAttacking = { x: this.position.x + x, y: this.position.y + y};
        if (enemyKing.positionEqual(spotAttacking)) return true; 
    }
}

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
    this.possibleMoves = [[-7, -7], [-6, -6], [-5, -5], [-4, -4], [-3, -3], [-2, -2], [-1, -1],
                          [-7, 7], [-6, 6], [-5, 5], [-4, 4], [-3, 3], [-2, 2], [-1, 1],
                          [7, -7], [6, -6], [5, -5], [4, -4], [3, -3], [2, -2], [1, -1],
                          [7, 7], [6, 6], [5, 5], [4, 4], [3, 3], [2, 2], [1, 1]];
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
    this.possibleMoves = [[-7, 0], [-6, 0], [-5, 0], [-4, 0], [-3, 0], [-2, 0], [-1, 0],
                          [7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0],
                          [0, -7], [0, -6], [0, -5], [0, -4], [0, -3], [0, -2], [0, -1],
                          [0, 7], [0 ,6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1],
                          [-7, -7], [-6, -6], [-5, -5], [-4, -4], [-3, -3], [-2, -2], [-1, -1],
                          [-7, 7], [-6, 6], [-5, 5], [-4, 4], [-3, 3], [-2, 2], [-1, 1],
                          [7, -7], [6, -6], [5, -5], [4, -4], [3, -3], [2, -2], [1, -1],
                          [7, 7], [6, 6], [5, 5], [4, 4], [3, 3], [2, 2], [1, 1]];
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
    this.possibleMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
}

King.prototype = Object.create(Piece.prototype);

// Version 1
// King.prototype.kingChecked = function(pieces, spotClicked, room) {
//     for (let piece of pieces) {
//         if (piece.pieceType !== 'King' && piece.player !== this.player) {
//             let result = piece.kingChecked(pieces, spotClicked, room)
//             if (typeof result !== 'undefined') return true;
//         }
//     }
//     return false;
// }

// Version 2
King.prototype.kingChecked = function(pieces, spotClicked, room) {
    let attackingPieces = [];

    let upRight = this.findPiece(pieces, 1, -1);
    let upLeft = this.findPiece(pieces, -1, -1);
    let downRight = this.findPiece(pieces, 1, 1);
    let downLeft = this.findPiece(pieces, -1, 1);

    attackingPieces.push({ direction: 'upRight', piece: upRight });
    attackingPieces.push({ direction: 'upLeft', piece: upLeft });
    attackingPieces.push({ direction: 'downRight', piece: downRight });
    attackingPieces.push({ direction: 'downLeft', piece: downLeft });

    let up = this.findPiece(pieces, 0, -1);
    let down = this.findPiece(pieces, 0, 1);
    let left = this.findPiece(pieces, -1, 0);
    let right = this.findPiece(pieces, 1, 0);

    attackingPieces.push({ direction: 'up', piece: up });
    attackingPieces.push({ direction: 'down', piece: down });
    attackingPieces.push({ direction: 'left', piece: left });
    attackingPieces.push({ direction: 'right', piece: right });

    // Determines if the king is being attacked by a knight
    for (let piece of pieces) {
        if (piece.pieceType === 'Knight' && piece.player !== this.player) {
            if (piece.kingChecked(pieces, spotClicked, room)) attackingPieces.push({ direction: 'knight', piece})
        }
    }

    let filtered = attackingPieces.filter(item => item.piece !== undefined);

    if (filtered.length !== 0) {
        for (let attacker of filtered) {
            let piece = attacker.piece;
            let direction = attacker.direction;
            if (piece.captured) continue;
            if (piece.player === this.player) continue;
            if (piece.positionEqual(this.position)) continue;

            let diagDirections = ['upLeft', 'upRight', 'downLeft', 'downRight'];
            if (piece.pieceType === 'Queen' || piece.pieceType === 'Bishop' || piece.pieceType === 'Pawn') {
                if (piece.pieceType !== 'Pawn') {
                    if (piece.pieceType === 'Bishop' && diagDirections.includes(direction)) return true;
                    if (piece.pieceType === 'Queen' && diagDirections.includes(direction)) return true;
                } else {
                    let dx = Math.abs(this.position.x - piece.position.x);
                    let dy = Math.abs(this.position.y - piece.position.y);
                    if (dx !== 1 && dy !== 1) continue;
                    if (this.player === 'White' && direction === 'upLeft' || direction === 'upRight') return true;
                    if (this.player === 'Black' && direction === 'downLeft' || direction === 'downRight') return true;
                }
            }

            let linearDirections = ['right', 'left', 'up', 'down'];
            if (piece.pieceType === 'Queen' || piece.pieceType === 'Rook') {
                if (linearDirections.includes(direction)) return true;
            } 

            if (direction === 'knight' && piece.pieceType === 'Knight') return true;
        }
    }
    return false;
}   

King.prototype.findPiece = function(pieces, sign1, sign2) {
    for (let i = 1; this.position.x + i*sign1 <= 7 && this.position.y + i*sign2 <= 7; i++) {
        let newX = this.position.x + i*sign1;
        let newY = this.position.y + i*sign2;
        if (newX > 7 || newX < 0 || newY > 7 || newY < 0) break;
        for (let piece of pieces) {
            if (piece.captured === true) continue;
            if (piece.positionEqual({ x: newX, y: newY })) return piece;
        }
    }
    return;
}


King.prototype.moveOneSpot = function(pieces, spotClicked, room) {
    let dx = this.position.x - spotClicked.x;
    let dy = this.position.y - spotClicked.y;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return true;
    else return false;
}

King.prototype.wantsToCastle = function(pieces, spotClicked, room) {
    // Cannot castle if king has moved
    if (this.moveCount !== 0) return false;

    // Rooks on either side
    for (let piece of pieces) {
        if (piece.pieceType === 'Rook' && this.player === piece.player && piece.position.x < this.position.x) var leftRook = piece;
        if (piece.pieceType === 'Rook' && this.player === piece.player && piece.position.x > this.position.x) var rightRook = piece;
    }
    
    // Wants to castle left-side
    if (spotClicked.x == 2 && spotClicked.y == this.position.y) {
        if (leftRook.moveCount !== 0) return false;
        let leftTiles = [{ x: 1, y: this.position.y }, { x: 2, y: this.position.y }, { x: 3, y: this.position.y }];
        let canCastle = true;
        for (let spot of leftTiles) { if (this.spotOccupied(pieces, spot)) canCastle = false };
        return canCastle;
    }

    // Wants to castle right-side 
    if (spotClicked.x == 6 && spotClicked.y == this.position.y) {
        if (rightRook.moveCount !== 0) return false;
        let rightTiles = [{ x: 5, y: this.position.y }, { x: 6, y: this.position.y }];
        let canCastle = true;
        for (let spot of rightTiles) { if (this.spotOccupied(pieces, spot)) canCastle = false };
        return canCastle;
    }
}

King.prototype.castle = function(pieces, spotClicked, room) {
    // Rooks on either side
    for (let piece of pieces) {
        if (piece.pieceType === 'Rook' && this.player === piece.player && piece.position.x < this.position.x) var leftRook = piece;
        if (piece.pieceType === 'Rook' && this.player === piece.player && piece.position.x > this.position.x) var rightRook = piece;
    }
    // Move left side rook
    if (spotClicked.x == 2 && spotClicked.y == this.position.y) leftRook.position.x = 3;
    // Move right side rook
    if (spotClicked.x == 6 && spotClicked.y == this.position.y) rightRook.position.x = 5;

    return true;
}

King.prototype.legalMove = function(pieces, spotClicked, room) {
    if (!Piece.prototype.legalMove.call(this, pieces, spotClicked, room)) return false;
    if (this.wantsToCastle(pieces, spotClicked, room)) return this.castle(pieces, spotClicked, room);
    return this.moveOneSpot(pieces, spotClicked, room);
}

exports.module = {
    King: King,
    Queen: Queen,
    Knight: Knight,
    Bishop: Bishop,
    Rook: Rook,
    Pawn: Pawn
}