import Evento from '../models/evento.js'

var controller = {
    //Función para guardar ua publicacion 
    save: (req, res) => {
        var params = req.body
        var evento = new Evento()
        evento.title = params.title
        evento.description = params.description
        evento.coordinate = params.coordinate
        evento.latitude = params.latitude
        evento.longitude = params.longitude
        evento.date = params.date
        console.log(evento)
        evento.save((error, eventoStored) =>{
            if(error || !eventoStored){
                return res.status(404).send({
                    status: 'error',
                    message: 'No ha sido posible guardar el evento'
                })
            }
            return res.status(200).send({
                status: 'success',
                eventoStored
            })

        })
    },

    //Función para obtener las publicaciones
    getEventos: (req, res) => {
        var query = Evento.find({})

        query.sort('-_id').exec((error, eventos) => {
            if(error){
				return res.status(500).send({
					status: "error",
					message: "Error al extraer los datos"
				})
			}

			//Si no existen artículos:
			if(!eventos){
				return res.status(404).send({
					status: "error",
					message: "No hay eventos para mostrar"
				})
			}

			return res.status(200).send({
				status: "success",
				eventos
			})

        })
    }
}

export default controller