import express  from "express";
import { nuevoTrabajo, obtenerTrabajos, editarTrabajo, obtenerTrabajo, eliminarTrabajo } from "../controllers/workController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/")
    .get(checkAuth, obtenerTrabajos)
    .post(checkAuth, nuevoTrabajo)

router.route("/:id")
    .get(checkAuth,  obtenerTrabajo)
    .put(checkAuth, editarTrabajo)
    .delete(checkAuth, eliminarTrabajo)

export default router