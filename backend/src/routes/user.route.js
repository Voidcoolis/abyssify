import { Router } from "express";
import { getAllUsers, getMessages } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages); //*endpoint to get messages between two users

export default router;
