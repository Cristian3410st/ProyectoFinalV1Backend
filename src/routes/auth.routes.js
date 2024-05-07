import {Router} from "express"
import {register,login,logout,verify} from "../controllers/authControlles.js"
import {validatorRegister} from "../validator/express.validator.js"
import {validatorErrors} from "../middlewares/validatorErrors.js"
const router =  Router()


router.post("/register",validatorRegister,validatorErrors,register);

router.post("/login",login);

router.delete("/logout",logout);

router.get("/verify",verify)

export default router