import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
 
const missionsList = [
  "20 minutos de corrida leve",
  "10 flexões de braço",
  "15 agachamentos",
  "5 minutos de prancha",
  "20 abdominais",
  "3 séries de polichinelos (15 cada)",
  "2 minutos de alongamento",
  "Caminhada de 15 minutos",
  "10 burpees",
  "15 saltos no lugar",
  "3 séries de 12 levantamento de pernas",
  "20 elevações de quadril",
  "1 minuto de corrida estacionária",
  "3 séries de 10 mergulhos (dips)",
  "10 minutos de yoga",
  "2 minutos de pular corda",
  "5 séries de 10 abdominais bicicleta",
  "15 avanços (lunges) para cada perna",
  "20 segundos de prancha lateral (cada lado)",
  "3 séries de 10 agachamentos com salto",
  "30 polichinelos",
  "1 minuto de saltos laterais",
  "3 séries de 15 elevações de panturrilha",
  "Caminhada rápida de 20 minutos",
  "10 minutos de alongamento de corpo inteiro",
  "20 flexões inclinadas",
  "5 séries de 12 levantamentos de joelho alto",
  "15 segundos de prancha dinâmica (com movimentos dos braços)",
  "3 séries de 15 super-homens (exercício de lombar)",
  "1 minuto de corrida rápida seguida de 1 minuto de caminhada (repetir 3x)",
];
 
const generateRandomMissions = () => {
  const shuffled = missionsList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};
 
const DailyMissionsScreen = () => {
  const [missions, setMissions] = useState(generateRandomMissions());
  const [completedMissions, setCompletedMissions] = useState(0);
  const [rerollsLeft, setRerollsLeft] = useState(2);
  const [resetTime, setResetTime] = useState(0);
 
  const calculateTimeRemaining = () => {
    const now = new Date();
    const nextReset = new Date(now);
    nextReset.setHours(4, 0, 0, 0);
 
    if (now.getHours() >= 4) {
      nextReset.setDate(nextReset.getDate() + 1);
    }
 
    return nextReset - now;
  };
 
  const handleMissionComplete = (index) => {
    if (completedMissions >= 5) {
      Alert.alert("Limite de Missões", "Você já completou todas as missões do dia!");
      return;
    }
 
    const newMissions = [...missions];
    if (newMissions[index]) {
      newMissions[index] = { ...newMissions[index], completed: true };
      setMissions(newMissions);
      setCompletedMissions(completedMissions + 1);
    }
 
    if (completedMissions + 1 === 5) {
      Alert.alert("Parabéns!", "Você completou todas as missões do dia! Lembre-se, as missões diárias resetam todos os dias as 04:00 da manhã");
      setRerollsLeft(0);
    }
  };
 
  const handleGenerateNewMissions = () => {
    if (rerollsLeft > 0 && completedMissions === 0) {
      setMissions(generateRandomMissions());
      setRerollsLeft(rerollsLeft - 1);
    } else if (completedMissions === 5) {
      Alert.alert("Missões Concluídas", "Você já completou todas as missões do dia.");
    } else {
      Alert.alert("Limite de Rerolls", "Você já utilizou todos os rerolls de hoje!");
    }
  };
 
  const handleResetMissions = () => {
    setMissions(generateRandomMissions());
    setCompletedMissions(0);
    setRerollsLeft(2);
  };
 
  useEffect(() => {
    const timeRemaining = calculateTimeRemaining();
    setResetTime(timeRemaining);
 
    const interval = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining();
      setResetTime(newTimeRemaining);
    }, 1000);
 
    return () => clearInterval(interval);
  }, [completedMissions]);
 
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Missões Diárias</Text>
      <Text style={styles.subTitle}>Missões Concluídas: {completedMissions}/5</Text>
 
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>{`${completedMissions}/5 Missões Concluídas`}</Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${(completedMissions / 5) * 100}%` },
            ]}
          />
        </View>
      </View>
 
      <View style={styles.missionButtonsContainer}>
        {missions.map((mission, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.missionButton,
              mission.completed ? styles.completedButton : {},
            ]}
            onPress={() => !mission.completed && handleMissionComplete(index)}
            disabled={mission.completed || completedMissions >= 5}
          >
            <Text style={styles.missionButtonText}>{mission.completed ? 'Concluída' : mission}</Text>
          </TouchableOpacity>
        ))}
      </View>
 
      <TouchableOpacity
        style={styles.rerollButton}
        onPress={handleGenerateNewMissions}
        disabled={rerollsLeft <= 0 || completedMissions >= 5}
      >
        <Text style={styles.rerollButtonText}>Gerar Novas Missões ({rerollsLeft} restantes)</Text>
      </TouchableOpacity>
 
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetMissions}
      >
        <Text style={styles.resetButtonText}>Reset de Adm</Text>
      </TouchableOpacity>
 
      <Text style={styles.resetTimeText}>
        Reset das Missões em: {formatTime(resetTime)}
      </Text>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#000000',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  progressBarContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    width: '100%',
    height: 10,
    marginTop: 5,
  },
  progressBar: {
    backgroundColor: '#4CAF50',
    height: '100%',
    borderRadius: 10,
  },
  missionButtonsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  missionButton: {
    backgroundColor: '#808080',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  missionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  rerollButton: {
    backgroundColor: '#808080',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  rerollButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  resetTimeText: {
    fontSize: 16,
    color: '#333333',
    marginTop: 20,
  },
});
 
export default DailyMissionsScreen;