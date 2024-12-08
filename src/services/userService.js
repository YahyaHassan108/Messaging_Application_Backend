import { db, Timestamp } from "../config/firebaseConfig.js";
import { handleServiceError } from "../utils/serviceErrorHandler.js";

/**
 * Fetches the user profile from the database.
 * @param {string} userId - The unique identifier for the user.
 * @returns {Promise<Object>} - The user profile data.
 */
export const getUserProfile = async (userId) => {
    try {
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();

        if (!doc.exists) {
            throw new Error('User not found');
        }

        return doc.data(); // Return the user profile data
    } catch (error) {
        return handleServiceError(error, 'USER_PROFILE_FETCH_ERROR');
    }
};

/**
 * Creates or updates the user profile in the database.
 * @param {string} userId - The unique identifier for the user.
 * @param {Object} data - The data to create or update the profile.
 * @returns {Promise<Object>} - The created or updated profile data.
 */
export const updateUserProfile = async (userId, data) => {
    try {
        const userRef = db.collection('users').doc(userId);

        // Check if the user profile already exists
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            // If the profile exists, update it with the new data
            await userRef.set(data, { merge: true });
            const updatedProfile = await userRef.get();
            return updatedProfile.data(); // Return the updated profile
        } else {
            // If the profile does not exist, create it with the provided data
            const defaultProfile = {
                username: '',
                email: '',
                description: '',
                lastSeen: Timestamp.now(),
                status: 'offline',
                rooms: [],
                friends: [],
                createdAt: Timestamp.now(),
            };

            // Combine the default values with the provided data
            const profileData = { ...defaultProfile, ...data };

            // Create the document (merge to avoid overwriting)
            await userRef.set(profileData, { merge: true });

            return profileData; // Return the newly created profile data
        }
    } catch (error) {
        return handleServiceError(error, 'USER_PROFILE_CREATE_OR_UPDATE_ERROR');
    }
};
