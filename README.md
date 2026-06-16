# FitTrack - Monitoramento e Motivação para Exercícios 💪

O **FitTrack** é um aplicativo de saúde e bem-estar projetado para ajudar os usuários a manterem a consistência em seus treinos. Desenvolvido com foco em retenção de usuários, o app utiliza um sistema robusto de gamificação (missões diárias, acúmulo de XP e medalhas) aliado a uma arquitetura moderna e reativa.

---

## ✨ Funcionalidades de Destaque

* **Arquitetura Offline-First:** Persistência total de dados locais utilizando o `AsyncStorage` como fonte única de verdade (Single Source of Truth), permitindo que o app funcione perfeitamente sem internet.
* **Gamificação e Recompensas:** Sistema de missões diárias com reset cíclico automático (às 04:00 AM), acúmulo de XP, desbloqueio condicional de medalhas e micro-interações visuais (animações fluidas e explosão de confetes ao concluir metas).
* **Design System Centralizado:** Utilização de um dicionário de tokens de design (`theme.ts`) que garante consistência visual em toda a interface e facilita a manutenção ou escalabilidade (como a implementação de um *Dark Mode*).
* **Gerenciamento de Estado Reativo:** Sincronização em tempo real entre as abas do aplicativo utilizando `Context API` e o hook `useFocusEffect` do React Navigation.

---

## 🚀 Tecnologias Utilizadas

* **React Native & Expo (SDK 54):** Framework principal para desenvolvimento mobile multiplataforma.
* **TypeScript:** Tipagem estática rigorosa para garantir segurança, previsibilidade e um código à prova de falhas de tipagem.
* **React Navigation:** Navegação nativa e fluida utilizando Native Stack e Bottom Tabs.
* **Context API:** Gerenciamento de estado global descentralizado e limpo (dispensando bibliotecas externas como Redux).
* **React Native Animated & Confetti Cannon:** Criação de UX responsiva, micro-interações e feedback visual gamificado.

---

## 📂 Estrutura Modular (SOLID)

O projeto segue uma rigorosa separação de responsabilidades para manter o código escalável e de fácil manutenção:

```
src/
├── assets/         # Imagens, ícones e fontes da aplicação
├── components/     # Componentes de UI reutilizáveis (Cards, Buttons, etc)
├── contexts/       # Gerenciamento de Estado Global
├── hooks/          # Hooks customizados para lógica encapsulada
├── navigation/     # Configuração de rotas da aplicação
├── screens/        # Telas da aplicação (focadas apenas na lógica e renderização)
├── services/       # Lógicas de negócio, Mocks e chamadas externas
├── storage/        # Implementação centralizada do AsyncStorage
├── styles/         # Arquivos de estilização isolados por escopo e Design System
├── types/          # Definições de interfaces do TypeScript
└── utils/          # Funções utilitárias e formatações
```

## 💻 Como rodar o projeto localmente

1. Clone este repositório:
```
   git clone [https://github.com/andredevdantas/FitTrack-App.git](https://github.com/andredevdantas/FitTrack-App.git)
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
---

## 👨‍💻 Autor
Desenvolvido por André Luis.