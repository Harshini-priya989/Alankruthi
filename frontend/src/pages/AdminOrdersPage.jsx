import { useEffect,useState } from "react";
import api from "../api";


function AdminOrdersPage(){
    const [orders,setOrders]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    const fetchOrders=async ()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));
    try{
        setLoading(true);
        const response=await api.get("/orders/all",{headers:{Authorization: `Bearer ${userInfo.token}`}});
        setOrders(response.data);
    }catch(error){
        setError(error.response?.data?.message || "Failed to load orders");
    }finally{
        setLoading(false);
    }
}
const updateStatus=async(orderId,status)=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));
    try{
        await api.put(`/orders/${orderId}`,
        {status,},{headers:{Authorization: `Bearer ${userInfo.token}`}});
        fetchOrders();
    }catch(error){
        alert(error.response?.data?.message|| "Failed to update status");
    }
}
const updateOrderDetails=async(orderId,details)=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));
    try{
        await api.put(`/orders/${orderId}`,details,{headers:{Authorization: `Bearer ${userInfo.token}`}});
        fetchOrders();
    }catch(error){
        alert(error.response?.data?.message|| "Failed to update order");
    }
}
useEffect(()=>{
    const loadOrders=async()=>{
        await fetchOrders();
    };
    loadOrders();
},[]);
return (
    <div className="page">
        <h1>Manage Orders</h1>
        {error && <p className="error">{error}</p>}
        {loading ? <h2>Loading...</h2> : orders.length===0 ? <p>No orders found.</p> : orders.map((order)=>(
            <div className="list-item" key={order._id}>
                <div>
                <h3>{order.user?.name || "Customer"}</h3>
                <p>{order.user?.email}</p>
                <p>Phone: {order.user?.phone}</p>
                <p>Rs.{order.totalPrice}</p>
                <p>Payment: {order.paymentStatus==="received" ? "Received" : "After delivery"}</p>
                <p>Completion: {order.estimatedCompletionDays ? `${order.estimatedCompletionDays} days` : "Not set"}</p>
                {order.colorPreferences?.length>0 && <p>Colors: {order.colorPreferences.join(", ")}</p>}
                {order.colorNotes && <p>Notes: {order.colorNotes}</p>}
                <p>Cloth: {order.clothDeliveryMethod}</p>
                {order.shippingAddress && (
                    <p>Address: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                )}
                {order.orderItems?.length>0 && (
                    <div className="order-products">
                        <strong>Order Items</strong>
                        {order.orderItems.map((item)=>(
                            <p key={item.product}>{item.name} x {item.quantity} - Rs.{item.price*item.quantity}</p>
                        ))}
                    </div>
                )}
                <span className="status-pill">{order.status}</span>
                </div>
               <div className="admin-order-controls">
               <select value={order.status} onChange={(e)=>updateStatus(order._id,e.target.value)}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
               </select>
               <input type="number" min="1" placeholder="Days" defaultValue={order.estimatedCompletionDays || ""} onBlur={(e)=>updateOrderDetails(order._id,{estimatedCompletionDays:e.target.value ? Number(e.target.value) : null})}/>
               <select value={order.paymentStatus || "pending-after-delivery"} onChange={(e)=>updateOrderDetails(order._id,{paymentStatus:e.target.value})}>
                <option value="pending-after-delivery">Payment after delivery</option>
                <option value="received">Payment received</option>
               </select>
               </div>
            </div>
        ))}
    </div>
)
}
export default AdminOrdersPage;
