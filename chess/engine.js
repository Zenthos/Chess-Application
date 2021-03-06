const PAWN = 'p';
const KNIGHT = 'n';
const BISHOP = 'b';
const ROOK = 'r';
const QUEEN = 'q';
const KING = 'k';

const ILLEGAL = [undefined, -1];
const EMPTY = '.';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];

const SQUARES = {
  a1:  0, b1:  1, c1:  2, d1:  3, e1:  4, f1:  5, g1:  6, h1:  7,
  a2: 10, b2: 11, c2: 12, d2: 13, e2: 14, f2: 15, g2: 16, h2: 17,
  a3: 20, b3: 21, c3: 22, d3: 23, e3: 24, f3: 25, g3: 26, h3: 27,
  a4: 30, b4: 31, c4: 32, d4: 33, e4: 34, f4: 35, g4: 36, h4: 37,
  a5: 40, b5: 41, c5: 42, d5: 43, e5: 44, f5: 45, g5: 46, h5: 47,
  a6: 50, b6: 51, c6: 52, d6: 53, e6: 54, f6: 55, g6: 56, h6: 57,
  a7: 60, b7: 61, c7: 62, d7: 63, e7: 64, f7: 65, g7: 66, h7: 67,
  a8: 70, b8: 71, c8: 72, d8: 73, e8: 74, f8: 75, g8: 76, h8: 77
};

const PAWN_MOVES = {
  'Black': [10, 20],
  'White': [-10, -20],
}

const PAWN_ATTACKS = {
  'Black': [9, 11],
  'White': [-9, -11],
}

const PIECE_MOVES = {
  n: [-21, -19, -12, -8, 8, 12, 19, 21],
  b: [-11, -9, 9, 11],
  r: [-10, -1, 1, 10],
  q: [-11, -10, -9, -1, 1, 9, 10, 11],
  k: [-11, -10, -9, -1, 1, 9, 10, 11]
}

const CASTLE_MOVES = {
  kingside: [2, -2],
  queenside: [-2, 3]
}

const ChessEngine = function() {
  this.board = new Array(120);
  this.currentPlayer = 'White';
  this.needToPromote = false;
  this.enpassantTarget = '';
  this.halfMoves = 0;
  this.moveCount = 1;
  this.history = [];
  this.gameOver = false;
  this.lastMove = { from: '', to: ' '};
  this.castles = { 
    'White': { KC: true, QC: true },
    'Black': { KC: true, QC: true }
  };
}

ChessEngine.prototype.init = function(fen) {
  this.board.fill(-1, 0, this.board.length);

  fen = fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  if (this.isValidFEN(fen)) {
    const { ranks, headers } = this.readFEN(fen);
  
    this.history = this.history.splice(0, this.history.length);
    this.currentPlayer = (headers[0] === 'w' ? 'White':'Black');
    this.enpassantTarget = headers[2];
    this.halfMoves = headers[3];
    this.moveCount = headers[4];
    this.castles = { 
      'White': { KC: headers[1].includes('K'), QC: headers[1].includes('Q') },
      'Black': { KC: headers[1].includes('k'), QC: headers[1].includes('q') }
    };
  
    Object.values(SQUARES).forEach((item, index) => this.board[item] = ranks[index]);
  }
}

//////////////////////////////////////////////////////////////////
// Move Functions
/////////////////////////////////////////////////////////////////

ChessEngine.prototype.buildMove = function(turn, from, to, optional) {
  let move = {
    from, 
    to, 
    color: turn,
    piece: this.board[SQUARES[from]]
  }

  let toTile = this.board[SQUARES[to]];
  if (!ILLEGAL.includes(toTile) && toTile !== EMPTY) {
    if (this.getPiece(to).color !== turn)
      move.captured = this.board[SQUARES[to]];
  }

  if (optional) {
    for (let property in optional) {
      move[property] = optional[property];
    }
  }

  return move;
}

