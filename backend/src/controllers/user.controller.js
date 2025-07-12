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

export const getMessages = async (req, res, next) => {

}