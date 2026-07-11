import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import api from "../api";
function CartPage(){
    const navigate=useNavigate();
    const [cartItems,setCartItems]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const fetchCart=async()=>{
            const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        try{
            setLoading(true);
             const response=await api.get("/cart",{headers:{
                Authorization:`Bearer ${userInfo.token}`,
            }});
        setCartItems(response.data);
        }catch(error){
            setError(error.response?.data?.message|| "Failed to load cart")
        }finally{
            setLoading(false);
        }
       
    };
    const updateQuantity=async(cartId,quantity)=>{
         const userInfo=JSON.parse(localStorage.getItem("userInfo"));
          try{
            await api.put(`/cart/${cartId}`,{quantity},{headers:{
                Authorization:`Bearer ${userInfo.token}`,
            }});
        fetchCart();
        }catch(error){
            setError(error.response?.data?.message|| "Failed to update quantity")
        }
    }
    const removeItem=async(cartId)=>{
         const userInfo=JSON.parse(localStorage.getItem("userInfo"));
          try{
            await api.delete(`/cart/${cartId}`,{headers:{
                Authorization:`Bearer ${userInfo.token}`,
            }});
        fetchCart();
        }catch(error){
            setError(error.response?.data?.message|| "Failed to remove Item")
        }
    }
    
    useEffect(()=>{
        const loadCart=async()=>{
            await fetchCart();
        };
        loadCart();
    },[]);
    const totalPrice=cartItems.reduce((total,item)=>total+(item.product.price*item.quantity),0);
    if(loading){
        return <h2>Loading...</h2>
    }
    if(error){
        return <h2>{error}</h2>
    }
    return (
       <div className="page">
        <h1>My Cart</h1>
        {cartItems.length===0?(<p className="empty-state">Your cart is empty</p>):(cartItems.map((item)=>(
            <div className="list-item" key={item._id}>
                <div>
                    <h3>{item.product.name}</h3>
                    <p>Rs.{item.product.price}</p>
                    <p>Subtotal: Rs.{item.product.price*item.quantity}</p>
                </div>
                <div className="quantity-control">
                    <button onClick={()=>updateQuantity(item._id,item.quantity-1)} disabled={item.quantity<=1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={()=>updateQuantity(item._id,item.quantity+1)}>+</button>
                </div>
                <button onClick={()=>{removeItem(item._id)}}>Remove</button>
            </div>

        )))}
        {cartItems.length>0 && (
            <div className="cart-summary">
                <h3>Total: Rs.{totalPrice}</h3>
                <div className="button-row">
                    <button onClick={()=>navigate("/")}>Continue Shopping</button>
                    <button onClick={()=>navigate("/checkout")}>Proceed to checkout</button>
                </div>
            </div>
        )}
       </div>
    )
}
export default CartPage;
