import { Card, CardContent } from "@/components/ui/card"
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react"
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser(); // Get user data and loading state from Clerk
	const navigate = useNavigate();
	const syncAttempted = useRef(false);  // Ref to track if sync has been attempted (prevents duplicate calls)

  useEffect(() => {
    //* Syncs user data with the backend after successful authentication
		const syncUser = async () => {
			if (!isLoaded || !user || syncAttempted.current) return;

			try {
				syncAttempted.current = true; // Mark sync as attempted to prevent duplicate calls

         // Send user data to backend
				await axiosInstance.post("/auth/callback", {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					imageUrl: user.imageUrl,
				});
			} catch (error) {
				console.log("Error in auth callback", error);
			} finally {
				navigate("/"); // Always redirect to home page after sync (success or failure)
			}
		};

		syncUser();
	}, [isLoaded, user, navigate]); // Dependencies: re-run if these change

  return (
    <div className='h-screen w-full bg-black flex items-center justify-center'>
      {/* card component from shadcn --> container for loading message */}
      <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
        <CardContent className='flex flex-col items-center gap-4 pt-6'>
          <Loader className='size-6 text-emerald-500 animate-spin'/>
          {/* Loading message */}
          <h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
					<p className='text-zinc-400 text-sm'>Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallbackPage