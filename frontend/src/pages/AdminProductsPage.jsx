import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api";

const emptyForm = {
    name: "",
    price: "",
    description: "",
    categories: [],
    images: "",
    isAvailable: true,
};

const categoryGroups = [
    {
        label: "Type of Embroideries",
        categories: [
            "Kantha",
            "Chikankari",
            "Phulkari",
            "Kasuti",
            "Mirror",
            "Gota",
            "Kashmiri",
            "Banjara",
            "Zardozi",
        ],
    },
];

function AdminProductsPage(){
    const [products,setProducts]=useState([]);
    const [form,setForm]=useState(emptyForm);
    const [editingId,setEditingId]=useState(null);
    const [loading,setLoading]=useState(true);
    const [saving,setSaving]=useState(false);
    const [uploading,setUploading]=useState(false);
    const [message,setMessage]=useState("");
    const [error,setError]=useState("");
    const [searchTerm,setSearchTerm]=useState("");
    const [statusFilter,setStatusFilter]=useState("all");

    const userInfo=JSON.parse(localStorage.getItem("userInfo"));
    const authHeader=useMemo(()=>({
        headers:{Authorization:`Bearer ${userInfo?.token}`},
    }),[userInfo?.token]);

    const fetchProducts=useCallback(async ()=>{
        try{
            setLoading(true);
            const response=await api.get("/admin/products",authHeader);
            setProducts(response.data);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load products");
        }finally{
            setLoading(false);
        }
    },[authHeader]);

    const handleChange=(e)=>{
        const {name,value,type,checked}=e.target;
        setForm((prev)=>({
            ...prev,
            [name]:type==="checkbox" ? checked : value,
        }));
    };

    const handleCategoryChange=(e)=>{
        const {value,checked}=e.target;
        setForm((prev)=>({
            ...prev,
            categories:checked
                ? [...prev.categories,value]
                : prev.categories.filter((category)=>category!==value),
        }));
    };

    const handleImageUpload=async(e)=>{
        const file=e.target.files[0];
        if(!file){
            return;
        }

        const uploadData=new FormData();
        uploadData.append("image",file);

        try{
            setUploading(true);
            setError("");
            const response=await api.post("/upload",uploadData,{
                headers:{
                    Authorization:`Bearer ${userInfo?.token}`,
                    "Content-Type":"multipart/form-data",
                },
            });
            setForm((prev)=>({
                ...prev,
                images:response.data.imageUrl,
            }));
            setMessage("Image uploaded. Click Add Product or Update Product to save it.");
        }catch(error){
            setError(error.response?.data?.message || "Failed to upload image");
        }finally{
            setUploading(false);
        }
    };

    const resetForm=()=>{
        setForm(emptyForm);
        setEditingId(null);
    };

    const saveProduct=async(e)=>{
        e.preventDefault();
        if(form.categories.length===0){
            setError("Please select at least one category");
            return;
        }
        const payload={
            name:form.name,
            price:Number(form.price),
            description:form.description,
            category:form.categories[0],
            categories:form.categories,
            images:form.images.trim() ? [form.images.trim()] : [],
            isAvailable:form.isAvailable,
        };

        try{
            setSaving(true);
            setError("");
            setMessage("");
            if(editingId){
                await api.put(`/products/${editingId}`,payload,authHeader);
                setMessage("Product updated successfully");
            }else{
                await api.post("/products",payload,authHeader);
                setMessage("Product added successfully");
            }
            resetForm();
            fetchProducts();
        }catch(error){
            setError(error.response?.data?.message || "Failed to save product");
        }finally{
            setSaving(false);
        }
    };

    const startEdit=(product)=>{
        setEditingId(product._id);
        const productCategories=Array.isArray(product.categories) && product.categories.length>0
            ? product.categories
            : product.category
                ? [product.category]
                : [];
        setForm({
            name:product.name || "",
            price:String(product.price || ""),
            description:product.description || "",
            categories:productCategories,
            images:product.images?.[0] || "",
            isAvailable:Boolean(product.isAvailable),
        });
        setMessage("");
        setError("");
    };

    const deleteProduct=async(id)=>{
        if(!window.confirm("Delete this product?")){
            return;
        }
        try{
            await api.delete(`/products/${id}`,authHeader);
            setMessage("Product deleted successfully");
            fetchProducts();
        }catch(error){
            alert(error.response?.data?.message || "Failed to delete product");
        }
    };

    const toggleAvailability=async(product)=>{
        try{
            await api.put(`/products/${product._id}`,{
                isAvailable:!product.isAvailable,
            },authHeader);
            setMessage(product.isAvailable ? "Product hidden from customers" : "Product made available");
            fetchProducts();
        }catch(error){
            alert(error.response?.data?.message || "Failed to update availability");
        }
    };

    useEffect(()=>{
        const loadProducts=async()=>{
            await fetchProducts();
        };
        loadProducts();
    },[fetchProducts]);

    const filteredProducts=products.filter((product)=>{
        const matchesSearch=product.name.toLowerCase().includes(searchTerm.toLowerCase())
            || (product.categories || [product.category]).filter(Boolean).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus=statusFilter==="all"
            || (statusFilter==="available" && product.isAvailable)
            || (statusFilter==="hidden" && !product.isAvailable);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="page">
            <h1>Manage Products</h1>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <form className="form" onSubmit={saveProduct}>
                <input name="name" type="text" placeholder="Product name" value={form.name} onChange={handleChange} required/>
                <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} min="1" required/>
                <fieldset className="category-checklist">
                    <legend>Categories</legend>
                    {categoryGroups.map((group)=>(
                        <div className="category-group" key={group.label}>
                            <h3>{group.label}</h3>
                            <div className="category-options">
                                {group.categories.map((category)=>(
                                    <label className="checkbox-row" key={category}>
                                        <input
                                            type="checkbox"
                                            value={category}
                                            checked={form.categories.includes(category)}
                                            onChange={handleCategoryChange}
                                        />
                                        {category}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </fieldset>
                <input name="images" type="url" placeholder="Image URL" value={form.images} onChange={handleChange}/>
                <input type="file" accept="image/*" onChange={handleImageUpload}/>
                {uploading && <p>Uploading image...</p>}
                {form.images && <img className="form-preview" src={form.images} alt="Product preview"/>}
                <label className="checkbox-row">
                    <input name="isAvailable" type="checkbox" checked={form.isAvailable} onChange={handleChange}/>
                    Available for customers
                </label>
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required/>
                <div className="button-row">
                    <button type="submit" disabled={saving || uploading}>{saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}</button>
                    {editingId && <button type="button" onClick={resetForm}>Cancel Edit</button>}
                </div>
            </form>

            <div className="toolbar">
                <input type="search" placeholder="Search products or categories..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
                <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                    <option value="all">All Products</option>
                    <option value="available">Available</option>
                    <option value="hidden">Hidden</option>
                </select>
            </div>

            {loading ? <h2>Loading...</h2> : (
                <div className="list">
                    {filteredProducts.length===0 ? <p>No products found.</p> : filteredProducts.map((product)=>(
                        <div className="list-item" key={product._id}>
                            {product.images?.[0] && <img className="thumb" src={product.images[0]} alt={product.name}/>}
                            <div>
                                <h3>{product.name}</h3>
                                <p>Rs.{product.price}</p>
                                <p>{(product.categories?.length ? product.categories : [product.category]).filter(Boolean).join(", ")}</p>
                                <span className="status-pill">{product.isAvailable ? "Available" : "Hidden"}</span>
                            </div>
                            <div className="button-row">
                                <button type="button" onClick={()=>startEdit(product)}>Edit</button>
                                <button type="button" onClick={()=>toggleAvailability(product)}>{product.isAvailable ? "Hide" : "Show"}</button>
                                <button type="button" onClick={()=>deleteProduct(product._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminProductsPage;
