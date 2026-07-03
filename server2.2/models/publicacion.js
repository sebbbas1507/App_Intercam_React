import {mongoose} from 'mongoose';

var Schema = mongoose.Schema;

var PublicacionSchema = new Schema({
    from: String,
    fecha: Date,
    texto: String,

    nombre: String,
    valorcomercial: Number,
    factura: String,
    caja: String,
    manuales: String,
    
    imagen: String,
    barrio: String,
    like: Number,

})

export default mongoose.model('Publicacion', PublicacionSchema)



