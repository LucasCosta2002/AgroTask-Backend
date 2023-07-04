import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { editarCliente, eliminarCliente, nuevoCliente, obtenerCliente, obtenerClientes } from '../controllers/clienteController.js';

const router = express.Router();

router.route("/")
        .get(checkAuth, obtenerClientes)
        .post(checkAuth, nuevoCliente)

router.route("/:id")
        .get(checkAuth, obtenerCliente)
        .put(checkAuth, editarCliente)
        .delete(checkAuth, eliminarCliente)

export default router