import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { handler } from '../build/handler.js';

const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server);

const lobbies = {};

function checkWinner(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === 'X' ? 'X wins' : 'Y wins';
        }
    }

    // check for a tie (no empty cells)
    if (board.every((cell) => cell !== '')) {
        return "it's a tie";
    }

    return null; // no winner or tie yet
}

let init_player = 1;

// connected when user visits page
io.on('connection', (socket) => {
    console.log('sio: a user has connected to the page');

    let currentLobbyId = null;

    // create lobby
    socket.on('sio-createLobby', (lobbyId) => {
        console.log('sio: lobby created ', lobbyId);

        socket.on('disconnect', () => {
            console.log('sio: lobby creator disconnected');
        });
    });

    // check lobby
    socket.on('sio-checkLobby', (lobbyId, callback) => {
        const room = io.sockets.adapter.rooms.get(lobbyId);
        if (room && room.size === 1) {
            callback({ success: true });
        } else if (room && room.size === 2) {
            callback({ success: false, message: 'lobby is full' });
        } else {
            callback({ success: false, message: 'lobby does not exist' });
        }
    });

    // join lobby
    socket.on('sio-joinLobby', (lobbyId, callback) => {
        currentLobbyId = lobbyId;
        let room = io.sockets.adapter.rooms.get(lobbyId);

        if (!room || !room.has(socket.id) || room.size <= 2) {
            socket.join(lobbyId);
            room = io.sockets.adapter.rooms.get(lobbyId);
            console.log(`sio: user joined lobby: ${lobbyId}`);
            init_player = 1;

            if (room && room.size === 1) {
                lobbies[lobbyId] = {
                    board: Array(9).fill(''),
                    server_turn: init_player, // 1 is creator
                    completed: false
                };
            }

            socket.to(lobbyId).emit('sio-log-messages', 'a player has joined the lobby...');
        } else {
            console.log(
                `sio: user ${socket.id} already in lobby ${lobbyId}, no join event triggered.`
            );
        }

        callback({ gameState: lobbies[lobbyId] });
    });

    // make move
    socket.on('sio-move', (lobbyId, { index, player }) => {
        const gameState = lobbies[lobbyId];
        if (gameState && gameState.board[index] === '' && gameState.server_turn === player) {
            gameState.board[index] = player === 1 ? 'X' : 'O';
            gameState.server_turn = player === 1 ? 2 : 1;

            console.log('reached here');
            io.to(lobbyId).emit('sio-move', gameState);
            io.to(lobbyId).emit('sio-log-messages', gameState.board[index] + ' made a move ...');

            // Check if there is a winner or if the game is a tie
            const winner = checkWinner(gameState.board);
            console.log('here i am, ', winner);
            if (winner) {
                gameState.completed = true;
                gameState.winner = winner;
                io.to(lobbyId).emit('sio-gameover', winner);
            }
        } else {
            console.log('failed to go into sio-move: ', player, gameState.server_turn);
        }
    });

    // chat messages in lobby
    socket.on('sio-msgsFromClient', (lobbyId, message) => {
        socket.to(lobbyId).emit('sio-msgsFromServer', message);
    });

    socket.on('sio-reset', (lobbyId) => {
        init_player = init_player === 1 ? 2 : 1;
        lobbies[lobbyId] = {
            board: Array(9).fill(''),
            server_turn: init_player,
            completed: false
        };
        const gameState = lobbies[lobbyId];
        io.to(lobbyId).emit('sio-reset-server', gameState);
        io.to(lobbyId).emit('sio-log-messages', 'game restarted...');
    });

    socket.on('sio-quit', (lobbyId) => {
        socket.to(lobbyId).emit('sio-log-messages', 'player disconnected...');
        socket.disconnect();
    });

    // When the user disconnects, check if the lobby is empty
    socket.on('disconnect', () => {
        if (currentLobbyId) {
            const room = io.sockets.adapter.rooms.get(currentLobbyId);
            if (!room || room.size === 0) {
                // No users left in the lobby, delete it
                console.log(`sio: lobby ${currentLobbyId} is empty, deleting...`);
                delete lobbies[currentLobbyId];
            }
        }

        console.log('sio: a user has disconnected');
    });
});

app.use(handler);

server.listen(port, () => {
    console.log(`listening on port - ${port}`);
});