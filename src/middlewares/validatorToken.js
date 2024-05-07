import  jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const accessRequired =(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){return res.status(400).json(["no hay token autorizado"])}
    else{
        jwt.verify(token,TOKEN_SECRET,(err,user)=>{
            if(err){return res.status(400).json(["validacion del token incorrecta"])}
            else{
                req.user = user
                next();
            }
        })
    }
}

