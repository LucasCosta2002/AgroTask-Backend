import mongoose from 'mongoose';

//definir tabla en DB
const workSchema = mongoose.Schema({
    date: {
        type: String,
        default: Date.now(),
        required: true,
    },
    hectares: {
        type: Number,
        required: true,
        trim: true,
    },
    agrochemical: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
}
);

//Crear el modelo y asignar tabla  nombreModel    schema 
const Work = mongoose.model("Work", workSchema);

// hacerlo disponible para usarlo en otros archivos
export default Work; 