import {Link,useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar(){
    const navigate=useNavigate();
    const {isAuthenticated,isAdmin,logout}=useAuth();
    const logoutHandler=()=>{
        logout();
        navigate("/login");
    }
    return(
        <nav>
            <Link className="brand" to="/">Alankruthi</Link>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/design-assistant">AI Assistant</Link>
                {isAuthenticated? (<>
                    <Link to="/cart">Cart</Link>
                    <Link to="/orders">Orders</Link>
                    {isAdmin && <Link to="/admin">Admin</Link>}
                    <button onClick={logoutHandler}>Logout</button>
                </>):(<>
                   <Link to="/login">Login</Link>
                   <Link to="/register">Register</Link>
                </>)}
            </div>
        </nav>
    )
};
export default Navbar;
