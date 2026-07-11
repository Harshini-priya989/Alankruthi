import User from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
const registerUser=async(req,res)=>{
    try{
        const {name,email,password,phone}=req.body;
        if(!name ||!email || !password ||!phone){
            return res.status(400).json({
                message:"All fields are required",
            })
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return  res.status(400).json({
                message:"User already exists",
            })
        }
        const hashedpassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,email,password:hashedpassword,phone,
        });
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            role:user.role,
            token:generateToken(user._id),
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message,
        })
    }
}
const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
             return res.status(400).json({
                message:"All fields are required",
            })
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({
                message:"Invalid credentials",
            })
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({
                message:"Invalid credentials",
            })
        }
        res.status(200).json({
            token:generateToken(user._id),
            user:{
                _id:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            role:user.role,
            }
            
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message,
        })
    }
}
const getUserProfile=asyncHandler(async (req,res)=>{
    res.status(200).json(req.user);
});
const adminController=(req,res)=>{
    res.status(200).json({
        message:"Welcome Admin",
        user:req.user.name,
    });
};
export {registerUser,loginUser,getUserProfile,adminController};
