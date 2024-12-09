const userSocketMap = new Map();

/**
 * Map a user ID to a socket ID
 * @param {string} userId - The user ID
 * @param {string} socketId - The socket ID
 */
export const mapUserToSocket = (userId, socketId) => {
    userSocketMap.set(userId, socketId);
};

/**
 * Remove a user ID from the mapping based on the socket ID
 * @param {string} socketId - The socket ID
 */
export const removeUserFromMap = (socketId) => {
    for (const [userId, mappedSocketId] of userSocketMap.entries()) {
        if (mappedSocketId === socketId) {
            userSocketMap.delete(userId);
            break;
        }
    }
};

/**
 * Get the socket ID for a given user ID
 * @param {string} userId - The user ID
 * @returns {string|null} - The socket ID or null if not found
 */
export const getSocketIdForUser = (userId) => {
    return userSocketMap.get(userId) || null;
};

export default userSocketMap;
