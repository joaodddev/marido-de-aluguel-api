const supabase = require('../lib/supabase')

const listarPorPrestador = async (req, res) => {
  const { data, error } = await supabase
    .from('avaliacoes')
    .select(`
      *,
      usuarios!avaliacoes_cliente_id_fkey (nome)
    `)
    .eq('prestador_id', req.params.prestadorId)
    .order('criado_em', { ascending: false })

  if (error) return res.status(500).json({ erro: error.message })

  return res.json(data)
}

const criar = async (req, res) => {
  const { agendamento_id, prestador_id, nota, comentario } = req.body

  if (!agendamento_id || !prestador_id || !nota) {
    return res.status(400).json({ erro: 'Campos obrigatórios: agendamento_id, prestador_id, nota' })
  }

  if (nota < 1 || nota > 5) {
    return res.status(400).json({ erro: 'Nota deve ser entre 1 e 5' })
  }

  const { data: agendamento } = await supabase
    .from('agendamentos')
    .select('status, cliente_id')
    .eq('id', agendamento_id)
    .single()

  if (!agendamento) {
    return res.status(404).json({ erro: 'Agendamento não encontrado' })
  }

  if (agendamento.status !== 'concluido') {
    return res.status(400).json({ erro: 'Só é possível avaliar agendamentos concluídos' })
  }

  if (agendamento.cliente_id !== req.usuario.id) {
    return res.status(403).json({ erro: 'Você não pode avaliar este agendamento' })
  }

  const { data, error } = await supabase
    .from('avaliacoes')
    .insert({
      agendamento_id,
      prestador_id,
      cliente_id: req.usuario.id,
      nota,
      comentario
    })
    .select()
    .single()

  if (error) return res.status(500).json({ erro: error.message })

  const { data: todasAvaliacoes } = await supabase
    .from('avaliacoes')
    .select('nota')
    .eq('prestador_id', prestador_id)

  const media = todasAvaliacoes.reduce((acc, a) => acc + a.nota, 0) / todasAvaliacoes.length

  await supabase
    .from('prestadores')
    .update({ avaliacao_media: media.toFixed(1) })
    .eq('id', prestador_id)

  return res.status(201).json(data)
}

module.exports = { listarPorPrestador, criar }