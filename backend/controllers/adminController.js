import User from "../models/user.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import asyncHandler from "express-async-handler";

const getDashboardStats=asyncHandler(async(req,res)=>{
    const totalUsers=await User.countDocuments();
    const totalProducts=await Product.countDocuments();
    const totalOrders=await Order.countDocuments();

    const revenue=await Order.aggregate([{
        $group:{
            _id:null,
            totalRevenue:{
                $sum:"$totalPrice",
            }
        }
    }])
    const totalRevenue=revenue.length>0?revenue[0].totalRevenue:0;
    const recentOrders=await Order.find().populate("user","name phone").sort({createdAt:-1,}).limit(5);
    return res.status(200).json({totalUsers,totalProducts,totalOrders,totalRevenue,recentOrders,});
});

const getUsers=asyncHandler(async(req,res)=>{
    const users=await User.find({}).select("-password").sort({createdAt:-1});
    return res.status(200).json(users);
});

const getAdminProducts=asyncHandler(async(req,res)=>{
    const products=await Product.find({}).sort({createdAt:-1});
    return res.status(200).json(products);
});

export {getDashboardStats,getUsers,getAdminProducts};
