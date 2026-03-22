const supabase = require('../lib/supabase')

const autenticar = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' })
  }

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' })
  }

  req.usuario = data.user
  next()
}

module.exports = { autenticar }