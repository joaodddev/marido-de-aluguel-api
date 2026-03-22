// ─────────────────────────────────────────
// Exemplo 1 — Tela de Login
// ─────────────────────────────────────────
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { login } from '../services/authService'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha')
      return
    }

    setCarregando(true)
    try {
      await login({ email, senha })
      navigation.replace('Home') // redireciona após login
    } catch (error) {
      Alert.alert('Erro', error.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Entrar</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={handleLogin}
        disabled={carregando}
      >
        <Text style={styles.botaoTexto}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 14, marginBottom: 16, fontSize: 16
  },
  botao: {
    backgroundColor: '#6C63FF', borderRadius: 8,
    padding: 16, alignItems: 'center', marginBottom: 16
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#6C63FF', fontSize: 14 }
})


// ─────────────────────────────────────────
// Exemplo 2 — Tela de Lista de Prestadores
// ─────────────────────────────────────────
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { listarPrestadores } from '../services/prestadoresService'

export default function PrestadoresScreen({ navigation }) {
  const [prestadores, setPrestadores] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarPrestadores()
  }, [])

  const carregarPrestadores = async () => {
    try {
      const data = await listarPrestadores()
      setPrestadores(data)
    } catch (error) {
      console.error(error)
    } finally {
      setCarregando(false)
    }
  }

  if (carregando) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#6C63FF" />
  }

  return (
    <FlatList
      data={prestadores}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.lista}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Prestador', { id: item.id })}
        >
          <Text style={styles.nome}>{item.bio}</Text>
          <Text style={styles.regiao}>{item.regiao}</Text>
          <Text style={styles.especialidades}>
            {item.especialidades?.join(' · ')}
          </Text>
          <Text style={styles.nota}>
            Avaliação: {item.avaliacao_media || 'Sem avaliações'}
          </Text>
        </TouchableOpacity>
      )}
    />
  )
}

const styles = StyleSheet.create({
  lista: { padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#eee'
  },
  nome: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  regiao: { fontSize: 13, color: '#888', marginBottom: 4 },
  especialidades: { fontSize: 13, color: '#6C63FF', marginBottom: 4 },
  nota: { fontSize: 13, color: '#444' }
})


// ─────────────────────────────────────────
// Exemplo 3 — Criar Agendamento
// ─────────────────────────────────────────
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { criarAgendamento } from '../services/agendamentosService'

export default function AgendarScreen({ route, navigation }) {
  const { prestadorId } = route.params
  const [servico, setServico] = useState('')
  const [dataHora, setDataHora] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleAgendar = async () => {
    if (!servico || !dataHora) {
      Alert.alert('Atenção', 'Preencha o serviço e a data/hora')
      return
    }

    setCarregando(true)
    try {
      await criarAgendamento({
        prestador_id: prestadorId,
        servico,
        data_hora: new Date(dataHora).toISOString()
      })
      Alert.alert('Sucesso', 'Agendamento criado!')
      navigation.goBack()
    } catch (error) {
      Alert.alert('Erro', error.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agendar Serviço</Text>

      <TextInput
        style={styles.input}
        placeholder="Descreva o serviço (ex: Instalação de tomadas)"
        value={servico}
        onChangeText={setServico}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Data e hora (ex: 2026-04-10T14:00)"
        value={dataHora}
        onChangeText={setDataHora}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={handleAgendar}
        disabled={carregando}
      >
        <Text style={styles.botaoTexto}>
          {carregando ? 'Agendando...' : 'Confirmar Agendamento'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, marginTop: 16 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 14, marginBottom: 16, fontSize: 16
  },
  botao: {
    backgroundColor: '#6C63FF', borderRadius: 8,
    padding: 16, alignItems: 'center'
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' }
})
