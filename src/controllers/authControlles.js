import { getConnection } from "../database/config.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/createToken.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken"
const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const register = async (req, res) => {
  try {
    const { username, password, names, age, email, rol, position } = req.body;
    const connection = await getConnection();
    const [queryExistingUser] = await connection.query(
      "SELECT * FROM usuarios WHERE usuario = ? or correo = ?",
      [username, email]
    );
    if (queryExistingUser.length > 0) {
      return res
        .status(400)
        .json([
          "Lo sentimos, parece que el usuario o el correo electrónico ya están registrados. Por favor, verifica los datos ingresados e intenta nuevamente",
        ]);
    } else {
      const passHash = await bcrypt.hash(password, 10);
      const insertUser = await connection.query("INSERT INTO usuarios SET ?", {
        usuario: username,
        contraseña: passHash,
        nombre_apellido: names,
        edad: age,
        correo: email,
        rol: rol,
        cargo: position,
      });

      const [findUserInsert] = await connection.query(
        "SELECT * FROM usuarios WHERE usuario = ?",
        [username]
      );
      const resUserInsert = {
        username: findUserInsert[0].usuario,
        email: findUserInsert[0].correo,
        rol: findUserInsert[0].rol,
      };
      const token = await createAccessToken({
        username: resUserInsert.username,
      });
      res.cookie("token", token);
      console.log(token);
      console.log(resUserInsert);
      res
        .status(200)
        .json([
          "El usuario ha sido registrado exitosamente. Por favor, diríjase al inicio de sesión e ingrese utilizando su correo electrónico y la contraseña que ha registrado.",
        ]);
    }
  } catch (error) {
    console.log("error en la consulta", error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await getConnection();
    const [emailExist] = await connection.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [email]
    );
    if (!emailExist.length > 0) {
      res
        .status(400)
        .json([
          "credenciales invalidas,valide si ingreso correctamente su correo corporativo o su contraseña",
        ]);
    } else {
      const passHash = emailExist[0].contraseña;
      const comparePass = await bcrypt.compare(password, passHash);
      if (!comparePass) {
        res
          .status(400)
          .json([
            "credenciales invalidas, valide si ingreso correctamente su correo corporativo o su contraseña",
          ]);
      } else {
        const saveUser = {
          username: emailExist[0].usuario,
          email: emailExist[0].correo,
          rol: emailExist[0].rol,
        };
        const token = await createAccessToken({ username: saveUser.username });
        res.cookie("token", token);
        console.log(saveUser);
        res.status(200).json(saveUser);
      }
    }
  } catch (error) {
    console.log("se ha producido un error", error);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.status(200).json(["token eliminado con exito"]);
};

export const verify = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json(["no autorizado"]);
  jwt.verify(token,TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json(["no autorizado"]);
    const connection = await getConnection();
    const findUser = "SELECT * FROM usuarios WHERE usuario = ?";
    const result = await connection.query(findUser, [user.usuario]);
    if (!result) return res.status(401).json(["no autorizado"]);

    return res.status(200).json({
      username: findUser.usuario,
      email: findUser.correo,
      rol: findUser.rol,
    });
  });
};
