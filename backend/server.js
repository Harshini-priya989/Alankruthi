import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { notFound,errorHandler } from "./middleware/errorMiddleware.js";
dotenv.config();
connectDB();
const app=express();
const allowedOrigins=process.env.CLIENT_URL ? [process.env.CLIENT_URL] : true;
app.use(cors({
    origin:allowedOrigins,
}));
app.use(express.json());
app.get("/api/health",(req,res)=>{
    res.json({status:"app is running"})
});
app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/ai",aiRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{console.log(`started listening on port ${PORT} and running on http://localhost:${PORT}/`)});
