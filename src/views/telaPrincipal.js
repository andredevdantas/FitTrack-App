import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { DaysContext } from '../context/DaysContext';
 
const workoutPlan = {
  segunda: ["Corrida de 20 minutos", "3 séries de 10 flexões", "15 agachamentos"],
  terca: ["Caminhada de 30 minutos", "2 séries de 15 burpees", "20 abdominais"],
  quarta: ["3 séries de 12 levantamento de pernas", "10 minutos de yoga", "20 elevações de quadril"],
  quinta: ["2 minutos de pular corda", "5 séries de 10 abdominais bicicleta", "15 avanços para cada perna"],
  sexta: ["Caminhada rápida de 20 minutos", "3 séries de 15 super-homens", "1 minuto de corrida rápida seguida de 1 minuto de caminhada (repetir 3x)"]
};
 
const initialCompletionStatus = {
  segunda: false,
  terca: false,
  quarta: false,
  quinta: false,
  sexta: false,
};
 
const WeeklyWorkoutScreen = () => {
  const { selectedDays, setSelectedDays } = useContext(DaysContext);
  const [completionStatus, setCompletionStatus] = useState(initialCompletionStatus);
  const [currentDay, setCurrentDay] = useState('');
  useEffect(() => {
    const daysOfWeek = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
    let currentDayIndex = new Date().getDay();
    setCurrentDay(daysOfWeek[currentDayIndex]);
 
    const intervalId = setInterval(() => {
      setCompletionStatus((prevStatus) => {
        const newStatus = { ...prevStatus };
        const keys = Object.keys(initialCompletionStatus);
        const keyAtIndex = keys[currentDayIndex];
        newStatus[keyAtIndex] = false;
        return newStatus;
      });
 
      currentDayIndex = (currentDayIndex + 1) % daysOfWeek.length;
      setCurrentDay(daysOfWeek[currentDayIndex]);
    }, 1000 * 5);
 
    return () => clearInterval(intervalId); // Limpeza do intervalo ao desmontar
  }, []);
 
  const handleCompleteWorkout = (day) => {
    if (day !== currentDay) {
      Alert.alert("Ação não permitida", "Você só pode marcar o treino do dia atual como concluído.");
      return;
    }
 
    if (completionStatus[day]) {
      Alert.alert("Treino já completado", `Você já completou o treino de ${day}.`);
      return;
    }
 
    setCompletionStatus((prevStatus) => ({ ...prevStatus, [day]: true }));
    Alert.alert("Parabéns!", `Você concluiu o treino de ${day}.`);
  };
 
  const isToday = (day) => day === currentDay;
 
  return (
<View style={styles.container}>
<Text style={styles.title}>Treinos da Semana</Text>
<FlatList
        data={
          Object.entries(selectedDays).filter(([day, status]) => status === true).map(([day]) => day)
        }
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
<View style={[styles.workoutContainer, isToday(item) && styles.highlightContainer]}>
<Text style={[styles.dayTitle, isToday(item) && styles.highlightText]}>
              {capitalizeFirstLetter(item)}
</Text>
<FlatList
              data={workoutPlan[item]}
              keyExtractor={(exercise, index) => index.toString()}
              renderItem={({ item: exercise }) => (
<Text style={[styles.exerciseText, isToday(item) && styles.highlightExerciseText]}>
                  • {exercise}
</Text>
              )}
            />
            {isToday(item) && (
<TouchableOpacity
                style={[
                  styles.completeButton,
                  completionStatus[item] && styles.buttonCompleted,
                ]}
                onPress={() => handleCompleteWorkout(item)}
>
<Text style={styles.buttonText}>
                  {completionStatus[item] ? "Concluído" : "Marcar como Concluído"}
</Text>
</TouchableOpacity>
            )}
</View>
        )}
      />
</View>
  );
};
 
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  workoutContainer: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  highlightContainer: {
    backgroundColor: '#D1E7DD',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  highlightText: {
    color: '#0F5132',
  },
  exerciseText: {
    fontSize: 16,
    color: '#555555',
    marginVertical: 2,
  },
  highlightExerciseText: {
    color: '#0F5132',
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonCompleted: {
    backgroundColor: '#777777',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
 
export default WeeklyWorkoutScreen;