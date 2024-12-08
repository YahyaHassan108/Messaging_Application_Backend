import { handleSocketEventError } from "../utils/socketEventErrorHandler.js";
import { getUserProfile, updateUserProfile } from "../services/userService.js";

/**
 * Helper function to validate username and description
 * @param {string} username - The username to validate.
 * @param {string} description - The description to validate.
 */
const validateProfileData = (username, description) => {
    if (!username || typeof username !== 'string') {
        throw new Error('Invalid or missing username');
    }
    if (description && typeof description !== 'string') {
        throw new Error('Invalid description');
    }
};

/**
 * Event handler for user events.
 * @param {Object} io - Socket.IO server instance
 * @param {Object} socket - Socket.IO socket instance
 */
export const handleUserEvents = (io, socket) => {
    // Get user profile
    socket.on('profile:get', async () => {
        try {
            const userProfile = await getUserProfile(socket.user.uid);
            io.to(socket.id).emit('profile:get:success', userProfile);
        } catch (error) {
            handleSocketEventError(io, socket, 'profile:get', error, 'PROFILE_GET_ERROR');
        }
    });

    // Create or update user profile
    socket.on('profile:update', async (data) => {
        try {
            const { username, description } = data;

            // If username is not provided, use email to create a default username
            const initialUsername = username || socket.user.email.split('@')[0]; // Use email prefix as default

            // Validate the username and description
            validateProfileData(initialUsername, description);

            // Pass the initial values to create or update the user profile
            const profile = await updateUserProfile(socket.user.uid, {
                username: initialUsername,
                email: socket.user.email,
                description: description || '', // Default empty string if description not provided
            });

            // Emit success response with the created or updated profile
            io.to(socket.id).emit('profile:update:success', profile);
        } catch (error) {
            handleSocketEventError(io, socket, 'profile:update', error, 'PROFILE_UPDATE_ERROR');
        }
    });
};
