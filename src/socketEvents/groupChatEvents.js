import { handleSocketEventError } from "../utils/socketEventErrorHandler.js";
import { createGroupChat, addMemberToGroup, removeMemberFromGroup } from "../services/groupChatService.js";

/**
 * Event handler for group chat events.
 * @param {Object} io - Socket.IO server instance.
 * @param {Object} socket - Socket.IO socket instance.
 */
export const handleGroupChatEvents = (io, socket) => {
    // Create a new group
    socket.on('groupChat:create', async (data) => {
        try {
            // Extract data from the incoming request
            const { name, description, members } = data;

            // Validate required fields
            if (!name || typeof name !== 'string') {
                throw new Error('Invalid or missing group name');
            }

            // Ensure members is an array if provided
            if (members && !Array.isArray(members)) {
                throw new Error('Members should be an array');
            }

            // Create the group chat
            const group = await createGroupChat(socket.user.uid, {
                name,
                description: description || '',
                members: members || [], // Default to an empty array if not provided
            });

            // Emit success response with the group details
            io.to(socket.id).emit('groupChat:create:success', group);
        } catch (error) {
            handleSocketEventError(io, socket, 'groupChat:create', error, 'GROUP_CHAT_CREATE_ERROR');
        }
    });

    // Add a member to an existing group
    socket.on('groupChat:addMember', async (data) => {
        try {
            // Extract groupId and memberId
            const { groupId, memberId } = data;

            // Validate required fields
            if (!groupId || typeof groupId !== 'string') {
                throw new Error('Invalid or missing group ID');
            }
            if (!memberId || typeof memberId !== 'string') {
                throw new Error('Invalid or missing member ID');
            }

            // Add the member to the group
            const updatedGroup = await addMemberToGroup(groupId, memberId);

            // Emit success response with updated group details
            io.to(socket.id).emit('groupChat:addMember:success', updatedGroup);
        } catch (error) {
            handleSocketEventError(io, socket, 'groupChat:addMember', error, 'GROUP_CHAT_ADD_MEMBER_ERROR');
        }
    });

    // Remove a member from an existing group
    socket.on('groupChat:removeMember', async (data) => {
        try {
            // Extract groupId and memberId
            const { groupId, memberId } = data;

            // Validate required fields
            if (!groupId || typeof groupId !== 'string') {
                throw new Error('Invalid or missing group ID');
            }
            if (!memberId || typeof memberId !== 'string') {
                throw new Error('Invalid or missing member ID');
            }

            // Remove the member from the group
            const updatedGroup = await removeMemberFromGroup(groupId, memberId);

            // Emit success response with updated group details
            io.to(socket.id).emit('groupChat:removeMember:success', updatedGroup);
        } catch (error) {
            handleSocketEventError(io, socket, 'groupChat:removeMember', error, 'GROUP_CHAT_REMOVE_MEMBER_ERROR');
        }
    });

    // Update the group details (e.g., name, description)

    // socket.on('groupChat:updateDetails', async (data) => {
    //     try {
    //         // Extract groupId, name, and description
    //         const { groupId, name, description } = data;
    //
    //         // Validate required fields
    //         if (!groupId || typeof groupId !== 'string') {
    //             throw new Error('Invalid or missing group ID');
    //         }
    //         if (name && typeof name !== 'string') {
    //             throw new Error('Invalid group name');
    //         }
    //         if (description && typeof description !== 'string') {
    //             throw new Error('Invalid group description');
    //         }
    //
    //         // Update the group details
    //         const updatedGroup = await updateGroupDetails(groupId, { name, description });
    //
    //         // Emit success response with updated group details
    //         io.to(socket.id).emit('groupChat:updateDetails:success', updatedGroup);
    //     } catch (error) {
    //         handleSocketEventError(io, socket, 'groupChat:updateDetails', error, 'GROUP_CHAT_UPDATE_DETAILS_ERROR');
    //     }
    // });
};
