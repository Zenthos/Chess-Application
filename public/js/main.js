
window.addEventListener("load", function() {
    var canvas = document.getElementById("board")
    var ctx = canvas.getContext('2d');
    var board = new Image();
    var figures = new Image();
    var pieces = [];
    var currentPlayer = 'White';
    var socket = io();

    const chatFunctions = function() {
        $('form').submit(function(e){
            e.preventDefault(); // prevents page reloading
            socket.emit('chat message', $('#usermsg').val());
            $('#usermsg').val('');
            return false;
        });

        socket.on('chat message', function(msg){
            $('#messages').append($('<li>').text(msg));
        });
    }

    const chessFunctions = function() {
        const mainLoop = function() {
            ctx.drawImage(board, 0, 0);
            for (let i = 0; i < pieces.length; i++)
                pieces[i].draw(ctx);
            window.requestAnimationFrame(mainLoop);
        }

        const initPieces = function(img) {
            let pieces = [];
            ['Black', 'White'].forEach((color, index) => {
                pieces.push(new Rook('Rook' , color, 0, index, img, 0, 7 * index));
                pieces.push(new Knight('Knight', color, 1, index, img, 1, 7 * index));
                pieces.push(new Bishop('Bishop', color, 2, index, img, 2, 7 * index));
                pieces.push(new Queen('Queen' , color, 3, index, img, 3, 7 * index));
                pieces.push(new King('King' , color, 4, index, img, 4, 7 * index));
                pieces.push(new Bishop('Bishop', color, 2, index, img, 5, 7 * index));
                pieces.push(new Knight('Knight', color, 1, index, img, 6, 7 * index));
                pieces.push(new Rook('Rook'  , color, 0, index, img, 7, 7 * index));
                for (let i = 0; i < 8; i++) {
                    if (index == 0)
                        pieces.push(new Pawn('Pawn', color, 5, index, img, i, 1));
                    else 
                        pieces.push(new Pawn('Pawn', color, 5, index, img, i, 6));
                }
            })
            return pieces;
        }
    
        const getRelativeMousePos = function(event) {
            var rect = event.target.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            return {x, y};
        }
    
        const getSelectedObject = function(arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].selected) 
                    return {contains: true, index: i};
            }
            return {contains: false, index: NaN};   // Returns Index of Selected Object
        }
    
        const tileClicked = function(spotClicked) {
            let x = Math.floor((spotClicked.x - 28) / 56);
            let y = Math.floor((spotClicked.y - 28) / 56);
            let occupied = false
    
            for (let piece of pieces) {
                if (piece.position.x == x && piece.position.y == y && !piece.captured)
                    occupied = true;
            }
    
            if (x >= 0 && x <= 7 && y >= 0 && y <= 7)
                return {x, y, occupied};
        }
        
        const onClick = function(event) {
            let pos = getRelativeMousePos(event);
            let tileToMoveTo = tileClicked(pos);
    
            let selectedObject = getSelectedObject(pieces);
            if (selectedObject.contains) {
                pieces[selectedObject.index].selected = false;
                let x = pieces[selectedObject.index].position.x;
                let y = pieces[selectedObject.index].position.y;
                if (tileToMoveTo !== undefined && tileToMoveTo.x != x || tileToMoveTo.y != y){
                    currentPlayer = pieces[selectedObject.index].moveTo(pieces, tileToMoveTo, currentPlayer, socket);
                    if (currentPlayer === undefined) {throw new Error("Player is Undefined")}
                }
                return;
            }
    
            for (let i = 0; i < pieces.length; i++) {
                var tile = pieces[i].getPiecePos();
                var size = pieces[i].tile.s;
                if (pos.x > tile.x && pos.y > tile.y && pos.x < tile.x + size && pos.y < tile.y + size)
                    if (!pieces[i].captured)
                        pieces[i].selectPiece(currentPlayer);
            }
        }

        pieces = initPieces(figures);
        canvas.addEventListener('click', onClick);
        window.requestAnimationFrame(mainLoop);
    }

    var timer = setInterval(() => {
        board.src = "/static/images/board.png";
        figures.src = "/static/images/figures.png";
        canvas.width = board.width;
        canvas.height = board.height;
        
        if (figures.complete && board.complete) {
            chatFunctions();
            chessFunctions();
            this.clearInterval(timer);
        }
    }, 100);
})