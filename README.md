# FitTrack - Monitoramento e Motivação para Exercícios 💪

O **FitTrack** é um aplicativo de saúde e bem-estar projetado para ajudar os usuários a manterem a consistência em seus treinos. Desenvolvido com foco em retenção de usuários, o app utiliza um sistema robusto de gamificação (missões diárias, acúmulo de XP, medalhas e ofensivas) aliado a uma arquitetura moderna e reativa.

---

## ✨ Funcionalidades de Destaque

* **Arquitetura Offline-First:** Persistência total de dados locais utilizando o `AsyncStorage` como fonte única de verdade (Single Source of Truth), permitindo que o app funcione perfeitamente sem internet.
* **Gamificação e Retenção:** Sistema de missões diárias com reset cíclico automático, acúmulo de XP, desbloqueio condicional de medalhas e um sistema de **Ofensivas (Streaks)** que recompensa a consistência.
* **Notificações Push Locais:** Lembretes diários automatizados para ajudar o usuário a não perder a sua ofensiva, utilizando agendamento nativo do sistema operacional.
* **Acompanhamento de Desempenho:** Visualização do progresso através de gráficos interativos de volumetria semanal de XP.
* **Dark Mode Dinâmico e Design System:** Utilização de um dicionário de tokens de design que garante consistência visual e permite a alternância fluida e animada entre os temas Claro e Escuro, totalmente gerenciada por Context API.
* **Micro-interações:** UX responsiva com animações baseadas em física (React Native Animated) e feedback visual gamificado (como explosões de confetes ao concluir metas).

---

## 🚀 Tecnologias Utilizadas

* **React Native & Expo:** Framework principal para desenvolvimento mobile multiplataforma.
* **TypeScript:** Tipagem estática rigorosa para garantir segurança, previsibilidade e um código à prova de falhas.
* **React Navigation:** Navegação nativa e fluida utilizando Native Stack e Bottom Tabs.
* **Context API:** Gerenciamento de estado global descentralizado e limpo (dispensando bibliotecas externas como Redux).
* **Expo Notifications:** Integração direta com a API de Push Notifications nativa dos dispositivos.
* **React Native Chart Kit:** Renderização de gráficos vetoriais (SVG) para análise de desempenho.

---

## 📂 Estrutura Modular (SOLID)

O projeto segue uma rigorosa separação de responsabilidades para manter o código escalável e de fácil manutenção:

```
FitTrack-App/
├── assets/         # Identidade visual, logotipos, splash screen e ícones nativos
├── src/
│   ├── components/ # Componentes de UI reutilizáveis (Cards, Buttons, etc)
│   ├── contexts/   # Gerenciamento de Estado Global (Theme, Days, User)
│   ├── hooks/      # Hooks customizados para lógica encapsulada
│   ├── navigation/ # Configuração de rotas e Tab Navigators
│   ├── screens/    # Telas da aplicação (focadas apenas na renderização)
│   ├── services/   # Serviços isolados (WorkoutService, StreakService, NotificationService)
│   ├── storage/    # Implementação centralizada e estruturada do AsyncStorage
│   ├── styles/     # Arquivos de estilização dinâmicos e adaptáveis ao tema
│   ├── types/      # Definições de interfaces do TypeScript
│   └── utils/      # Funções utilitárias e de formatação
├── app.json        # Configurações do app, manifestos e permissões do Expo
└── package.json    # Dependências e scripts do projeto
```

## 💻 Como rodar o projeto localmente

1. Clone este repositório:
```
   git clone [https://github.com/andredevdantas/FitTrack-App.git]
   ```
   
2. Acesse a pasta do projeto e certifique-se de ter o Node.js instalado:
```
   cd FitTrack-App
```
   
3. Instale as dependências executando:
```
   npm install
```

4. Inicie o servidor do Expo:
```
   npx expo start
```
    
5. Leia o QR Code com o aplicativo Expo Go (Android/iOS) ou pressione a para abrir no emulador Android.

* **Aviso de Ambiente:** Devido à implementação de expo-notifications, a visualização das notificações push em tempo real exige que a aplicação seja compilada através do EAS (Expo Application Services) ou utilizando o cliente expo-dev-client, pois o suporte a push notifications remotas foi descontinuado no app padrão do Expo Go.

---

## 👨‍💻 Autor
Desenvolvido por André Luis.