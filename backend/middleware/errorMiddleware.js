const notFound=(req,res,next)=>{
    const error=new Error(`Route not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode===200?500:res.statusCode;
    res.status(statusCode);
    res.json({
        message:err.message,
        ...(process.env.NODE_ENV==="production" ? {} : {stack:err.stack}),
    });
}
export {notFound,errorHandler};
