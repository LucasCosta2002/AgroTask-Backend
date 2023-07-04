import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js"

const registrar = async (req, res)=>{
    //comprobar si existe el email
    const {email} = req.body; 
    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body) //crear obj con la informacion del usuario
        usuario.token = generarId();
        const usuarioAlmacenado = await usuario.save() //almacenarlo en db
        res.json(usuarioAlmacenado)
    } catch (error) {
        console.log(error);
    }
}

//Login
const autenticar = async (req, res) =>{ 

    const {email, password} = req.body;
    //comprobar que el usuario exista en la db
    const usuario = await Usuario.findOne({email})

    //retornar error si no existe
    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message})
    }
    //comprobar que el usuario no este confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no fué confirmada");
        return res.status(403).json({msg: error.message})
    }

    //comprobar que la contraseña sea correcta para pasar a true la autenticacion
    if(await usuario.comprobarPassword(password)){

        //autenticacion
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error("Contraseña Incorrecta");
        return res.status(403).json({msg: error.message})
    }

}   

const confirmar = async (req, res) =>{
    const {token} = req.params; //leer token de url
    // Buscar token en DB
    const usuarioConfirmar = await Usuario.findOne({token}); 

    //comprobar que exista ese token
    if(!usuarioConfirmar){
        const error = new Error("Token no válido");
        return res.status(403).json({msg: error.message})
    }

    // si el token existe, confirmamos usuario, borrar token y guardar en db
    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save()
        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error);
    }

}

//enviar email de reseteo de password
const olvidePassword = async (req, res) =>{

    const {email} = req.body;
    //comprobar que el usuario exista en la db
    const usuario = await Usuario.findOne({email})

    //retornar error si no existe
    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message})
    }
    
    try {
        usuario.token = generarId();
        await usuario.save()

        // enviar email



        res.json({msg: "Hemos enviado un email con las instrucciones"})

    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) =>{
    //Leer el token de la url
    const {token} = req.params;
    const tokenValido = await Usuario.findOne({token})

    if(tokenValido){
        res.json("El Token es Válido y el usuario existe")
    }else{
        const error = new Error("Token no Válido o no existe el usuario");
        return res.status(404).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res)=>{
    const {token} = req.params;
    const {password} = req.body

    const usuario = await Usuario.findOne({token})

    if(usuario && usuario.confirmado === true){
        //cambiar password con lo que escribe el usuario y borrar token
        //password va al modelo Usuario, comprueba si el nuevo password tiene hash (next), sino lo hashea
        usuario.password = password;
        usuario.token = ""

        try {
            await usuario.save()
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
    const {usuario} = req
    res.json(usuario)
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