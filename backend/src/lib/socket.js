import { Server } from "socket.io";
import {Message} from  "../models/message.model.js";

//! Reminder: For more info on Socket.IO look at notes.md
export const initializeSocket = (server) => {
    // Create Socket.io server instance with CORS configuration
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });

    // keeps track of Online status
    const userSockets = new Map(); // { userId: socketId}
	const userActivities = new Map(); // {userId: activity}

     // Handle new socket connections
    io.on("connection", (socket) => {
        socket.on("user_connected", (userId) => {
            // Store user's socket ID and set initial activity
            userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			io.emit("user_connected", userId); // Notify all clients about the new connection(that this user just logged in)

            socket.emit("users_online", Array.from(userSockets.keys()));  // Send list of online users to the newly connected user

			io.emit("activities", Array.from(userActivities.entries()));  // Broadcast all user activities
        });

        // Handle activity updates from users
        socket.on("update_activity", ({ userId, activity }) => {
			console.log("activity updated", userId, activity);
			userActivities.set(userId, activity);  // Update user's activity status
			io.emit("activity_updated", { userId, activity });  // Broadcast the update to all clients
		});

        // Handle sending messages between users
        socket.on("send_message", async (data) => {
			try {
				const { senderId, receiverId, content } = data;

                // Save message to database
				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				// send to receiver in realtime, if they're online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				socket.emit("message_sent", message);  // Confirm message was sent to sender
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

        //  Handle socket disconnection
        socket.on("disconnect", () => {
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				
                // Find which user disconnected
				if (socketId === socket.id) {
					disconnectedUserId = userId;
                     // Clean up user tracking
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
             // Notify all clients if a known user disconnected
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
    });

}