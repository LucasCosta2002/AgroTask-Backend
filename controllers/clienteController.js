import Cliente from "../models/Cliente.js";

const obtenerClientes = async (req, res)=>{
    //buscar todos los clientes
    const clientes = await Cliente.find()

    if (!clientes) {
        const error = new Error("No hay Clientes registrados")
        return res.status(404).json({msg: error.message})
    }

    res.json(clientes)
};

const nuevoCliente = async (req, res)=>{
    //traer plantilla cliente y rellenarla con lo que escribe el usuario
    const cliente = new Cliente(req.body);

    //si no existe el cliente, lo creamos
    try {
        const clienteAlmacenado = await cliente.save()
        res.json(clienteAlmacenado)
    } catch (error) {
        console.log(error);
        error = new Error("Error al Crear el Cliente")
        return res.status(403).json({msg: error.message})
    }

};

const obtenerCliente = async (req, res)=>{

    const {id} = req.params;
    const cliente = await Cliente.findById(id)
    //comprobar que exista el cliente
    if (!cliente) {
        const error = new Error("El cliente no existe")
        return res.status(404).json({msg: error.msg})
    }

    res.json(cliente)
    // .populate("nombre cuil telefono trabajos _id")
};

const editarCliente = async (req, res)=>{

    const {id} = req.params;
    //comprobar que el cliente a editar exista
    const cliente = await Cliente.findById(id)

    if(!cliente){
        const error = new Error("El Cliente no existe")
        return res.status(404).json({msg: error.message})
    }

    cliente.nombre = req.body.nombre || cliente.nombre;
    cliente.cuil = req.body.cuil || cliente.cuil;
    cliente.telefono = req.body.telefono || cliente.telefono;

    try {
        const clienteAlmacenado = await cliente.save()
        res.json(clienteAlmacenado)
    } catch (error) {
        console.log(error);
        error = new Error("Error al Editar el cliente")
        return res.status(403).json({msg: error.message})
    }

};

const eliminarCliente = async (req, res)=>{
    const {id} = req.params;
    const cliente = await Cliente.findById(id)

    if(!cliente){
        const error = new Error("El cliente no existe")
        return res.status(404).json({msg: error.message}) 
    }

    try {
        await cliente.deleteOne()
        res.json({msg: "Cliente eliminado correctamente"})
    } catch (error) {
        error = new Error("Error al eliminar el cliente")
        console.log(error);
        return res.status(404).json({msg: error.message}) 
    }
};

export{
    obtenerClientes,
    obtenerCliente,
    nuevoCliente,
    editarCliente,
    eliminarCliente
}