import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { WorkoutService, DailyMission } from '../services/WorkoutService';
import { styles } from '../styles/screens/telaMissoesStyles';

const TelaMissoes = () => {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rerollsLeft, setRerollsLeft] = useState<number>(2);
  const [resetTime, setResetTime] = useState<number>(0);

  const loadMissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await WorkoutService.fetchDailyMissions();
      setMissions(data);
      setCompletedIds([]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as missões diárias.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const nextReset = new Date(now);
      nextReset.setHours(4, 0, 0, 0);

      if (now.getHours() >= 4) {
        nextReset.setDate(nextReset.getDate() + 1);
      }

      return nextReset.getTime() - now.getTime();
    };

    setResetTime(calculateTimeRemaining());

    const interval = setInterval(() => {
      setResetTime(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMissionComplete = (id: string) => {
    if (completedIds.length >= 5) {
      Alert.alert('Limite Atingido', 'Já completou todas as missões de hoje!');
      return;
    }

    if (!completedIds.includes(id)) {
      const newCompleted = [...completedIds, id];
      setCompletedIds(newCompleted);

      if (newCompleted.length === 5) {
        Alert.alert(
          'Parabéns! 🏆', 
          'Completou todas as missões do dia! As missões serão reiniciadas às 04:00 da manhã.'
        );
        setRerollsLeft(0);
      }
    }
  };

  const handleGenerateNewMissions = () => {
    if (rerollsLeft > 0 && completedIds.length === 0) {
      loadMissions();
      setRerollsLeft(prev => prev - 1);
    } else if (completedIds.length > 0 && completedIds.length < 5) {
      Alert.alert('Aviso', 'Não pode trocar as missões depois de já ter começado a completá-las.');
    } else if (completedIds.length === 5) {
      Alert.alert('Missões Concluídas', 'Já completou todas as missões de hoje.');
    } else {
      Alert.alert('Limite de Trocas', 'Já utilizou todos os rerolls de hoje!');
    }
  };

  const handleResetAdmin = () => {
    loadMissions();
    setRerollsLeft(2);
  };

  const formatTime = (timeInMs: number) => {
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalXP = missions
    .filter(m => completedIds.includes(m.id))
    .reduce((sum, current) => sum + current.xp, 0);

  const renderMissionCard = ({ item }: { item: DailyMission }) => {
    const isCompleted = completedIds.includes(item.id);

    return (
      <View style={[styles.missionCard, isCompleted && styles.missionCardCompleted]}>
        <View style={styles.missionInfo}>
          <Text style={[styles.missionDescription, isCompleted && styles.missionDescriptionCompleted]}>
            {item.description}
          </Text>
          <View style={styles.xpBadge}>
            <FontAwesome5 name="star" size={12} color={isCompleted ? '#7F8C8D' : '#F39C12'} solid />
            <Text style={[styles.xpBadgeText, isCompleted && { color: '#7F8C8D' }]}>
              +{item.xp} XP
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.completeButton, isCompleted && styles.completeButtonActive]}
          onPress={() => handleMissionComplete(item.id)}
          disabled={isCompleted || completedIds.length >= 5}
          activeOpacity={0.7}
        >
          {isCompleted && <FontAwesome5 name="check" size={16} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading && missions.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Missões Diárias</Text>
        
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>{completedIds.length}/5 Concluídas</Text>
            <Text style={styles.xpText}>{totalXP} XP Obtido</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${(completedIds.length / 5) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <FlatList
        data={missions}
        keyExtractor={(item) => item.id}
        renderItem={renderMissionCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton, 
            (rerollsLeft <= 0 || completedIds.length > 0) && styles.actionButtonDisabled
          ]}
          onPress={handleGenerateNewMissions}
          disabled={rerollsLeft <= 0 || completedIds.length > 0}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="sync-alt" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Trocar Missões ({rerollsLeft})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetAdminButton}
          onPress={handleResetAdmin}
          activeOpacity={0.6}
        >
          <Text style={styles.resetAdminButtonText}>Reset de Admin</Text>
        </TouchableOpacity>

        <Text style={styles.timerText}>
          Novas missões em: {formatTime(resetTime)}
        </Text>
      </View>
    </View>
  );
};

export default TelaMissoes;