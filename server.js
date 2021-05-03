import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import model from './model/productos.js'
import fs from 'fs';
import validar from './validaciones/productos.js'
import setMail from './scripts/setMail.js';
import sendMail from './scripts/sendMail.js'



const app = express()

app.use(express.urlencoded({extended: true}))
app.engine('hbs', handlebars({extname:'.hbs', defaultLayout: 'index.hbs'}) )
app.set('views', './views')
app.set('view engine', 'hbs')

app.get('/',(req,res)=>{

    res.render('formulario')
})

app.post('/ingreso',(req, res)=> {
    let producto = req.body
    let val = validar(producto)
    if(val.result) {
        const productoNuevo = new model.producto(producto)
        productoNuevo.save((err,productoNuevo)=> {
            if(err) throw new Error (`error en escritura de producto: ${err}`)
            
            model.producto.find({}, (error, productos) => {
            if(error) {
                res.send(producto)
            }
            if(productos.length % 20 === 0) sendMail(productos);
        }).lean()
    })
    }
    else{
        res.send(val.error)
    }

    
    


})

app.get('/listar',(req,res)=>{
   /* model.producto.find({}, (err, productos) => {
        res.render('tabla', {productos});
    }).lean()
*/

model.producto.find({}, (err,productos) => {
    if(err) throw new Error(`error en lectura de usuarios: ${err}`)
    res.render('tabla',{productos})
}).lean()

})

app.get('/set-correo',(req,res)=>{
    res.render('set-correo')
})

app.post('/set-correo',async (req,res)=>{
    const email = req.body.email
    try{
        await fs.promises.writeFile('correo.data', email);
    }
    catch(error) {
        console.log(`ERROR: ${error}`);
        res.send(error);
    }
})



const PORT = process.env.PORT || 8080
//mongoose.connect('mongodb://localhost/test', {
mongoose.connect('mongodb+srv://facu:F4CU1995@productos.oyppc.mongodb.net/mibase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err=>{
    if(err) throw new Error(`Error de conexion en la base de datos: ${err}`)
    console.log('Base de datos conectada!')
    const server = app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${server.address().port}`)
        setMail()
    })
    server.on('error', error => console.log(`Error en servidor ${error}`))
    
})

