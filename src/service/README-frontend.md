# Integração React Native — Marido de Aluguel API

Guia completo para consumir a API do backend no app React Native + Expo.

---

## Instalação

```bash
npm install @react-native-async-storage/async-storage
```

---

## Estrutura sugerida de arquivos

```
src/
├── services/
│   ├── api.js                  ← helper base (injeta token automaticamente)
│   ├── authService.js          ← login, registro, logout
│   ├── prestadoresService.js   ← listar, buscar, criar, atualizar
│   ├── agendamentosService.js  ← listar, criar, atualizar, cancelar
│   └── avaliacoesService.js    ← listar, criar
└── screens/
    ├── LoginScreen.js
    ├── PrestadoresScreen.js
    └── AgendarScreen.js
```

---

## Configuração

No arquivo `api.js`, troca a URL pela URL real do backend:

```js
const API_URL = 'https://sua-url.up.railway.app'
```

---

## Como usar

### Login

```js
import { login, logout, estaLogado } from '../services/authService'

// Fazer login (token salvo automaticamente no AsyncStorage)
await login({ email: 'joao@email.com', senha: '123456' })

// Verificar se está logado
const logado = await estaLogado() // true ou false

// Logout
await logout()
```

### Listar prestadores

```js
import { listarPrestadores } from '../services/prestadoresService'

// Todos os prestadores
const prestadores = await listarPrestadores()

// Com filtros
const eletricistas = await listarPrestadores({ especialidade: 'elétrica' })
const norte = await listarPrestadores({ regiao: 'norte' })
```

### Criar agendamento

```js
import { criarAgendamento } from '../services/agendamentosService'

await criarAgendamento({
  prestador_id: 'uuid-do-prestador',
  servico: 'Instalação de tomadas',
  data_hora: '2026-04-10T14:00:00'
})
```

### Avaliar prestador

```js
import { criarAvaliacao } from '../services/avaliacoesService'

// O agendamento precisa estar com status 'concluido'
await criarAvaliacao({
  agendamento_id: 'uuid',
  prestador_id: 'uuid',
  nota: 5,
  comentario: 'Excelente profissional!'
})
```

---

## Tratamento de erros

Todos os services lançam um `Error` com a mensagem do backend quando algo dá errado. Use try/catch:

```js
try {
  await login({ email, senha })
} catch (error) {
  Alert.alert('Erro', error.message)
  // ex: "Email ou senha incorretos"
}
```

---

## Fluxo de autenticação

```
App abre
  → verifica AsyncStorage (token existe?)
    → SIM: vai para Home
    → NÃO: vai para Login

Login
  → POST /auth/login
  → salva token no AsyncStorage
  → redireciona para Home

Logout
  → remove token do AsyncStorage
  → redireciona para Login

Toda requisição protegida
  → api.js lê o token do AsyncStorage
  → injeta no header Authorization automaticamente
  → se receber 401: redirecionar para Login
```

---

## Códigos de resposta

| Código | Significado | O que fazer no app |
|---|---|---|
| `200` | Sucesso | Exibe os dados |
| `201` | Criado | Exibe mensagem de sucesso |
| `400` | Dados inválidos | Exibe mensagem de erro ao usuário |
| `401` | Token inválido/expirado | Redireciona para Login |
| `403` | Sem permissão | Exibe mensagem de acesso negado |
| `404` | Não encontrado | Exibe mensagem de item não encontrado |
| `500` | Erro do servidor | Exibe mensagem genérica de erro |
