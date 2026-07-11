
import { useState,useEffect } from "react";
import api from "../api";
function OrdersPage(){
    const [orders,setOrders]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    const fetchOrders=async()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        try{
            const response=await api.get("/orders",{
                headers:{Authorization:`Bearer ${userInfo.token}`},
            })
            setOrders(response.data);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load orders");
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        const loadOrders=async()=>{
            await fetchOrders();
        };
        loadOrders();
    },[]);

    if(loading){
        return <h2>Loading...</h2>
    }
    if(error){
        return <h2>{error}</h2>
    }
    return (
       <div className="page">
        <h1>My Orders</h1>
        {orders.length===0 ? <p className="empty-state">No orders found.</p> : orders.map((item)=>(
            <div className="list-item" key={item._id}>
                <div>
                <h3>Order ID:{item._id}</h3>
                <p>Total:Rs.{item.totalPrice}</p>
                <p>Payment: {item.paymentStatus==="received" ? "Received" : "After delivery"}</p>
                <p>Completion: {item.estimatedCompletionDays ? `${item.estimatedCompletionDays} days` : "Admin will update soon"}</p>
                {item.colorPreferences?.length>0 && <p>Colors: {item.colorPreferences.join(", ")}</p>}
                <p>Cloth: {item.clothDeliveryMethod}</p>
                {item.orderItems?.length>0 && (
                    <div className="order-products">
                        <strong>Items</strong>
                        {item.orderItems.map((orderItem)=>(
                            <p key={orderItem.product}>{orderItem.name} x {orderItem.quantity} - Rs.{orderItem.price*orderItem.quantity}</p>
                        ))}
                    </div>
                )}
                {item.shippingAddress && (
                    <p>Deliver to: {item.shippingAddress.address}, {item.shippingAddress.city}, {item.shippingAddress.state} {item.shippingAddress.postalCode}</p>
                )}
                </div>
                <span className="status-pill">{item.status}</span>
                
            </div>

        ))}
       </div>
    )
}
export default OrdersPage;
