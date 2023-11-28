import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';
import trabajoRoutes from './routes/trabajoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';

const app = express() //servidor express
app.use(express.json())// habilitar que express pueda leer json
dotenv.config(process.env.MONGO_URI)

conectarDB() //conectarse a Mongo Db

// permitir conexion entre front y back
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    //origen de datos
    origin: function(origin, callback){
        if(whitelist.includes(origin) || !origin){ 
            //si el origen esta en la lista blanca
            callback(null, true)
        }else{
            // no esta permitido
            callback(new Error("Error de CORS"))
        }
    }
}

app.use(cors(corsOptions))

//Routing desde usuarioRoutes.js
app.use("/api/usuarios", usuarioRoutes)
//Routing desde trabajoRoutes.js
app.use("/api/trabajos", trabajoRoutes)
//Routing desde clienteRoutes.js
app.use("/api/clientes", clienteRoutes)


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Servidor express en el puerto ${PORT}`)
})