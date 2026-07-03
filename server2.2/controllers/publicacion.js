import Publicacion from '../models/publicacion.js'

var controller = {
    //Función para guardar ua publicacion 
    save: (req, res) => {
        var params = req.body
        var publicacion = new Publicacion()
        publicacion.from = params.from
        publicacion.fecha = params.fecha
        publicacion.texto = params.texto

        publicacion.nombre = params.nombre
        publicacion.valorcomercial = params.valorcomercial
        publicacion.factura = params.factura
        publicacion.caja = params.caja
        publicacion.manuales = params.manuales


        publicacion.imagen = params.imagen
        publicacion.barrio = params.barrio
        publicacion.like = params.like
        console.log(publicacion)
        publicacion.save((error, publicacionStored) =>{
            if(error || !publicacionStored){
                return res.status(404).send({
                    status: 'error',
                    message: 'No ha sido posible guardar el mensaje'
                })
            }
            return res.status(200).send({
                status: 'success',
                publicacionStored
            })

        })
    },
    
    // eliminar publicacion
    deletePublicacion: async (req, res) => { // 🔹 Agregar async aquí
        try {
            var id = req.params.id;
            var publicacionEliminada = await Publicacion.findByIdAndDelete(id); // 🔹 Corrección aquí
    
            if (!publicacionEliminada) {
                return res.status(404).json({ message: "Publicación no encontrada" });
            }
    
            return res.status(200).json({ message: "Publicación eliminada correctamente" });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar la publicación", error });
        }
    },









    //Funcion Like
    updateLikes: async (req, res) => {
        try {
            console.log("🔥 Recibida petición PUT");
            console.log("📩 Body:", req.body);
            console.log("🆔 Params:", req.params);
    
            const publicacionId = req.params.id;
    
            if (!publicacionId) {
                return res.status(400).send({ status: "error", message: "ID no proporcionado" });
            }
    
            const publicacion = await Publicacion.findById(publicacionId);
    
            if (!publicacion) {
                console.log("❌ No se encontró la publicación con ID:", publicacionId);
                return res.status(404).send({ status: "error", message: "Publicación no encontrada" });
            }
    
            publicacion.like += 1;
            await publicacion.save();
    
            console.log("✅ Like actualizado. Nuevo conteo:", publicacion.like);
    
            return res.status(200).send({ status: "success", publicacion });
        } catch (error) {
            console.error("🚨 Error en updateLikes:", error);
            return res.status(500).send({ status: "error", message: "Error al actualizar el like" });
        }
    }
    ,
    
    
    //Función para obtener las publicaciones
    getPublicaciones: (req, res) => {
        var query = Publicacion.find({})

        query.sort('-_id').exec((error, publicaciones) => {
            if(error){
				return res.status(500).send({
					status: "error",
					message: "Error al extraer los datos"
				})
			}

			//Si no existen artículos:
			if(!publicaciones){
				return res.status(404).send({
					status: "error",
					message: "No hay publicaciones para mostrar"
				})
			}

			return res.status(200).send({
				status: "success",
				publicaciones
			})

        })
    },


    //actualizar
    updatePublicacion: async (req, res) => {
        try {
            const publicacionId = req.params.id;
            const updates = req.body; // Recibir datos actualizados desde el frontend

            // Verificar si la publicación existe
            const publicacion = await Publicacion.findById(publicacionId);
            if (!publicacion) {
                return res.status(404).send({
                    status: "error",
                    message: "Publicación no encontrada",
                });
            }

            // Actualizar la publicación
            const publicacionActualizada = await Publicacion.findByIdAndUpdate(
                publicacionId,
                updates,
                { new: true } // Devuelve la publicación actualizada
            );

            return res.status(200).send({
                status: "success",
                message: "Publicación actualizada con éxito",
                publicacion: publicacionActualizada,
            });

        } catch (error) {
            console.error("🚨 Error al actualizar la publicación:", error);
            return res.status(500).send({
                status: "error",
                message: "Error al actualizar la publicación",
                error: error.message,
            });
        }
    },




    getPublicacion: async (req, res) => {
        try {
            const { id } = req.params;
            console.log("🔍 Buscando publicación con ID:", id);
    
            if (!id) {
                return res.status(400).json({ status: "error", message: "ID no proporcionado" });
            }
    
            const publicacion = await Publicacion.findById(id);
    
            if (!publicacion) {
                return res.status(404).json({ status: "error", message: "Publicación no encontrada" });
            }
    
            console.log("✅ Publicación encontrada:", publicacion);
            return res.status(200).json({ status: "success", publicacion });
    
        } catch (error) {
            console.error("🚨 Error al obtener la publicación:", error);
            return res.status(500).json({ status: "error", message: "Error interno del servidor" });
        }
    }
}

export default controller