import { Router } from "express";
import { getAllUsers, getMessages } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);
//todo: get messages between two users
// router.get("/messages/:userId", protectRoute, getMessages);

export default router;
