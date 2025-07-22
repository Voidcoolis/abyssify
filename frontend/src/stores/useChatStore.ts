import { axiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

// Define the shape of the chat store
interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: any;
	isConnected: boolean; // Socket connection status
	onlineUsers: Set<string>; // Set of online user IDs
	userActivities: Map<string, string>;
	messages: Message[];
  selectedUser: User | null; // Currently selected chat user

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void; // Set current chat user
}

// Determine base URL based on environment
  const baseURL ="http://localhost:5000";

  // Create socket instance with configuration
  const socket = io(baseURL, {
	autoConnect: false, // only connect if user is authenticated
	withCredentials: true,
});


// Create the Zustand store
export const useChatStore = create<ChatStore>((set, get) => ({
   // Initial state
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
  selectedUser: null,

   // Action: Set the currently selected user for chat
  setSelectedUser: (user) => set({ selectedUser: user }),

  //fetch all users
  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/users"); //the route is desplayed in the server.js/ user.route.js
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Action: Initialize socket connection
  initSocket: (userId) => {
		if (!get().isConnected) {
			socket.auth = { userId }; // Authenticate socket with user ID
			socket.connect();

			socket.emit("user_connected", userId); // Notify server about connection

      // Event: Receive list of online users
			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

      // Event: Receive all user activities
			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

      // Event: Handle new user connection
			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

      // Event: Handle user disconnection
			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

      // Event: Receive incoming message
			socket.on("receive_message", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

      // Event: Confirm message was sent
			socket.on("message_sent", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

       // Event: Update user activity status
			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},

   // Action: Disconnect socket
	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

  // Action: Send message through socket
	sendMessage: async (receiverId, senderId, content) => {
		const socket = get().socket;
		if (!socket) return;

		socket.emit("send_message", { receiverId, senderId, content });
	},

  // Action: Fetch message history from API
	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/users/messages/${userId}`);
			set({ messages: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