// Single Square Move Generation
ChessEngine.prototype.generateMoves = function(fromLocation) {
  let piece = this.getPiece(fromLocation);

  // Generate All Moves
  let moves = [];

  // Generate Moves if piece is a pawn
  if (piece.type === PAWN) {
    for (let i = 0; i < PAWN_MOVES[piece.color].length; i++) {
      let toIndex = SQUARES[fromLocation] + PAWN_MOVES[piece.color][i]; 
      let tile = this.board[toIndex];
      let toLocation = this.getTileUsingIndex(toIndex);

      // Move Forward 1 Tile
      if (tile === EMPTY && i === 0) {
        if (toLocation.charAt(1) === '8' || toLocation.charAt(1) === '1')
          moves.push(this.buildMove(piece.color, fromLocation, toLocation, { promote: true }));
        else
          moves.push(this.buildMove(piece.color, fromLocation, toLocation));
      }

      // Double tile Forward
      let previousTile = this.board[toIndex - PAWN_MOVES[piece.color][0]];
      if (tile === EMPTY && previousTile === EMPTY && i === 1) {
        if (piece.color === 'White' && fromLocation.charAt(1) === RANKS[6].toString())
          moves.push(this.buildMove(piece.color, fromLocation, toLocation, { double: true }));
        
        if (piece.color === 'Black' && fromLocation.charAt(1) === RANKS[1].toString())
          moves.push(this.buildMove(piece.color, fromLocation, toLocation, { double: true }));
      }
    }

    for (let i = 0; i < PAWN_ATTACKS[piece.color].length; i++) {
      let toIndex = SQUARES[fromLocation] + PAWN_ATTACKS[piece.color][i]; 
      let tile = this.board[toIndex];
      let toLocation = this.getTileUsingIndex(toIndex);

      if (tile !== EMPTY && !ILLEGAL.includes(tile) && this.getColor(tile) !== piece.color && tile.toLowerCase() !== KING) {
        if (toLocation.charAt(1) === '8' || toLocation.charAt(1) === '1')
          moves.push(this.buildMove(piece.color, fromLocation, toLocation, { promote: true }));
        else
          moves.push(this.buildMove(piece.color, fromLocation, toLocation));
      }

      if (this.getTileUsingIndex(toIndex) === this.enpassantTarget)
        moves.push(this.buildMove(piece.color, fromLocation, toLocation, { enpassant: true }));
    }
  }

  // Generate Moves if piece is anything else  
  if (PIECE_MOVES.hasOwnProperty(piece.type)) {
    for (let i = 0; i < PIECE_MOVES[piece.type].length; i++) {
      let loops = 1;
      let toIndex = SQUARES[fromLocation] + PIECE_MOVES[piece.type][i];
      let tile = this.board[toIndex];
      let toLocation = this.getTileUsingIndex(toIndex);

      while (!ILLEGAL.includes(tile)) {
        loops++;

        if (tile !== EMPTY) {
          if (tile.toLowerCase() !== KING && this.getColor(tile) !== piece.color)
            moves.push(this.buildMove(piece.color, fromLocation, toLocation));

          break;
        } else {
          moves.push(this.buildMove(piece.color, fromLocation, toLocation));

          if (piece.type === KNIGHT || piece.type === KING) break;
        }

        toIndex = SQUARES[fromLocation] + PIECE_MOVES[piece.type][i] * loops;
        tile = this.board[toIndex];
        toLocation = this.getTileUsingIndex(toIndex);
      }
    }
  }
  
  // Generate Castling Moves
  if (piece.type === KING && (this.castles[piece.color].KC || this.castles[piece.color].QC)) {
    for (let side in CASTLE_MOVES) {
      let [kingOffset, rookOffset] = CASTLE_MOVES[side];
            
      for (let i = 1; i <= Math.abs(kingOffset); i++) {
        let toIndex = SQUARES[fromLocation] + (i * (kingOffset < 0 ? -1 : 1));
        let tile = this.board[toIndex];
        let toLocation = this.getTileUsingIndex(toIndex);

        // Make Sure Rooks Are present
        if (this.board[SQUARES[(piece.color === 'White'? 'h8':'h1')]].toLowerCase() !== ROOK && side === 'kingside') break;
        if (this.board[SQUARES[(piece.color === 'White'? 'a8':'a1')]].toLowerCase() !== ROOK && side === 'queenside') break;

        // King Cannot Travel Through Check
        if (this.isSquareAttacked(toLocation, this.otherColor(piece.color)))
          break;

        if (!ILLEGAL.includes(tile) && tile === EMPTY) {
          if (side === 'kingside' && i === 2 && this.castles[piece.color].KC)
            moves.push(this.buildMove(piece.color, fromLocation, toLocation, { castle: 'kingside' }));

          if (side === 'queenside' && i*-1 === -2 && this.board[toIndex - 1] === EMPTY && this.castles[piece.color].QC)
           moves.push(this.buildMove(piece.color, fromLocation, toLocation, { castle: 'queenside' }));
        }
      }
    }
  }

  // Filter out moves that leave the king in check
  let legalMoves = [];
  for (let move of moves) {
    this.move(move);
    if (!this.isKingChecked(piece.color))
      legalMoves.push(move);

    this.undoMove();
  }

  return legalMoves;
}

