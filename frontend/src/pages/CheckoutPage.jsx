import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

const colorOptions=[
    {name:"Rose",value:"#c97482"},
    {name:"Maroon",value:"#7f2537"},
    {name:"Gold",value:"#c7953b"},
    {name:"Leaf Green",value:"#5f8a65"},
    {name:"Peacock",value:"#1f6f78"},
    {name:"Ivory",value:"#f3eadb"},
    {name:"Black",value:"#222222"},
    {name:"Sky Blue",value:"#76a9c7"},
];

const studioAddress="Alankruthi Studio, Hyderabad, Telangana. Phone: +91 98765 43210";

function CheckoutPage(){
    const navigate=useNavigate();
    const [address,setAddress]=useState("");
    const [city,setCity]=useState("");
    const [state,setState]=useState("");
    const [postalCode,setPostalCode]=useState("");
    const [country,setCountry]=useState("");
    const [clothDeliveryMethod,setClothDeliveryMethod]=useState("courier");
    const [colorPreferences,setColorPreferences]=useState([]);
    const [colorNotes,setColorNotes]=useState("");
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");
    const [success,setSuccess]=useState("");

    const toggleColor=(colorName)=>{
        setColorPreferences((prev)=>prev.includes(colorName) ? prev.filter((color)=>color!==colorName) : [...prev,colorName]);
    };

    const placeOrder=async(e)=>{
        e.preventDefault();
        if(!address || !city || !state || !postalCode || !country){
            setError("Please fill all shipping fields");
            return;
        }
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        try{
            setLoading(true);
            setError("");
            setSuccess("");
            await api.post("/orders",{
                shippingAddress:{address,city,state,postalCode,country},
                colorPreferences,
                colorNotes,
                clothDeliveryMethod,
             },{headers:{
                Authorization:`Bearer ${userInfo.token}`,
            }});
            setSuccess("Order placed successfully. Redirecting to your orders...");
            setTimeout(()=>navigate("/orders"),700);
        }catch(error){
            setError(error.response?.data?.message|| "Failed to place order");
        }finally{
            setLoading(false);
        }
       
    };
    
    return (
       <div className="page">
        <div className="page-header">
            <div>
                <h1>Checkout</h1>
                <p>Payment is collected after the completed design is delivered.</p>
            </div>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div className="info-panel">
            <h3>Send your plain cloth</h3>
            <p>{studioAddress}</p>
            <p>Admin will review current orders and update the estimated completion days after your order is placed.</p>
        </div>
        <form className="form" onSubmit={placeOrder}>
            <h3>Delivery Address</h3>
            <input type="text" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)}/>
            <input type="text" placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)}/>
            <input type="text" placeholder="State" value={state} onChange={(e)=>setState(e.target.value)}/>
            <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} inputMode="numeric"/>
            <input type="text" placeholder="Country" value={country} onChange={(e)=>setCountry(e.target.value)}/>

            <h3>Cloth Sending Method</h3>
            <select value={clothDeliveryMethod} onChange={(e)=>setClothDeliveryMethod(e.target.value)}>
                <option value="courier">I will courier my plain cloth</option>
                <option value="in-person">I will give it in person</option>
                <option value="not-needed">No plain cloth needed</option>
            </select>

            <h3>Preferred Thread Colors</h3>
            <div className="color-palette">
                {colorOptions.map((color)=>(
                    <button className={colorPreferences.includes(color.name) ? "color-swatch selected-color" : "color-swatch"} type="button" key={color.name} onClick={()=>toggleColor(color.name)}>
                        <span style={{backgroundColor:color.value}}></span>
                        {color.name}
                    </button>
                ))}
            </div>
            <textarea placeholder="Any extra color or design notes" value={colorNotes} onChange={(e)=>setColorNotes(e.target.value)}/>
            <button type="submit" disabled={loading}>{loading ? "Placing..." : "Place Order"}</button>
        </form>
       </div>
    )
}
export default CheckoutPage;
