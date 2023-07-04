import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

//definir tabla en DB
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    token: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
}
);

//hashear password
usuarioSchema.pre("save", async function(next){
    //si el user no mofifica el pasword, pasar al siguiente middleware
    if(!this.isModified("password")) next()
    const salt = await bcrypt.genSalt(5) //hash de 10 caracteres
    this.password = await bcrypt.hash(this.password, salt); //string a hashear y las rondas 
})

usuarioSchema.methods.comprobarPassword = async function(passwordForm){
    //comparar password hasheados, el nuevo y el de la db
    return await bcrypt.compare(passwordForm, this.password)
}

//Crear el modelo y asignar tabla  nombreModel    schema 
const Usuario = mongoose.model("Usuario", usuarioSchema);

// hacerlo disponible para usarlo en otros archivos
export default Usuario; 


