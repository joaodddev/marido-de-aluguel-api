# marido-de-aluguel-api

# Estrutura do projeto:
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

# Fluxo do projeto:
App Mobile
    ↓ requisição HTTP (JSON)
Express.js (Node)
    ↓ valida dados (Zod)
    ↓ verifica auth (JWT / Supabase Auth)
    ↓ executa lógica no controller
Supabase (PostgreSQL)
    ↓ retorna dados
Express.js
    ↓ resposta JSON
App Mobile
