document.addEventListener('DOMContentLoaded', function() {
    var socket = io({transports: ['websocket'], upgrade: false});
    chatFunctions(socket);

    $('#Waiting').hide();
    $('#joinForm').submit(function(event){
        event.preventDefault(); // prevents page reloading
    
        socket.emit('Joined', $('#username').val(), $('#address').val(), $('#activity').val(), function(formValid, testFailed) {
            if (formValid) {
                socket.emit('Can Start', function(result) {
                    if (result) {
                        $('#JoinContainer').hide();
                        chessApp(socket);
                    } else {
                        $('#joinForm').hide();
                        $('#Waiting').show();
                        if ($('#activity').val() == 'Spectator') $('h4').text('Waiting for players...');
                        else if ($('#activity').val() == 'White') $('h4').text('Waiting for Black...');
                        else if ($('#activity').val() == 'Black') $('h4').text('Waiting for White...');
                    }
                });
            } else {
                $('#errMsg').text(testFailed);
            }
        });
    
        return false;
    });
});

const chatFunctions = function(socket) {
    $('#chatForm').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('Send Message', $('#usermsg').val());
        $('#usermsg').val('');
        return false;
    });

    socket.on('Emit Message', function(user, message){
        $('#messages').append($('<li>').text(`[${user.side}] ${user.username}: ${message}`));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    socket.on('Update', function(message) {
        $('#messages').append($('<li>').text(message));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
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
            if (pieces.length == 0) pieces = pieces.concat(serverBoard);

            serverBoard.forEach((item, index) => {
                pieces[index] = JSON.parse(JSON.stringify(item));
            });
        });
    }

    const chessFunctions = function() {
        const mainLoop = function() {
            ctx.drawImage(board, 0, 0);
            for (let piece of pieces) draw(piece);
            window.requestAnimationFrame(mainLoop);
        }

        const draw = function(piece) {
            if (!piece.captured) {
                let img = {
                    tx: piece.tile.x * piece.tile.s,
                    ty: piece.tile.y * piece.tile.s,
                    x: 28 + piece.position.x * piece.tile.s, 
                    y: 28 + piece.position.y * piece.tile.s,
                    s: piece.tile.s
                }
                ctx.drawImage(figures, img.tx, img.ty, img.s, img.s, img.x, img.y, img.s, img.s);
        
                if (piece.selected) {
                    ctx.lineWidth = 6;
                    ctx.strokeStyle = 'rgba(0, 255, 0)';
                    ctx.strokeRect(img.x, img.y, img.s, img.s);
                }
            }
        }

        const getRelativeMousePos = function(event) {
            let rect = event.target.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            return {x, y};
        }
        
        canvas.addEventListener('click', function(event) {
            socket.emit('Client Clicked', values);
        });

        window.requestAnimationFrame(mainLoop);
    };

    (function beginChess() {
        board.src = "/static/images/board.png";
        figures.src = "/static/images/figures.png";
        canvas.width = board.width;
        canvas.height = board.height;

        if (figures.complete && board.complete) {
            serverFunctions();
            chessFunctions();
            socket.emit('Validate', pieces);
        } else { setTimeout(beginChess, 100); }
    })();
}