import { clerkClient } from "@clerk/express";

// Middleware to protect routes: only allows access if user is authenticated
export const protectRoute = async (req, res, next) => {
  // Check if the request has a valid authenticated user
  if (!req.auth.userId) {
    return res.status(401).json({ message: "Unauthorized - you must be logged in" });
  }
  next(); // If authenticated, proceed to the next middleware or route handler
};

// Middleware to require admin privileges: only allows access if user is admin
export const requireAdmin = async (req, res, next) => {
  try {
    // Fetch the current user from Clerk using the user ID from the request
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    // Check if the user's primary email matches the admin email from environment variables
    const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized - you must be an admin" });
    }

    next(); // If user is admin, proceed to the next function
  } catch (error) {
    next(error); // If an error occurs (e.g., user not found), pass the error to the error handler
  }
};
