import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";

const UsersList = () => {
  const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } =
    useChatStore();

  return (
    <div className="border-r border-zinc-800">
      {" "}
      {/* Right border */}
      <div className="flex flex-col h-full">
        {" "}
        {/* Full height container */}
        <ScrollArea className="h-[calc(100vh-280px)]">
          {" "}
          {/* Scrollable area for user list */}
          <div className="space-y-2 p-4">
            {isLoading ? (
              <UsersListSkeleton />
            ) : (
              // Map through users when data is loaded
              users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center justify-center lg:justify-start gap-3 p-3 
										rounded-lg cursor-pointer transition-colors
                    ${
                      selectedUser?.clerkId === user.clerkId
                        ? "bg-zinc-800" // Selected state
                        : "hover:bg-zinc-800/50" // Hover state
                    }`}
                >
                  <div className="relative">
                    <Avatar className="size-8 md:size-12">
                      {" "}
                      {/* Responsive sizing */}
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>

                    {/* Online status indicator */}
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
                        ${
                          onlineUsers.has(user.clerkId)
                            ? "bg-green-500"
                            : "bg-zinc-500"
                        }`}
                    />
                  </div>

                  {/* User name (hidden on mobile) */}
                  <div className="flex-1 min-w-0 lg:block hidden">
                    <span className="font-medium truncate">
                      {" "}
                      {/* Truncate long names */}
                      {user.fullName}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UsersList;
