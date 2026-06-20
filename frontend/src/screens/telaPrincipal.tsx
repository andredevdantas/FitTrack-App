import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { WorkoutService, Exercise } from '../services/WorkoutService';
import { StreakService } from '../services/StreakService';
import { DaysContext } from '../contexts/DaysContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { DaysOfWeek } from '../types';
import { getStyles } from '../styles/screens/telaPrincipalStyles';
import { StorageService, StorageKeys } from '../storage/StorageService';

interface DayWorkout {
  day: keyof DaysOfWeek;
  label: string;
  exercises: Exercise[];
  isToday: boolean;
}

const TelaPrincipal = () => {
  const { selectedDays } = useContext(DaysContext);
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [workouts, setWorkouts] = useState<DayWorkout[]>([]);
  const [currentDay, setCurrentDay] = useState<keyof DaysOfWeek>('segunda');
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const formatDayName = (day: keyof DaysOfWeek): string => {
    const names: Record<keyof DaysOfWeek, string> = {
      segunda: 'Segunda-feira',
      terca: 'Terça-feira',
      quarta: 'Quarta-feira',
      quinta: 'Quinta-feira',
      sexta: 'Sexta-feira',
      sabado: 'Sábado',
      domingo: 'Domingo',
    };
    return names[day];
  };

  const getCurrentDayKey = (): keyof DaysOfWeek => {
    const days: (keyof DaysOfWeek)[] = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    return days[new Date().getDay()];
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const today = getCurrentDayKey();
      setCurrentDay(today);
      await StreakService.getStreak();

      const weeklyPlan = await WorkoutService.fetchWeeklyPlan();

      const activeDayKeys = (Object.keys(selectedDays) as Array<keyof DaysOfWeek>).filter(
        (key) => selectedDays[key]
      );

      const builtWorkouts: DayWorkout[] = activeDayKeys.map((key) => {
        return {
          day: key,
          label: formatDayName(key),
          exercises: weeklyPlan[key] || [],
          isToday: key === today,
        };
      });

      const sortedWorkouts = builtWorkouts.sort((a, b) => {
        const daysOrder = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
      });

      setWorkouts(sortedWorkouts);

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

  const handleCompleteWorkout = useCallback(async (day: keyof DaysOfWeek) => {
    if (day !== currentDay) {
      Alert.alert('Ação não permitida', 'Apenas pode marcar como concluído o treino do dia atual.');
      return;
    }

    if (completionStatus[day]) {
      Alert.alert('Treino concluído', `Já completou o treino de ${day} hoje. Bom trabalho!`);
      return;
    }

    const updatedStatus = { ...completionStatus, [day]: true };
    setCompletionStatus(updatedStatus);
    await StorageService.setItem(StorageKeys.PRINCIPAL_COMPLETION, updatedStatus);
    
    const currentWorkouts = await StorageService.getItem<number>(StorageKeys.TOTAL_WORKOUTS_COMPLETED) || 0;
    await StorageService.setItem(StorageKeys.TOTAL_WORKOUTS_COMPLETED, currentWorkouts + 1);

    const currentTotalXp = await StorageService.getItem<number>(StorageKeys.USER_TOTAL_XP) || 0;
    await StorageService.setItem(StorageKeys.USER_TOTAL_XP, currentTotalXp + 150);

    const newStreak = await StreakService.recordActivity();

    Alert.alert('Parabéns! 🎉', `Completou o treino de ${day} com sucesso e ganhou +150 XP!\n\n🔥 Ofensiva: ${newStreak} dia(s)`);
  }, [currentDay, completionStatus]);

  const renderWorkoutCard = ({ item }: { item: DayWorkout }) => {
    const isCompleted = completionStatus[item.day];

    return (
      <View style={[styles.card, item.isToday && styles.cardToday]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.dayTitle, item.isToday && styles.dayTitleToday]}>
            {item.label}
          </Text>
          {item.isToday && (
            <View style={styles.badgeToday}>
              <Text style={styles.badgeText}>Hoje</Text>
            </View>
          )}
        </View>

        <View style={styles.exercisesContainer}>
          {item.exercises.map((ex) => (
            <View key={ex.id} style={styles.exerciseRow}>
              <FontAwesome5 name="dumbbell" size={14} color={theme.colors.primary} style={{ marginTop: 2 }} />
              <View style={styles.exerciseTextContainer}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseDetails}>{ex.details}</Text>
              </View>
            </View>
          ))}
        </View>

        {item.isToday && (
          <TouchableOpacity
            style={[styles.button, isCompleted ? styles.buttonCompleted : styles.buttonActive]}
            onPress={() => handleCompleteWorkout(item.day)}
            disabled={isCompleted}
            activeOpacity={0.8}
          >
            <FontAwesome5 
              name={isCompleted ? "check-circle" : "play-circle"} 
              size={18} 
              color={theme.colors.surface} 
              style={{ marginRight: 8 }} 
            />
            <Text style={styles.buttonText}>
              {isCompleted ? 'Treino Concluído' : 'Começar Treino'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
        <Text style={styles.subtitle}>Bora treinar hoje?</Text>
      </View>

      {workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="calendar-times" size={48} color={theme.colors.border} />
          <Text style={styles.emptyText}>Nenhum dia de treino selecionado. Ajuste o seu plano no Perfil.</Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={workouts}
          keyExtractor={(item) => item.day}
          renderItem={renderWorkoutCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default TelaPrincipal;