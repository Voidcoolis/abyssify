import TopBar from "@/components/TopBar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatPage = () => {
  const { user } = useUser(); // Get current user from Clerk authentication
  const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

  // Fetch all users when component mounts or user changes
  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  console.log({ messages });

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <TopBar /> {/* App header */}
      {/* Main chat layout - responsive grid */}
      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <UsersList /> {/* Left sidebar - user list */}
        {/* Right panel - chat messages */}
        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader /> {/* Chat header with user info */}
              {/* Messages */}
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {/* Map through messages */}
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex items-start gap-3 ${
                        // Align right if current user sent the message
                        message.senderId === user?.id ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={
                            message.senderId === user?.id
                              ? user.imageUrl // Current user's avatar
                              : selectedUser.imageUrl // Other user's avatar
                          }
                        />
                      </Avatar>

                      {/* Message bubble */}
                      <div
                        className={`rounded-lg p-3 max-w-[70%]
													${message.senderId === user?.id ? "bg-green-500" : "bg-zinc-800"}
												`}
                      >
                        {/* Message content */}
                        <p className="text-sm">{message.content}</p>
                         {/* Message timestamp */}
                        <span className="text-xs text-zinc-300 mt-1 block">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;

//* Placeholder component shown when no chat is selected
const NoConversationPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <img src="/abyssify.png" alt="Abyssify" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
  </div>
);
