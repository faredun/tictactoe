import { sveltekit } from '@sveltejs/kit/vite';
import { type ViteDevServer, defineConfig } from 'vite';

import { Server } from 'socket.io';

// const player_name = 'hi';

const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server: ViteDevServer) {
        if (!server.httpServer) return;

        const io = new Server(server.httpServer);

        const lobbies: { [key: string]: { board: string[]; server_turn: number } } = {};

        function checkWinner(board: string[]) {
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
                    return board[a]; // Return 'X' or 'O' as the winner
                }
            }

            // Check for a tie (no empty cells)
            if (board.every((cell: string) => cell !== '')) {
                return 'tie';
            }

            return null; // No winner or tie yet
        }

        // connected when user visits page
        io.on('connection', (socket) => {
            console.log('sio: a user has connected ');

            // create lobby
            socket.on('sio-createLobby', (lobbyId: string) => {
                // init lobbies

                console.log('sio: lobby created ', lobbyId);

                socket.on('disconnect', () => {
                    console.log('sio: lobby creator disconnected');
                });
            });

            // check lobby
            socket.on('sio-checkLobby', (lobbyId, callback) => {
                // if (lobbies.includes(lobbyId)) callback(true);
                // else callback(false);

                const room = io.sockets.adapter.rooms.get(lobbyId);
                console.log(room);
                if (room && room.size === 1) {
                    callback({ success: true });
                } else if (room && room.size === 2) {
                    callback({ success: false, message: 'Lobby is full' });
                } else {
                    callback({ success: false, message: 'Lobby does not exist' });
                }
            });

            // join lobby
            socket.on('sio-joinLobby', (lobbyId, callback) => {
                socket.join(lobbyId);
                const room = io.sockets.adapter.rooms.get(lobbyId);
                console.log(`sio: user joined lobby: ${lobbyId}`);
                if (room && room.size === 1) {
                    lobbies[lobbyId] = {
                        board: Array(9).fill(''),
                        server_turn: 1 // 1 is creator
                    };
                }

                callback({ gameState: lobbies[lobbyId] });
                // Optionally, notify users in the lobby that a new user has joined
                socket.to(lobbyId).emit('sio-userJoined', 'a new user has joined the lobby.');
            });

            // make move
            socket.on('sio-move', (lobbyId, { index, player }) => {
                const gameState = lobbies[lobbyId];
                // Ensure game state exists and game isn't already over
                if (
                    gameState &&
                    gameState.board[index] === '' &&
                    gameState.server_turn === player
                ) {
                    gameState.board[index] = player === 1 ? 'X' : 'O';
                    gameState.server_turn = player === 1 ? 2 : 1;

                    console.log('reached here');
                    // Check if there is a winner or if the game is a tie
                    const winner = checkWinner(gameState.board);
                    if (winner) {
                        // Emit game-over event to both players
                        io.to(lobbyId).emit('game-over', { winner, board: gameState.board });

                        // Clear lobby to prevent further moves
                        delete lobbies[lobbyId];
                    } else {
                        // Broadcast the updated game state to both players
                        io.to(lobbyId).emit('sio-move', gameState);
                    }
                }
            });

            // chat messages in lobby
            socket.on('sio-msgsFromClient', (lobbyId, message) => {
                console.log(' message "', message, '" sent in lobby: ', lobbyId);

                socket.to(lobbyId).emit('sio-msgsFromServer', message);
            });

            // connection disconnected
            socket.on('disconnect', () => {
                console.log('sio: a user has disconnected');
            });
        });
    }
};

export default defineConfig({
    plugins: [sveltekit(), webSocketServer]
});
