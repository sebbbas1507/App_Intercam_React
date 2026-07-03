import express from 'express'
import controller from '../controllers/evento.js'

var router = express.Router();

router.post('/save', controller.save)
router.get('/eventos', controller.getEventos)

export default router