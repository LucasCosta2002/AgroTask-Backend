import  jwt  from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next)=>{

    //comprobar si le mandamos el token por header o url
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(' ')[1]; //quitarle el bearer y quedarme con el token
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET) //traducir el jwt de la url

            //buscar el usuario por su id y le va a asignar el nuevo id, select para no trarme el resto
            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")

            return next()
        } catch (error) {
            return res.status(404).json({msg: "Hubo un error"})
        }
    }

    if(!token){
        const error = new Error("Token no Válido");
        return res.status(401).json({msg: error.message})
    }

    next()
}

export default checkAuth