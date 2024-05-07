import { getConnection } from "../database/config.js";
import bcrypt from "bcryptjs"

export const viewSchedules = async (req, res) => {
  try {
    const { username } = req.user;
    const connection = await getConnection();
    const [viewSchedule] = await connection.query(
      "SELECT * FROM horarios WHERE usuario = ?",
      [username]
    );

    if (!viewSchedule.length > 0) {
      res
        .status(200)
        .json([
          "No se encontraron horarios registrados. Por favor, comuníquese con su supervisor para que le asigne los horarios correspondientes.",
        ]);
    }else{
      const newViewSchedule = viewSchedule.map(schedule=>{
        return{
          ...schedule,
          fecha:schedule.fecha.toISOString().split("T")[0]
        }
      })

      console.log(newViewSchedule)
       res.status(200).json(newViewSchedule)
      return
    }

  } catch (error) {
    console.log("error en la consulta sql", error);
  }
};


export const recordEntryTime = async(req,res) =>{
try{
  const connection = await getConnection();
  const{username} = req.user;
  const ahora = new Date;
  const horaActual = ahora.toTimeString().slice(0,8)
  const [getRegisteredTime] = await connection.query("SELECT horaEntradaRegistrada FROM horarios WHERE usuario = ? AND fecha = CURDATE();"
  ,[username])
  const resTime = getRegisteredTime[0]
  if(resTime.horaEntradaRegistrada === null || resTime.horaEntradaRegistrada === undefined){
    const [entry] = await connection.query("UPDATE horarios SET horaEntradaRegistrada = ? WHERE usuario = ? AND fecha = CURDATE();",
    [horaActual,username])
    console.log(horaActual)
    res.status(200).json(horaActual)

  }else{
    res.status(200).json(['la hora de entrada del dia de hoy  ya se encuentra registrada,debera esperar hasta el dia de mañana'])
  }
  }catch(error){
    console.log("error en la base de datos",error)
  }
};

export const recordExitTime = async(req,res)=>{
  try{
    const connection = await getConnection();
    const { username } = req.user;
    const ahora = new Date;
    const horaActual = ahora.toTimeString().slice(0,8);
    const [getRegisterTime] =  await connection.query("SELECT horaSalidaRegistrada FROM horarios WHERE usuario = ? AND fecha = CURDATE();"
    ,[username])
    const resRegisterTime = getRegisterTime[0]
    if(resRegisterTime.horaSalidaRegistrada === null||resRegisterTime.horaSalidaRegistrada === undefined){
      const insertRegisterTime = await connection.query("UPDATE horarios SET horaSalidaRegistrada =? WHERE usuario = ? AND fecha = CURDATE();",[horaActual,username])
      console.log(horaActual)
      res.status(200).json(horaActual)
      return
    }else{
        res.status(200).json(['la hora de entrada del dia de hoy  ya se encuentra registrada,debera esperar hasta el dia de mañana'])
        return
    };
  }catch(error){
    console.log("error en la base de datos",error)
  }
};


export const alterPassword = async(req,res)=>{
  try{
   const connection = await getConnection();
   const {username} = req.user;
   const {oldPass,newPass} = req.body;
   const [verifyOldPass] = await connection.query("SELECT contraseña FROM usuarios WHERE usuario = ?",[username])
   const  resPass = verifyOldPass[0]
   console.log(resPass.contraseña)
   const comparePass = await bcrypt.compare(oldPass,resPass.contraseña)
   if(!comparePass){
    res.status(400).json(["la contraseña actual es incorrecta por favor valide nuevamente los datos ingresados"])
   }else{
      const newPass = await bcrypt.hash(newPass,10)
       const insertPass = await connection.query("UPDATE usuarios SET contraseña = ? WHERE usuario = ?",
       [newPass,username])
       res.status(200).json(['La contraseña se ha modificado exitosamente. Por favor, cierre sesión y vuelva a iniciarla utilizando su nueva contraseña'])
   }
   }catch(error){
    console.log("error en la base de datos",error)
   }
};

