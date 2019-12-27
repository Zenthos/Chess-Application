document.addEventListener('DOMContentLoaded', function() {
    var socket = io({transports: ['websocket'], upgrade: false});
    chatFunctions(socket);

    $('#username').focus(handlers.focus);
    $('#username').blur(handlers.blur);
    $('#username').on('keypress', handlers.whiteSpace);
    $('#address').focus(handlers.focus);
    $('#address').blur(handlers.blur);
    $('#address').on('keypress', handlers.whiteSpace);

    $('#usermsg').focus(function() {
        if ($('#usermsg').val().trim() === 'Start Typing Here...') {
            $('#usermsg').val('');
        }
    });

    $('#usermsg').blur(function() {
        if ($('#usermsg').val().trim() === '') {
            $('#usermsg').val('Start Typing Here...');
        }
    });

    $("#roomList").click(function(event) {
        if (event.target && event.target.matches("pre.Item")) {
            event.target.className = "element";
            let split = event.target.innerText.split('\n');
            $('#address').val(split[0].substr(11));
        }
    });

    $('#Yes').click(function() {
        $('#Yes').prop('disabled', true);
        $('#No').prop('disabled', true);

        (function waitingForResponse() {
            socket.emit('Play Again', 'Yes', function(result) {
                if (result) {
                    $('#JoinContainer').hide();
                }

                if (!result && result !== 'Rejected') {
                    $('h4').text('Waiting For Response From Other Player...');
                    setTimeout(waitingForResponse, 1000);
                } 

                if (result === 'Rejected') {
                    $('h4').text('Other player has declined. Please wait...');

                    setTimeout(() => {
                        $('#Yes').prop('disabled', true);
                        $('#No').prop('disabled', true);
                        $('#Waiting').hide();
                        $('#Again').hide();
                        $('#joinForm').show();
                        $('#joinList').show();
                        $("#joinButton").attr("disabled", false);
                        $('#errMsg').text("");
                        socket.emit('Change Rooms');
                    }, 6000);
                }
            });
        })();
    });

    $('#No').click(function() {
        socket.emit('Play Again', 'Declined', function(result) {
            $('h4').text('You have declined. Please wait...');

            setTimeout(() => {
                $('#Yes').prop('disabled', true);
                $('#No').prop('disabled', true);
                $('#Waiting').hide();
                $('#Again').hide();
                $('#joinForm').show();
                $('#joinList').show();
                $("#joinButton").attr("disabled", false);
                $('#errMsg').text("");
                socket.emit('Change Rooms');
            }, 3000);
        });
    });

    setInterval(() => {
        socket.emit('Get Rooms', function(listOfRooms) {
            $('#roomList').empty();
            listOfRooms.forEach((room) => {
                let text1 = `Room Name: ${room.name}\n    White: ${room.white}/1\n    `;
                let text2 = `Black: ${room.black}/1\n    Spectators: ${room.spectators}`;
                let formattedText = $('<pre></pre>').text(`${text1}${text2}`).addClass('Item');
                let $room = $('<li>').append(formattedText);
                $('#roomList').append($room);
            });
        });
    }, 3000);

    $('#Waiting').hide();
    $('#Again').hide();
    $('#joinForm').submit(function(event){
        event.preventDefault(); // prevents page reloading
        $("#joinButton").attr("disabled", true);
        $('#errMsg').text("Please wait, Attempting to Connect...");

        socket.emit('Joined', $('#username').val(), $('#address').val(), $('#activity').val(), function(formValid, testFailed) {
            if (formValid) {
                (function waitingForOther() {
                    socket.emit('Can Start', function(result) {
                        if (result) {
                            $('#JoinContainer').hide();
                            chessApp(socket, $('#activity').val());
                        } else {
                            $('#joinForm').hide();
                            $('#joinList').hide();
                            $('#Waiting').show();
                            if ($('#activity').val() == 'Spectator') $('h4').text('Waiting for players...');
                            else if ($('#activity').val() == 'White') $('h4').text('Waiting for Black...');
                            else if ($('#activity').val() == 'Black') $('h4').text('Waiting for White...');
                            setTimeout(waitingForOther, 1000);
                        }
                    });
                })();                
            } else {
                $('#errMsg').text(testFailed);
                $("#joinButton").attr("disabled", false);
            }
        });

        return false;
    });
});

