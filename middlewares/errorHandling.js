export const errorHandler=(err,req,res,next)=>{
const status = err.status || 500;
const message = err.message || "Something went wrong!";
return res.status(status).json({
  success: false,
  status,
  message,
});
}

export const createError=(status,message)=>{
    const err=new Error()
    err.status=status
    err.message=message
    return err
}