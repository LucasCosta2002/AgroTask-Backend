import mongoose from 'mongoose';

//definir tabla en DB
const trabajoSchema = mongoose.Schema({
    fecha: {
        type: String,
        default: Date.now(),
        required: true,
    },
    hectareas: {
        type: Number,
        required: true,
        trim: true,
    },
    agroquimico: {
        type: String,
        required: true,
        trim: true
    },
    ubicacion: {
        type: String,
        trim: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente"
    },
    // cliente: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }
},{
    timestamps: true
}
);

//Crear el modelo y asignar tabla  nombreModel    schema 
const Trabajo = mongoose.model("Trabajo", trabajoSchema);

// hacerlo disponible para usarlo en otros archivos
export default Trabajo; 