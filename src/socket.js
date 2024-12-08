import { Server } from "socket.io";
import socketEvents from "./socketEvents/index.js"; // Import all socket event handlers from the index
import { verifySocketToken } from "./middlewares/verifyToken.js";
import userSocketMap from "./utils/userSocketMap.js";
/**
 * Initialize and configure Socket.IO
 * @param {http.Server} server - The HTTP server instance
 * @param {string} allowedOrigin - The frontend origin URL (to be used for CORS)
 * @returns {Server} - Returns the initialized Socket.IO server
 */
const initializeSocketIO = (server, allowedOrigin) => {
    const io = new Server(server, {
        cors: {
            origin: allowedOrigin, // Allows WebSocket connections only from the frontend
            methods: ['GET', 'POST'], // Allow specific methods during the WebSocket handshake
            credentials: true // Allow credentials such as cookies or authorization headers
        }
    });

    // Apply the token verification middleware for every incoming WebSocket connection
    io.use(verifySocketToken);  // This will check the token on each new connection

    // Socket.IO connection handler
    io.on('connection', (socket) => {
        const userId = socket.user.uid;

        // Map the userId to the socket.id
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} mapped to socket ID ${socket.id}`);

        // Call all event handlers here
        socketEvents(io, socket);

        // Event for user disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            // Clean up userSocketMap here, if needed
            for (const [key, value] of userSocketMap.entries()) {
                if (value === socket.id) {
                    userSocketMap.delete(key);
                    break;
                }
            }
        });
    });

    return io;
};

export default initializeSocketIO;
