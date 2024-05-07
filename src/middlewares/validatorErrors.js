import {validationResult} from "express-validator"

export const validatorErrors = (req,res,next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const MensageError =  errors.array().map((error)=> error.msg)
        return res.status(400).json(MensageError)
    }
    next();
}