ChessEngine.prototype.generateAllMoves = function(color) {
  let moves = [];

  // Generate all moves or all moves for a specific color
  if (color) {
    for (let i = SQUARES.a1; i <= SQUARES.h8; i++) {
      let char = this.board[i];
      if (!ILLEGAL.includes(char) && char !== EMPTY && this.getColor(char) === color) {
        let charMoves = this.generateMoves(this.getTileUsingIndex(i));
        moves = moves.concat(charMoves);
      }
    }
  } else {
    for (let i = SQUARES.a1; i <= SQUARES.h8; i++) {
      let char = this.board[i];
      if (!ILLEGAL.includes(char) && char !== EMPTY) {
        let charMoves = this.generateMoves(this.getTileUsingIndex(i));
        moves = moves.concat(charMoves);
      }
    }
  }

  return moves;
}

// Actually Move the Piece
ChessEngine.prototype.move = function(move) {
  this.board[SQUARES[move.to]] = this.board[SQUARES[move.from]]
  this.board[SQUARES[move.from]] = EMPTY;
  this.history.push(move);
}

ChessEngine.prototype.undoMove = function() {
  let lastMove = this.history.pop()

  this.board[SQUARES[lastMove.from]] = this.board[SQUARES[lastMove.to]];
  if (lastMove.hasOwnProperty('captured'))
    this.board[SQUARES[lastMove.to]] = lastMove.captured;
  else
    this.board[SQUARES[lastMove.to]] = EMPTY;
}

// Move a piece without adding it to the history
ChessEngine.prototype.uniqueMove = function(from, to) {
  this.board[SQUARES[to]] = this.board[SQUARES[from]]
  this.board[SQUARES[from]] = EMPTY;
}

//////////////////////////////////////////////////////////////////
// Game State Functions
/////////////////////////////////////////////////////////////////

ChessEngine.prototype.isKingCheckMated = function(side) {
  if (this.isKingChecked(side) && this.generateAllMoves(side).length === 0) 
    return true;
  else
    return false;
}

ChessEngine.prototype.isKingChecked = function(side) {
  for (let i = SQUARES.a1; i <= SQUARES.h8; i++) {
    let char = this.board[i];
    if (!ILLEGAL.includes(char) && char === (side === 'White' ? 'K':'k')) {
      let color = this.getColor(char);
      if (color === side && this.isSquareAttacked(this.getTileUsingIndex(i), this.otherColor(side))) 
        return true;
    }
  }
  return false;
}

