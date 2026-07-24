import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemeContext } from '../contexts/ThemeContext';
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  
  const currentExercise = MOCK_WORKOUT[currentIndex];
  const isLastExercise = currentIndex === MOCK_WORKOUT.length - 1;
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

  const handleFinishWorkout = () => {
    if (!canFinishWorkout) return;
    
    Alert.alert("Sucesso!", `Treino finalizado em ${formatTime(secondsElapsed)}! Ganhou +50 XP.`, [
      { text: "Incrível", onPress: () => navigation.goBack() }
    ]);
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
          {currentIndex + 1} / {MOCK_WORKOUT.length}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: currentExercise.gifUrl }} 
          style={styles.exerciseImage} 
        />
      </View>

      <View style={styles.content}>
        <View style={styles.muscleBadge}>
          <Text style={styles.muscleText}>{currentExercise.muscleGroup}</Text>
        </View>
        
        <Text style={styles.exerciseName}>{currentExercise.name}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <FontAwesome5 name="layer-group" size={20} color={theme.colors.textBody} />
            <Text style={styles.statValue}>{currentExercise.sets}</Text>
            <Text style={styles.statLabel}>Séries</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="sync-alt" size={20} color={theme.colors.textBody} />
            <Text style={styles.statValue}>{currentExercise.reps}</Text>
            <Text style={styles.statLabel}>Reps</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="hourglass-half" size={20} color={theme.colors.textBody} />
            <Text style={styles.statValue}>{currentExercise.restTime}s</Text>
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
              style={[styles.button, !canFinishWorkout && styles.buttonDisabled]} 
              activeOpacity={0.8}
              onPress={handleFinishWorkout}
              disabled={!canFinishWorkout}
            >
              <FontAwesome5 name="check-circle" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Finalizar Treino</Text>
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