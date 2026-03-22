const supabase = require('../lib/supabase')

const registro = async (req, res) => {
  const { email, senha, nome, telefone, tipo } = req.body

  if (!email || !senha || !nome || !tipo) {
    return res.status(400).json({ erro: 'Campos obrigatórios: email, senha, nome, tipo' })
  }

  const { data, error } = await supabase.auth.signUp({ email, password: senha })

  if (error) return res.status(400).json({ erro: error.message })

  await supabase.from('usuarios').insert({
    id: data.user.id,
    nome,
    telefone,
    tipo
  })

  return res.status(201).json({ mensagem: 'Usuário criado com sucesso!' })
}

const login = async (req, res) => {
  const { email, senha } = req.body

  console.log('Tentando login com:', email, senha)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  })

  console.log('Resposta Supabase:', JSON.stringify(error))

  if (error) return res.status(401).json({ erro: 'Email ou senha incorretos' })

  return res.json({
    token: data.session.access_token,
    usuario: {
      id: data.user.id,
      email: data.user.email
    }
  })
}

const perfil = async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', req.usuario.sub)
    .single()

  if (error) return res.status(404).json({ erro: 'Usuário não encontrado' })

  return res.json(data)
}

module.exports = { registro, login, perfil }