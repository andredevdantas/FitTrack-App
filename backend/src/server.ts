import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import workoutRoutes from './routes/workoutRoutes';
import catalogRoutes from './routes/catalogRoutes'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 
app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);
app.use('/catalog', catalogRoutes);

// Rota de teste
app.get('/ping', (req, res) => {
  res.json({ message: 'O servidor FitTrack está online.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando a todo vapor na porta ${PORT}`);
});