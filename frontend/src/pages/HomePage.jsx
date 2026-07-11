import ProductCard from "../components/ProductCard";
import {useState,useEffect,} from "react";
import api from "../api";
function HomePage(){
    const [products,setProducts]=useState([]);
    const [categories,setCategories]=useState([]);
    const [selectedCategory,setSelectedCategory]=useState("");
    const [keyword,setKeyword]=useState("");
    const [searchTerm,setSearchTerm]=useState("");
    const [sort,setSort]=useState("createdAt");
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const [failedCategoryImages,setFailedCategoryImages]=useState([]);
    useEffect(()=>{
            const loadCategories=async()=>{
                try{
                    const response=await api.get("/products/categories",{
                        params:{fresh:Date.now()},
                    });
                    setCategories(response.data);
                }catch{
                    setCategories([]);
                }
            };
            loadCategories();
    },[]);

    useEffect(()=>{
            const loadProducts=async()=>{
                try{
                    setLoading(true);
                    setError("");
                    const response=await api.get("/products",{
                        params:{
                            ...(selectedCategory ? {category:selectedCategory} : {}),
                            ...(searchTerm ? {keyword:searchTerm} : {}),
                            ...(sort ? {sort} : {}),
                        },
                    });
                    setProducts(response.data.products || response.data);
                }catch{
                    setError("Failed to load products");
                }finally{
                    setLoading(false);
                }
            };
            loadProducts();
    },[selectedCategory,searchTerm,sort]);

    const handleSearch=(e)=>{
        e.preventDefault();
        setSearchTerm(keyword.trim());
    };

    const selectedCategoryGroup=categories.find((category)=>
        category.name===selectedCategory || category.subcategories?.includes(selectedCategory)
    );

    const clearFilters=()=>{
        setKeyword("");
        setSearchTerm("");
        setSelectedCategory("");
        setSort("createdAt");
    };

    const activeLabel=selectedCategory || "All Designs";

    return (
        <div className="page">
            <div className="page-header home-hero">
                <div>
                    <p className="eyebrow">Alankruthi Studio</p>
                    <h1>Hand Stitched Designs</h1>
                    <p>Browse custom embroidery, choose your design direction, and place made-to-order work for your plain cloth.</p>
                </div>
            </div>
            <form className="toolbar" onSubmit={handleSearch}>
                <input type="search" placeholder="Search designs..." value={keyword} onChange={(e)=>setKeyword(e.target.value)}/>
                <select value={sort} onChange={(e)=>setSort(e.target.value)}>
                    <option value="createdAt">Newest</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                </select>
                <button type="submit">Search</button>
                <button type="button" className="secondary-button" onClick={clearFilters}>Clear</button>
            </form>
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Explore</p>
                    <h2>Design Categories</h2>
                </div>
            </div>
            <div className="category-filter">
                <button className={selectedCategory==="" ? "active-filter" : ""} type="button" onClick={()=>setSelectedCategory("")}>All</button>
            </div>
            {categories.length>0 && (
                <div className="category-grid">
                    {categories.map((category)=>(
                        <button
                            className={category.name===selectedCategory || category.subcategories?.includes(selectedCategory) ? "category-card active-category-card" : "category-card"}
                            type="button"
                            key={category.name}
                            onClick={()=>setSelectedCategory(category.name)}
                        >
                            {category.image && !failedCategoryImages.includes(category.name) ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    onError={()=>setFailedCategoryImages((prev)=>[...prev,category.name])}
                                />
                            ) : (
                                <span className="category-placeholder">No image</span>
                            )}
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
            )}
            {selectedCategoryGroup?.subcategories?.length>0 && (
                <div className="subcategory-filter">
                    {selectedCategoryGroup.subcategories.map((subcategory)=>(
                        <button
                            className={selectedCategory===subcategory ? "active-filter" : ""}
                            type="button"
                            key={subcategory}
                            onClick={()=>setSelectedCategory(subcategory)}
                        >
                            {subcategory}
                        </button>
                    ))}
                </div>
            )}
            <div className="section-heading">
                <div>
                    <p className="eyebrow">{activeLabel}</p>
                    <h2>Available Designs</h2>
                </div>
                {!loading && !error && <span className="result-count">{products.length} found</span>}
            </div>
            {loading ? (
                <div className="product-grid">
                    {[1,2,3].map((item)=><div className="product-card skeleton-card" key={item}/>)}
                </div>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    <div className="product-grid">
                        {products.map((product)=>(
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                price={product.price}
                                image={product.images?.[0]}
                                category={(product.categories?.length ? product.categories : [product.category]).filter(Boolean)[0]}
                            />
                        ))}
                    </div>
                    {products.length===0 && <p className="empty-state">No products found. Try clearing filters or choosing another category.</p>}
                </>
            )}
        </div>
    )
}
export default HomePage;
