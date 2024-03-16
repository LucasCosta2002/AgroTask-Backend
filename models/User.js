import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

//definir tabla en DB
const userSchema = mongoose.Schema({
    name: {
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
    phone: {
        type: String,
        trim: true
    },
    token: {
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
}
);

//hashear password
userSchema.pre("save", async function(next){
    //si el user no mofifica el pasword, pasar al siguiente middleware
    if(!this.isModified("password")) next()
    const salt = await bcrypt.genSalt(5) //hash de 10 caracteres
    this.password = await bcrypt.hash(this.password, salt); //string a hashear y las rondas 
})

userSchema.methods.comprobarPassword = async function(passwordForm){
//comparar password hasheados,      el nuevo y el de la db
    return await bcrypt.compare(passwordForm, this.password)
}

//Crear el modelo y asignar tabla  nombreModel    schema 
const User = mongoose.model("User", userSchema);

// hacerlo disponible para usarlo en otros archivos
export default User; 


