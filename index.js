import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import workRoutes from './routes/workRoutes.js';
import clientRoutes from './routes/clientRoutes.js';

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
app.use("/api/users", userRoutes)
//Routing desde trabajoRoutes.js
app.use("/api/works", workRoutes)
//Routing desde clienteRoutes.js
app.use("/api/clients", clientRoutes)


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Servidor express en el puerto ${PORT}`)
})