const handlers = {
    focus: function() {
        if ($(`#${this.id}`).val().trim() === `${this.id}`) {
            $(`#${this.id}`).val('');
        }
    },
    blur: function() {
        if ($(`#${this.id}`).val().trim() === '') {
            $(`#${this.id}`).val(`${this.id}`);
        }
    },
    whiteSpace: function(event) {
        if (event.which === 32) return false;
    }
}

const chatFunctions = function(socket) {
    $('#chatForm').submit(function(event){
        event.preventDefault(); // prevents page reloading
        if ($('#usermsg').val().trim() !== 'Start Typing Here...') {
            socket.emit('Send Message', $('#usermsg').val());
            $('#usermsg').val('Start Typing Here...');
        }
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

    socket.on('Reset Chat', function() {
        $('#messages').empty();
    });
}

const chessApp = function(socket, clientColor) {
    var canvas = document.getElementById("board")
    var ctx = canvas.getContext('2d');
    var board = new Image();
    var figures = new Image();
    var pieces = [];

    const serverFunctions = function() {
        socket.on('Update Board', function(serverBoard, serverColor) {
            if (pieces.length == 0) pieces = pieces.concat(serverBoard);

            serverBoard.forEach((item, index) => {
                if (clientColor === 'Black') item.position.y = 7 - item.position.y;
                if (clientColor !== serverColor && clientColor !== 'Spectator') item.selected = false;
                pieces[index] = JSON.parse(JSON.stringify(item));
            });

            $('#currentPlayer').text(`It is ${serverColor}'s turn!`);
        });

        socket.on('Player Left', function() {
            $('#JoinContainer').show();
            $('#joinForm').hide();
            $('#joinList').hide();
            $('#Again').hide();
            $('#Waiting').show();
            if (clientColor == 'Spectator') $('h4').text('A player has left, waiting for another person...');
            else if (clientColor == 'White') $('h4').text('Black has left, waiting for another person...');
            else if (clientColor == 'Black') $('h4').text('White has left, waiting for another person...');
            
            (function waitingForRejoin() {
                socket.emit('Player Validation', function(result) {
                    if (result) {
                        $('#JoinContainer').hide();
                    } else {
                        setTimeout(waitingForRejoin, 3000);
                    }
                });
            })();
        });

        socket.on('Again Prompt', function() {
            $('#JoinContainer').show();
            $('#joinForm').hide();
            $('#joinList').hide();
            $('#Waiting').hide();
            $('#Again').show();
            $('#Yes').prop('disabled', false);
            $('#No').prop('disabled', false);
            $('h2').text('');
            $('h4').text('Would you like to play another match?');
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

        const tileClicked = function(event) {
            let rect = event.target.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;

            let tx = Math.floor((x - 28) / 56); 
            let ty = Math.floor((y - 28) / 56);

            if (clientColor === 'Black') return {x: tx, y: (7 - ty) }; 
            else return {x: tx, y: ty};
        }
        
        canvas.addEventListener('click', function(event) {
            socket.emit('Client Clicked', tileClicked(event));
        });

        // canvas.addEventListener('contextmenu', function(event) {
        //     socket.emit('test');
        // });

        window.requestAnimationFrame(mainLoop);
    };

    (function beginChess() {
        board.src = "/static/chess/images/board.png";
        figures.src = "/static/chess/images/figures.png";
        canvas.width = board.width;
        canvas.height = board.height;

        if (figures.complete && board.complete) {
            serverFunctions();
            chessFunctions();
            socket.emit('Validate', pieces);
        } else { setTimeout(beginChess, 100); }
    })();
}