ChessEngine.prototype.isKingStaleMated = function(side) {
  if (!this.isKingChecked(side) && this.generateAllMoves(side).length === 0) 
    return true;
  else
    return false;
}

ChessEngine.prototype.checkRepetition = function() {
  // Implement Zobrist Hashing
}

ChessEngine.prototype.checkInsufficientMaterial = function() {
  let numPieces = [0, 0, 0, 0, 0];
  for (let square in SQUARES) {
    let tile = this.board[SQUARES[square]];
    if (ILLEGAL.includes(tile) || tile === EMPTY) continue;

    switch(this.board[SQUARES[square]].toLowerCase()) {
      case 'p':
        numPieces[0]++;
        break;
      case 'r':
        numPieces[1]++;
        break;
      case 'b':
        numPieces[2]++;
        break;
      case 'n':
        numPieces[3]++;
        break;
      case 'q':
        numPieces[4]++;
        break;
      default:
        break;
    }
  }

  if (numPieces.every((item) => item === 0))
    return true;
  else
    return false;
}

ChessEngine.prototype.updatePiece = function(side, newPiece) {
  for (let square in SQUARES) {
    let tile = this.board[SQUARES[square]];
    if (!ILLEGAL.includes(tile) && tile !== EMPTY)
      if (tile.toLowerCase() === 'p') {
        this.board[SQUARES[square]] = (side === 'White' ? newPiece.toUpperCase() : newPiece);
        return;
      }
  }

  console.log('Could not update piece');
}

ChessEngine.prototype.isSquareAttacked = function(location, attackingColor) {
  let sqBeingAttacked = SQUARES[location];

  // Check if tile is attacked by Pawn
  if (attackingColor === 'White') {
    for (let i = 0; i < PAWN_ATTACKS['Black'].length; i++) {
      let toIndex = sqBeingAttacked + PAWN_ATTACKS['Black'][i]; 
      let tile = this.board[toIndex];

      if (!ILLEGAL.includes(tile) && tile !== EMPTY) {
        if (tile.toLowerCase() === PAWN && attackingColor === this.getColor(tile))
          return true;
      }
    }
  }
  if (attackingColor === 'Black') {
    for (let i = 0; i < PAWN_ATTACKS['White'].length; i++) {
      let toIndex = sqBeingAttacked + PAWN_ATTACKS['White'][i]; 
      let tile = this.board[toIndex];

      if (!ILLEGAL.includes(tile) && tile !== EMPTY) {
        if (tile.toLowerCase() === PAWN && attackingColor === this.getColor(tile))
          return true;
      }
    }
  }

  // Check if tile is attacked by Rook or Queen
  for (let i = 0; i < PIECE_MOVES.r.length; i++) {
    let loops = 1;
    let toIndex = sqBeingAttacked + PIECE_MOVES.r[i];
    let tile = this.board[toIndex];

    while (!ILLEGAL.includes(tile)) {
      loops++;
      if (tile !== EMPTY) {
        if ((tile.toLowerCase() === ROOK || tile.toLowerCase() === QUEEN) && attackingColor === this.getColor(tile))
          return true;

        break;
      }
      toIndex = sqBeingAttacked + PIECE_MOVES.r[i] * loops;
      tile = this.board[toIndex];
    }
  }

  // Check if tile is attacked by Bishop or Queen
  for (let i = 0; i < PIECE_MOVES.b.length; i++) {
    let loops = 1;
    let toIndex = sqBeingAttacked + PIECE_MOVES.b[i];
    let tile = this.board[toIndex];

    while (!ILLEGAL.includes(tile)) {
      loops++;
      if (tile !== EMPTY) {
        if ((tile.toLowerCase() === BISHOP || tile.toLowerCase() === QUEEN) && attackingColor === this.getColor(tile)) 
          return true;

        break;
      }
      toIndex = sqBeingAttacked + PIECE_MOVES.b[i] * loops;
      tile = this.board[toIndex];
    }
  }

  // Check if tile is attacked by Knight
  for (let i = 0; i < PIECE_MOVES.n.length; i++) {
    let toIndex = sqBeingAttacked + PIECE_MOVES.n[i];
    let tile = this.board[toIndex];

    if (!ILLEGAL.includes(tile) && tile !== EMPTY) {
      if (tile.toLowerCase() === KNIGHT && attackingColor === this.getColor(tile))
        return true;
    }
  }

  // Check if tile is attacked by King
  for (let i = 0; i < PIECE_MOVES.k.length; i++) {
    let toIndex = sqBeingAttacked + PIECE_MOVES.k[i];
    let tile = this.board[toIndex];

    if (!ILLEGAL.includes(tile) && tile !== EMPTY) {
      if (tile.toLowerCase() === KING && attackingColor === this.getColor(tile))
        return true;
    }
  }

  return false;
}

