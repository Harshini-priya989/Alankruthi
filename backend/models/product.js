import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    images:[{
        type:String,
    },],
    category:{
        type:String,
        required:true,
    },
    categories:[{
        type:String,
    },],
    isAvailable:{
        type:Boolean,
        default:true,
    },
},{timestamps:true});
const Product=mongoose.model("Product",productSchema);
export default Product;
