import AsyncStorage from '@react-native-async-storage/async-storage'
import api from './api'

// Cadastrar novo usuário
export const registro = async ({ email, senha, nome, telefone, tipo }) => {
  const data = await api('/auth/registro', {
    method: 'POST',
    body: JSON.stringify({ email, senha, nome, telefone, tipo })
  })
  return data
}

// Login — salva o token automaticamente
export const login = async ({ email, senha }) => {
  const data = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  })

  await AsyncStorage.setItem('token', data.token)
  await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario))

  return data
}

// Logout — remove o token
export const logout = async () => {
  await AsyncStorage.removeItem('token')
  await AsyncStorage.removeItem('usuario')
}

// Verifica se o usuário está logado
export const estaLogado = async () => {
  const token = await AsyncStorage.getItem('token')
  return !!token
}

// Retorna os dados do usuário salvo localmente
export const getUsuarioLocal = async () => {
  const usuario = await AsyncStorage.getItem('usuario')
  return usuario ? JSON.parse(usuario) : null
}

// Busca o perfil atualizado do servidor
export const getPerfil = async () => {
  return await api('/auth/perfil')
}
