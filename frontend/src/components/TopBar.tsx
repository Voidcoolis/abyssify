import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const TopBar = () => {
    // Check if current user is an admin via Zustand store
    const {isAdmin} = useAuthStore();
    console.log({ isAdmin });

  return (
    <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10'>
        <div className='flex gap-2 items-center'>
            <img src="/abyssify.png" className="size-8" alt="Abyssify logo" />
            Abyssify
        </div>

        <div className='flex items-center gap-4'>
            {/* Conditionally show Admin Dashboard link if user is admin */}
            {isAdmin && (
                <Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
                    <LayoutDashboardIcon className='size-4  mr-2' />
                    Admin Dashboard
                </Link>
            )}

             {/* Show Google sign-in button ONLY when user is signed out */}
            <SignedOut>
                <SignInOAuthButtons/>
            </SignedOut>
            {/* Clerk's user profile dropdown (shown when signed in) */}
            <UserButton />
        </div>
    </div>
  )
}

export default TopBar