$('#joinForm').submit(function(e){
    e.preventDefault(); // prevents page reloading
    var socket = io({transports: ['websocket'], upgrade: false});
    $('#JoinContainer').hide();
    chatFunctions(socket);
    chessApp(socket);
    socket.emit('Joined', $('#username').val(), $('#address').val());
    return false;
});

const chatFunctions = function(socket) {
    $('#chatForm').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('Send Message', $('#usermsg').val());
        $('#usermsg').val('');
        return false;
    });

    socket.on('Emit Message', function(username, message){
        $('#messages').append($('<li>').text(`${username}: ${message}`));
    });

    socket.on('Update', function(message){
        $('#messages').append($('<li>').text(message));
    });
}

const chessApp = function(socket) {
    var canvas = document.getElementById("board")
    var ctx = canvas.getContext('2d');
    var board = new Image();
    var figures = new Image();
    var pieces = [];

    const serverFunctions = function() {
        socket.on('Update Board', function(serverBoard) {
            serverBoard.forEach((item, index) => {
                pieces[index].position.x = item.position.x;
                pieces[index].position.y = item.position.y;
                pieces[index].captured = item.captured;
            });
        });
    }

    const chessFunctions = function() {
        const mainLoop = function() {
            ctx.drawImage(board, 0, 0);

            for (let i = 0; i < pieces.length; i++)
                pieces[i].draw(figures, ctx);

            window.requestAnimationFrame(mainLoop);
        }

        
        const initPieces = function() {
            let arr = [];
            ['Black', 'White'].forEach((color, index) => {
                arr.push(new Rook('Rook' , color, 0, index, 0, 7 * index));
                arr.push(new Knight('Knight', color, 1, index, 1, 7 * index));
                arr.push(new Bishop('Bishop', color, 2, index, 2, 7 * index));
                arr.push(new Queen('Queen' , color, 3, index, 3, 7 * index));
                arr.push(new King('King' , color, 4, index, 4, 7 * index));
                arr.push(new Bishop('Bishop', color, 2, index, 5, 7 * index));
                arr.push(new Knight('Knight', color, 1, index, 6, 7 * index));
                arr.push(new Rook('Rook'  , color, 0, index, 7, 7 * index));
                for (let i = 0; i < 8; i++) {
                    if (index == 0)
                        arr.push(new Pawn('Pawn', color, 5, index, i, 1));
                    else 
                        arr.push(new Pawn('Pawn', color, 5, index, i, 6));
                }
            })
            arr.forEach((item, index) => {item.index = index});
            return arr;
        }

        const getRelativeMousePos = function() {
            var rect = event.target.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            return {x, y};
        }

        const moveAndSelect = function() {
            let pos = getRelativeMousePos();
            let tileToMoveTo = tileClicked(pos);
            let selectedObject = getSelectedObject();
            
            if (selectedObject.contains) {
                pieces[selectedObject.index].selected = false;
                let x = pieces[selectedObject.index].position.x;
                let y = pieces[selectedObject.index].position.y;
                if (tileToMoveTo !== undefined && tileToMoveTo.x != x || tileToMoveTo.y != y) {
                    pieces[selectedObject.index].moveTo(pieces, tileToMoveTo, socket);
                }
    
                return;
            }

            for (let i = 0; i < pieces.length; i++) {
                var tile = {
                    x: 28 + pieces[i].position.x * pieces[i].tile.s,
                    y: 28 + pieces[i].position.y * pieces[i].tile.s
                }
                var size = pieces[i].tile.s;
                if (pos.x > tile.x && pos.y > tile.y && pos.x < tile.x + size && pos.y < tile.y + size)
                    if (!pieces[i].captured) {
                        $.get('http://localhost:3000/currentPlayer', {}, function(data){
                            pieces[i].selectPiece(data);
                        });
                    }
            }
        }
    
        const getSelectedObject = function() {
            for (let i = 0; i < pieces.length; i++) {
                if (pieces[i].selected) 
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
        
        canvas.addEventListener('click', function(event) {
            moveAndSelect();
        });

        pieces = initPieces();
        socket.emit('Validate', pieces);
        window.requestAnimationFrame(mainLoop);
    }

    var timer = setInterval(() => {
        board.src = "/static/images/board.png";
        figures.src = "/static/images/figures.png";
        canvas.width = board.width;
        canvas.height = board.height;
        
        if (figures.complete && board.complete) {
            serverFunctions();
            chessFunctions();
            clearInterval(timer);
        }
    }, 100);
}