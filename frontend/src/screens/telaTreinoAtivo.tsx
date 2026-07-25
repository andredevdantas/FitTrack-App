import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import { WorkoutService } from '../services/WorkoutService';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { getStyles } from '../styles/screens/telaTreinoAtivoStyles';

const MOCK_WORKOUT = [
  { 
    id: '1', 
    name: 'Flexão de Braço', 
    muscleGroup: 'Peito', 
    sets: 3, 
    reps: '10-12', 
    restTime: 60, 
    gifUrl: 'https://via.placeholder.com/400x300/3498db/ffffff?text=Animacao+Flexao' 
  },
  { 
    id: '2', 
    name: 'Agachamento Livre', 
    muscleGroup: 'Pernas', 
    sets: 4, 
    reps: '15', 
    restTime: 90, 
    gifUrl: 'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Animacao+Agachamento' 
  }
];

const ANTI_CHEAT_MINIMUM_SECONDS = 10; 

const TelaTreinoAtivo = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const activeWorkout = route.params?.workout;
  const exercises = activeWorkout?.exercises?.length > 0 ? activeWorkout.exercises : MOCK_WORKOUT;
  const workoutLabel = activeWorkout?.label || 'Treino Livre';

  const { user, fetchProgress } = useContext(UserContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  
  const currentExercise = exercises[currentIndex];
  const isLastExercise = currentIndex === exercises.length - 1;
  const canFinishWorkout = secondsElapsed >= ANTI_CHEAT_MINIMUM_SECONDS;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleNextExercise = () => {
    if (!isLastExercise) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleFinishWorkout = async () => {
    if (!canFinishWorkout) return;
    
    if (!user) {
      Alert.alert('Erro', 'Sessão de usuário não encontrada.');
      return;
    }

    const userId = (user as any).id || (user as any).userId;

    try {
      setIsFinishing(true);
      
      const durationMin = Math.max(1, Math.ceil(secondsElapsed / 60)); 
      const xpAwarded = 150; 

      const data = await WorkoutService.finishWorkoutAPI(userId, `Treino de ${workoutLabel}`, durationMin, xpAwarded);

      if (activeWorkout?.day) {
        const savedStatus = await StorageService.getItem<Record<string, boolean>>(StorageKeys.PRINCIPAL_COMPLETION) || {};
        const updatedStatus = { ...savedStatus, [activeWorkout.day]: true };
        await StorageService.setItem(StorageKeys.PRINCIPAL_COMPLETION, updatedStatus);
      }
      
      if (fetchProgress) await fetchProgress(userId);

      Alert.alert('Treino Destruído! 🔥', `Excelente trabalho!\n\nTempo: ${formatTime(secondsElapsed)}\nGanhou +${xpAwarded} XP\nOfensiva: ${data.streak.currentStreak} dia(s)`, [
        { text: "Incrível", onPress: () => navigation.goBack() }
      ]);
      
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o seu progresso no servidor.');
    } finally {
      setIsFinishing(false);
    }
  };

  const handleQuit = () => {
    Alert.alert("Desistir?", "Se sair agora, o progresso deste treino não será salvo.", [
      { text: "Continuar Treino", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit}>
          <FontAwesome5 name="times" size={24} color={theme.colors.textBody} />
        </TouchableOpacity>
        
        <View style={styles.globalTimerContainer}>
          <FontAwesome5 name="clock" size={16} color={theme.colors.primary} />
          <Text style={styles.globalTimerText}>{formatTime(secondsElapsed)}</Text>
        </View>
        
        <Text style={styles.headerTitle}>
          {currentIndex + 1} / {exercises.length}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: currentExercise.gifUrl || 'https://via.placeholder.com/400x300/3498db/ffffff?text=Sem+Animacao' }} 
          style={styles.exerciseImage} 
        />
      </View>

      <View style={styles.content}>
        <View style={styles.muscleBadge}>
          <Text style={styles.muscleText}>{currentExercise.muscleGroup || 'Geral'}</Text>
        </View>
        
        <Text style={styles.exerciseName}>{currentExercise.name}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <FontAwesome5 name="layer-group" size={20} color={theme.colors.textBody} />
            <Text style={styles.statValue}>{currentExercise.sets || 3}</Text>
            <Text style={styles.statLabel}>Séries</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="sync-alt" size={20} color={theme.colors.textBody} />
            <Text style={styles.statValue}>{currentExercise.reps || 12}</Text>
            <Text style={styles.statLabel}>Reps</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="hourglass-half" size={20} color={theme.colors.textBody} />
            <Text style={styles.statValue}>{currentExercise.restTime || 60}s</Text>
            <Text style={styles.statLabel}>Descanso</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        {!isLastExercise ? (
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={handleNextExercise}
          >
            <Text style={styles.buttonText}>Próximo Exercício</Text>
            <FontAwesome5 name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity 
              style={[styles.button, (!canFinishWorkout || isFinishing) && styles.buttonDisabled]} 
              activeOpacity={0.8}
              onPress={handleFinishWorkout}
              disabled={!canFinishWorkout || isFinishing}
            >
              {isFinishing ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <FontAwesome5 name="check-circle" size={18} color="#FFF" style={{ marginRight: 10 }} />
                  <Text style={styles.buttonText}>Finalizar Treino</Text>
                </>
              )}
            </TouchableOpacity>
            {!canFinishWorkout && (
              <Text style={styles.antiCheatText}>
                O botão será liberado em {ANTI_CHEAT_MINIMUM_SECONDS - secondsElapsed}s (Anti-Cheat)
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default TelaTreinoAtivo;