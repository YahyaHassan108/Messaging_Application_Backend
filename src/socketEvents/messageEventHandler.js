import { handleSocketEventError } from "../utils/socketEventErrorHandler.js";
import { saveMessage } from "../services/messageService.js";

/**
 * Event handler for message-related events.
 * @param {Object} io - Socket.IO server instance.
 * @param {Object} socket - Socket.IO socket instance.
 */
export const handleMessageEvents = (io, socket) => {

    // Send a new message
    socket.on('message:send', async (data) => {
        try {
            const { roomId, content } = data;

            // Call service to save the message and get the message details
            const message = await saveMessage(socket.user.uid, roomId, content);

            // Emit the message to all users in the room
            io.to(roomId).emit('message:send:success', message);
        } catch (error) {
            handleSocketEventError(io, socket, 'message:send', error, 'MESSAGE_SEND_ERROR');
        }
    });
};
