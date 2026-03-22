import api from './api'

// Listar todos os prestadores (com filtros opcionais)
export const listarPrestadores = async ({ regiao, especialidade } = {}) => {
  const params = new URLSearchParams()
  if (regiao) params.append('regiao', regiao)
  if (especialidade) params.append('especialidade', especialidade)

  const query = params.toString() ? `?${params.toString()}` : ''
  return await api(`/prestadores${query}`)
}

// Buscar prestador por ID
export const getPrestador = async (id) => {
  return await api(`/prestadores/${id}`)
}

// Criar perfil de prestador (precisa estar logado como prestador)
export const criarPrestador = async ({ especialidades, regiao, bio }) => {
  return await api('/prestadores', {
    method: 'POST',
    body: JSON.stringify({ especialidades, regiao, bio })
  })
}

// Atualizar perfil do prestador
export const atualizarPrestador = async (id, dados) => {
  return await api(`/prestadores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}
