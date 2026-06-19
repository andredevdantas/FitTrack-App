import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, Switch } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { DaysContext } from '../contexts/DaysContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { StreakService } from '../services/StreakService';
import { DaysOfWeek } from '../types';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { getStyles } from '../styles/screens/telaPerfilStyles';

const TelaPerfil = () => {
  const { selectedDays, toggleDay } = useContext(DaysContext);
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation<any>();
  const styles = getStyles(theme);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    xp: 0,
    missions: 0,
    workouts: 0,
    streak: 0,
  });

  const loadData = async () => {
    try {
      const xp = await StorageService.getItem<number>(StorageKeys.USER_TOTAL_XP) || 0;
      const missions = await StorageService.getItem<number>(StorageKeys.TOTAL_MISSIONS_COMPLETED) || 0;
      const workouts = await StorageService.getItem<number>(StorageKeys.TOTAL_WORKOUTS_COMPLETED) || 0;
      const streak = await StreakService.getStreak();
      
      setUserStats({ xp, missions, workouts, streak });

      const savedImage = await StorageService.getItem<string>(StorageKeys.USER_PROFILE_IMAGE);
      if (savedImage) setProfileImage(savedImage);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à sua galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await StorageService.setItem(StorageKeys.USER_PROFILE_IMAGE, imageUri);
    }
  };

  const daysList: { key: keyof DaysOfWeek; label: string }[] = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  const handleLogout = () => {
    Alert.alert('Sair da Conta', 'Tem certeza que deseja terminar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Sair', 
        style: 'destructive',
        onPress: () => {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <FontAwesome5 name="user-alt" size={40} color={theme.colors.primary} />
            )}
            <View style={styles.editBadge}>
              <FontAwesome5 name="camera" size={12} color={theme.colors.surface} />
            </View>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.userName}>Atleta FitTrack</Text>
        <Text style={styles.userEmail}>focado@fittrack.app</Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: `${theme.colors.warning}20`,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          marginTop: 12,
        }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.warning }}>
            🔥 {userStats.streak} {userStats.streak === 1 ? 'dia' : 'dias'} de ofensiva
          </Text>
        </View>

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
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.cardContainer}>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowText}>Modo Escuro</Text>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleTheme}
              trackColor={{ false: '#E5E8E8', true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>O Meu Plano de Treino</Text>
        <View style={styles.cardContainer}>
          {daysList.map((day, index) => {
            const isActive = selectedDays[day.key];
            const isLast = index === daysList.length - 1;

            return (
              <TouchableOpacity
                key={day.key}
                style={[styles.row, isLast && styles.rowLast]}
                onPress={() => toggleDay(day.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.rowText, isActive && styles.rowTextActive]}>
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