import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { DaysContext } from '../contexts/DaysContext';
import { DaysOfWeek } from '../types';
import { styles } from '../styles/screens/telaPrincipalStyles';
import { WorkoutService, Exercise } from '../services/WorkoutService';
import { StorageService, StorageKeys } from '../storage/StorageService';

const TelaPrincipal = () => {
  const { selectedDays } = useContext(DaysContext);
  const [workoutPlan, setWorkoutPlan] = useState<Record<keyof DaysOfWeek, Exercise[]> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completionStatus, setCompletionStatus] = useState<Partial<Record<keyof DaysOfWeek, boolean>>>({});
  const [currentDay, setCurrentDay] = useState<keyof DaysOfWeek | null>(null);

  useEffect(() => {
    const dayIndex = new Date().getDay(); 
    const daysMap: Record<number, keyof DaysOfWeek> = {
      1: 'segunda',
      2: 'terca',
      3: 'quarta',
      4: 'quinta',
      5: 'sexta',
    };
    setCurrentDay(daysMap[dayIndex] || null);

    initData();
  }, []);

  const initData = async () => {
    try {
      setIsLoading(true);
      const data = await WorkoutService.fetchWeeklyPlan();
      setWorkoutPlan(data);

      const todayStr = new Date().toDateString();
      const savedDate = await StorageService.getItem<string>(StorageKeys.PRINCIPAL_LAST_DATE);
      
      if (savedDate === todayStr) {
        const savedCompletion = await StorageService.getItem<Partial<Record<keyof DaysOfWeek, boolean>>>(
          StorageKeys.PRINCIPAL_COMPLETION
        );
        if (savedCompletion) {
          setCompletionStatus(savedCompletion);
        }
      } else {
        await StorageService.setItem(StorageKeys.PRINCIPAL_LAST_DATE, todayStr);
        await StorageService.setItem(StorageKeys.PRINCIPAL_COMPLETION, {});
        setCompletionStatus({});
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os treinos.');
    } finally {
      setIsLoading(false);
    }
  };

  const activeWorkouts = useMemo(() => {
    return (Object.keys(selectedDays) as Array<keyof DaysOfWeek>).filter(
      (day) => selectedDays[day] === true
    );
  }, [selectedDays]);

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

    Alert.alert('Parabéns! 🎉', `Completou o treino de ${day} com sucesso e ganhou +150 XP!`);
  }, [currentDay, completionStatus]);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderWorkoutCard = ({ item: day }: { item: keyof DaysOfWeek }) => {
    const isToday = day === currentDay;
    const isCompleted = completionStatus[day];
    const exercises = workoutPlan ? workoutPlan[day] : [];

    return (
      <View style={[styles.card, isToday && styles.cardToday]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.dayTitle, isToday && styles.dayTitleToday]}>
            {capitalizeFirstLetter(day)}
          </Text>
          {isToday && (
            <View style={styles.badgeToday}>
              <Text style={styles.badgeText}>HOJE</Text>
            </View>
          )}
        </View>

        <View style={styles.exercisesContainer}>
          {exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseRow}>
              <FontAwesome5 
                name="check-circle" 
                size={14} 
                color={isToday ? '#27AE60' : '#A0A0A0'} 
                style={{ marginTop: 2 }} 
              />
              <View style={styles.exerciseTextContainer}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetails}>{exercise.details}</Text>
              </View>
            </View>
          ))}
        </View>

        {isToday && (
          <TouchableOpacity
            style={[styles.button, isCompleted ? styles.buttonCompleted : styles.buttonActive]}
            onPress={() => handleCompleteWorkout(day)}
            disabled={isCompleted}
            activeOpacity={0.8}
          >
            <FontAwesome5 
              name={isCompleted ? "check-double" : "dumbbell"} 
              size={16} 
              color="#FFFFFF" 
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>
              {isCompleted ? 'Treino Concluído' : 'Marcar como Concluído'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading || !workoutPlan) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Plano Semanal</Text>
        <Text style={styles.subtitle}>Acompanhe a sua rotina de exercícios</Text>
      </View>

      <FlatList
        style={styles.list}
        data={activeWorkouts}
        keyExtractor={(item) => item}
        renderItem={renderWorkoutCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="calendar-times" size={40} color="#A0A0A0" />
            <Text style={styles.emptyText}>Nenhum dia de treino selecionado no seu perfil.</Text>
          </View>
        }
      />
    </View>
  );
};

export default TelaPrincipal;