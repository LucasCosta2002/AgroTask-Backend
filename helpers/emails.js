import nodemailer from 'nodemailer'

export const emailRegistro = async datosUsuario =>{

    const { email, nombre, token} = datosUsuario;

    //Nodemailer API
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            //ocultar en env
            user: process.env.EMAIL_USER, //correo registrado
            pass: process.env.EMAIL_PASS //contraseña generada de google
        }
    });

    // informacion del email
    const informacion = await transporter.sendMail({
        from: '"AgroTask" <administrador',
        to: email, 
        subject: "AgroTask - Confirmá tu Cuenta ✔", 
        text: "Confirma tu Cuenta en AgroTask",
        html: `<p>Hola ${nombre}, Confirma tu cuenta en AgroTask </p>
        <p>Tu cuenta está casi lista, solo tenés que confirmar tu contraseña en el siguiente enlace: 
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a></p>
        
        <p>Si no creaste esta cuenta, ignora el mensaje.</p>`
    })
}   

export const emailOlvidePassword= async datosUsuario =>{

    const { email, nombre, token} = datosUsuario;

    //Nodemailer API
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            //ocultar en env
            user: process.env.EMAIL_USER, //correo registrado
            pass: process.env.EMAIL_PASS //contraseña generada de google
        }
    });

    // informacion del email
    const informacion = await transporter.sendMail({
        from: '"AgroTask" <administrador',
        to: email, 
        subject: "AgroTask - Reestablece tu constraseña",
        text: "Reestablece tu constraseña",
        html: `<p>Hola ${nombre}, has solicitado restablecer tu constraseña de AgroTask </p>
        <p>Sigue el siguiente enlace para generar una nueva contraseña: 
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Contraseña</a></p>
        
        <p>Si no solicitaste este cambio, ignora el mensaje.</p>`
    })
}   