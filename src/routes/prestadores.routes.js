const express = require('express')
const router = express.Router()
const { autenticar } = require('../middlewares/auth.middleware')
const {
  listar,
  buscarPorId,
  criar,
  atualizar
} = require('../controllers/prestadores.controller')

router.get('/', listar)
router.get('/:id', buscarPorId)
router.post('/', autenticar, criar)
router.put('/:id', autenticar, atualizar)

module.exports = router