# FitTrack - Monitoramento e Motivação para Exercícios 💪

O **FitTrack** é um aplicativo completo de saúde e bem-estar projetado para ajudar os usuários a manterem a consistência em seus treinos. Desenvolvido com foco absoluto em retenção, o sistema utiliza um motor robusto de gamificação (missões diárias, acúmulo de XP, medalhas e ofensivas) aliado a uma arquitetura moderna Full-Stack.

---

## ✨ Funcionalidades de Destaque

* **Arquitetura Full-Stack (Monorepo):** Divisão inteligente entre o cliente mobile (Frontend) e a API na nuvem (Backend) dentro do mesmo repositório, garantindo padronização e escalabilidade de código.
* **Gamificação e Retenção:** Sistema de missões diárias com reset cíclico automático, acúmulo de XP, e um sistema de **Ofensivas (Streaks)** que recompensa a consistência do usuário.
* **Notificações Push Locais:** Lembretes diários automatizados para ajudar o usuário a não perder a sua ofensiva, utilizando agendamento nativo do sistema operacional.
* **Acompanhamento de Desempenho:** Visualização do progresso através de gráficos interativos de volumetria semanal de XP.
* **Dark Mode Dinâmico e Design System:** Utilização de um dicionário de tokens de design que garante consistência visual e permite a alternância fluida entre os temas Claro e Escuro (Context API).

---

## 🚀 Tecnologias Utilizadas

### Frontend (Mobile)
* **React Native & Expo:** Framework principal para desenvolvimento mobile multiplataforma.
* **TypeScript:** Tipagem estática rigorosa para segurança e previsibilidade.
* **Context API & React Navigation:** Gerenciamento de estado global e rotas nativas fluidas.
* **Expo Notifications & Chart Kit:** Integração nativa de lembretes e renderização de gráficos vetoriais (SVG).

### Backend (API)
* **Node.js & Express:** Motor de execução e framework de roteamento rápido para a API REST.
* **TypeScript:** Compartilhamento do mesmo ecossistema de tipagem do frontend.
* **Prisma ORM:** Ferramenta moderna e tipada para comunicação segura com o banco de dados.
* **PostgreSQL (Neon.tech):** Banco de dados relacional hospedado na nuvem para persistência em tempo real.

---

## 📂 Estrutura Arquitetural

O projeto foi refatorado para um padrão **Monorepo**, garantindo a separação estrita de responsabilidades:

```
FitTrack/
├── frontend/             # Aplicação Mobile
│   ├── assets/           # Identidade visual e ícones nativos
│   ├── src/
│   │   ├── components/   # Componentes de UI reutilizáveis (SOLID)
│   │   ├── contexts/     # Estado Global (Theme, Days, User)
│   │   ├── screens/      # Telas focadas na renderização
│   │   ├── services/     # Regras locais e armazenamento
│   │   └── styles/       # Tokens de design e temas
│   └── app.json          # Manifestos do Expo
│
└── backend/              # API REST (Arquitetura MSC)
    ├── prisma/           # Schema do banco de dados e migrações (SQL)
    ├── src/
    │   ├── controllers/  # Gerenciamento de requisições e respostas HTTP
    │   ├── services/     # Cérebro da API: regras de negócio e validações
    │   ├── routes/       # Definição dos endpoints da API
    │   └── server.ts     # Ponto de entrada do servidor
    └── .env              # Variáveis de ambiente (Segurança)
```

## 💻 Como rodar o projeto localmente

Como o projeto agora é um Monorepo, você precisará iniciar o banco de dados/servidor e o aplicativo simultaneamente.

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

- Crie um arquivo .env na pasta backend com a sua URL do banco de dados PostgreSQL (DATABASE_URL).
  

- Execute as migrações para gerar as tabelas no seu banco:
  
```
npx prisma migrate dev
```

- Inicie o servidor: 
```
npm run dev
```
   
3. Configuração do Frontend (Mobile):
Abra uma nova aba no terminal, acesse a pasta do frontend e instale as dependências:
```
   cd frontend
   npm install
```

4. Inicie o servidor do Expo:
```
   npx expo start
```

- Leia o QR Code com o aplicativo Expo Go (Android/iOS) ou pressione a para abrir no emulador Android.
  

* **Aviso de Ambiente:** Devido à implementação de expo-notifications, a visualização das notificações push em tempo real exige que a aplicação seja compilada através do EAS (Expo Application Services) ou utilizando o cliente expo-dev-client, pois o suporte a push notifications remotas foi descontinuado no app padrão do Expo Go.

---

## 👨‍💻 Autor
Desenvolvido por André Luis.