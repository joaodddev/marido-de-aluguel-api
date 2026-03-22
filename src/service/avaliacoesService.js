import api from './api'

// Listar avaliações de um prestador
export const listarAvaliacoes = async (prestadorId) => {
  return await api(`/avaliacoes/${prestadorId}`)
}

// Criar avaliação (agendamento precisa estar com status 'concluido')
export const criarAvaliacao = async ({ agendamento_id, prestador_id, nota, comentario }) => {
  return await api('/avaliacoes', {
    method: 'POST',
    body: JSON.stringify({ agendamento_id, prestador_id, nota, comentario })
  })
}
