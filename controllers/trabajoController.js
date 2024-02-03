import Trabajo from "../models/Trabajo.js";
import Cliente from "../models/Cliente.js";

const obtenerTrabajos = async(req, res)=>{
    //buscar todos los trabajos por su usuario autenticado
    const trabajos = await Trabajo.find().where('usuario').equals(req.usuario)
    res.json(trabajos)
}   
const nuevoTrabajo = async(req, res)=>{
    //Traer plantilla de trabajo
    const trabajo = new Trabajo(req.body)
    //asignar al trabajo al usuario autenticado
    trabajo.usuario = req.usuario._id;

    try {
        // almacenar el trabajo con los datos leidos e instanciados
        const trabajoAlmacenado = await trabajo.save();
        res.json(trabajoAlmacenado)
    } catch (error) {
        console.log(error)
    }
}
const obtenerTrabajo = async(req, res)=>{

    //leer el id del trabajo
    const {id} = req.params;
    const trabajo = await Trabajo.findById(id).select("-createdAt -updatedAt -__v");

    if(!trabajo){
        const error = new Error("No se encontró el Trabajo")
        return res.status(404).json({msg: error.message})
    }

    //comprobar que el usuario que quiere obtener el trabajo sea el mismo logeado que creo el trabajo
    if(trabajo.usuario.toString() !== req.usuario._id.toString()){
        const error = new Error("No creaste este trabajo, no tenés permisos para verlo")
        return res.status(401).json({msg: error.message})
    }

    //obtener el cliente
    const cliente = await Cliente.find().where("trabajo").equals(trabajo._id);
    res.json({
        trabajo,
        cliente
    })

}
const editarTrabajo = async(req, res)=>{
    // obtener trabajo por su id
    const {id} = req.params;
    const trabajo = await Trabajo.findById(id);

    if(!trabajo){
        const error = new Error("No se encontró el Trabajo")
        return res.status(404).json({msg: error.message})
    }

    //comprobar que el usuario que quiere obtener el trabajo sea el mismo logeado que creo el trabajo
    if(trabajo.usuario.toString() !== req.usuario._id.toString()){
        const error = new Error("No creaste este trabajo, no tenés permisos para verlo")
        return res.status(401).json({msg: error.message})
    }

    //Asignar lo que escribe el usuario en el form o mantener lo que habia en la db
    trabajo.fecha = req.body.fecha || trabajo.fecha;
    trabajo.cliente = req.body.cliente || trabajo.cliente;
    trabajo.hectareas = req.body.hectareas || trabajo.hectareas;
    trabajo.agroquimico = req.body.agroquimico || trabajo.agroquimico;
    trabajo.ubicacion = req.body.ubicacion || trabajo.ubicacion;

    try {
        //guardar en la db y devolverselo al usuario
        const trabajoActualizado = await trabajo.save()
        res.json(trabajoActualizado)
    } catch (error) {
        console.log(error)
    }
}
const eliminarTrabajo = async(req, res)=>{
    // obtener trabajo por su id
    const {id} = req.params;
    const trabajo = await Trabajo.findById(id);

    if(!trabajo){
        const error = new Error("No se encontró el Trabajo")
        return res.status(404).json({msg: error.message})
    }

    //comprobar que el usuario que quiere obtener el trabajo sea el mismo logeado que creo el trabajo
    if(trabajo.usuario.toString() !== req.usuario._id.toString()){
        const error = new Error("No creaste este trabajo, no tenés permisos para verlo")
        return res.status(401).json({msg: error.message})
    }

    try {
        await trabajo.deleteOne();
        res.json({msg: "Trabajo eliminado correctamente"})
    } catch (error) {
        error = new Error("Error al eliminar el trabajo")
        return res.status(404).json({msg: error.message}) 
    }
}

export {
    obtenerTrabajos,
    nuevoTrabajo,
    obtenerTrabajo,
    editarTrabajo,
    eliminarTrabajo
}