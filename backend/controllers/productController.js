import Product from "../models/product.js";
import asyncHandler from "express-async-handler";

const categoryGroups = [
    {
        label: "Kantha",
        image: "/categories/kantha.png",
        categories: ["Kantha"],
    },
    {
        label: "Chikankari",
        image: "/categories/chikankari.png",
        categories: ["Chikankari"],
    },
    {
        label: "Phulkari",
        image: "/categories/phulkari.png",
        categories: ["Phulkari"],
    },
    {
        label: "Kasuti",
        image: "/categories/kasuti.png",
        categories: ["Kasuti"],
    },
    {
        label: "Mirror",
        image: "/categories/mirror.png",
        categories: ["Mirror"],
    },
    {
        label: "Gota",
        image: "/categories/gota.png",
        categories: ["Gota"],
    },
    {
        label: "Kashmiri",
        image: "/categories/kashmiri.png",
        categories: ["Kashmiri"],
    },
    {
        label: "Banjara",
        image: "/categories/banjara.png",
        categories: ["Banjara"],
    },
    {
        label: "Zardozi",
        image: "/categories/zardozi.png",
        categories: ["Zardozi"],
    },
];

const normalizeCategories=(category,categories=[])=>{
    const values=Array.isArray(categories) ? categories : [categories];
    if(category){
        values.unshift(category);
    }
    return [...new Set(values.map((value)=>String(value).trim()).filter(Boolean))];
};

const getGroupCategories=(category)=>{
    const group=categoryGroups.find((item)=>item.label===category);
    return group ? group.categories : [category];
};

const createProduct=asyncHandler(async(req,res)=>{
    try{
        const {name,price,description,images,category,categories,isAvailable}=req.body;
        const selectedCategories=normalizeCategories(category,categories);
        if(!name || !price || !description || selectedCategories.length===0){
            return res.status(400).json({
                message:"Please provide all required fields",
            })
        }
        const product=await Product.create({
            name,
            price,
            description,
            images,
            category:selectedCategories[0],
            categories:selectedCategories,
            isAvailable,
        });
        return res.status(201).json(product);
    }
    catch(error){
        return res.status(500).json({
            message:error.message,
        });
    }
});
const getProducts=asyncHandler(async(req,res)=>{
    const {keyword,category,sort,}=req.query;
    const page=Number(req.query.page)||1;
    const pageSize=10;
    const query={
        isAvailable:true,
    };
    if(keyword){
        query.name={
            $regex:keyword,
            $options:"i",
        };
    }
    if(category){
        const selectedCategories=getGroupCategories(category);
        query.$or=[
            {category:{$in:selectedCategories}},
            {categories:{$in:selectedCategories}},
        ];
    }
    let sortOption={
        createdAt:-1,
    };
    if(sort==="price"){
        sortOption={
            price:1,
        }
    }
    if(sort==="-price"){
        sortOption={
            price:-1,
        }
    }
    if(sort==="createdAt"){
        sortOption={
            createdAt:-1,
        }
    }
    const count=await Product.countDocuments(query);
    const products=await Product.find(query).sort(sortOption).skip((page-1)*pageSize).limit(pageSize);
    return res.status(200).json({products,page,pages:Math.ceil(count/pageSize),totalProducts:count,});
});
const getCategories=asyncHandler(async(req,res)=>{
    const categories=categoryGroups.map((group)=>({
        name:group.label,
        image:group.image,
        productId:null,
        subcategories:[],
    }));
    return res.status(200).json(categories);
})
const getProductById=asyncHandler(async(req,res)=>{
    try{
        const {id}=req.params;
        const product=await Product.findById(id);
        if(!product){
            return res.status(404).json({
                message:"Product not found",
            });
        }
        return res.status(200).json(product);
    }
    catch(error){
        if(error.name==="CastError"){
            return res.status(400).json({
                message:"Invalid product id",
            });
        }
        return res.status(500).json({
            message:error.message,
        });
    }
});
const deleteProduct=asyncHandler(async(req,res)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            message:"Product not found",
        });
    }
    await product.deleteOne();
    return res.status(200).json({
        message:"Product deleted",
    });
});
const updateProduct=asyncHandler(async(req,res)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            message:"Product not found",
        });
    }
    const {name,price,description,images,category,categories,isAvailable}=req.body;
    const selectedCategories=category!==undefined || categories!==undefined
        ? normalizeCategories(category,categories)
        : null;
    product.name=name ?? product.name;
    product.price=price ?? product.price;
    product.description=description ?? product.description;
    product.images=images ?? product.images;
    if(selectedCategories){
        product.category=selectedCategories[0] ?? product.category;
        product.categories=selectedCategories;
    }
    product.isAvailable=isAvailable ?? product.isAvailable;

    const updatedProduct=await product.save();
    return res.status(200).json(updatedProduct);
});
export {createProduct,getProducts,getProductById,getCategories,deleteProduct,updateProduct};
