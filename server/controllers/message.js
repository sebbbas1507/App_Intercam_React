import Message from '../models/message.js'

var controller = {
    //Función para guardar un mensaje
    save: (req, res) => {
        var params = req.body
        var message = new Message()
        message.message = params.message
        message.from = params.from
        console.log(message)
        message.save()
        .then(messageStored => {
          if (!messageStored) {
            return res.status(404).send({
              status: 'error',
              message: 'No ha sido posible guardar el mensaje'
            });
          }
          return res.status(200).send({
            status: 'success',
            messageStored
          });
        })
        .catch(error => {
          return res.status(500).send({
            status: 'error',
            message: 'Error al guardar el mensaje'
          });
        });
    },

    //Función para obtener los mensajes
    getMessages: async (req, res) => {
        try {
            const messages = await Message.find({}).sort('-_id').exec();
            
            if (messages.length === 0) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay mensajes para mostrar"
                });
            }
    
            return res.status(200).send({
                status: "success",
                messages
            });
        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Error al extraer los datos"
            });
        }
    }
}

export default controller