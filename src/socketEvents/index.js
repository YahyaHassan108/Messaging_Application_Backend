import { handleUserEvents } from "./userEvents.js";
import { handlePrivateChatEvents } from "./privateChatEventHandler.js";
import { handleGroupChatEvents } from "./groupChatEvents.js";
import { handleMessageEvents } from "./messageEventHandler.js";
import { handleRoomEvents } from "./roomEventHandler.js";

export default function socketEvents (io, socket) {
    handleUserEvents(io, socket);
    handlePrivateChatEvents(io, socket);
    handleGroupChatEvents(io, socket);
    handleMessageEvents(io, socket);
    handleRoomEvents(io, socket);
}