
const Rook = function (x, y, color) {
  this.x = x;
  this.y = y;
  this.type = 'Rook';
  this.color = color;
  this.selected = false;
  this.availableTiles = [];
}

Rook.prototype.move = function(clickX, clickY) {
  this.x = clickX;
  this.y = clickY;
}

Rook.prototype.canMove = function(clickX, clickY) {
  for (let [x, y] of this.availableTiles) {
    if (x === clickX && y === clickY) {
      return true;
    }
  }
  return false;
}

Rook.prototype.calculateTiles = function(chess) {
  const possibleMoves = {
    'up':    [ [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7] ],
    'down':  [ [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7] ],
    'left':  [ [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0] ],
    'right': [ [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0] ]
  };

  for (let direction in possibleMoves) {
    for (let [x, y] of possibleMoves[direction]) {
      let newX = this.x + x;
      let newY = this.y + y;
      
      if (this.inBounds(newX, newY)) {
        if (this.tileLegal(newX, newY, chess))
          this.availableTiles.push([newX, newY]);
        else
          break;
      }
    }
  }
}

Rook.prototype.inBounds = function(newX, newY) {
  if (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7)
    return true;
  else 
    return false;
}

Rook.prototype.isPathOpen = function(newX, newY, chess) {
  let xpath = [];
  let ypath = [];
  let path = [];
  let temp = { x: this.x, y: this.y };
  // Determine which direction piece needs to travel
  while (temp.x !== newX) {
    if (temp.x < newX) {
      xpath.push(1); 
      temp.x = temp.x + 1;
    } else {
      xpath.push(-1);
      temp.x = temp.x - 1;
    }
  }

  while (temp.y !== newY) {
    if (temp.y < newY) {
      ypath.push(1); 
      temp.y = temp.y + 1;
    } else {
      ypath.push(-1);
      temp.y = temp.y - 1;
    }
  }

  let loops = ( xpath.length >= ypath.length ? xpath.length : ypath.length );

  temp = { x: this.x, y: this.y };
  for (let i = 0; i < loops; i++) {
    let coord = [
      xpath[i] === undefined ? 0 : xpath[i],
      ypath[i] === undefined ? 0 : ypath[i]
    ];
    path.push([ temp.x + coord[0], temp.y + coord[1] ]);
    temp.x = temp.x + coord[0];
    temp.y = temp.y + coord[1];
  }

  let available = [];
  let exception;
  for (let [x, y] of path) {
    let [tileOpen] = this.tileState(x, y, chess);

    if (tileOpen)
      available.push(true);
    else {
      available.push(false);
      exception = [x, y];
      break;
    }
  }

  if (available.includes(false))
    return [false, exception];
  else
    return [true, null];
}

Rook.prototype.tileLegal = function(newX, newY, chess) {
  let [tileOpen, tileCapturable] = this.tileState(newX, newY, chess);
  let [pathOpen, exception] = this.isPathOpen(newX, newY, chess);

  if (tileOpen && pathOpen)
    return true;

  if (tileCapturable && !pathOpen && newX === exception[0] && newY === exception[1])
    return true;

  return false;
}

Rook.prototype.tileState = function(newX, newY, chess) {
  let open = true;
  let capturable = false;

  for (let piece of chess.pieces) {
    if (piece.x === newX && piece.y === newY)
      open = false;

    if (piece.x === newX && piece.y === newY && piece.color !== this.color)
      capturable = true;
  }

  return [open, capturable];
}

module.exports = Rook;