//////////////////////////////////////////////////////////////////
// Lobby Functions - Used by lobby to send/retrieve game data
/////////////////////////////////////////////////////////////////

ChessEngine.prototype.makeMove = function(socket, role, clientMove) {
  if (!clientMove) return;

  let validMoves = this.generateMoves(clientMove.from);
  let exists = validMoves.find((item) => 
    item.color === role && 
    item.from === clientMove.from && 
    item.to === clientMove.to && 
    item.piece === this.board[SQUARES[clientMove.from]]
  );

  if (exists) {
    let newMove = {
      ...clientMove,
      ...exists
    }

    this.move(newMove);

    if (this.castles[newMove.color].QC || this.castles[newMove.color].KC) {
      if (newMove.from === 'a8' || newMove.from === 'a1')
        this.castles[newMove.color].QC = false;

      if (newMove.from === 'h8' || newMove.from === 'h1')
        this.castles[newMove.color].KC = false;

      if (newMove.from === 'e8' || newMove.from === 'e1') {
        this.castles[newMove.color].QC = false;
        this.castles[newMove.color].KC = false;
      }

      if (newMove.hasOwnProperty('castle')) {
        if (newMove.castle === 'kingside') {
          let file = (newMove.color === 'White'? 8:1);
          this.uniqueMove(`h${file}`, `f${file}`);
        }
  
        if (newMove.castle === 'queenside') {
          let file = (newMove.color === 'White'? 8:1);
          this.uniqueMove(`a${file}`, `d${file}`);
        }
      }
    }

    if (newMove.hasOwnProperty('enpassant')) {
      let targetY = parseInt(this.enpassantTarget.charAt(1)) + (newMove.color === 'White'?1:-1);
      this.board[SQUARES[this.enpassantTarget.replace(/[0-9]/, targetY.toString())]] = '.';
    }

    if (newMove.hasOwnProperty('double')) {
      let targetY = parseInt(newMove.from.charAt(1)) + (newMove.color === 'White'?-1:1);
      this.enpassantTarget = newMove.from.replace(/[0-9]/, targetY.toString());
    } else {
      this.enpassantTarget = '';
    }

    if (newMove.hasOwnProperty('promote')) {
      if (this.opponentIsComputer && this.computerColor === newMove.color) {
        let potientialUpgrades = ['q','r','b','n'];
        let randPiece = potientialUpgrades[Math.floor(Math.random() * potientialUpgrades.length)];
        this.board[SQUARES[newMove.to]] = (newMove.color === 'White' ? randPiece.toUpperCase():randPiece);
      } else {
        socket.emit('promotion');
      }
    }

    if (newMove.hasOwnProperty('captured') || newMove.type === PAWN) {
      this.moveCount++;
      this.halfMoves = 0;
    } else {
      this.halfMoves++;
    }
    
    this.lastMove = { from: newMove.from, to: newMove.to };
  }
}

