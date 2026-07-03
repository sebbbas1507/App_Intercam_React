import express from 'express'
import morgan from 'morgan'
import {Server as SocketServer} from 'socket.io'
import http from 'http'
import cors from 'cors'
import {PORT} from './config.js'
import mongoose from 'mongoose'
import router from './routes/publicacion.js'
import bodyParser from 'body-parser'
import publicacion from './models/publicacion.js'

//Mongoose configuration **********************************************************
//Cambiar "Contrasenia" por la contraseña de la base de datos en MongoDB Atlas del cluster creado.

var url = 'mongodb+srv://mibarrio2023:Contraseniamibarrio.y0qb8ww.mongodb.net/?'
//Configuración para evitar fallos en la conexión con mongoDB
mongoose.Promise = global.Promise;

const app = express()
//Creamos el servidor con el módulo http de node
const server = http.createServer(app)
//Utilizamos como servidor el proporcionado por socket.io. Configuramos cors indicando que cualquier servidor se puede conectar
const io = new SocketServer(server, {
    cors: {
        origin: '*'
    }
})

app.use(cors())

//Vemos las peticiones por consola utilizando el paquete morgan en modo dev
app.use(morgan('dev'))

//Cargamos el bodyParser: middleware para analizar cuerpos de a través de la URL
//Este analizador acepta solo la codificación UTF-8 contenida en el body
//Cualquier tipo de petición lo convertimos a json:
// Aumentamos el límite del bodyParser
app.use(bodyParser.urlencoded({ extended: false, limit: "70mb" }));
app.use(bodyParser.json({ limit: "70mb" }));

//Escuchamos la conexión de los clientes. Podemos imprimir el id del cliente conectado
io.on('connection', (socket) =>{
    //console.log('user connected')
    //console.log(socket.id)

    socket.on('publicacion', (nickname, fecha, texto, nombre, valorcomercial, factura, caja, manuales, imagen, barrio, like) => {
        console.log(publicacion)
        //Envio al resto de clientes con broadcast.emit
        socket.broadcast.emit('publicacion', {
            from: nickname,
            fecha: fecha,
            body: texto,
            nombre: nombre,
            valorcomercial: valorcomercial,
            factura: factura,
            caja: caja,
            manuales: manuales,
            imagen: imagen,
            barrio: barrio,
            like: like
        })
    })
})

//**** Ficheros ruta **************************************************************
app.use('/api', router);


//Nos conectamos a mongoDB. Opción { useNewUrlParser: true } para utilizar las últimas funcionalidades de mongoDB
mongoose.connect(url, { useNewUrlParser: true }).then(() =>{
    console.log('Conexión con la BDD realizada con éxito!!!');
    server.listen(PORT, () =>{
		console.log('servidor ejecutándose en http://localhost:', PORT );
	});
})