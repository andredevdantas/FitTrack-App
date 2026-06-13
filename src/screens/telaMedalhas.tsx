import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { WorkoutService, Medal } from '../services/WorkoutService';
import { styles } from '../styles/screens/telaMedalhasStyles';
import { StorageService, StorageKeys } from '../storage/StorageService';

const TelaMedalhas = () => {
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

      const xp = await StorageService.getItem<number>(StorageKeys.USER_TOTAL_XP) || 0;
      const missions = await StorageService.getItem<number>(StorageKeys.TOTAL_MISSIONS_COMPLETED) || 0;
      const workouts = await StorageService.getItem<number>(StorageKeys.TOTAL_WORKOUTS_COMPLETED) || 0;
      
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
    }, [])
  );

  const addDemoXP = async () => {
    const newXp = userStats.xp + 100;
    await StorageService.setItem(StorageKeys.USER_TOTAL_XP, newXp);
    setUserStats(prev => ({ ...prev, xp: newXp }));
  };

  const renderMedalCard = ({ item }: { item: Medal }) => {
    let isUnlocked = false;
    let progressText = '';

    if (item.type === 'xp') {
      isUnlocked = userStats.xp >= item.requirement;
      progressText = `Faltam ${item.requirement - userStats.xp} XP`;
    } else if (item.type === 'missions') {
      isUnlocked = userStats.missions >= item.requirement;
      progressText = `Faltam ${item.requirement - userStats.missions} missões`;
    } else if (item.type === 'workouts') {
      isUnlocked = userStats.workouts >= item.requirement;
      progressText = `Faltam ${item.requirement - userStats.workouts} treinos`;
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
            color={isUnlocked ? item.color : '#BDC3C7'} 
          />
        </View>
        
        <Text style={styles.medalName}>{item.name}</Text>
        <Text style={styles.medalDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {!isUnlocked && (
          <View style={styles.lockedBadge}>
            <FontAwesome5 name="lock" size={10} color="#95A5A6" />
            <Text style={styles.lockedText}>{progressText}</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading && medals.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Conquistas</Text>
          {isAdmin && (
            <TouchableOpacity style={styles.demoButton} onPress={addDemoXP} activeOpacity={0.7}>
              <Text style={styles.demoButtonText}>+100 XP (Admin)</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>XP Total Acumulado</Text>
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