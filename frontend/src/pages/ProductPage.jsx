import { useParams,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import api from "../api";
function ProductPage(){
    const {id}=useParams();
    const navigate=useNavigate();
    const [product,setProduct]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    
    const addToCartHandler=async()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"))
        if(!userInfo){
            navigate("/login");
            return ;
        }
        try{
            await api.post("/cart",
            {
                productId:product._id,
                quantity:1,
            },
            {headers:{
                Authorization:`Bearer ${userInfo.token}`,
            }});
            navigate("/cart")
        }catch(error){
            setError(error.response?.data?.message|| "Failed to add to cart")
        }
    }
    useEffect(()=>{
        const fetchProduct=async()=>{
        try{
             const response=await api.get(`/products/${id}`);
        setProduct(response.data);
        }catch(error){
            setError(error.response?.data?.message|| "Failed to fetch product details")
        }finally{
            setLoading(false);
        }
       
    };
          fetchProduct();  
    },[id]);
    if(loading){
        return <h2>Loading...</h2>
    }
    if(error){
        return <h2>{error}</h2>
    }
    if(!product){
        return <h2>Product not found</h2>
    }
    const productCategories=(product.categories?.length ? product.categories : [product.category]).filter(Boolean).join(", ");
    return (
       <div className="page product-detail">
        {product.images?.[0] ? (
            <img className="product-detail-image" src={product.images[0]} alt={product.name}/>
        ) : (
            <div className="product-detail-image placeholder-image">No image</div>
        )}
        <div>
            <p className="eyebrow">{productCategories}</p>
            <h1>{product.name}</h1>
            <p className="price">Rs.{product.price}</p>
            {!product.isAvailable && <p className="error">This design is currently hidden from new orders.</p>}
            <p>{product.description}</p>
            <div className="info-panel compact-panel">
                <p>Made to order on your plain cloth.</p>
                <p>Payment is collected after delivery. Admin will confirm completion days after reviewing current orders.</p>
            </div>
            <button onClick={addToCartHandler} disabled={!product.isAvailable}>Add to Cart</button>
        </div>
       </div>
    )
}
export default ProductPage;
