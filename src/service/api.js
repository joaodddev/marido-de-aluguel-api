import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'https://sua-url.up.railway.app' // troca pela URL real

// Helper base — injeta o token automaticamente em todas as requisições
const api = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.erro || 'Erro na requisição')
  }

  return data
}

export default api
