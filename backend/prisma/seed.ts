import { prisma } from '../src/utils/prisma';

async function main() {
  console.log('Preparando a terra... limpando dados antigos...');  
  await prisma.exercise.deleteMany();
  await prisma.dailyMission.deleteMany();
  await prisma.medal.deleteMany();

  console.log('Inserindo Exercícios Semanais...');
  const exercises = [
    // Segunda
    { name: 'Corrida', details: '20 Minutos em Ritmo Leve', dayOfWeek: 'segunda' },
    { name: 'Flexões de braço', details: '3 Séries de 10 Repetições', dayOfWeek: 'segunda' },
    { name: 'Agachamentos', details: '3 Séries de 15 Repetições', dayOfWeek: 'segunda' },
    // Terça
    { name: 'Caminhada', details: '30 Minutos', dayOfWeek: 'terca' },
    { name: 'Burpees', details: '2 Séries de 15 Repetições', dayOfWeek: 'terca' },
    { name: 'Abdominais', details: '3 Séries de 20 Repetições', dayOfWeek: 'terca' },
    // Quarta
    { name: 'Levantamento de Pernas', details: '3 Séries de 12 Repetições', dayOfWeek: 'quarta' },
    { name: 'Yoga', details: '10 Minutos de Alongamento', dayOfWeek: 'quarta' },
    { name: 'Elevações de Quadril', details: '3 Séries de 20 Repetições', dayOfWeek: 'quarta' },
    // Quinta
    { name: 'Pular Corda', details: '2 Minutos', dayOfWeek: 'quinta' },
    { name: 'Abdominais Bicicleta', details: '5 Séries de 10 Repetições', dayOfWeek: 'quinta' },
    { name: 'Avanços (Lunges)', details: '15 para cada perna', dayOfWeek: 'quinta' },
    // Sexta
    { name: 'Caminhada Rápida', details: '20 Minutos', dayOfWeek: 'sexta' },
    { name: 'Super-Homens (Lombar)', details: '3 Séries de 15 Repetições', dayOfWeek: 'sexta' },
    { name: 'HIIT Corrida', details: '1 Min Corrida / 1 Min Caminhada (3x)', dayOfWeek: 'sexta' },
    // Sábado
    { name: 'Corrida Longa', details: '40 Minutos em Ritmo Moderado', dayOfWeek: 'sabado' },
    { name: 'Alongamento Completo', details: '15 Minutos de Mobilidade', dayOfWeek: 'sabado' },
    // Domingo
    { name: 'Descanso Ativo', details: 'Caminhada Leve de 20 Minutos no Parque', dayOfWeek: 'domingo' },
    { name: 'Yoga Restaurativa', details: '20 Minutos', dayOfWeek: 'domingo' }
  ];
  await prisma.exercise.createMany({ data: exercises });

  console.log('Inserindo Missões Diárias...');
  await prisma.dailyMission.createMany({
    data: [
      { description: '20 Minutos de Corrida Leve', xp: 50 },
      { description: '10 Flexões de Braço', xp: 30 },
      { description: '15 Agachamentos', xp: 30 },
      { description: '5 Minutos de Prancha', xp: 40 },
      { description: '20 Abdominais', xp: 20 },
      { description: '3 Séries de Polichinelos', xp: 30 },
      { description: '10 Burpees', xp: 50 },
      { description: '10 Minutos de Yoga', xp: 40 }
    ]
  });

  console.log('Inserindo Medalhas de Conquista...');
  await prisma.medal.createMany({
    data: [
      { name: 'Primeiro Suor', description: 'Conclua o seu primeiro treino', type: 'workouts', requirement: 1, icon: 'shoe-prints', color: '#3498DB' },
      { name: 'Iniciante', description: 'Acumule 100 XP', type: 'xp', requirement: 100, icon: 'medal', color: '#CD7F32' },
      { name: 'Caçador', description: 'Complete 10 missões', type: 'missions', requirement: 10, icon: 'clipboard-check', color: '#1ABC9C' },
      { name: 'Consistente', description: 'Conclua 5 treinos semanais', type: 'workouts', requirement: 5, icon: 'running', color: '#9B59B6' },
      { name: 'Máquina', description: 'Acumule 500 XP', type: 'xp', requirement: 500, icon: 'bolt', color: '#F1C40F' },
      { name: 'Lenda', description: 'Complete 50 missões', type: 'missions', requirement: 50, icon: 'crown', color: '#E74C3C' }
    ]
  });

  console.log('Banco de dados populado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });