/**
 * Handles errors for socket events.
 * @param {Object} io - Socket.IO server instance
 * @param {Object} socket - Socket.IO socket instance
 * @param {string} eventName - Name of the event that caused the error
 * @param {Error} error - The error object
 * @param {string} errorCode - A predefined error code
 */
export const handleSocketEventError = (io, socket, eventName, error, errorCode) => {
    // Log the error with stack trace and event name for better debugging
    console.error(`Error in event '${eventName}' for socket ID '${socket.id}':`, error.message);
    // console.error(error.stack);

    // Emit an error response with detailed information
    io.to(socket.id).emit(`${eventName}:error`, {
        code: errorCode,
        message: error.message || `An unexpected error occurred during the '${eventName}' event.`,
    });
};
