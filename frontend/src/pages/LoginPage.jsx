import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function LoginPage(){
    const navigate=useNavigate();
    const {login}=useAuth();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!email || !password){
            setError("Please enter email and password");
            return;
        }
       try{
        setLoading(true);
        setError("");
        const response=await api.post("/auth/login",
        {
            email,
            password,
        });
        login(response.data);
        navigate("/");
       }catch(error){
        setError(error.response?.data?.message || "Invalid credentials");
       }finally{
        setLoading(false);
       }
    }
    return (
        <div className="page">
            <h1>Login</h1>
            {error && <p className="error">{error}</p>}
            <form className="form" onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            </form>
        </div>
    )
}
export default LoginPage;
