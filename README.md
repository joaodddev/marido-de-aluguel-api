# Marido de Aluguel — API

Backend REST para o aplicativo mobile **Marido de Aluguel**, que conecta clientes a prestadores de serviços domésticos.

---

## Tecnologias

- **Runtime:** Node.js (LTS)
- **Framework:** Express.js
- **Banco de dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth (JWT)
- **Validação:** Zod
- **CORS:** habilitado via pacote `cors`

---

## Como rodar localmente

### Pré-requisitos

- Node.js instalado (recomendado via nvm)
- Conta no [Supabase](https://supabase.com) com projeto criado

### Instalação

```bash
git clone https://github.com/seu-usuario/marido-de-aluguel-api
cd marido-de-aluguel-api
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=sua_service_role_key
PORT=3000
```

### Rodando em desenvolvimento

```bash
npm run dev
```

### Rodando em produção

```bash
npm start
```

O servidor sobe na porta `3000` por padrão.

---

## Estrutura do projeto

```
marido-de-aluguel-api/
├── src/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── prestadores.routes.js
│   │   ├── agendamentos.routes.js
│   │   └── avaliacoes.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── prestadores.controller.js
│   │   ├── agendamentos.controller.js
│   │   └── avaliacoes.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── lib/
│   │   └── supabase.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Banco de dados

### Tabelas

| Tabela | Descrição |
|---|---|
| `usuarios` | Perfis de clientes e prestadores |
| `prestadores` | Dados profissionais dos prestadores |
| `agendamentos` | Serviços agendados entre cliente e prestador |
| `avaliacoes` | Avaliações dos prestadores após serviço concluído |

---

## Autenticação

A API usa **JWT via Supabase Auth**. Rotas protegidas exigem o token no header:

```
Authorization: Bearer SEU_TOKEN_JWT
```

### Como obter o token

1. Cadastre um usuário via `POST /auth/registro`
2. Faça login via `POST /auth/login`
3. Copie o campo `token` da resposta
4. Use esse token no header `Authorization` das demais requisições

---

## Endpoints

### Auth

#### `POST /auth/registro`
Cadastra um novo usuário.

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "123456",
  "nome": "João Silva",
  "telefone": "11999999999",
  "tipo": "cliente"
}
```
> `tipo` aceita: `"cliente"` ou `"prestador"`

**Resposta:**
```json
{
  "mensagem": "Usuário criado com sucesso!"
}
```

---

#### `POST /auth/login`
Autentica o usuário e retorna o token JWT.

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGci...",
  "usuario": {
    "id": "uuid",
    "email": "joao@email.com"
  }
}
```

---

#### `GET /auth/perfil` 🔒
Retorna os dados do usuário logado.

**Resposta:**
```json
{
  "id": "uuid",
  "nome": "João Silva",
  "telefone": "11999999999",
  "tipo": "cliente",
  "criado_em": "2026-03-22T00:00:00"
}
```

---

### Prestadores

#### `GET /prestadores`
Lista todos os prestadores. Aceita filtros por query string.

**Filtros opcionais:**
```
GET /prestadores?regiao=norte
GET /prestadores?especialidade=elétrica
GET /prestadores?regiao=norte&especialidade=elétrica
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "usuario_id": "uuid",
    "especialidades": ["elétrica", "instalações"],
    "regiao": "Zona Norte",
    "bio": "10 anos de experiência",
    "foto_url": null,
    "avaliacao_media": 4.5
  }
]
```

---

#### `GET /prestadores/:id`
Busca um prestador pelo ID.

**Resposta:**
```json
{
  "id": "uuid",
  "usuario_id": "uuid",
  "especialidades": ["elétrica"],
  "regiao": "Zona Norte",
  "bio": "10 anos de experiência",
  "foto_url": null,
  "avaliacao_media": 4.5
}
```

---

#### `POST /prestadores` 🔒
Cria um perfil de prestador. Apenas usuários com `tipo: "prestador"` podem usar.

**Body:**
```json
{
  "especialidades": ["elétrica", "instalações"],
  "regiao": "Zona Norte",
  "bio": "10 anos de experiência em elétrica residencial"
}
```

**Resposta:** `201 Created`
```json
{
  "id": "uuid",
  "usuario_id": "uuid",
  "especialidades": ["elétrica", "instalações"],
  "regiao": "Zona Norte",
  "bio": "10 anos de experiência em elétrica residencial",
  "foto_url": null,
  "avaliacao_media": 0
}
```

---

#### `PUT /prestadores/:id` 🔒
Atualiza o perfil do prestador.

**Body (todos os campos opcionais):**
```json
{
  "especialidades": ["elétrica", "hidráulica"],
  "regiao": "Zona Sul",
  "bio": "Bio atualizada",
  "foto_url": "https://..."
}
```

---

### Agendamentos

#### `GET /agendamentos` 🔒
Lista os agendamentos do usuário logado (como cliente ou prestador).

**Resposta:**
```json
[
  {
    "id": "uuid",
    "cliente_id": "uuid",
    "prestador_id": "uuid",
    "servico": "Instalação de tomadas",
    "data_hora": "2026-04-10T14:00:00",
    "status": "pendente",
    "criado_em": "2026-03-22T00:00:00"
  }
]
```

---

#### `POST /agendamentos` 🔒
Cria um novo agendamento.

**Body:**
```json
{
  "prestador_id": "uuid-do-prestador",
  "servico": "Instalação de tomadas",
  "data_hora": "2026-04-10T14:00:00"
}
```

**Resposta:** `201 Created`
```json
{
  "id": "uuid",
  "cliente_id": "uuid",
  "prestador_id": "uuid",
  "servico": "Instalação de tomadas",
  "data_hora": "2026-04-10T14:00:00",
  "status": "pendente",
  "criado_em": "2026-03-22T00:00:00"
}
```

---

#### `PUT /agendamentos/:id` 🔒
Atualiza o status de um agendamento.

**Body:**
```json
{
  "status": "confirmado"
}
```

> `status` aceita: `"pendente"`, `"confirmado"`, `"concluido"`, `"cancelado"`

---

#### `DELETE /agendamentos/:id` 🔒
Cancela um agendamento (muda status para `"cancelado"`).

---

### Avaliações

#### `GET /avaliacoes/:prestadorId`
Lista todas as avaliações de um prestador.

**Resposta:**
```json
[
  {
    "id": "uuid",
    "nota": 5,
    "comentario": "Excelente profissional!",
    "criado_em": "2026-03-22T00:00:00",
    "usuarios": {
      "nome": "João Silva"
    }
  }
]
```

---

#### `POST /avaliacoes` 🔒
Cria uma avaliação. Só é possível avaliar agendamentos com status `"concluido"`.

**Body:**
```json
{
  "agendamento_id": "uuid",
  "prestador_id": "uuid",
  "nota": 5,
  "comentario": "Excelente profissional, muito pontual!"
}
```

> `nota` aceita valores de `1` a `5`

**Resposta:** `201 Created`

> A média de avaliação do prestador é recalculada automaticamente após cada nova avaliação.

---

## Códigos de resposta

| Código | Descrição |
|---|---|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Dados inválidos ou campos faltando |
| `401` | Token não fornecido ou inválido |
| `403` | Sem permissão para esta ação |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

---

## Legenda

🔒 Rota protegida — requer token JWT no header `Authorization: Bearer TOKEN`

---

## Observações para o front-end

- Salve o token JWT retornado no login no armazenamento local do app (`AsyncStorage` no React Native)
- Envie o token em **todas** as requisições protegidas no header `Authorization`
- O token expira — implemente renovação de sessão ou redirecione para login quando receber `401`
- Para upload de foto de perfil, use o Supabase Storage diretamente do front-end e salve a URL via `PUT /prestadores/:id`
