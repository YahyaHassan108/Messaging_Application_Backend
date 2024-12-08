import { db } from "../config/firebaseConfig.js";
import { handleServiceError } from "../utils/serviceErrorHandler.js";

/**
 * Fetches the rooms a user is part of from Firestore.
 * @param {string} userId - The unique identifier for the user.
 * @returns {Promise<Array>} - A list of room IDs the user is part of.
 */
export const getUserRooms = async (userId) => {
    try {
        // Fetch user document from Firestore based on the provided userId.
        const userDoc = await db.collection('users').doc(userId).get();

        // If the user document doesn't exist, throw an error.
        if (!userDoc.exists) {
            throw new Error("User not found");
        }

        // Extract the room data from the user document and return it.
        const userData = userDoc.data();
        return userData.rooms || []; // Default to an empty array if no rooms are found.
    } catch (error) {
        // Use the error handling service to manage errors.
        handleServiceError(error, 'USER_ROOMS_FETCH_ERROR');
    }
};

/**
 * Fetches metadata for a specific room from Firestore.
 * @param {string} roomId - The unique identifier for the room.
 * @returns {Promise<Object>} - The metadata for the room (e.g., name, description).
 */
export const fetchRoomMetadata = async (roomId) => {
    try {
        // Fetch room document from Firestore based on the roomId.
        const roomDoc = await db.collection('rooms').doc(roomId).get();

        // If the room document doesn't exist, throw an error.
        if (!roomDoc.exists) {
            throw new Error(`Room with ID ${roomId} not found`);
        }

        // Return the room metadata as an object.
        return roomDoc.data();
    } catch (error) {
        // Use the error handling service to manage errors.
        handleServiceError(error, 'ROOM_METADATA_FETCH_ERROR');
    }
};

/**
 * Fetches metadata for multiple rooms in parallel.
 * @param {Array} roomIds - A list of room IDs to fetch metadata for.
 * @returns {Promise<Array>} - A list of metadata for each room.
 */
export const fetchRoomsMetadata = async (roomIds) => {
    try {
        // Map through the roomIds array and fetch metadata for each room in parallel.
        const roomMetadataPromises = roomIds.map(roomId => fetchRoomMetadata(roomId));

        // Wait for all metadata fetching promises to resolve and return the results.
        return await Promise.all(roomMetadataPromises);
    } catch (error) {
        // Use the error handling service to manage errors.
        handleServiceError(error, 'ROOMS_METADATA_FETCH_ERROR');
    }
};

/**
 * Fetches the room history (messages) from the database.
 * @param {string} roomId - The unique identifier for the room.
 * @returns {Promise<Array>} - A list of messages for the room.
 */
export const fetchRoomHistory = async (roomId) => {
    try {
        // Fetch all messages for the room from the 'messages' subcollection.
        const messagesSnapshot = await db.collection('rooms')
            .doc(roomId)
            .collection('messages')
            .orderBy('timestamp')  // Sort messages by timestamp in ascending order.
            .get();  // Fetch all messages from the room.

        // Map through the fetched documents and structure the data into a usable format.
        const messages = messagesSnapshot.docs.map(doc => ({
            id: doc.id,  // Include the document ID (message ID).
            ...doc.data()  // Spread the message data (content, senderId, timestamp, etc.).
        }));

        // Return the list of messages.
        return messages;
    } catch (error) {
        // Use the error handling service to manage errors.
        return handleServiceError(error, 'ROOM_HISTORY_FETCH_ERROR');
    }
};
