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
    let previousPosition = { x: this.position.x, y: this.position.y };
    let friendlyKing = this.findKing(pieces, this.player);
    let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');

    this.position.x = spotClicked.x;
    this.position.y = spotClicked.y;
    this.moveCount = this.moveCount + 1;
    room.switchColor();

    if (friendlyKing.kingChecked(pieces, spotClicked, room) && this.pieceType !== 'King') {
        friendlyKing.inCheck = false;
        this.position.x = previousPosition.x;
        this.position.y = previousPosition.y;
        this.moveCount = this.moveCount - 1;
        room.switchColor();
        return;
    }

    if (enemyKing.kingChecked(pieces, spotClicked, room) && this.pieceType !== 'King') {
        room.sendUpdate(`${this.player} ${this.pieceType} checked ${enemyKing.player} King!`);
    } 
}

Piece.prototype.capture = function(pieces, spotClicked, room) {
    for (let piece of pieces) {
        if (piece.positionEqual(spotClicked) && !piece.captured && piece.pieceType !== 'King') {
            let previousPosition = { x: this.position.x, y: this.position.y };
            let friendlyKing = this.findKing(pieces, this.player);
            let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');

            piece.captured = true;
            this.position.x = spotClicked.x;
            this.position.y = spotClicked.y;
            this.moveCount = this.moveCount + 1;
            room.switchColor();
            
            if (friendlyKing.kingChecked(pieces, spotClicked, room) && this.pieceType !== 'King') {
                friendlyKing.inCheck = false;
                piece.captured = false;
                this.position.x = previousPosition.x;
                this.position.y = previousPosition.y;
                this.moveCount = this.moveCount - 1;
                room.switchColor();
                return;
            }

            room.sendUpdate(`${piece.player} ${piece.pieceType} was captured!`);

            if (enemyKing.kingChecked(pieces, spotClicked, room) && this.pieceType !== 'King') {
                room.sendUpdate(`${this.player} ${this.pieceType} checked ${enemyKing.player} King!`);
            }
            
            return;
        }
    }
}

Piece.prototype.legalMove = function(pieces, spotClicked, room) {
    // If the piece tries to move onto another piece and its the same color => not a legal move
    if (this.spotOccupied(pieces, spotClicked)) {
        for (let piece of pieces) {
            if (piece.positionEqual(spotClicked) && piece.pieceType !== 'King' && !piece.captured && piece.player == this.player) return false;
        }
    }
    
    return true;
}

