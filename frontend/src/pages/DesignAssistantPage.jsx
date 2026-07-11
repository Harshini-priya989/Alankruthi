import { useState } from "react";
import api from "../api";

function DesignAssistantPage(){
    const [form,setForm]=useState({
        occasion:"",
        garment:"",
        colors:"",
        notes:"",
    });
    const [suggestion,setSuggestion]=useState(null);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setForm((prev)=>({
            ...prev,
            [name]:value,
        }));
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!form.occasion.trim() || !form.garment.trim()){
            setError("Please enter occasion and garment");
            return;
        }
        try{
            setLoading(true);
            setError("");
            setSuggestion(null);
            const response=await api.post("/ai/design-suggestion",form);
            setSuggestion(response.data);
        }catch(error){
            setError(error.response?.data?.message || "Failed to generate design suggestion");
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="eyebrow">AI Design Assistant</p>
                    <h1>Plan Your Embroidery Look</h1>
                    <p>Describe your occasion, item, and color ideas to get a structured design brief.</p>
                </div>
            </div>

            <div className="assistant-layout">
                <form className="form assistant-form" onSubmit={handleSubmit}>
                    <input
                        name="occasion"
                        type="text"
                        placeholder="Occasion, e.g. wedding, festival, casual function"
                        value={form.occasion}
                        onChange={handleChange}
                    />
                    <input
                        name="garment"
                        type="text"
                        placeholder="Garment or item, e.g. blouse, dupatta, kurti"
                        value={form.garment}
                        onChange={handleChange}
                    />
                    <input
                        name="colors"
                        type="text"
                        placeholder="Preferred colors, e.g. maroon and gold"
                        value={form.colors}
                        onChange={handleChange}
                    />
                    <textarea
                        name="notes"
                        placeholder="Any extra notes, fabric type, motif ideas, or budget preference"
                        value={form.notes}
                        onChange={handleChange}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Generating..." : "Generate Suggestion"}
                    </button>
                </form>

                <div className="assistant-result">
                    {error && <p className="error">{error}</p>}
                    {!suggestion && !error && (
                        <div className="info-panel">
                            <h3>What this does</h3>
                            <p>It creates a customer-friendly style idea and an artisan-ready brief from your inputs.</p>
                            <p>The final order is still confirmed by the customer and admin.</p>
                        </div>
                    )}
                    {suggestion && (
                        <div className="suggestion-card">
                            <p className="eyebrow">{suggestion.recommendedCategory}</p>
                            <h2>{suggestion.title}</h2>
                            <p>{suggestion.styleSummary}</p>

                            <div className="suggestion-grid">
                                <div>
                                    <h3>Colors</h3>
                                    <div className="tag-row">
                                        {suggestion.colorPalette.map((color)=>(
                                            <span className="tag" key={color}>{color}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3>Threads</h3>
                                    <div className="tag-row">
                                        {suggestion.threadSuggestions.map((thread)=>(
                                            <span className="tag" key={thread}>{thread}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="suggestion-detail">
                                <h3>Complexity</h3>
                                <p>{suggestion.complexity}</p>
                            </div>
                            <div className="suggestion-detail">
                                <h3>Design Notes</h3>
                                <p>{suggestion.designNotes}</p>
                            </div>
                            <div className="suggestion-detail">
                                <h3>Artisan Brief</h3>
                                <p>{suggestion.artisanBrief}</p>
                            </div>
                            <div className="suggestion-detail">
                                <h3>Care Tip</h3>
                                <p>{suggestion.careTip}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DesignAssistantPage;
