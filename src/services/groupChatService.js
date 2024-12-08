import { db, FieldValue, Timestamp } from "../config/firebaseConfig.js";
import { handleServiceError } from "../utils/serviceErrorHandler.js";
import { updateUserRooms } from "../utils/updateUserRooms.js";

/**
 * Creates a new group chat in the database.
 * @param {string} creatorId - The user ID of the group creator.
 * @param {Object} data - Group details like name, description, and members.
 * @returns {Promise<Object>} - The created group data.
 */
export const createGroupChat = async (creatorId, data) => {
    try {
        const { name, description, members = [] } = data;

        // Auto-generate a group ID
        const groupRef = db.collection('rooms').doc();

        // Define the group data
        const groupData = {
            type: 'group',
            name,
            description: description || '',
            admin: creatorId,
            createdAt: Timestamp.now(),
            members: [...new Set([creatorId, ...members])],
        };

        // Save the group data to the database
        await groupRef.set(groupData);

        // Add the group to the creator's rooms list
        await updateUserRooms(creatorId, groupRef.id, "add");

        // Update each member's rooms list
        for (const memberId of groupData.members) {
            if (memberId !== creatorId) { // Avoid adding the creator twice
                await updateUserRooms(memberId, groupRef.id, "add");
            }
        }

        return { id: groupRef.id, ...groupData };
    } catch (error) {
        return handleServiceError(error, "CREATE_GROUP_CHAT_ERROR");
    }
};

/**
 * Adds a member to a group and updates the user's rooms list.
 * @param {string} groupId - The ID of the group.
 * @param {string} memberId - The ID of the member to add.
 * @returns {Promise<Object>} - The updated group data.
 */
export const addMemberToGroup = async (groupId, memberId) => {
    try {
        const groupRef = db.collection('rooms').doc(groupId);
        const groupDoc = await groupRef.get();

        if (!groupDoc.exists) {
            throw new Error("Group not found");
        }

        const groupData = groupDoc.data();
        if (groupData.members.includes(memberId)) {
            throw new Error("Member already in group");
        }

        // Add the new member to the group's members list
        await groupRef.update({
            members: FieldValue.arrayUnion(memberId),
        });

        // Add the group to the member's rooms list
        await updateUserRooms(memberId, groupId, "add");

        // Return the updated group data directly
        return { id: groupId, ...groupData, members: [...groupData.members, memberId] };
    } catch (error) {
        return handleServiceError(error, "ADD_MEMBER_TO_GROUP_ERROR");
    }
};

/**
 * Removes a member from a group and updates the user's rooms list.
 * @param {string} groupId - The ID of the group.
 * @param {string} memberId - The ID of the member to remove.
 * @returns {Promise<Object>} - The updated group data.
 */
export const removeMemberFromGroup = async (groupId, memberId) => {
    try {
        const groupRef = db.collection('rooms').doc(groupId);
        const groupDoc = await groupRef.get();

        if (!groupDoc.exists) {
            throw new Error("Group not found");
        }

        const groupData = groupDoc.data();
        if (!groupData.members.includes(memberId)) {
            throw new Error("Member not in group");
        }

        // Remove the member from the group's members list
        await groupRef.update({
            members: FieldValue.arrayRemove(memberId),
        });

        // Remove the group from the member's rooms list
        await updateUserRooms(memberId, groupId, "remove");

        // Return the updated group data directly
        return { id: groupId, ...groupData, members: groupData.members.filter(id => id !== memberId) };
    } catch (error) {
        return handleServiceError(error, "REMOVE_MEMBER_FROM_GROUP_ERROR");
    }
};

/**
 * Updates the details of a group.
 * @param {string} groupId - The ID of the group.
 * @param {Object} data - Fields to update (e.g., name, description).
 * @returns {Promise<Object>} - The updated group data.
 */
// export const updateGroupDetails = async (groupId, data) => {
//     try {
//         const groupRef = db.collection('rooms').doc(groupId);
//         const groupDoc = await groupRef.get();
//
//         if (!groupDoc.exists) {
//             throw new Error("Group not found");
//         }
//
//         // Update the group details
//         await groupRef.update(data);
//
//         // Fetch and return the updated group data directly
//         const updatedGroupDoc = await groupRef.get();
//         const updatedGroupData = updatedGroupDoc.data();
//
//         return { id: groupId, ...updatedGroupData };
//     } catch (error) {
//         return handleServiceError(error, "UPDATE_GROUP_DETAILS_ERROR");
//     }
// };
