import { emailOlvidePassword, emailRegistro } from "../helpers/emails.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import User from "../models/User.js"

const registrar = async (req, res)=>{
    //comprobar si existe el email
    const {email} = req.body; 
    const existUser = await User.findOne({email})

    if(existUser){
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({msg: error.message})
    }

    try {
        const user = new User(req.body) //crear obj con la informacion del usuario
        user.token = generarId();
        await user.save() //almacenarlo en db

        // enviar email
        const { email, name, token} = user;
        emailRegistro({email, name, token})

        res.json({msg: "Usuario Creado Correctamente, Revisá tu Email para confirmar tu cuenta"})
    } catch (error) {
        console.log(error);
    }
}

//Login
const autenticar = async (req, res) =>{ 

    const {email, password} = req.body;
    //comprobar que el usuario exista en la db
    const user = await User.findOne({email})

    //retornar error si no existe
    if (!user) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message})
    }
    //comprobar que el usuario no este confirmado
    if(!user.confirmed){
        const error = new Error("Tu cuenta no fué confirmada");
        return res.status(403).json({msg: error.message})
    }

    //comprobar que la contraseña sea correcta para pasar a true la autenticacion
    if(await user.comprobarPassword(password)){
        //autenticacion
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            token: generarJWT(user._id)
        })
    }else{
        const error = new Error("Contraseña Incorrecta");
        return res.status(403).json({msg: error.message})
    }

}   

const confirmar = async (req, res) =>{
    const {token} = req.params; //leer token de url
    // Buscar token en DB
    const userConfirm = await User.findOne({token}); 

    //comprobar que exista ese token
    if(!userConfirm){
        const error = new Error("Token no válido");
        return res.status(403).json({msg: error.message})
    }

    // si el token existe, confirmamos usuario, borrar token y guardar en db
    try {
        userConfirm.confirmed = true;
        userConfirm.token = "";
        await userConfirm.save()
        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error);
    }

}

//enviar email de reseteo de password
const olvidePassword = async (req, res) =>{

    const {email} = req.body;
    //comprobar que el usuario exista en la db
    const user = await User.findOne({email})

    //retornar error si no existe
    if (!user) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message})
    }
    
    try {
        user.token = generarId();
        await user.save()

        // enviar email
        const { email, name, token} = user;
        emailOlvidePassword({email, name, token})

        res.json({msg: "Hemos enviado un email con las instrucciones"})

    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) =>{
    //Leer el token de la url
    const {token} = req.params;
    const validToken = await User.findOne({token})

    if(validToken){
        res.json("El Token es Válido y el usuario existe")
    }else{
        const error = new Error("Token no Válido o no existe el usuario");
        return res.status(404).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res)=>{
    const {token} = req.params;
    const {password} = req.body

    const user = await User.findOne({token})

    if(user && user.confirmed === true){
        //cambiar password con lo que escribe el usuario y borrar token
        //password va al modelo Usuario, comprueba si el nuevo password tiene hash (next), sino lo hashea
        user.password = password;
        user.token = ""

        try {
            await user.save()
            res.json({msg: "Contraseña Actualizada"})
        } catch (error) {
            console.log(error);
        }

    }else{
        const error = new Error("Token no Válido");
        return res.status(403).json({msg: error.message})
    }

}

const perfil = async (req, res) =>{
    //leer datos del servidor
    const {user} = req
    res.json(user)
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}