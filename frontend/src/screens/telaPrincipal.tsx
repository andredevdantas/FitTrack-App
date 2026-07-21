import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { WorkoutService } from '../services/WorkoutService';
import { UserContext } from '../contexts/UserContext'; 
import { DaysContext } from '../contexts/DaysContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { DaysOfWeek, Exercise } from '../types';
import { getStyles } from '../styles/screens/telaPrincipalStyles';
import { StorageService, StorageKeys } from '../storage/StorageService';

interface DayWorkout {
  day: keyof DaysOfWeek;
  label: string;
  shortLabel: string;
  exercises: Exercise[];
  isToday: boolean;
  dateIndex: number;
}

const WEEK_DAYS: { key: keyof DaysOfWeek, short: string }[] = [
  { key: 'domingo', short: 'Dom' },
  { key: 'segunda', short: 'Seg' },
  { key: 'terca', short: 'Ter' },
  { key: 'quarta', short: 'Qua' },
  { key: 'quinta', short: 'Qui' },
  { key: 'sexta', short: 'Sex' },
  { key: 'sabado', short: 'Sáb' },
];

const TelaPrincipal = () => {
  const { selectedDays } = useContext(DaysContext);
  const { theme } = useContext(ThemeContext);
  const { user, fetchProgress } = useContext(UserContext);
  const styles = getStyles(theme);

  const [workouts, setWorkouts] = useState<DayWorkout[]>([]);
  const [currentDay, setCurrentDay] = useState<keyof DaysOfWeek>('segunda');
  const [viewDay, setViewDay] = useState<keyof DaysOfWeek>('segunda');
  
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  
  const [activeWorkoutModal, setActiveWorkoutModal] = useState<DayWorkout | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  const getCurrentDayKey = (): keyof DaysOfWeek => {
    return WEEK_DAYS[new Date().getDay()].key;
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const today = getCurrentDayKey();
      setCurrentDay(today);
      setViewDay(today);

      const weeklyPlan = await WorkoutService.fetchWeeklyPlan();
      const activeDayKeys = (Object.keys(selectedDays) as Array<keyof DaysOfWeek>).filter(key => selectedDays[key]);

      const builtWorkouts: DayWorkout[] = activeDayKeys.map((key) => {
        const weekDef = WEEK_DAYS.find(w => w.key === key);
        return {
          day: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          shortLabel: weekDef?.short || '',
          exercises: weeklyPlan[key] || [],
          isToday: key === today,
          dateIndex: WEEK_DAYS.findIndex(w => w.key === key)
        };
      });

      setWorkouts(builtWorkouts);

      const savedStatus = await StorageService.getItem<Record<string, boolean>>(StorageKeys.PRINCIPAL_COMPLETION);
      const lastResetDate = await StorageService.getItem<string>(StorageKeys.PRINCIPAL_LAST_DATE);
      const todayDateString = new Date().toDateString();

      if (lastResetDate !== todayDateString) {
        setCompletionStatus({});
        await StorageService.setItem(StorageKeys.PRINCIPAL_COMPLETION, {});
        await StorageService.setItem(StorageKeys.PRINCIPAL_LAST_DATE, todayDateString);
      } else if (savedStatus) {
        setCompletionStatus(savedStatus);
      }

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os treinos.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDays]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleCompleteWorkout = async () => {
    if (!activeWorkoutModal) return;
    const day = activeWorkoutModal.day;

    if (day !== currentDay) {
      Alert.alert('Calma aí, atleta!', 'Você só pode treinar e ganhar XP no dia de hoje.');
      return;
    }

    if (!user) return;
    const userId = (user as any).id || (user as any).userId;

    try {
      setIsFinishing(true);
      const durationMin = activeWorkoutModal.exercises.reduce((acc, ex) => acc + (ex.restTime ? Math.ceil(ex.restTime/60) * ex.sets : 5), 0) || 45; 
      const xpAwarded = 150; 

      const data = await WorkoutService.finishWorkoutAPI(userId, `Treino de ${activeWorkoutModal.label}`, durationMin, xpAwarded);

      const updatedStatus = { ...completionStatus, [day]: true };
      setCompletionStatus(updatedStatus);
      await StorageService.setItem(StorageKeys.PRINCIPAL_COMPLETION, updatedStatus);
      
      if (fetchProgress) await fetchProgress(userId);

      setActiveWorkoutModal(null);
      Alert.alert('Treino Destruído! 🔥', `Excelente trabalho!\n\nGanhou +${xpAwarded} XP\nOfensiva: ${data.streak.currentStreak} dia(s)`);
      
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o seu progresso.');
    } finally {
      setIsFinishing(false);
    }
  };

  const renderStripCalendar = () => {
    return (
      <View>
        <ScrollView 
          ref={scrollViewRef}
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.calendarContainer}
        >
          {WEEK_DAYS.map((d, index) => {
            const isSelected = viewDay === d.key;
            const isToday = currentDay === d.key;
            const hasWorkout = workouts.some(w => w.day === d.key);

            return (
              <TouchableOpacity 
                key={d.key}
                style={[styles.dayButton, isSelected && styles.dayButtonActive]}
                onPress={() => setViewDay(d.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayTextWeek, isSelected && styles.dayTextActive]}>{d.short}</Text>
                <Text style={[styles.dayTextDate, isSelected && styles.dayTextActive]}>
                  {new Date().getDate() - (new Date().getDay() - index)}
                </Text>
                {hasWorkout && (
                  <View style={[styles.todayIndicator, isSelected && styles.activeTodayIndicator]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const selectedWorkout = workouts.find(w => w.day === viewDay);
  const isCompleted = completionStatus[viewDay];

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Plano</Text>
        <Text style={styles.subtitle}>Sua jornada de força começa aqui.</Text>
      </View>

      {renderStripCalendar()}

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {viewDay === currentDay ? 'Treino de Hoje' : `Treino de ${selectedWorkout?.label || 'Descanso'}`}
        </Text>

        {!selectedWorkout || selectedWorkout.exercises.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="bed" size={48} color={theme.colors.border} />
            <Text style={styles.emptyText}>Dia de descanso ou nenhum treino configurado. Aproveite para recuperar os músculos!</Text>
          </View>
        ) : (
          selectedWorkout.exercises.map((ex, index) => (
            <View key={ex.id || index.toString()} style={styles.richCard}>
              <View style={styles.richCardHeader}>
                <View style={styles.muscleTag}>
                  <Text style={styles.muscleTagText}>{ex.muscleGroup || 'Corpo Inteiro'}</Text>
                </View>
                <View style={styles.exerciseMetaContainer}>
                  <FontAwesome5 name="sync-alt" size={12} color={theme.colors.textBody} />
                  <Text style={styles.exerciseMetaText}>{ex.sets || 3}x{ex.reps || 12}</Text>
                  <FontAwesome5 name="clock" size={12} color={theme.colors.textBody} />
                  <Text style={styles.exerciseMetaText}>{ex.restTime || 60}s</Text>
                </View>
              </View>

              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseDetails}>{ex.details}</Text>
              
            </View>
          ))
        )}

        {selectedWorkout && selectedWorkout.exercises.length > 0 && viewDay === currentDay && (
          <TouchableOpacity 
            style={[styles.openModalBtn, isCompleted && styles.completedBtn]}
            onPress={() => !isCompleted && setActiveWorkoutModal(selectedWorkout)}
            disabled={isCompleted}
            activeOpacity={0.8}
          >
            <FontAwesome5 name={isCompleted ? "check" : "dumbbell"} size={18} color="#FFF" />
            <Text style={styles.openModalBtnText}>
              {isCompleted ? 'TREINO CONCLUÍDO' : 'INICIAR SESSÃO'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={activeWorkoutModal !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveWorkoutModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Visão Geral do Treino</Text>
              <TouchableOpacity onPress={() => setActiveWorkoutModal(null)} style={styles.closeBtn}>
                <FontAwesome5 name="times" size={20} color={theme.colors.textBody} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {activeWorkoutModal?.exercises.map((ex, idx) => (
                <View key={idx} style={styles.sheetExerciseRow}>
                  <FontAwesome5 name="dumbbell" size={20} color={theme.colors.primary} />
                  <View style={styles.sheetExerciseInfo}>
                    <Text style={styles.sheetExerciseName}>{ex.name}</Text>
                    <Text style={styles.sheetExerciseReps}>
                      {ex.sets || 3} séries de {ex.reps || 12} repetições
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.hugeStartBtn}
              onPress={handleCompleteWorkout}
              disabled={isFinishing}
            >
              {isFinishing ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.hugeStartBtnText}>COMEÇAR A SUAR</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TelaPrincipal;