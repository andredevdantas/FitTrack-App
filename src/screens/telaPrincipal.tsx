import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { DaysContext } from '../contexts/DaysContext';
import { DaysOfWeek } from '../types';
import { styles } from '../styles/screens/telaPrincipalStyles';

type WorkoutPlan = Record<keyof DaysOfWeek, string[]>;

const workoutPlan: WorkoutPlan = {
  segunda: ['Corrida de 20 minutos', '3 séries de 10 flexões', '15 agachamentos'],
  terca: ['Caminhada de 30 minutos', '2 séries de 15 burpees', '20 abdominais'],
  quarta: ['3 séries de 12 levantamento de pernas', '10 minutos de yoga', '20 elevações de quadril'],
  quinta: ['2 minutos de pular corda', '5 séries de 10 abdominais bicicleta', '15 avanços para cada perna'],
  sexta: ['Caminhada rápida de 20 minutos', '3 séries de 15 super-homens', '1 minuto de corrida rápida / 1 min caminhada (3x)'],
};

const TelaPrincipal = () => {
  const { selectedDays } = useContext(DaysContext);
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
  }, []);

  const activeWorkouts = useMemo(() => {
    return (Object.keys(selectedDays) as Array<keyof DaysOfWeek>).filter(
      (day) => selectedDays[day] === true
    );
  }, [selectedDays]);

  const handleCompleteWorkout = useCallback((day: keyof DaysOfWeek) => {
    if (day !== currentDay) {
      Alert.alert('Ação não permitida', 'Apenas pode marcar como concluído o treino do dia atual.');
      return;
    }

    if (completionStatus[day]) {
      Alert.alert('Treino concluído', `Já completou o treino de ${day} hoje. Bom trabalho!`);
      return;
    }

    setCompletionStatus((prev) => ({ ...prev, [day]: true }));
    Alert.alert('Parabéns! 🎉', `Completou o treino de ${day} com sucesso.`);
  }, [currentDay, completionStatus]);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderWorkoutCard = ({ item: day }: { item: keyof DaysOfWeek }) => {
    const isToday = day === currentDay;
    const isCompleted = completionStatus[day];

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
          {workoutPlan[day].map((exercise, index) => (
            <View key={index} style={styles.exerciseRow}>
              <FontAwesome5 name="check-circle" size={14} color={isToday ? '#27AE60' : '#A0A0A0'} />
              <Text style={styles.exerciseText}>{exercise}</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Plano Semanal</Text>
        <Text style={styles.subtitle}>Acompanhe a sua rotina de exercícios</Text>
      </View>

      <FlatList
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