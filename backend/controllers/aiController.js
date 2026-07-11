import asyncHandler from "express-async-handler";

const designCategories=[
    "Kantha",
    "Chikankari",
    "Phulkari",
    "Kasuti",
    "Mirror",
    "Gota",
    "Kashmiri",
    "Banjara",
    "Zardozi",
];

const requiredFields=[
    "title",
    "recommendedCategory",
    "styleSummary",
    "colorPalette",
    "threadSuggestions",
    "complexity",
    "designNotes",
    "artisanBrief",
    "careTip",
];

const extractGroqOutputText=(data)=>{
    return data.choices?.[0]?.message?.content || "";
};

const parseJsonOutput=(text)=>{
    const cleaned=text
        .trim()
        .replace(/^```json\s*/i,"")
        .replace(/^```\s*/,"")
        .replace(/\s*```$/,"");
    return JSON.parse(cleaned);
};

const validateSuggestion=(suggestion)=>{
    const missingFields=requiredFields.filter((field)=>suggestion[field]===undefined);
    if(missingFields.length>0){
        throw new Error(`AI response missing fields: ${missingFields.join(", ")}`);
    }
    if(!designCategories.includes(suggestion.recommendedCategory)){
        throw new Error("AI response used an invalid category");
    }
    if(!["Simple","Medium","Heavy"].includes(suggestion.complexity)){
        throw new Error("AI response used an invalid complexity");
    }
    if(!Array.isArray(suggestion.colorPalette) || !Array.isArray(suggestion.threadSuggestions)){
        throw new Error("AI response included invalid list fields");
    }
    return suggestion;
};

const generateDesignSuggestion=asyncHandler(async(req,res)=>{
    const {occasion,garment,colors,notes}=req.body;

    if(!occasion || !garment){
        return res.status(400).json({
            message:"Please provide occasion and garment",
        });
    }

    if(!process.env.GROQ_API_KEY){
        return res.status(500).json({
            message:"GROQ_API_KEY is not configured on the server",
        });
    }

    const model=process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
    const systemPrompt=[
        "You are an expert Indian hand embroidery design assistant for Alankruthi Studio.",
        "Recommend practical made-to-order embroidery ideas that an artisan can execute.",
        `Choose exactly one recommendedCategory from: ${designCategories.join(", ")}.`,
        "Return only valid JSON. No markdown, no explanation outside JSON.",
        "The JSON object must include exactly these keys: title, recommendedCategory, styleSummary, colorPalette, threadSuggestions, complexity, designNotes, artisanBrief, careTip.",
        "colorPalette must be an array of 3 to 5 strings.",
        "threadSuggestions must be an array of 3 to 6 strings.",
        "complexity must be one of: Simple, Medium, Heavy.",
        "Keep the tone concise, premium, and useful for both customer and artisan.",
    ].join(" ");
    const userRequest=[
        "Create an embroidery design suggestion from these customer details.",
        "",
        `Occasion: ${occasion}`,
        `Garment or item: ${garment}`,
        `Preferred colors: ${colors || "Suggest suitable colors"}`,
        `Customer notes: ${notes || "No extra notes"}`,
    ].join("\n");

    const response=await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${process.env.GROQ_API_KEY}`,
        },
        body:JSON.stringify({
            model,
            messages:[
                {
                    role:"system",
                    content:systemPrompt,
                },
                {
                    role:"user",
                    content:userRequest,
                },
            ],
            response_format:{
                type:"json_object",
            },
            temperature:0.4,
        }),
    });

    const data=await response.json();

    if(!response.ok){
        return res.status(response.status).json({
            message:data.error?.message || data.message || "Failed to generate design suggestion",
        });
    }

    const outputText=extractGroqOutputText(data);
    if(!outputText){
        return res.status(502).json({
            message:"AI response did not include readable output",
        });
    }

    try{
        const suggestion=validateSuggestion(parseJsonOutput(outputText));
        return res.status(200).json(suggestion);
    }catch(error){
        return res.status(502).json({
            message:error.message || "AI returned an unexpected response format. Please try again.",
        });
    }
});

export {generateDesignSuggestion};
