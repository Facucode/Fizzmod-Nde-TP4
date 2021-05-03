import { createTransport } from 'nodemailer';
import fs from 'fs';

const sendMail = async data => {

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'nodefacumail@hotmail.com',
        pass: 'F4CUM41L1995'
    },
   
});

let productos = '';
data.forEach(producto => {
    productos += `
    <tr>
        <td>${producto.nombre}</td>
        <td>$${producto.precio}</td>
        <td>${producto.descripcion}</td>
        <td>
        <img src=${producto.url} alt=${producto.nombre}/>
        </td>
        </tr>`
    });

    try{
        const email = await fs.promises.readFile('correo.data','utf-8')
        const mailOptions = {
            from: 'Facu',
            to: email,
            subject: 'Lista de productos',
            html: `
            <head>
            <style>
                td{text-align:center}
                img{height: 70px;}
            </style>
            </head>
            <div>
                <h2>Lista de Productos:</h2>
                <table>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descripcion</th>
                        <th>Foto</th>
                    </tr>
                    ${productos}
                </table>
            </div>`
        };
    
    transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                console.log(err);
                return err;
            }
            console.log(info);

        });
    }
    catch(error) {
        console.log(`ERROR: ${error}`);
    };
}

export default sendMail