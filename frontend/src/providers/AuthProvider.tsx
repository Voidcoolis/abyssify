import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

//* Helper function to update the Axios instance's authorization header
const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

//* AuthProvider component that wraps the application to handle authentication
const AuthProvider = ({children} : {children: React.ReactNode}) => {
  const { getToken, userId } = useAuth(); // Get the getToken function from Clerk's useAuth hook
  const [loading, setLoading] = useState(true);
  const {checkAdminStatus} = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    //* Initialize authentication by getting the current user's token
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token); // Update Axios headers with the token (or remove if none)

        //! if we have the token this check if the user is admin or not
        if (token) {
          await checkAdminStatus();

          // init socket
					if (userId) initSocket(userId);
        }

      } catch (error: any) {
        updateApiToken(null); // we know the user is not authentificated
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
    return () => disconnectSocket(); //cleanup
  }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]); // Dependency: Only re-run if getToken changes

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <div>{children}</div>; // Once auth is initialized, render the child components
};

export default AuthProvider;
