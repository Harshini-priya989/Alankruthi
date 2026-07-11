import { useEffect, useState } from "react";
import api from "../api";

function AdminUsersPage(){
    const [users,setUsers]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    useEffect(()=>{
        const fetchUsers=async()=>{
            const userInfo=JSON.parse(localStorage.getItem("userInfo"));
            try{
                const response=await api.get("/admin/users",{
                    headers:{Authorization:`Bearer ${userInfo?.token}`},
                });
                setUsers(response.data);
            }catch(error){
                setError(error.response?.data?.message || "Failed to load users");
            }finally{
                setLoading(false);
            }
        };
        fetchUsers();
    },[]);

    if(loading){
        return <h2>Loading...</h2>;
    }

    return (
        <div className="page">
            <h1>Manage Users</h1>
            {error && <p className="error">{error}</p>}
            {users.length===0 ? <p>No users found.</p> : users.map((user)=>(
                <div className="list-item" key={user._id}>
                    <div>
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                        <p>{user.phone}</p>
                    </div>
                    <span className="status-pill">{user.role}</span>
                </div>
            ))}
        </div>
    );
}

export default AdminUsersPage;
