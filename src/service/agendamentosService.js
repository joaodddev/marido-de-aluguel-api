import api from './api'

// Listar meus agendamentos
export const listarAgendamentos = async () => {
  return await api('/agendamentos')
}

// Criar novo agendamento
export const criarAgendamento = async ({ prestador_id, servico, data_hora }) => {
  return await api('/agendamentos', {
    method: 'POST',
    body: JSON.stringify({ prestador_id, servico, data_hora })
  })
}

// Atualizar status do agendamento
// status aceita: 'pendente', 'confirmado', 'concluido', 'cancelado'
export const atualizarStatus = async (id, status) => {
  return await api(`/agendamentos/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
}

// Cancelar agendamento
export const cancelarAgendamento = async (id) => {
  return await api(`/agendamentos/${id}`, {
    method: 'DELETE'
  })
}
