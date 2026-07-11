import { Link } from "react-router-dom";
import { useState } from "react";

function ProductCard(props){
    const [imageFailed,setImageFailed]=useState(false);
    const showImage=props.image && !imageFailed;

    return (
        <div className="product-card">
            {showImage ? (
                <img className="product-image" src={props.image} alt={props.name} onError={()=>setImageFailed(true)}/>
            ) : (
                <div className="product-image placeholder-image">No image</div>
            )}
            {props.category && <p className="card-eyebrow">{props.category}</p>}
            <Link to={`/product/${props.id}`}> <h3>{props.name}</h3></Link>
            <div className="product-card-footer">
                <p>Rs.{props.price}</p>
                <Link className="text-link" to={`/product/${props.id}`}>View</Link>
            </div>
        </div>
    )
};
export default ProductCard;
