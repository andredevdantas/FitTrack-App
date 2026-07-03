import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, TouchableWithoutFeedback, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { WorkoutService, DailyMission } from '../services/WorkoutService';
import { StreakService } from '../services/StreakService';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import { getStyles } from '../styles/screens/telaMissoesStyles';
import { StorageService, StorageKeys } from '../storage/StorageService';

const TelaMissoes = () => {
  const { theme } = useContext(ThemeContext);
  const { user, fetchProgress } = useContext(UserContext);
  const styles = getStyles(theme);

  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completingMissionId, setCompletingMissionId] = useState<string | null>(null);
  const [rerollsLeft, setRerollsLeft] = useState<number>(2);
  const [resetTime, setResetTime] = useState<number>(0);
  
  const [secretTapCount, setSecretTapCount] = useState<number>(0);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: completedIds.length,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [completedIds.length, progressAnim]);

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

      const savedAdmin = await StorageService.getItem<boolean>(StorageKeys.IS_ADMIN_MODE);
      if (savedAdmin) setIsAdminMode(true);

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
          
          if (savedCompleted && savedCompleted.length > 0) {
            progressAnim.setValue(savedCompleted.length);
          }
          return;
        }
      }
      
      await loadNewMissionsCycle();
    } catch (error) {
      await loadNewMissionsCycle();
    }
  }, [loadNewMissionsCycle, progressAnim]);

  useFocusEffect(
    useCallback(() => {
      checkPersistence();
    }, [checkPersistence])
  );

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
        StorageService.setItem(StorageKeys.IS_ADMIN_MODE, true);
        Alert.alert('Modo Admin Ativado', 'O botão de depuração foi habilitado globalmente para esta sessão.');
      }
      return newCount;
    });
  };

  const handleDeactivateAdmin = () => {
    setIsAdminMode(false);
    setSecretTapCount(0);
    StorageService.setItem(StorageKeys.IS_ADMIN_MODE, false);
    Alert.alert('Modo Admin Desativado', 'As ferramentas de depuração foram ocultadas.');
  };

  const confirmMissionComplete = (id: string) => {
    if (completedIds.length >= 5) return;

    Alert.alert(
      'Confirmar Conclusão',
      'Você realmente finalizou este exercício?',
      [
        { text: 'Ainda não', style: 'cancel' },
        { text: 'Sim, eu fiz!', onPress: () => handleMissionComplete(id) }
      ]
    );
  };

  const handleMissionComplete = async (id: string) => {
    if (!completedIds.includes(id)) {
      const mission = missions.find(m => m.id === id);
      const missionXp = mission ? mission.xp : 0;
      const missionDesc = mission ? mission.description : 'Missão Diária';

      if (!user) {
        Alert.alert('Erro de Sessão', 'Usuário não autenticado. Faça login novamente.');
        return;
      }

      const userId = (user as any).id || (user as any).userId;

      if (!userId) {
        Alert.alert('Erro', 'ID do usuário não encontrado na sessão.');
        return;
      }

      try {
        setCompletingMissionId(id);
        const data = await WorkoutService.finishWorkoutAPI(userId, `Missão: ${missionDesc}`, 5, missionXp);
        const newCompleted = [...completedIds, id];
        setCompletedIds(newCompleted);
        await StorageService.setItem(StorageKeys.MISSOES_COMPLETED, newCompleted);

        if (fetchProgress) {
          await fetchProgress(userId);
        }

        if (newCompleted.length === 5) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          
          Alert.alert('Parabéns! 🏆', `Completou todas as missões do dia!\n\n🔥 Ofensiva mantida: ${data.streak.currentStreak} dia(s)`);
          setRerollsLeft(0);
          await StorageService.setItem(StorageKeys.MISSOES_REROLLS, 0);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a missão na nuvem. Verifique a sua conexão.');
      } finally {
        setCompletingMissionId(null);
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
      Alert.alert('Aviso', 'Não pode trocar as missões depois de já ter começado.');
    } else if (completedIds.length === 5) {
      Alert.alert('Missões Concluídas', 'Já completou todas as missões de hoje.');
    } else {
      Alert.alert('Limite de Trocas', 'Já utilizou todos os rerolls de hoje!');
    }
  };

  const handleResetAdmin = () => {
    Alert.alert(
      'Reset de Administrador',
      'Zerar missões atuais?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Resetar', style: 'destructive', onPress: () => {
            progressAnim.setValue(0);
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

  const dailyXP = missions
    .filter(m => completedIds.includes(m.id))
    .reduce((sum, current) => sum + current.xp, 0);

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 5],
    outputRange: ['0%', '100%'],
  });

  const renderMissionCard = ({ item }: { item: DailyMission }) => {
    const isCompleted = completedIds.includes(item.id);
    const isFinishing = completingMissionId === item.id;

    return (
      <View style={[styles.missionCard, isCompleted && styles.missionCardCompleted]}>
        <View style={styles.missionInfo}>
          <Text style={[styles.missionDescription, isCompleted && styles.missionDescriptionCompleted]}>
            {item.description}
          </Text>
          <View style={styles.xpBadge}>
            <FontAwesome5 
              name="star" 
              size={12} 
              color={isCompleted ? theme.colors.textBody : theme.colors.warning} 
              solid 
            />
            <Text style={[styles.xpBadgeText, isCompleted && { color: theme.colors.textBody }]}>
              +{item.xp} XP
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.completeButton, isCompleted && styles.completeButtonActive, isFinishing && { opacity: 0.7 }]}
          onPress={() => confirmMissionComplete(item.id)}
          disabled={isCompleted || completedIds.length >= 5 || isFinishing || completingMissionId !== null}
          activeOpacity={0.7}
        >
          {isFinishing ? (
            <ActivityIndicator size="small" color={theme.colors.surface} />
          ) : (
            isCompleted && <FontAwesome5 name="check" size={16} color={theme.colors.surface} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading && missions.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
            <Text style={styles.xpText}>{dailyXP} XP Hoje</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { width: progressBarWidth }
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
          style={[styles.actionButton, (rerollsLeft <= 0 || completedIds.length > 0) && styles.actionButtonDisabled]}
          onPress={handleGenerateNewMissions}
          disabled={rerollsLeft <= 0 || completedIds.length > 0}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="sync-alt" size={16} color={theme.colors.surface} />
          <Text style={styles.actionButtonText}>Trocar Missões ({rerollsLeft})</Text>
        </TouchableOpacity>

        {isAdminMode && (
          <>
            <TouchableOpacity style={styles.resetAdminButton} onPress={handleResetAdmin} activeOpacity={0.6}>
              <Text style={styles.resetAdminButtonText}>Reset de Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deactivateAdminButton} onPress={handleDeactivateAdmin} activeOpacity={0.6}>
              <Text style={styles.deactivateAdminButtonText}>Ocultar Modo Admin</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.timerText}>Novas missões em: {formatTime(resetTime)}</Text>
      </View>

      {showConfetti && (
        <ConfettiCannon 
          count={150} 
          origin={{ x: -10, y: 0 }} 
          fadeOut={true} 
          fallSpeed={3000}
        />
      )}
    </View>
  );
};

export default TelaMissoes;