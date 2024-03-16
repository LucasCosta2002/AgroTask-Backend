import Client from "../models/Client.js";

const obtenerClientes = async (req, res)=>{
    //buscar todos los clientes
    const clients = await Client.find()

    if (!clients) {
        const error = new Error("No hay Clientes registrados")
        return res.status(404).json({msg: error.message})
    }

    res.json(clients)
};

const nuevoCliente = async (req, res)=>{
    //traer plantilla cliente y rellenarla con lo que escribe el usuario
    const client = new Client(req.body);

    //si no existe el cliente, lo creamos
    try {
        const clienteAlmacenado = await client.save()
        res.json(clienteAlmacenado)
    } catch (error) {
        error = new Error("Error al Crear el Cliente")
        return res.status(403).json({msg: error.message})
    }

};

const obtenerCliente = async (req, res)=>{

    const {id} = req.params;
    const client = await Client.findById(id)
    //comprobar que exista el cliente
    if (!client) {
        const error = new Error("El cliente no existe")
        return res.status(404).json({msg: error.msg})
    }

    res.json(client)
    // .populate("nombre cuil telefono trabajos _id")
};

const editarCliente = async (req, res)=>{

    const {id} = req.params;
    //comprobar que el cliente a editar exista
    const client = await Client.findById(id)

    if(!client){
        const error = new Error("El Cliente no existe")
        return res.status(404).json({msg: error.message})
    }

    client.name = req.body.name || client.name;
    client.cuil = req.body.cuil || client.cuil;
    client.phone = req.body.phone || client.phone;

    try {
        const saveClient = await client.save()
        res.json(saveClient)
    } catch (error) {
        error = new Error("Error al Editar el cliente")
        return res.status(403).json({msg: error.message})
    }

};

const eliminarCliente = async (req, res)=>{
    const {id} = req.params;
    const client = await Client.findById(id)

    if(!client){
        const error = new Error("El cliente no existe")
        return res.status(404).json({msg: error.message}) 
    }

    try {
        await client.deleteOne()
        res.json({msg: "Cliente eliminado correctamente"})
    } catch (error) {
        error = new Error("Error al eliminar el cliente")
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