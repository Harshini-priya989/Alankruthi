import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function AdminDashboardPage(){
    const [stats,setStats]=useState(null);
    const [error,setError]=useState("");

    useEffect(()=>{
        const fetchStats=async()=>{
            const userInfo=JSON.parse(localStorage.getItem("userInfo"));
            try{
                const response=await api.get("/admin/dashboard",{
                    headers:{Authorization:`Bearer ${userInfo.token}`},
                });
                setStats(response.data);
            }catch(error){
                setError(error.response?.data?.message || "Failed to load dashboard");
            }
        };
        fetchStats();
    },[]);

    return (
        <div className="page">
            <h1>Admin Dashboard</h1>
            {error && <p className="error">{error}</p>}
            {stats && (
                <div className="stats-grid">
                    <div><h3>Users</h3><p>{stats.totalUsers}</p></div>
                    <div><h3>Products</h3><p>{stats.totalProducts}</p></div>
                    <div><h3>Orders</h3><p>{stats.totalOrders}</p></div>
                    <div><h3>Revenue</h3><p>Rs.{stats.totalRevenue}</p></div>
                </div>
            )}
            <div className="admin-links">
                <Link to="/admin/products">Manage Products</Link>
                <Link to="/admin/orders">Manage Orders</Link>
                <Link to="/admin/users">Manage Users</Link>
            </div>
            {stats?.recentOrders?.length>0 && (
                <div className="recent-section">
                    <h2>Recent Orders</h2>
                    <div className="list">
                        {stats.recentOrders.map((order)=>(
                            <div className="list-item" key={order._id}>
                                <div>
                                    <h3>{order.user?.name || "Customer"}</h3>
                                    <p>Phone: {order.user?.phone || "Not available"}</p>
                                    <p>Total: Rs.{order.totalPrice}</p>
                                </div>
                                <span className="status-pill">{order.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboardPage;
