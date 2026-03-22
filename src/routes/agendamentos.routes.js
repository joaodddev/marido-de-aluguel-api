const express = require('express')
const router = express.Router()
const { autenticar } = require('../middlewares/auth.middleware')
const {
  listar,
  criar,
  atualizarStatus,
  cancelar
} = require('../controllers/agendamentos.controller')

router.get('/', autenticar, listar)
router.post('/', autenticar, criar)
router.put('/:id', autenticar, atualizarStatus)
router.delete('/:id', autenticar, cancelar)

module.exports = router