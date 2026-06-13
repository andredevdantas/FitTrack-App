import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { WorkoutService, Medal } from '../services/WorkoutService';
import { styles } from '../styles/screens/telaMedalhasStyles';

const TelaMedalhas = () => {
  const [medals, setMedals] = useState<Medal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [userTotalXP, setUserTotalXP] = useState<number>(0);

  const loadMedals = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await WorkoutService.fetchMedals();
      setMedals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedals();
  }, [loadMedals]);

  const addDemoXP = () => {
    setUserTotalXP(prev => prev + 100);
  };

  const renderMedalCard = ({ item }: { item: Medal }) => {
    const isUnlocked = userTotalXP >= item.xpRequired;
    const missingXP = item.xpRequired - userTotalXP;

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
            <Text style={styles.lockedText}>Faltam {missingXP} XP</Text>
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
          <TouchableOpacity style={styles.demoButton} onPress={addDemoXP} activeOpacity={0.7}>
            <Text style={styles.demoButtonText}>+100 XP (Demo)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>XP Total Acumulado</Text>
          <Text style={styles.statsValue}>{userTotalXP} XP</Text>
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