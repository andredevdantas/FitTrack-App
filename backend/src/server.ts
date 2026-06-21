import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do ficheiro .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.json({
    message: '🚀 API do FitTrack rodando com sucesso!',
    status: 'online',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`\n==============================================`);
  console.log(`Servidor online em: http://localhost:${PORT}`);
  console.log(`==============================================\n`);
});