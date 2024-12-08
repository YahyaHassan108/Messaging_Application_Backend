import { db, Timestamp } from "../config/firebaseConfig.js";
import { handleServiceError } from "../utils/serviceErrorHandler.js";
import { updateUserRooms } from "../utils/updateUserRooms.js";

/**
 * Creates a new group chat in the database.
 * @param {string} creatorId - The logged user ID
 * @param {Object} data - The recipient ID
 * @returns {Promise<Object>} - The created private chat data.
 */
export const createPrivateChat = async (creatorId, data) => {
    try {
        const { recipientId } = data;

        // Auto-generate a private chat ID
        const privateChatRef = db.collection('rooms').doc();

        // Define the private chat data
        const privateChatData = {
            type: 'private',
            createdAt: Timestamp.now(),
            members: [...new Set([creatorId, recipientId])],
        };

        await privateChatRef.set(privateChatData);

        // Add the private chat to the creator's rooms list
        await updateUserRooms(creatorId, privateChatRef.id, "add");

        // Add the private chat to the recipient's rooms list
        await updateUserRooms(recipientId, privateChatRef.id, "add");

        return { id: privateChatData.id, ...privateChatData};
    } catch (error) {
        return handleServiceError(error, "CREATE_PRIVATE_CHAT_ERROR");
    }
}