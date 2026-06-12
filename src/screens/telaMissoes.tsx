import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { WorkoutService, DailyMission } from '../services/WorkoutService';
import { styles } from '../styles/screens/telaMissoesStyles';
import { StorageService, StorageKeys } from '../storage/StorageService';

const TelaMissoes = () => {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rerollsLeft, setRerollsLeft] = useState<number>(2);
  const [resetTime, setResetTime] = useState<number>(0);
  
  const [secretTapCount, setSecretTapCount] = useState<number>(0);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  const getTargetResetTimestamp = (baseDate: Date) => {
    const target = new Date(baseDate);
    target.setHours(4, 0, 0, 0);
    if (baseDate.getHours() >= 4) {
      target.setDate(target.getDate() + 1);
    }
    return target.getTime();
  };

  const loadNewMissionsCycle = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await WorkoutService.fetchDailyMissions();
      const nextResetTs = getTargetResetTimestamp(new Date());

      setMissions(data);
      setCompletedIds([]);
      setRerollsLeft(2);

      await StorageService.setItem(StorageKeys.MISSOES_LIST, data);
      await StorageService.setItem(StorageKeys.MISSOES_COMPLETED, []);
      await StorageService.setItem(StorageKeys.MISSOES_REROLLS, 2);
      await StorageService.setItem(StorageKeys.MISSOES_LAST_DATE, nextResetTs);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as missões diárias.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkPersistence = useCallback(async () => {
    try {
      setIsLoading(true);
      const nowTs = new Date().getTime();
      const savedResetTs = await StorageService.getItem<number>(StorageKeys.MISSOES_LAST_DATE);

      if (savedResetTs && nowTs < savedResetTs) {
        const savedMissions = await StorageService.getItem<DailyMission[]>(StorageKeys.MISSOES_LIST);
        const savedCompleted = await StorageService.getItem<string[]>(StorageKeys.MISSOES_COMPLETED);
        const savedRerolls = await StorageService.getItem<number>(StorageKeys.MISSOES_REROLLS);

        if (savedMissions) {
          setMissions(savedMissions);
          setCompletedIds(savedCompleted || []);
          setRerollsLeft(savedRerolls !== null ? savedRerolls : 2);
          setIsLoading(false);
          return;
        }
      }
      
      await loadNewMissionsCycle();
    } catch (error) {
      await loadNewMissionsCycle();
    }
  }, [loadNewMissionsCycle]);

  useEffect(() => {
    checkPersistence();
  }, [checkPersistence]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const targetTs = getTargetResetTimestamp(now);
      const diff = targetTs - now.getTime();
      
      if (diff <= 0) {
        checkPersistence();
      } else {
        setResetTime(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [checkPersistence]);

  const handleTitlePress = () => {
    if (isAdminMode) return;
    
    setSecretTapCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setIsAdminMode(true);
        Alert.alert('Modo Admin Ativado', 'O botão de depuração foi habilitado para esta sessão.');
      }
      return newCount;
    });
  };

  const handleDeactivateAdmin = () => {
    setIsAdminMode(false);
    setSecretTapCount(0);
    Alert.alert('Modo Admin Desativado', 'As ferramentas de depuração foram ocultadas.');
  };

  const confirmMissionComplete = (id: string) => {
    if (completedIds.length >= 5) return;

    Alert.alert(
      'Confirmar Conclusão',
      'Você realmente finalizou este exercício? Lembre-se, o maior compromisso é com a sua própria saúde!',
      [
        { text: 'Ainda não', style: 'cancel' },
        { text: 'Sim, eu fiz!', onPress: () => handleMissionComplete(id) }
      ]
    );
  };

  const handleMissionComplete = async (id: string) => {
    if (!completedIds.includes(id)) {
      const newCompleted = [...completedIds, id];
      setCompletedIds(newCompleted);
      await StorageService.setItem(StorageKeys.MISSOES_COMPLETED, newCompleted);

      if (newCompleted.length === 5) {
        Alert.alert(
          'Parabéns! 🏆', 
          'Completou todas as missões do dia! As missões serão reiniciadas às 04:00 da manhã.'
        );
        setRerollsLeft(0);
        await StorageService.setItem(StorageKeys.MISSOES_REROLLS, 0);
      }
    }
  };

  const handleGenerateNewMissions = () => {
    if (rerollsLeft > 0 && completedIds.length === 0) {
      Alert.alert(
        'Trocar Missões',
        'Deseja gastar 1 reroll para gerar novas missões?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Trocar', 
            onPress: async () => {
              try {
                setIsLoading(true);
                const data = await WorkoutService.fetchDailyMissions();
                const newRerolls = rerollsLeft - 1;
                
                setMissions(data);
                setRerollsLeft(newRerolls);
                
                await StorageService.setItem(StorageKeys.MISSOES_LIST, data);
                await StorageService.setItem(StorageKeys.MISSOES_REROLLS, newRerolls);
              } catch {
                Alert.alert('Erro', 'Não foi possível trocar as missões.');
              } finally {
                setIsLoading(false);
              }
            } 
          }
        ]
      );
    } else if (completedIds.length > 0 && completedIds.length < 5) {
      Alert.alert('Aviso', 'Não pode trocar as missões depois de já ter começado a completá-las.');
    } else if (completedIds.length === 5) {
      Alert.alert('Missões Concluídas', 'Já completou todas as missões de hoje.');
    } else {
      Alert.alert('Limite de Trocas', 'Já utilizou todos os rerolls de hoje!');
    }
  };

  const handleResetAdmin = () => {
    Alert.alert(
      'Reset de Administrador',
      'Esta é uma função de depuração. Ela irá zerar suas missões atuais, remover o XP obtido e restaurar seus rerolls. Deseja prosseguir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Resetar', 
          style: 'destructive',
          onPress: () => {
            loadNewMissionsCycle();
          } 
        }
      ]
    );
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
          onPress={() => confirmMissionComplete(item.id)}
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
        <TouchableWithoutFeedback onPress={handleTitlePress}>
          <View>
            <Text style={styles.title}>Missões Diárias</Text>
          </View>
        </TouchableWithoutFeedback>
        
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
        style={styles.list}
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

        {isAdminMode && (
          <>
            <TouchableOpacity
              style={styles.resetAdminButton}
              onPress={handleResetAdmin}
              activeOpacity={0.6}
            >
              <Text style={styles.resetAdminButtonText}>Reset de Admin</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.deactivateAdminButton}
              onPress={handleDeactivateAdmin}
              activeOpacity={0.6}
            >
              <Text style={styles.deactivateAdminButtonText}>Ocultar Modo Admin</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.timerText}>
          Novas missões em: {formatTime(resetTime)}
        </Text>
      </View>
    </View>
  );
};

export default TelaMissoes;