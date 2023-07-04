import express  from "express";
import { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

//crear router de express
const router = express.Router()

// autenticacion, registrar y confirmar usuario
router.post("/", registrar) //registrar usuario
router.post("/login", autenticar) //autenticar usuario}
router.get("/confirmar/:token", confirmar) //confirmar usuario
router.post("/olvide-password", olvidePassword) //resetear contraseña
// router.get("/olvide-password/:token", comprobarToken) //Comprobar el token para cambiar password
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)// generar nuevo password

//checkauth va a proteger las rutas, va a comprobar que el token exista etc
router.get("/perfil", checkAuth, perfil)


export default router