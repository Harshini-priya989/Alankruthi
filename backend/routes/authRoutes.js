import express from "express";
import { registerUser,loginUser,getUserProfile,adminController } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",protect,getUserProfile);
router.get("/admin",protect,admin,adminController)
export default router;