ChessEngine.prototype.getBoard = function(role) {
  let boardData = this.convertBoard64();
  let pieces = [];

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      let char = boardData[rank].charAt(file);
      if (char !== EMPTY) {
        let piece = { 
          type: char, 
          color: this.getColor(char), 
          position: `${FILES[file]}${RANKS[rank]}`,
          availableMoves: this.generateMoves(`${FILES[file]}${RANKS[rank]}`).map((move) => move.to)
        };

        pieces.push(piece);
      }
    }
  }

  return pieces;
}

ChessEngine.prototype.getGameState = function() {
  let title = '';
  if (this.isKingChecked(this.currentPlayer)) {
    title += `The ${this.currentPlayer} King is in check! `;
  }
  title += `${this.currentPlayer} Move`;

  if (this.isKingCheckMated(this.currentPlayer)) {
    title = `${this.currentPlayer} has been checkmated! ${this.otherColor(this.currentPlayer)} has won!`;
    this.gameOver = true;
  }

  if (this.isKingStaleMated(this.currentPlayer)) {
    title = `${this.currentPlayer} has no legal moves! It's a stalemate!`;
    this.gameOver = true;
  }

  if (this.checkInsufficientMaterial()) {
    title = `Neither side has enough material to checkmate. It's a draw!`
    this.gameOver = true;
  }

  if (this.halfMoves >= 50) {
    title = `50 moves have passed since a pawn was moved or a piece was captured. It's a draw!`
    this.gameOver = true;
  }

  return title;
}

//////////////////////////////////////////////////////////////////
// Notation Functions
/////////////////////////////////////////////////////////////////

ChessEngine.prototype.isValidFEN = function(fen) {
  return true;
}

ChessEngine.prototype.readFEN = function(fen) {
  let ranks = fen.split('/', 8);
  let headers = ranks[7].split(' ', 6); // Headers are bundled with last rank so split them
  ranks[7] = headers.shift();           // remove headers from rank
  
  ranks.forEach((rank, index) => {
    rank = rank.split(/(?=[0-9])/g);
    rank.forEach((char, index) => {
      let replacement = EMPTY.repeat(parseInt(char[0]));
      rank[index] = char.replace(/[0-9]/, replacement);
    });
    
    if (rank.length > 0) rank = rank.join('');
    
    ranks[index] = rank;
  });
  
  ranks = ranks.join('');
  return { ranks, headers };
}

ChessEngine.prototype.convertToFEN = function() {

}

//////////////////////////////////////////////////////////////////
// Computer Functions
/////////////////////////////////////////////////////////////////

