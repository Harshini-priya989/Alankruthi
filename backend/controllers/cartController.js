import Cart from "../models/cart.js";
import Product from "../models/product.js";
import asyncHandler from "express-async-handler";
const addToCart=asyncHandler(async(req,res)=>{
    const {productId,quantity}=req.body;
    const qty=quantity||1;
    const product=await Product.findById(productId);
    if(!product){
        return res.status(404).json({
            message:"Product not found",
        })
    }
    if(!product.isAvailable){
        return res.status(400).json({
            message:"This product is currently unavailable",
        });
    }
    const cartItem=await Cart.findOne({
        user:req.user._id,
        product:productId,
    })
    if(cartItem){
        cartItem.quantity+=qty;
        await cartItem.save();
        return res.status(200).json(cartItem);
    }
    const newcartitem=await Cart.create({
        user:req.user._id,
        product:productId,
        quantity:qty,
    });
    return res.status(201).json(newcartitem);
});
const getCart=asyncHandler(async (req,res)=>{
    const cartItems=await Cart.find({
        user:req.user._id,
    }).populate("product");
    return res.status(200).json(cartItems);
});
const updateCartItem=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const {quantity}=req.body;
    const cartItem=await Cart.findById(id);
    if(!cartItem){
        return res.status(404).json({
            message:"cart item not found",
        })
    }
    if(cartItem.user.toString()!==req.user._id.toString()){
        return res.status(403).json({
            message:"Not authorized",
        });
    }
    if(quantity<1){
        return res.status(400).json({
            message:"Quantity must be at least 1",
        })
    }
    cartItem.quantity=quantity;
    await cartItem.save();
    return res.status(200).json(cartItem);
});
const removeFromCart=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const cartItem=await Cart.findById(id);
    if(!cartItem){
        return res.status(404).json({
            message:"cart item not found",
        })
    }
    if(cartItem.user.toString()!==req.user._id.toString()){
        return res.status(403).json({
            message:"Not authorized",
        });
    }
    await cartItem.deleteOne();
    return res.status(200).json({
        message:"Item removed from cart",
    });
});
export {addToCart,getCart,updateCartItem,removeFromCart};
