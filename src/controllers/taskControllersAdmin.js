import { getConnection } from "../database/config.js";



export const consultSchedules = async (req, res) => {
  const { username } = req.body;
  const connection = await getConnection();
  const [findSchedules] = await connection.query(
    "SELECT * FROM horarios WHERE usuario = ?",
    [username]
  );
  if (!findSchedules.length > 0) {
    res
      .status(200)
      .json([
        "El usuario aún no tiene horarios registrados. Por favor, asigne horarios al usuario consultado o valide si el usuario está registrado en el sistema.",
      ]);
    return;
  } else {
    const modifiedSchedules = findSchedules.map((schedule) => {
      return {
        ...schedule,
        fecha: schedule.fecha.toISOString().split("T")[0],
      };
    });
    console.log(modifiedSchedules);
    res.status(200).json(modifiedSchedules);
    return;
  }
};

export const assignSchedules = async (req, res) => {
  try {
    const connection = await getConnection();
    const {
      username,
      horaEntradaAsignada,
      horaSalidaAsignada,
      fechaInicio,
      fechaFin,
    } = req.body;

    const [findUserExist] = await connection.query(
      "SELECT * FROM horarios WHERE usuario = ?",
      [username]
    );

    const diasLaborales = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];

    const fechaInicioDate = new Date(fechaInicio);
    const fcehaFinDate = new Date(fechaFin);
    let fechas = [];
    while (fechaInicioDate <= fcehaFinDate) {
      const dateFormat = fechaInicioDate.toISOString().split("T")[0];
      fechas.push(dateFormat);
      fechaInicioDate.setDate(fechaInicioDate.getDate() + 1);
    }

    const combinations = fechas.map((fecha, index) => ({
      fecha,
      diaLaboral: diasLaborales[index],
    }));

    for (const { fecha, diaLaboral } of combinations) {
      const find = await connection.query(
        "INSERT INTO horarios(usuario,diaSemana,horaEntradaAsignada,horaSalidaAsignada,fecha)VALUES(?,?,?,?,?)",
        [username, diaLaboral, horaEntradaAsignada, horaSalidaAsignada, fecha]
      );
    }
    res
      .status(200)
      .json([
        "Se han agregado nuevos horarios con éxito. Por favor, consulte nuevamente los horarios",
      ]);
  } catch (error) {
    console.log("error en la consulta de base de datos", error);
  }
};


export const updateSchedules = async (req, res) => {
  const connection = await getConnection();

  const {
    username,
    horaEntradaAsignada,
    horaSalidaAsignada,
    fechaInicio,
    fechaFin,
  } = req.body;

  const [queryId] = await connection.query(
    "SELECT id FROM horarios WHERE usuario = ?",
    [username]
  );

  const [queryUsername] = await connection.query(
    "SELECT * FROM horarios WHERE username = ?",
    [username]
  );

  const diasLaborales = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  const fechaInicioDate = new Date(fechaInicio);
  const fcehaFinDate = new Date(fechaFin);
  let fechas = [];
  while (fechaInicioDate <= fcehaFinDate) {
    const dateFormat = fechaInicioDate.toISOString().split("T")[0];
    fechas.push(dateFormat);
    fechaInicioDate.setDate(fechaInicioDate.getDate() + 1);
  }

  for (let i = 0; i < queryId.length && i < fechas.length; i++) {
    const { id } = queryId[i];
    const fecha = fechas[i];

    const insertDates = await connection.query(
      "UPDATE horarios SET fecha = ? WHERE id = ?",
      [fecha, id]
    );
  }

  const insertDays = await connection.query(
    "UPDATE horarios SET horaEntradaAsignada = ?,horaSalidaAsignada = ? WHERE usuario = ?",
    [horaEntradaAsignada, horaSalidaAsignada, username]
  );

  res
    .status(200)
    .json([
      "Los horarios existentes se han actualizado correctamente. Por favor, vuelva a consultar los horarios.",
    ]);
};


export const updateSchedule = async (req, res) => {
  try {
    const connection = await getConnection();
    const {
      username,
      diaSemana,
      horaEntradaAsignada,
      horaSalidaAsignada,
      fecha,
    } = req.body;
    const updateSchedule = connection.query(
      "UPDATE horarios SET diaSemana = ?,horaEntradaAsignada = ?,horaSalidaAsignada = ?,fecha = ? WHERE usuario = ?",
      [diaSemana, horaEntradaAsignada, horaSalidaAsignada, fecha,username]
    );
    res.status(200).json(["modificacion realizada con exito,por favor vuelva a consultar los horarios del usuario"])
  } catch (error) {
    console.log("error en la consulta a la base de datos", error);
  }
};

export const registeredUsers = async(req,res)=>{
  try{
 const connection = await getConnection();
 const [findUsers] = await connection.query("SELECT * FROM usuarios")
   res.status(200).json(findUsers[0])
   return
  }catch(error){
    console.log("error en la consulta sql",error)
    res.status(500)
    return
  }
};

export const assignRestday = async(req,res) =>{
  try{
  const connection = await getConnection(); 
  const {username,diaSemana,fecha} = req.body;
 const insertRestDay = await connection.query("UPDATE horarios SET diaDescanso = 'DESCANSO', horaEntradaAsignada = '00:00:00', horaSalidaAsignada = '00:00:00', horaEntradaRegistrada = '00:00:00', horaSalidaRegistrada = '00:00:00' WHERE usuario = ? AND diaSemana = ? AND fecha = ?",
 [username,diaSemana,fecha])
 res.status(200).json(['El día de descanso se ha asignado correctamente. Por favor, vuelva a consultar los horarios registrados del usuario.'])
   }catch(error){
    console.log("se detecto un error",error)
   }

};
