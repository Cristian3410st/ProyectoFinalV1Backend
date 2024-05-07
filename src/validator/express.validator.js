import {check} from "express-validator"

export const validatorRegister = [
    check("username")
    .isLength({min:9,max:13}).withMessage("el usuario debe tener entre 9 y 13 caracteres"),
    check("password")
    .isLength({min:7}).withMessage("la contraseña debe tener almenos 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/)
   .withMessage("la contraseña debe contener al menos una minuscula, una mayuscula, un numero, y un caracter especial")
]


