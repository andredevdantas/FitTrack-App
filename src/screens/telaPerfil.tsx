import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { DaysContext } from '../contexts/DaysContext';
import { DaysOfWeek } from '../types';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { styles } from '../styles/screens/telaPerfilStyles';
import { theme } from '../styles/theme';

const TelaPerfil = () => {
  const { selectedDays, toggleDay } = useContext(DaysContext);
  const [userStats, setUserStats] = useState({
    xp: 0,
    missions: 0,
    workouts: 0,
  });

  const loadStats = async () => {
    try {
      const xp = await StorageService.getItem<number>(StorageKeys.USER_TOTAL_XP) || 0;
      const missions = await StorageService.getItem<number>(StorageKeys.TOTAL_MISSIONS_COMPLETED) || 0;
      const workouts = await StorageService.getItem<number>(StorageKeys.TOTAL_WORKOUTS_COMPLETED) || 0;
      setUserStats({ xp, missions, workouts });
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const daysList: { key: keyof DaysOfWeek; label: string }[] = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja terminar a sessão? Os seus dados de progresso continuarão salvos no dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => Alert.alert('Aviso', 'A função de logout reencaminhará para a Tela de Login na estrutura de navegação raiz.')
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <FontAwesome5 name="user-alt" size={40} color={theme.colors.primary} />
        </View>
        <Text style={styles.userName}>Atleta FitTrack</Text>
        <Text style={styles.userEmail}>focado@fittrack.app</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userStats.xp}</Text>
            <Text style={styles.statLabel}>XP Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userStats.workouts}</Text>
            <Text style={styles.statLabel}>Treinos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userStats.missions}</Text>
            <Text style={styles.statLabel}>Missões</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>O Meu Plano de Treino</Text>
        <View style={styles.daysContainer}>
          {daysList.map((day, index) => {
            const isActive = selectedDays[day.key];
            const isLast = index === daysList.length - 1;

            return (
              <TouchableOpacity
                key={day.key}
                style={[styles.dayRow, isLast && styles.dayRowLast]}
                onPress={() => toggleDay(day.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayText, isActive && styles.dayTextActive]}>
                  {day.label}
                </Text>
                <View style={[styles.toggleButton, isActive && styles.toggleButtonActive]}>
                  {isActive && <FontAwesome5 name="check" size={12} color={theme.colors.surface} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <FontAwesome5 name="sign-out-alt" size={16} color={theme.colors.danger} />
        <Text style={styles.logoutButtonText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TelaPerfil;