import { handleSocketEventError } from "../utils/socketEventErrorHandler.js";
import { createPrivateChat } from "../services/privateChatService.js";

/**
 * Event handler for private chat events.
 * @param {Object} io - Socket.IO server instance.
 * @param {Object} socket - Socket.IO socket instance.
 */
export const handlePrivateChatEvents = (io, socket) => {
    // Create a new private chat room
    socket.on('privateChat:create', async (data) => {
        try {
            // Extract data from the incoming request
            const { recipientId } = data; // The one the user want to start a chat with

            // Create private chat
            const privateChat = await createPrivateChat(socket.user.uid, recipientId)

            // Emit success response with the private chat details
            io.to(socket.id).emit('privateChat:create:success', privateChat);
        } catch (error) {
            handleSocketEventError(io, socket, 'privateChat:create', error, 'PRIVATE_CHAT_CREATE_ERROR');
        }
    });
}
