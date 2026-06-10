# FitTrack - Monitoramento e Motivação para Exercícios 💪

FitTrack é um aplicativo de saúde e bem-estar projetado para ajudar os usuários a manterem a consistência em seus treinos. O app utiliza gamificação (missões diárias e medalhas) e monitoramento semanal para incentivar a prática regular de exercícios.

## 🚀 Tecnologias e Arquitetura (Versão 2.0)
Atualmente estou trabalhando em uma refatoração completa nesse projeto para adotar os padrões modernos e profissionais da indústria:

- **React Native & Expo (SDK 54)** - Framework principal.
- **TypeScript** - Tipagem estática rigorosa para maior segurança e previsibilidade do código.
- **React Navigation** - Navegação fluida utilizando Native Stack e Bottom Tabs.
- **Context API** - Gerenciamento de estado global descentralizado e limpo (sem Redux).
- **AsyncStorage** - Persistência de dados locais (offline-first).
- **Arquitetura Modular (SOLID)** - Separação clara de responsabilidades (Storage, Contexts, Screens, Types).

## 📂 Estrutura do Projeto
```text
src/
├── assets/         # Imagens, ícones e fontes da aplicação
├── components/     # Componentes de UI reutilizáveis (Cards, Buttons, etc)
├── contexts/       # Gerenciamento de Estado Global
├── hooks/          # Hooks customizados para lógica encapsulada
├── navigation/     # Configuração de rotas da aplicação
├── screens/        # Telas e fluxos de navegação
├── services/       # Lógicas de negócio e chamadas externas
├── storage/        # Implementação centralizada do AsyncStorage
├── types/          # Definições de interfaces do TypeScript
└── utils/          # Funções utilitárias e formatações
```

## 💻 Como rodar o projeto localmente

1. Clone este repositório:
```bash
   git clone [https://github.com/andredevdantas/FitTrack-App.git]
   ```
   
2. Certifique-se de ter o Node.js instalado.
   
3. Instale as dependências executando:
```bash
   npm install
```

4. Inicie o servidor do Expo:

```bash
   npx expo start
```
    
5. Leia o QR Code com o aplicativo Expo Go (Android/iOS) ou pressione a para abrir no emulador Android.

## 👨‍💻 Autor
Desenvolvido por André Luis.