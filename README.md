# FitTrack - Monitoramento e Motivação para Exercícios 💪

> O **FitTrack** é um aplicativo completo de saúde e bem-estar projetado para ajudar os usuários a manterem a consistência em seus treinos. Desenvolvido com foco absoluto em retenção, o sistema utiliza um motor robusto de gamificação (missões diárias, acúmulo de XP, medalhas e ofensivas) aliado a uma arquitetura moderna Full-Stack orientada a dados.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

---

## 📋 Índice

* [Funcionalidades de Destaque](#-funcionalidades-de-destaque)
* [Arquitetura do Sistema](#-arquitetura-do-sistema)
* [Estrutura Arquitetural](#-estrutura-arquitetural)
* [Módulos da API](#-módulos-da-api)
* [Modelagem do Banco de Dados](#-modelagem-do-banco-de-dados)
* [Variáveis de Ambiente](#-variáveis-de-ambiente)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Como rodar o projeto localmente](#-como-rodar-o-projeto-localmente)
* [Autor](#-autor)

---

## ✨ Funcionalidades de Destaque

* **Integração Full-Stack Real-Time:** Sincronização de progresso e ofensivas (Streaks) diretamente na nuvem (PostgreSQL). O usuário não perde os dados ao trocar de celular.
* **Motor de Gamificação Dinâmico:** Catálogo de missões, exercícios e medalhas servidos dinamicamente pela API REST, permitindo atualizações do sistema sem necessidade de o usuário baixar novas versões na loja.
* **Notificações Push Locais:** Lembretes diários automatizados para ajudar o usuário a não perder a sua ofensiva, utilizando agendamento nativo do sistema operacional.
* **Acompanhamento de Desempenho:** Visualização do progresso através de gráficos interativos de volumetria semanal de XP.
* **UI/UX com Tema Dinâmico:** Utilização de um dicionário de tokens de design que garante consistência visual e permite a alternância fluida entre os temas Claro e Escuro.

---

## 🧱 Arquitetura do Sistema

O projeto adota o padrão **Monorepo**, garantindo a separação estrita de responsabilidades entre o cliente mobile e a API na nuvem.

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│     Frontend     │───>│   Backend API    │───>│    PostgreSQL    │
│ (React Native)   │    │ (Node.js/Express)│    │   (Prisma ORM)   │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

---

## 📂 Estrutura Arquitetural

O projeto foi refatorado para um padrão **Monorepo**, garantindo a separação estrita de responsabilidades:

```
FitTrack-App/
├── frontend/              # Aplicação Mobile
│   ├── src/
│   │   ├── components/    # Componentes de UI reutilizáveis
│   │   ├── contexts/      # Estado global integrado à API
│   │   ├── screens/       # Telas e renderização
│   │   ├── services/      # Cliente HTTP (Axios) e Storage local
│   │   └── styles/        # Tokens de design (Dark/Light mode)
│   └── .env.example       # Molde de configuração de IP
│
└── backend/               # API REST
    ├── prisma/            # Banco de Dados
    │   ├── schema.prisma  # Modelagem de entidades relacionais
    │   └── seed.ts        # Script de população do catálogo
    ├── src/
    │   ├── controllers/   # Interceptadores e respostas HTTP
    │   ├── services/      # Regras de negócio e consultas (Prisma)
    │   ├── routes/        # Mapeamento de endpoints
    │   └── server.ts      # Ponto de entrada do servidor
    └── prisma.config.ts   # Configurações do ORM v7
```

---

## 📦 Módulos da API

| Módulo | Descrição |
|--------|-----------|
| `users` | Criação de contas, autenticação e sincronização de progresso |
| `workouts` | Registro de conclusão de exercícios, cálculo de XP e ofensivas |
| `catalog` | Fornecimento dinâmico de exercícios, missões diárias e medalhas |
| `notifications` | Agendamento de lembretes locais via motor do sistema operacional |

---

## 💾 Modelagem do Banco de Dados

O banco de dados relacional foi estruturado para suportar o Core Loop de gamificação e manter um catálogo escalável e dinâmico.

```
USER (Usuários)
├── id, name, email, password
├── xp, level (Métricas de Gamificação)
│
WORKOUT (Histórico de Treinos)
├── userId (Foreign Key) -> Pertence ao User
├── title, durationMin, xpAwarded, createdAt
│
STREAK (Ofensivas)
├── userId (Foreign Key) -> Pertence ao User
├── currentStreak, maxStreak, lastWorkoutDate
│
EXERCISE (Catálogo de Exercícios)
├── id, name, details, dayOfWeek
│
DAILY_MISSION (Catálogo de Missões)
├── id, description, xp
│
MEDAL (Catálogo de Medalhas)
└── id, name, description, requirement, icon, color

```

---

## 🔧 Variáveis de Ambiente

Para o funcionamento correto em desenvolvimento, configure as seguintes chaves nos arquivos .env respectivos:

| Variável | Local | Descrição |
|----------|-----------|-----------|
| `DATABASE_URL` | /backend/.env | String de conexão do PostgreSQL (Ex: Neon.tech) |
| `EXPO_PUBLIC_API_URL` | /frontend/.env | IP local + Porta para comunicação do Axios |

---

## 🚀 Tecnologias Utilizadas

### Frontend (Mobile)
* **React Native & Expo:** Framework principal para desenvolvimento multiplataforma.
* **TypeScript:** Tipagem estática rigorosa e cliente HTTP centralizado.
* **Context API & React Navigation:** Gerenciamento de estado global e rotas nativas fluidas.
* **Expo Notifications & Chart Kit:** Integração nativa de lembretes e renderização de gráficos vetoriais (SVG).

### Backend (API)
* **Node.js & Express:** Motor de execução e framework de roteamento rápido para a API REST.
* **TypeScript:** Compartilhamento do mesmo ecossistema de tipagem do frontend.
* **PostgreSQL (Neon):** Banco de dados relacional Serverless.
* **Prisma ORM (v7):** Conexão robusta via adapters nativos (pg e @prisma/adapter-pg).
* **SX & CORS:** Motor de execução para desenvolvimento com Hot-Reload e permissões cross-origin.

---

## 💻 Como rodar o projeto localmente

Como o projeto é um Monorepo, você precisará iniciar a API e o Aplicativo em abas separadas do terminal.

1. Clone este repositório:
```
   git clone [https://github.com/andredevdantas/FitTrack-App.git]
   ```
   
2. Configuração do Backend (API):
Abra um terminal, acesse a pasta do backend e instale as dependências:
```
   cd backend
   npm install
```

* Crie um arquivo .env na pasta backend e adicione a variável DATABASE_URL.
* Crie as tabelas e popule o banco de dados inicial:
  
```
npx prisma db push
npx prisma db seed
```

* Inicie o servidor em modo desenvolvimento:: 
```
npm run dev
```
   
3. Configuração e Execução do Frontend (Mobile):
Abra uma nova aba no terminal, acesse a pasta do frontend e instale as dependências:
```
   cd frontend
   npm install
```
* Crie um arquivo .env copiando o modelo .env.example e insira o IP da sua rede local.

4. Inicie o servidor do Expo:
Inicie o servidor do Expo limpando o cache:
```
   npx expo start --clear
```
* Leia o QR Code com o aplicativo Expo Go (Android/iOS) ou pressione a para abrir no emulador Android.

* **Aviso de Ambiente:** Devido à implementação de expo-notifications, a visualização das notificações push em tempo real exige que a aplicação seja compilada através do EAS (Expo Application Services) ou utilizando o cliente expo-dev-client, pois o suporte a push notifications remotas foi descontinuado no app padrão do Expo Go.

---

## 👤 Autor
Desenvolvido por André Luis.