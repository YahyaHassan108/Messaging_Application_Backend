import { fetchRoomHistory, fetchRoomsMetadata, getUserRooms } from "../services/roomService.js";
import { handleSocketEventError } from "../utils/socketEventErrorHandler.js";

export const handleRoomEvents = (io, socket) => {
    // Fetch room list with metadata
    socket.on('room:list:fetch', async (data) => {
        try {
            // 1. Get the list of room IDs the user is in (from Firestore).
            const userRooms = await getUserRooms(socket.uid); // Fetch room IDs from Firestore.

            if (!userRooms || userRooms.length === 0) {
                return io.to(socket.id).emit('room:list:fetch:success', []); // No rooms found.
            }

            // 2. Fetch metadata for each room.
            const roomsMetadata = await fetchRoomsMetadata(userRooms); // Fetch metadata for all rooms in parallel.

            // 3. Send back the list of room metadata to the frontend.
            io.to(socket.id).emit('room:list:fetch:success', roomsMetadata);
        } catch (error) {
            handleSocketEventError(io, socket, 'room:list:fetch', error, 'ROOM_LIST_FETCH_ERROR');
        }
    })

    // Fetch room history
    socket.on('room:history:fetch', async (roomId) => {
        try {
            // Fetch room history (all messages in the room)
            const history = await fetchRoomHistory(roomId);

            // Send back the history to the frontend
            io.to(socket.id).emit('room:history:fetch:success', history); // maybe add the room id in case of a race condition (user switch too fast)
        } catch (error) {
            handleSocketEventError(io, socket, 'room:history:fetch', error, 'ROOM_HISTORY_FETCH_ERROR');
        }
    });
}