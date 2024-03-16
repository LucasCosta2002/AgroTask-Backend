import mongoose from 'mongoose';

//definir tabla en DB
const clientSchema = mongoose.Schema({
    name: {
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
    phone: {
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
const Client = mongoose.model("Client", clientSchema);

// hacerlo disponible para usarlo en otros archivos
export default Client; 