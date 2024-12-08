import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import initializeSocketIO from "./socket.js";

dotenv.config();

// Create the HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the CORS configuration
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200'; // Frontend origin
const io = initializeSocketIO(server, allowedOrigin); // Export io for testing

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
    server.close(() => {
        console.log('Server shutting down gracefully.');
    });
}

// Export server and io for testing
export { server, io };
