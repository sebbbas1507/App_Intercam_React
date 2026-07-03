import express from "express"
import morgan from "morgan"
import { Server as SocketServer} from "socket.io"
import http from "http"
import cors from "cors"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import router from "./routes/message.js"



//Configuracion Mongoose
var url =  "mongodb+srv://mibarrio2023:Contrasenia@mibarrio.y0qb8ww.mongodb.net/?"

//Configuración para evitar fallos en la conexión con mongoDB
mongoose.Promise = global.Promise;

const app = express()
const PORT = 4001
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
app.use(bodyParser.urlencoded({ extended: false }));
//Cualquier tipo de petición lo convertimos a json:
app.use(bodyParser.json());
app.use("/api", router)

io.on('connection', (socket) =>{
    console.log(socket.id)
    console.log("Cliente conectado")

    socket.on("message", (message, nickname) =>(
        //Envio al resto de clientes
        socket.broadcast.emit("message",{
            body: message,
            from: nickname
        })


    ))
})

//Nos conectamos a mongoDB. Opción { useNewUrlParser: true } para utilizar las últimas funcionalidades de mongoDB
mongoose.connect(url, { useNewUrlParser: true }).then(() =>{
    console.log('Conexión con la BDD realizada con éxito!!!');
    server.listen(PORT, () =>{
		console.log('servidor ejecutándose en http://localhost:', PORT );
	});
})