const supabase = require('../lib/supabase')

const listar = async (req, res) => {
  const { regiao, especialidade } = req.query

  let query = supabase.from('prestadores').select('*')

  if (regiao) query = query.ilike('regiao', `%${regiao}%`)
  if (especialidade) query = query.contains('especialidades', [especialidade])

  const { data, error } = await query

  if (error) return res.status(500).json({ erro: error.message })

  return res.json(data)
}

const buscarPorId = async (req, res) => {
  const { data, error } = await supabase
    .from('prestadores')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ erro: 'Prestador não encontrado' })

  return res.json(data)
}

const criar = async (req, res) => {
  const { especialidades, regiao, bio } = req.body

  console.log('Usuario logado ID:', req.usuario.id)

  const { data: usuario, error: erroUsuario } = await supabase
    .from('usuarios')
    .select('tipo')
    .eq('id', req.usuario.id)
    .single()

  console.log('Usuario encontrado:', JSON.stringify(usuario))
  console.log('Erro ao buscar:', JSON.stringify(erroUsuario))

  if (usuario?.tipo !== 'prestador') {
    return res.status(403).json({ erro: 'Apenas prestadores podem criar um perfil' })
  }

  const { data, error } = await supabase
    .from('prestadores')
    .insert({ usuario_id: req.usuario.id, especialidades, regiao, bio })
    .select()
    .single()

  if (error) return res.status(500).json({ erro: error.message })

  return res.status(201).json(data)
}

const atualizar = async (req, res) => {
  const { especialidades, regiao, bio, foto_url } = req.body

  const { data, error } = await supabase
    .from('prestadores')
    .update({ especialidades, regiao, bio, foto_url })
    .eq('id', req.params.id)
    .eq('usuario_id', req.usuario.id)
    .select()
    .single()

  if (error) return res.status(500).json({ erro: error.message })

  return res.json(data)
}

module.exports = { listar, buscarPorId, criar, atualizar }