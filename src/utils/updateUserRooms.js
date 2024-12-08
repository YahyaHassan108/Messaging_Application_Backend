import { db, FieldValue } from "../config/firebaseConfig.js";
import { handleServiceError } from "./serviceErrorHandler.js";

/**
 * Updates the user's rooms list by either adding or removing a room.
 * @param {string} userId - The ID of the user.
 * @param {string} roomId - The ID of the room to add or remove.
 * @param {string} action - The action to perform: "add" or "remove".
 * @returns {Promise<void>}
 */
export const updateUserRooms = async (userId, roomId, action) => {
    try {
        const userRef = db.collection("users").doc(userId);

        let updateOperation;
        if (action === "add") {
            updateOperation = {
                rooms: FieldValue.arrayUnion(roomId), // Add room ID
            };
        } else if (action === "remove") {
            updateOperation = {
                rooms: FieldValue.arrayRemove(roomId), // Remove room ID
            };
        } else {
            throw new Error("Invalid action. Use 'add' or 'remove'.");
        }

        // Use `set` with `merge: true` for add, or `update` for remove
        await userRef.set(updateOperation, { merge: true });
    } catch (error) {
        const errorType = action === "add" ? "USER_ROOM_ADD_ERROR" : "USER_ROOM_REMOVE_ERROR";
        handleServiceError(error, errorType);
    }
};