Piece.prototype.moveOrCapture = function(pieces, spotClicked, room) {
    if (this.legalMove(pieces, spotClicked, room) && !this.spotOccupied(pieces, spotClicked))
        this.move(pieces, spotClicked, room);
    else if (this.legalMove(pieces, spotClicked, room) && this.spotOccupied(pieces, spotClicked))
        this.capture(pieces, spotClicked, room);

    room.getListOfLegalMoves(this.player);
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

linearCheck = function(pieces, spotClicked, room) {
    if (this.captured === true) return;

    let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');

    // Gets all pieces that are in the same row and column as THIS rook, disregarding self
    let rowObjects = [], colObjects = [];
    for (let i = 0; i < 8; i++) {
        for (let piece of pieces) {
            if (piece.positionEqual({ x: i, y: this.position.y }) && 
            JSON.stringify(piece.initial) !== JSON.stringify(this.initial)) rowObjects.push(piece);
            if (piece.positionEqual({ x: this.position.x, y: i }) && 
            JSON.stringify(piece.initial) !== JSON.stringify(this.initial)) colObjects.push(piece);
        }
    }

    // gets closest pieces from the left and right, relative to this rooks position
    let closestLeft, closestRight;
    let leftX = 7, rightX = 0;
    for (let item of rowObjects) {
        if (item.position.x > this.position.x && item.position.x <= leftX) {
            leftX = item.position.x;
            closestRight = item;
        }
        if (item.position.x < this.position.x && item.position.x >= rightX) {
            rightX = item.position.x;
            closestLeft = item;
        }
    }

    // gets closest pieces from above and below, relative to this rooks position
    let closestUp, closestDown;
    let upY = 7, downY = 0;
    for (let item of colObjects) {
        if (item.position.y > this.position.y && item.position.y <= upY) {
            upY = item.position.y;
            closestDown = item;
        }
        if (item.position.y < this.position.y && item.position.y >= downY) {
            downY = item.position.y;
            closestUp = item;
        }
    }

    // King is in check if any of the pieces being attacked are an enemy king
    for (let piece of [closestUp, closestDown, closestLeft, closestRight]) {
        if (typeof piece === 'undefined') continue;
        if (enemyKing.positionEqual(piece.position)) {
            enemyKing.inCheck = true;
            return this; 
        }
    }
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

diagonalCheck = function(pieces, spotClicked, room) {
    if (this.captured === true) return;

    let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');
    let attackingPieces = [];

    let findPiece = function(current, initial, xoff, yoff) {
        for (let piece of pieces) {
            if (piece.captured === true) continue;
            if (JSON.stringify(piece.initial) === JSON.stringify(initial)) continue; // Skip Self
            if (piece.positionEqual({ x: current.x + xoff, y: current.y + yoff })) return piece;
        }
        return;
    }

    // Up-Right + -
    for (let i = 0; this.position.x + i <= 7 && this.position.y - i >= 0; i++) {
        let result = findPiece(this.position, this.initial, i, -i)
        if (typeof result !== 'undefined') {
            attackingPieces.push(result);
            break;
        }
    }

    //Up-Left Check - -
    for (let i = 0; this.position.x - i >= 0 && this.position.y - i >= 0; i++) {
        let result = findPiece(this.position, this.initial, -i, -i)
        if (typeof result !== 'undefined') {
            attackingPieces.push(result);
            break;
        }
    }
    //Down-Left Check - +
    for (let i = 0; this.position.x - i >= 0 && this.position.y + i <= 7; i++) {
        let result = findPiece(this.position, this.initial, -i, i)
        if (typeof result !== 'undefined') {
            attackingPieces.push(result);
            break;
        }
    }

    //Down-Right Check + +
    for (let i = 0; this.position.x + i <= 7 && this.position.y + i <= 7; i++) {
        let result = findPiece(this.position, this.initial, i, i)
        if (typeof result !== 'undefined') {
            attackingPieces.push(result);
            break;
        }
    }

    for (let piece of attackingPieces) {
        if (piece.player === this.player) continue;
        if (enemyKing.positionEqual(piece.position)) {
            enemyKing.inCheck = true;
            return this; 
        }
    }
}

// -------------------------------------------- PAWN --------------------------------------------

function Pawn(name, color, tx, ty, px, py)  {
    Piece.call(this, name, color, tx, ty, px, py); 
}

Pawn.prototype = Object.create(Piece.prototype);

Pawn.prototype.kingChecked = function(pieces, spotClicked, room) {
    if (this.captured === true) return;

    let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');

    if (this.player === 'White') var attackableSpots = [[-1, -1], [1, -1]];
    if (this.player === 'Black') var attackableSpots = [[-1, 1], [1, 1]];

    for (let [x, y] of attackableSpots) {
        let spotAttacking = { x: this.position.x + x, y: this.position.y + y};
        if (enemyKing.positionEqual(spotAttacking)) {
            enemyKing.inCheck = true;
            return this; 
        }
    }
}

Pawn.prototype.verticalMove = function(pieces, spotClicked, room) {
    let dx = this.position.x - spotClicked.x;
    let dy = this.position.y - spotClicked.y;

    if (Math.abs(dx) === 0) {
        if (Math.abs(dy) == 2 && this.player == 'White' && dy > 0 && this.positionEqual(this.initial)) return true;
        if (Math.abs(dy) == 2 && this.player == 'Black' && dy < 0 && this.positionEqual(this.initial)) return true;
        if (Math.abs(dy) == 1 && this.player == 'White' && dy > 0) return true;
        if (Math.abs(dy) == 1 && this.player == 'Black' && dy < 0) return true;
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
}

Rook.prototype = Object.create(Piece.prototype);
Rook.prototype.linearMove = linearMove;
Rook.prototype.linearCheck = linearCheck;

Rook.prototype.kingChecked = function(pieces, spotClicked, room) {
    return this.linearCheck(pieces, spotClicked, room);
}

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
        if (enemyKing.positionEqual(spotAttacking)) {
            enemyKing.inCheck = true;
            return this; 
        }
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
}

Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.diagonalMove = diagonalMove;
Bishop.prototype.diagonalCheck = diagonalCheck;

Bishop.prototype.kingChecked = function(pieces, spotClicked, room) {
    return this.diagonalCheck(pieces, spotClicked, room);
}

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
Queen.prototype.linearCheck = linearCheck;
Queen.prototype.diagonalCheck = diagonalCheck;

Queen.prototype.kingChecked = function(pieces, spotClicked, room) {
    let r1 = this.linearCheck(pieces, spotClicked, room);
    let r2 = this.diagonalCheck(pieces, spotClicked, room);
    return (typeof r1 === 'undefined' ? r2 : r1);
}

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

King.prototype.kingChecked = function(pieces, spotClicked, room) {
    let piecesAttacking = [];
    for (let piece of pieces) {
        if (piece.pieceType !== 'King' && piece.player !== this.player) {
            let result = piece.kingChecked(pieces, spotClicked, room)
            if (typeof result !== 'undefined') piecesAttacking.push(result);
        }
    }
    if (piecesAttacking.length === 0) this.inCheck = false;

    return this.inCheck;
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