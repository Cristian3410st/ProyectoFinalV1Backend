import {Router} from "express"
import {accessRequired} from "../middlewares/validatorToken.js"
import {assignSchedules,consultSchedules,updateSchedules,updateSchedule,registeredUsers,assignRestday} from "../controllers/taskControllersAdmin.js"
import{viewSchedules,recordEntryTime,recordExitTime,alterPassword} from "../controllers/taskControllers.js"

const router = Router();

//solicitudes administrador

router.get("/tasksAdmin",accessRequired,consultSchedules); //admin

router.post("/tasksAdmin",accessRequired,assignSchedules); //admin

router.put("/tasksAdmin",accessRequired,updateSchedules);  //admin

router.put("/taskAdmin",accessRequired,updateSchedule) //admin

router.get("/tasksUsers",accessRequired,registeredUsers) //admin 

router.post("/tasksRest",accessRequired,assignRestday) // admin



//solicitudes usuario

router.get("/tasks",accessRequired,viewSchedules) // user  

router.post("/tasksEntry",accessRequired,recordEntryTime) //user and admin

router.post("/tasksExit",accessRequired,recordExitTime) // user and admin

router.post("/tasksPassword",accessRequired,alterPassword) // user and admin


export default router






