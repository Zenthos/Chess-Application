
module.exports = class ChessRoom {
    constructor(io, room, piecesModule) {
        this.currentPlayer = 'White';
        this.pieceSelected = false;
        this.gameFinished = false;
        this.ready = false;
        this.players = [];
        this.pieces = [];
        this.roomName = room;
        this.io = io;
        this.piecesModule = piecesModule;
    }

    switchColor = function() {
        this.currentPlayer = this.currentPlayer == 'White' ? 'Black' : 'White';
    }

    sendUpdate = function(message) {
        this.io.to(this.roomName).emit('Update', `[System] ${message}`);
    }

    addPlayer = function(person) {
        this.players.push(person);
    }

    checkMated = function(color) {
        // The winner is the opposite color of the side that got checkmated
        let winner = color == 'White' ? 'Black':'White';
        this.sendUpdate(`Checkmate! ${winner} has won!`);
        this.gameFinished = true;
    }

    staleMated = function(color) {
        this.sendUpdate(`${color} has no more legal moves, but the king is not in check. The game is a stalemate!`);
        this.gameFinished = true;
    }

    isGameFinished = function(color) {
        let availableMoves = [];
        for (let piece of this.pieces) {
            if (piece.captured || piece.player !== color) continue;
            let result = piece.listOfMoves(this.pieces, undefined, this);
            if (typeof result !== 'undefined' && result.moves.length !== 0) availableMoves.push(result);
        }

        if (availableMoves.length === 0) {
            let king = this.pieces[0].findKing(this.pieces, color);
            if (king.kingChecked(this.pieces, undefined, this)) this.checkMated(color);
            else this.staleMated(color);

            setTimeout(() => { this.io.to(this.roomName).emit('Again Prompt')}, 5000 );
        }
    }

    onClickEvent = function(clickPosition, clientPlayer, clientRoom, clientColor) {
        if (this.gameFinished) return;
        if (clientColor !== this.currentPlayer) return;

        let selectedPiece = {contains: false, index: NaN};
        this.pieces.forEach((item, index) => {
            if (item.selected) {
                selectedPiece.contains = true;
                selectedPiece.index = index;
            }
        });

        if (selectedPiece.contains) {
            this.pieces[selectedPiece.index].selected = false;
            this.pieces[selectedPiece.index].moveOrCapture(this.pieces, clickPosition, clientRoom);
        } else {
            for (let piece of this.pieces) {
                if (!piece.captured && piece.positionEqual(clickPosition))
                    piece.select(this.currentPlayer, clientPlayer);
            }
        }
    }

    playAgain = function() {
        let whiteAgain, blackAgain;
        this.players.forEach(element => {
            if (element.side == 'Black') blackAgain = element.again;
            else if (element.side == 'White') whiteAgain = element.again;
        });

        if (whiteAgain === 'Yes' && blackAgain === 'Yes') return true;
        else return false;
    }

    initPieces = function() {
        ['Black', 'White'].forEach((color, index) => {
            this.pieces.push(new this.piecesModule.Rook('Rook' , color, 0, index, 0, 7 * index));
            this.pieces.push(new this.piecesModule.Knight('Knight', color, 1, index, 1, 7 * index));
            this.pieces.push(new this.piecesModule.Bishop('Bishop', color, 2, index, 2, 7 * index));
            this.pieces.push(new this.piecesModule.Queen('Queen' , color, 3, index, 3, 7 * index));
            this.pieces.push(new this.piecesModule.King('King' , color, 4, index, 4, 7 * index));
            this.pieces.push(new this.piecesModule.Bishop('Bishop', color, 2, index, 5, 7 * index));
            this.pieces.push(new this.piecesModule.Knight('Knight', color, 1, index, 6, 7 * index));
            this.pieces.push(new this.piecesModule.Rook('Rook'  , color, 0, index, 7, 7 * index));
            for (let i = 0; i < 8; i++) {
                if (index == 0) 
                    this.pieces.push(new this.piecesModule.Pawn('Pawn', color, 5, index, i, 1));
                else 
                    this.pieces.push(new this.piecesModule.Pawn('Pawn', color, 5, index, i, 6));
            }
        })
    }

    alreadyHas = function(username) {
        let usernameCheck = false;
        let blackCheck = false;
        let whiteCheck = false;
        this.players.forEach(element => {
            if (element.username == username) usernameCheck = true;
            if (element.side == 'Black') blackCheck = true;
            if (element.side == 'White') whiteCheck = true;
        });

        return {hasUser: usernameCheck, hasBlack: blackCheck, hasWhite: whiteCheck};
    }

    canStart = function() {
        let blackPlayer, whitePlayer;
        this.players.forEach(element => {
            if (element.side == 'Black') blackPlayer = element;
            else if (element.side == 'White') whitePlayer = element;
        });

        if (blackPlayer !== undefined && whitePlayer !== undefined) return true;
        else return false;
    }
}