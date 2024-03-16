import Work from "../models/Work.js";
import Client from "../models/Client.js";

const obtenerTrabajos = async(req, res)=>{
    //buscar todos los trabajos por su usuario autenticado
    const works = await Work.find().where('user').equals(req.user).populate('client', 'name cuil').populate('user', 'name');

    res.json(works)
}   
const nuevoTrabajo = async(req, res)=>{
    //Traer plantilla de trabajo
    const work = new Work(req.body)
    //asignar al trabajo al usuario autenticado
    work.user = req.user._id;

    try {
        // almacenar el trabajo con los datos leidos e instanciados
        const saveWork = await work.save();
        res.json(saveWork)
    } catch (error) {
        console.log(error)
    }
}
const obtenerTrabajo = async(req, res)=>{

    //leer el id del trabajo
    const {id} = req.params;
    const work = await Work.findById(id).select("-createdAt -updatedAt -__v");

    if(!work){
        const error = new Error("No se encontró el Trabajo")
        return res.status(404).json({msg: error.message})
    }

    //comprobar que el usuario que quiere obtener el trabajo sea el mismo logeado que creo el trabajo
    if(work.user.toString() !== req.user._id.toString()){
        const error = new Error("No creaste este trabajo, no tenés permisos para verlo")
        return res.status(401).json({msg: error.message})
    }

    //obtener el cliente
    const client = await Client.find().where("work").equals(work._id);
    res.json({
        work,
        client
    })

}
const editarTrabajo = async(req, res)=>{
    const {id} = req.params;

    const work = await Work.findById(id);

    if (!work){
        const error = new Error("No se encontró el Trabajo")
        return res.status(404).json({msg: error.message})
    }

    //comprobar que el usuario que quiere obtener el trabajo sea el mismo logeado que creo el trabajo
    if (work.user.toString() !== req.user._id.toString()){
        const error = new Error("No creaste este trabajo, no tenés permisos para verlo")
       
        return res.status(401).json({msg: error.message})
    }

    work.date = req.body.date || work.date;
    work.hectares = req.body.hectares || work.hectares;
    work.agrochemical = req.body.agrochemical || work.agrochemical;
    work.location = req.body.location || work.location;

    try {
        const updateWork = await work.save()
        res.json(updateWork)
    } catch (error) {
        console.log(error)
    }
}
const eliminarTrabajo = async(req, res)=>{
    // obtener trabajo por su id
    const {id} = req.params;
    const work = await Work.findById(id);

    if(!work){
        const error = new Error("No se encontró el Trabajo")
        return res.status(404).json({msg: error.message})
    }

    //comprobar que el usuario que quiere obtener el trabajo sea el mismo logeado que creo el trabajo
    if(work.user.toString() !== req.user._id.toString()){
        const error = new Error("No creaste este trabajo, no tenés permisos para verlo")
        return res.status(401).json({msg: error.message})
    }

    try {
        await work.deleteOne();
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