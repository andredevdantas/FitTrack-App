import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { WorkoutService, Medal } from '../services/WorkoutService';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import { getStyles } from '../styles/screens/telaMedalhasStyles';
import { StorageService, StorageKeys } from '../storage/StorageService';

const TelaMedalhas = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const styles = getStyles(theme);

  const [medals, setMedals] = useState<Medal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userStats, setUserStats] = useState({
    xp: 0,
    missions: 0,
    workouts: 0,
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const adminMode = await StorageService.getItem<boolean>(StorageKeys.IS_ADMIN_MODE);
      setIsAdmin(adminMode || false);

      const xp = (user as any)?.xp || 0;
      const missions = (user as any)?.totalMissions || 0;
      const workouts = (user as any)?.totalWorkouts || 0;
      
      setUserStats({ xp, missions, workouts });

      const data = await WorkoutService.fetchMedals();
      setMedals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  const addDemoXP = async () => {
    Alert.alert(
      'Modo Admin', 
      'Como o XP agora é controlado pelo servidor (nuvem), o botão de adicionar XP de demonstração precisaria de uma rota específica na API. Para testar o desbloqueio real, complete um treino ou missão!'
    );
  };

  const handleResetStats = () => {
    Alert.alert(
      'Reset Global Desativado',
      'Como os dados agora estão sincronizados e protegidos na nuvem (PostgreSQL), o reset local de missões e treinos foi desativado por segurança.'
    );
  };

  const renderMedalCard = ({ item }: { item: Medal }) => {
    let isUnlocked = false;
    let progressText = '';
    
    if (item.type === 'xp') {
      isUnlocked = userStats.xp >= item.requirement;
      progressText = `Faltam ${Math.max(0, item.requirement - userStats.xp)} XP`;
    } else if (item.type === 'missions') {
      isUnlocked = userStats.missions >= item.requirement;
      progressText = `Faltam ${Math.max(0, item.requirement - userStats.missions)} missões`;
    } else if (item.type === 'workouts') {
      isUnlocked = userStats.workouts >= item.requirement;
      progressText = `Faltam ${Math.max(0, item.requirement - userStats.workouts)} treinos`;
    }

    return (
      <View style={[styles.medalCard, !isUnlocked && styles.medalCardLocked]}>
        <View 
          style={[
            styles.iconContainer, 
            isUnlocked ? { backgroundColor: `${item.color}20` } : styles.iconContainerLocked
          ]}
        >
          <FontAwesome5 
            name={item.icon} 
            size={28} 
            color={isUnlocked ? item.color : theme.colors.inactive} 
          />
        </View>
        
        <Text style={styles.medalName}>{item.name}</Text>
        <Text style={styles.medalDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {!isUnlocked && (
          <View style={styles.lockedBadge}>
            <FontAwesome5 name="lock" size={10} color={theme.colors.textMuted} />
            <Text style={styles.lockedText}>{progressText}</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading && medals.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Conquistas</Text>
        </View>

        {isAdmin && (
          <View style={styles.adminButtonsContainer}>
            <TouchableOpacity style={styles.demoButton} onPress={addDemoXP} activeOpacity={0.7}>
              <Text style={styles.demoButtonText}>+100 XP (Demo)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resetStatsButton} onPress={handleResetStats} activeOpacity={0.7}>
              <Text style={styles.resetStatsButtonText}>Zerar Progresso</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>XP Total Acumulado (Nuveem)</Text>
          <Text style={styles.statsValue}>{userStats.xp} XP</Text>
        </View>
      </View>

      <FlatList
        data={medals}
        keyExtractor={(item) => item.id}
        renderItem={renderMedalCard}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TelaMedalhas;