import cloudinary from "../config/cloudinary.js";
const uploadImage=async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({
                message:"Please upload an image",
            })
        }
        const result=await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({
                folder:"alankruthi",
            },
            (
                error,result
            )=>{
                if(error)
                    reject(error);
                else
                    resolve(result);
            }
        ).end(req.file.buffer);
        });
        return res.status(200).json({
            imageUrl:result.secure_url,
        })
    }
    catch(error){
        return res.status(500).json({
            message:error.message || "Image upload failed",
        });
    }
};
export {uploadImage};
