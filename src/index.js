const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const prestadoresRoutes = require('./routes/prestadores.routes')
const agendamentosRoutes = require('./routes/agendamentos.routes')
const avaliacoesRoutes = require('./routes/avaliacoes.routes')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/prestadores', prestadoresRoutes)
app.use('/agendamentos', agendamentosRoutes)
app.use('/avaliacoes', avaliacoesRoutes)

app.get('/', (req, res) => {
  res.json({ status: 'API rodando!', versao: '1.0.0' })
})

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})