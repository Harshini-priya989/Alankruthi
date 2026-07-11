import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute(){
    const {isAuthenticated,isAdmin}=useAuth();
    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
    if(!isAdmin){
        return <Navigate to="/"/>
    }
    return <Outlet/>
}
export default AdminRoute;
