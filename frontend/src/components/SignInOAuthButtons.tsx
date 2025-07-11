import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
	const { signIn, isLoaded } = useSignIn();

	 // If Clerk isn't ready, don't render anything (avoid errors)
	if (!isLoaded) {
		return null;
	}

	// Handles Google OAuth sign-in flow & Uses Clerk's redirect-based authentication
	const signInWithGoogle = () => {
		signIn.authenticateWithRedirect({
			strategy: "oauth_google", // Specify Google OAuth
			redirectUrl: "/sso-callback", // Where users go DURING auth
			redirectUrlComplete: "/auth-callback", // Where users land AFTER auth(save to db)
		});
	};

	return (
		<Button onClick={signInWithGoogle} variant={"secondary"} className='w-full text-white border-zinc-200 h-11'>
			<img src='/google.png' alt='Google' className='size-5' />
			Continue with Google
		</Button>
	);
};
export default SignInOAuthButtons;
