import Order from "../models/order.js";
import Cart from "../models/cart.js";
import asyncHandler from "express-async-handler";

const createOrder=asyncHandler(async(req,res)=>{
    const {shippingAddress,colorPreferences,colorNotes,clothDeliveryMethod}=req.body;
    if(!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.postalCode || !shippingAddress?.country){
        return res.status(400).json({
            message:"Please provide a complete shipping address",
        });
    }
    const cartItems=await Cart.find({
        user:req.user._id,
    }).populate("product");
    if(cartItems.length===0){
        return res.status(400).json({
            message:"Cart is empty",
        })
    }
    const orderItems=cartItems.map((item)=>({
        product:item.product._id,
        name:item.product.name,
        price:item.product.price,
        quantity:item.quantity,
    }));
    let totalPrice=0;
    for(const item of orderItems){
        totalPrice+=item.price*item.quantity;
    }
    const unavailableItem=cartItems.find((item)=>!item.product?.isAvailable);
    if(unavailableItem){
        return res.status(400).json({
            message:`${unavailableItem.product.name} is currently unavailable`,
        });
    }
    const order=await Order.create({
        user:req.user._id,
        orderItems,
        shippingAddress,
        colorPreferences:colorPreferences || [],
        colorNotes,
        clothDeliveryMethod,
        totalPrice,
    })
    await Cart.deleteMany({
        user:req.user._id,
    });
    return res.status(201).json(order);
});
const getMyOrders=asyncHandler(async(req,res)=>{
    const orders=await Order.find({
        user:req.user._id,
    });
    return res.status(200).json(orders);
});
const getOrders=asyncHandler(async(req,res)=>{
    const orders=await Order.find({}).populate("user","name email phone");
    return res.status(200).json(orders);
});
const updateOrderStatus=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const {status,estimatedCompletionDays,paymentStatus}=req.body;
    const order=await Order.findById(id);
    if(!order){
        return res.status(404).json({
            message:"Order not found",
        })
    }
    const allowedStatuses=["pending","processing","shipped","delivered","cancelled"];
    if(status && !allowedStatuses.includes(status)){
        return res.status(400).json({
            message:"Invalid Status",
        })
    }
    const allowedPaymentStatuses=["pending-after-delivery","received"];
    if(paymentStatus && !allowedPaymentStatuses.includes(paymentStatus)){
        return res.status(400).json({
            message:"Invalid payment status",
        });
    }
    if(status){
        order.status=status;
    }
    if(estimatedCompletionDays !== undefined){
        order.estimatedCompletionDays=estimatedCompletionDays || null;
    }
    if(paymentStatus){
        order.paymentStatus=paymentStatus;
    }
    await order.save();
    return res.status(200).json(order);
});
export {createOrder,getMyOrders,getOrders,updateOrderStatus};
