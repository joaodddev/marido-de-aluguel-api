const express = require('express')
const router = express.Router()
const { autenticar } = require('../middlewares/auth.middleware')
const { listarPorPrestador, criar } = require('../controllers/avaliacoes.controller')

router.get('/:prestadorId', listarPorPrestador)
router.post('/', autenticar, criar)

module.exports = router