import mongoose from 'mongoose';

//definir tabla en DB
const clienteSchema = mongoose.Schema({
    nombre: {
        type: String, 
        required: true,
        trim: true
    },
    cuil: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    telefono: {
        type: String,
        trim: true
    },
    // trabajos: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Trabajo"
    //     }
    // ]
},{
    timestamps: true
}
);

//Crear el modelo y asignar tabla  nombreModel    schema 
const Cliente = mongoose.model("Cliente", clienteSchema);

// hacerlo disponible para usarlo en otros archivos
export default Cliente; 