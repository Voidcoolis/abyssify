import { Router } from "express";
import { User } from "../models/user.model.js";
import { authCallback } from "../controllers/auth.controller.js";

const router = Router();

//route endpoint that we need for the authentification
router.post("/callback", authCallback);

export default router;