const PIECE_SQUARE_TABLES = {
  'p': [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [ 5,  5, 10, 25, 25, 10,  5,  5],
    [ 0,  0,  0, 20, 20,  0,  0,  0],
    [ 5, -5,-10,  0,  0,-10, -5,  5],
    [ 5, 10, 10,-20,-20, 10, 10,  5],
    [ 0,  0,  0,  0,  0,  0,  0,  0]
  ],
  'n': [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  'b': [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  'r': [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [ 0,  0,  0,  5,  5,  0,  0,  0]
  ],
  'q': [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  'k': [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20]
  ]
}

ChessEngine.prototype.evaluate = function() {
  let totalEvaluation = 0;
  for (let square in SQUARES) {
    let tile = this.board[SQUARES[square]];
    if (!ILLEGAL.includes(tile) && tile !== EMPTY) 
      totalEvaluation += this.getPieceValue(this.getPiece(square));
  }

  return totalEvaluation;
}

ChessEngine.prototype.calculateBonus = function(piece) {
  let table = [...PIECE_SQUARE_TABLES[piece.type]];

  if (piece.color === 'Black')
    table = table.slice().reverse();

  return table[FILES.indexOf(piece.tile.charAt(0))][RANKS.indexOf(parseInt(piece.tile.charAt(1)))];
}

ChessEngine.prototype.chooseBestMove = function(side, depth) {
  let validMoves = this.generateAllMoves(side);
  let bestMove = null;
  let bestEval = -9999;

  for (let move of validMoves) {
    this.move(move);
    let score = this.minimax(side, depth, -10000, 10000, true);
    this.undoMove();

    if(score > bestEval) {
      bestEval = score;
      bestMove = move;
    }
  }

  return bestMove;
}

ChessEngine.prototype.minimax = function(side, depth, alpha, beta, isMaximisingPlayer) {
  if (depth === 0) return -this.evaluate();

  var validMoves = this.generateAllMoves(side);

  if (isMaximisingPlayer) {
    let bestMove = -9999;
    for (let move of validMoves) {
      this.move(move);
      bestMove = Math.max(bestMove, this.minimax((side === 'White'?'Black':'White'), depth - 1, alpha, beta, !isMaximisingPlayer));
      this.undoMove();
      alpha = Math.max(alpha, bestMove);
      if (alpha <= beta) return bestMove;
    }

    return bestMove;
  } else {
    let bestMove = 9999;
    for (let move of validMoves) {
      this.move(move);
      bestMove = Math.min(bestMove, this.minimax((side === 'White'?'Black':'White'), depth - 1, alpha, beta, !isMaximisingPlayer));
      this.undoMove();
      beta = Math.min(beta, bestMove);
      if (beta <= alpha) return bestMove;
    }

    return bestMove;
  }
}

//////////////////////////////////////////////////////////////////
// Helper Functions
/////////////////////////////////////////////////////////////////

ChessEngine.prototype.switchPlayer = function() {
  if (!this.gameOver)
    this.currentPlayer = (this.currentPlayer === 'White' ? 'Black':'White');
}

ChessEngine.prototype.otherColor = function(color) {
  return (color === 'White' ? 'Black' : 'White');
}

ChessEngine.prototype.getColor = function(char) {
  if (/^[A-Z]*$/.test(char)) 
    return 'White';
  else
    return 'Black';
}

ChessEngine.prototype.getPiece = function(square) {
  let char = this.board[SQUARES[square]];

  if (char)
    return { type: char.toLowerCase(), color: this.getColor(char), tile: square };
  else
    return { type: 'Square is not on the board', color: 'No Color', tile: 'No Tile' };
}

ChessEngine.prototype.getTileUsingIndex = function(index) {
  for (let location in SQUARES) {
    if (SQUARES[location] === index)
      return location;
  }
}

ChessEngine.prototype.getPieceValue = function(piece) {
  if (piece === null) {
    console.log("Tried to get Value of Null Piece");
    return 0;
  }

  let absoluteValue = function(piece) {
    if (piece.type === 'p')
        return 10;
    else if (piece.type === 'r')
        return 50;
    else if (piece.type === 'n')
        return 30;
    else if (piece.type === 'b')
        return 30 ;
    else if (piece.type === 'q')
        return 90;
    else if (piece.type === 'k')
        return 900;
    else
      throw "Unknown Piece Type: " + piece.type;
  }

  let score = absoluteValue(piece);
  score += this.calculateBonus(piece);

  return (piece.color === 'White' ? score:-score);
}

ChessEngine.prototype.convertBoard64 = function() {
  let newBoard = [];

  let count = 0;
  let rank = '';
  for (let square in SQUARES) {
    rank += this.board[SQUARES[square]];
    count++;

    if (count % 8 === 0) {
      newBoard.push(rank);
      rank = '';
    }
  }

  return newBoard;
}

//////////////////////////////////////////////////////////////////
// Testing Functions
/////////////////////////////////////////////////////////////////

ChessEngine.prototype.printBoard = function() {
  let count = 0;
  console.log('------------------');
  let rank = '|    ';
  for (let square in SQUARES) {
    rank += this.board[SQUARES[square]];
    count++;

    if (count % 8 === 0) {
      console.log(rank + '    |');
      rank = '|    ';
    }
  }
  console.log('------------------');
}

module.exports = ChessEngine;
