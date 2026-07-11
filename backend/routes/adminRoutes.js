import express from "express";
import { getDashboardStats,getUsers,getAdminProducts } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
const router=express.Router();
router.get("/dashboard",protect,admin,getDashboardStats);
router.get("/users",protect,admin,getUsers);
router.get("/products",protect,admin,getAdminProducts);
export default router;
