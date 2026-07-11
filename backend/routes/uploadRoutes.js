import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
const router=express.Router();
router.post("/",protect,admin,upload.single("image"),uploadImage);

export default router;