import express from 'express'
import { Server } from 'socket.io'
import {createServer} from 'node:http'
import cors from 'cors'

const PORT = 3000
const app = express()
const server = createServer(app)

// Habilitar CORS
app.use(cors())

const io = new Server(server, {
    cors: {
        origin: "*", // Permitir todos los orígenes
        methods: ["GET", "POST"], // Métodos permitidos
    }
});


const rooms = {};
let turn = null;

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.emit('salasDisponibles', Object.keys(rooms));

    // El cliente solicita unirse a una sala
    socket.on('joinRoom', (roomId) => {
        if (!rooms[roomId]) {
            // roomId = '1111'
            // Crear una nueva sala si no existe

            rooms[roomId] = {
                players: [],
            };
        }

        const room = rooms[roomId];
        if (room.players.length < 2) {
            let playerId;
            if (room.players.length === 0) {
                playerId = 1;
                turn = playerId
            } else {
                playerId = 2;
            }

            socket.join(roomId);
            room.players.push({ id: playerId, socketId: socket.id });
            console.log(`Jugador ${socket.id} (ID ${playerId}) se unió a la sala ${roomId} ${room.players.length}`);

            // Notificar al cliente que se ha unido a la sala y enviar su ID
            socket.emit('roomJoined', { roomId, playerId, turn });
        } else {
            // Si la sala está llena, rechazar la solicitud
            socket.emit('roomFull');
        }

        if (room.players.length === 2) {
            io.to(roomId).emit('roomFull2', {'full': true});
        }
    });

    // Manejar movimiento de fichas dentro de la sala
    socket.on('move', (data) => {
        // Aquí iría la lógica para manejar el movimiento de fichas
        console.log('Movimiento recibido:', data);
        if (turn === 1) {
            turn = 2
            const resultBoard = Array(64).fill(0)            
            const lenArr = data.board.length

            const won = data.board.indexOf(2)

            if (won === -1) {
                const currentRoom = rooms[data.room]
                const me = currentRoom.players.find(player => player.id === data.player)
                io.to(data.room).emit('won', {'winner': data.player})
            }

            for(let e in data.board) {
                resultBoard[lenArr - e - 1] = data.board[e]
                if (data.board[e] === 1) {
                    resultBoard[lenArr - e - 1] = 2
                } else if (data.board[e] === 2){
                    resultBoard[lenArr - e - 1] = 1
                } else if (data.board[e] === 2.5) {
                    resultBoard[lenArr - e - 1] = 1.5
                } else if (data.board[e] === 2.5) {
                    resultBoard[lenArr - e - 1] = 2.5
                }
            }
            
            const resultData = {'board': resultBoard, 'turn': turn}
            const currentRoom = rooms[data.room]
            const otherPlayer = currentRoom.players.find(player => player.id !== data.player)
            
            // Emitir el movimiento a todos los clientes en la misma sala
            io.to(otherPlayer.socketId).emit('move', resultData);
        } else {
            turn = 1
            const resultBoard = Array(64).fill(0)          
            const lenArr = data.board.length

            const won = data.board.indexOf(2)

            if (won === -1) {
                const currentRoom = rooms[data.room]
                const me = currentRoom.players.find(player => player.id === data.player)
                io.to(data.room).emit('won', {'winner': data.player})
            }

            for(let e in data.board) {
                resultBoard[lenArr - e - 1] = data.board[e]
                if (data.board[e] === 1) {
                    resultBoard[lenArr - e - 1] = 2
                } else if (data.board[e] === 2){
                    resultBoard[lenArr - e - 1] = 1
                }
            }
            
            const resultData = {'board': resultBoard, 'turn': turn}
            const currentRoom = rooms[data.room]
            const otherPlayer = currentRoom.players.find(player => player.id !== data.player)
            
            // Emitir el movimiento a todos los clientes en la misma sala
            io.to(otherPlayer.socketId).emit('move', resultData);
        } 
        // io.to(data.room).emit('move', {'board': data.board, 'turn': turn});
    });

    // Manejar desconexiones de sockets
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');

        // Eliminar al jugador de la sala al desconectarse
        for (const roomId in rooms) {
            const room = rooms[roomId];
            const index = room.players.findIndex(player => player.socketId === socket.id);
            if (index !== -1) {
                const player = room.players[index];
                console.log(`Jugador ${socket.id} (ID ${player.id}) salió de la sala ${roomId}`);
                room.players.splice(index, 1);
                break;
            }
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(PORT, () => {
    console.log('Server listen on PORT: ', PORT)
})