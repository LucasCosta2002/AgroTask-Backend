import jwt from 'jsonwebtoken'

//mantiene la sesion, genera un token con las credenciales. NO ES EL TOKEN DE BD
const generarJWT =(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: "10d"
    })
}

export default generarJWT;