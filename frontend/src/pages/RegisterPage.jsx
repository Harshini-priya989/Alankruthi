import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function RegisterPage(){
    const navigate=useNavigate();
    const {login}=useAuth();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [phone,setPhone]=useState("")
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!name ||!email ||!phone ||!password ||!confirmPassword){
            setError("Please fill all fields");
            return ;
        }
        
        if(phone.length!==10){
            setError("Phone Number must be 10 digits");
            return ;
        }
        if(password.length<6){
             setError("Password must be atleast 6 characters");
            return ;
        }
        if(password!==confirmPassword){
            setError("Passwords do not match");
            return ;
        }
       try{
        setLoading(true);
        setError("");
        const response=await api.post("/auth/register",
        {
            name,
            email,
            phone,
            password,
        });
        login(response.data);
        navigate("/");
       }catch(error){
        setError(error.response?.data?.message||"Registration Failed");
       }finally{
        setLoading(false);
       }
    }
    return (
        <div className="page">
            <h1>Register</h1>
            {error && <p className="error">{error}</p>}
            <form className="form" onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="tel" placeholder="Phone Number" value={phone} onChange={(e)=>setPhone(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                <button type="submit" disabled={loading}>{loading ? "Registering" : "Register"}</button>
            </form>
        </div>
    )
}
export default RegisterPage;
