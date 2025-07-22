import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";

// MessageInput component for sending new messages in the chat
const MessageInput = () => {
  const [newMessage, setNewMessage] = useState(""); // State for storing the new message input
  const { user } = useUser(); // Get current user data from Clerk
  const { selectedUser, sendMessage } = useChatStore();

  // Function to handle sending a new message
  const handleSend = () => {
    if (!selectedUser || !user || !newMessage) return; // Don't send if there's no selected user, no current user, or empty message
    sendMessage(selectedUser.clerkId, user.id, newMessage.trim()); // Send the message using chat store function
    setNewMessage(""); // Clear the input field after sending
  };

  return (
    // Container for the message input area with styling
    <div className="p-4 mt-auto border-t border-zinc-800">
      <div className="flex gap-2">
        {" "}
        {/* Flex container for input and send button */}
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)} // Update state on input change
          className="bg-zinc-800 border-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()} // Send on Enter key
        />
        <Button
          size={"icon"}
          onClick={handleSend}
          disabled={!newMessage.trim()} // Disable button if message is empty
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
};
export default MessageInput;
