import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EventoSchema = new Schema({
    title: String,
    description: String,
    coordinate: {
        latitude: Number,
        longitude: Number,
    },
    date: Date,
});

export default mongoose.model('Evento', EventoSchema);
