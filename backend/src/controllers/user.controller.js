import { User } from "../models/user.model.js";

//* Controller to get all users except the currently logged-in user
export const getAllUsers = async (req, res, next) => {
try {
// Extract the current user's ID from the authenticated request set by the protectRoute middleware
    const currentUserId = req.auth.userId;
   
    // Find all users in the database EXCEPT the current user
    //! $ne means "not equal" in MongoDB query language
    const users = await User.find({clerkId:{ $ne: currentUserId }})
    res.status(200).json(users);
} catch (error) {
    next(error);
}
}

/**
 * Controller to get messages between two specific users
 * @param {Object} req - Express request object (contains params and auth info)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getMessages = async (req, res, next) => {
	try {
         // Extract IDs from request:
		const myId = req.auth.userId; // Current user's ID (from auth)
		const { userId } = req.params;  // Other user's ID (from URL params)

         // Find messages where: 1.Either the current user sent to the other user 2.Or the other user sent to the current user
        //* $or operator combines these conditions
		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 }); // Sort by creation time (ascending)

		res.status(200).json(messages);   // Send the conversation as JSON response
	} catch (error) {
		next(error);
	}
};
