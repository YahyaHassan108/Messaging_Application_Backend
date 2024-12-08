import { db, Timestamp } from "../config/firebaseConfig.js";
import { handleServiceError } from "../utils/serviceErrorHandler.js";

/**
 * Saves a new message in a room and returns the created message.
 * @param {string} senderId - The ID of the sender.
 * @param {string} roomId - The ID of the room where the message is sent.
 * @param {string} content - The message content.
 * @returns {Promise<Object>} - The created message object.
 */
export const saveMessage = async (senderId, roomId, content) => {
    try {
        const roomRef = db.collection('rooms').doc(roomId);

        // Fetch the room document to check if the sender is a member
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
            throw new Error("Room not found");
        }

        const roomData = roomDoc.data();

        // Check if the sender is a member of the room
        if (!roomData.members.includes(senderId)) {
            throw new Error("Sender is not a member of the room");
        }

        // Create the message object
        const message = {
            senderId,
            content,
            timestamp: Timestamp.now(),
        };

        // Save the message in the subCollection of the room
        const messageRef = await roomRef.collection('messages').add(message);

        // Add the message to the room's last message (optional optimization)
        await roomRef.update({
            lastMessage: {
                content,
                timestamp: Timestamp.now(),
                senderId,
            },
        });

        // Return the created message (including the auto-generated ID)
        return { ...message, id: messageRef.id };
    } catch (error) {
        return handleServiceError(error, 'MESSAGE_SAVE_ERROR');
    }
};

