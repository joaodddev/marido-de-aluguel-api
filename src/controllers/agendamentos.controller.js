const supabase = require('../lib/supabase')

const listar = async (req, res) => {
  const userId = req.usuario.id

  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      *,
      prestadores (id, regiao, bio, especialidades),
      usuarios!agendamentos_cliente_id_fkey (id, nome, telefone)
    `)
    .or(`cliente_id.eq.${userId},prestadores.usuario_id.eq.${userId}`)
    .order('data_hora', { ascending: true })

  if (error) return res.status(500).json({ erro: error.message })

  return res.json(data)
}

const criar = async (req, res) => {
  const { prestador_id, servico, data_hora } = req.body

  if (!prestador_id || !servico || !data_hora) {
    return res.status(400).json({ erro: 'Campos obrigatórios: prestador_id, servico, data_hora' })
  }

  const { data, error } = await supabase
    .from('agendamentos')
    .insert({
      cliente_id: req.usuario.id,
      prestador_id,
      servico,
      data_hora,
      status: 'pendente'
    })
    .select()
    .single()

  if (error) return res.status(500).json({ erro: error.message })

  return res.status(201).json(data)
}

const atualizarStatus = async (req, res) => {
  const { status } = req.body
  const statusValidos = ['pendente', 'confirmado', 'concluido', 'cancelado']

  if (!statusValidos.includes(status)) {
    return res.status(400).json({ erro: `Status inválido. Use: ${statusValidos.join(', ')}` })
  }

  const { data, error } = await supabase
    .from('agendamentos')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ erro: error.message })

  return res.json(data)
}

const cancelar = async (req, res) => {
  const { error } = await supabase
    .from('agendamentos')
    .update({ status: 'cancelado' })
    .eq('id', req.params.id)
    .eq('cliente_id', req.usuario.id)

  if (error) return res.status(500).json({ erro: error.message })

  return res.json({ mensagem: 'Agendamento cancelado.' })
}

module.exports = { listar, criar, atualizarStatus, cancelar }