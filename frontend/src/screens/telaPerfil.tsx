import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, Dimensions, Animated } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BarChart } from 'react-native-chart-kit';
import { DaysContext } from '../contexts/DaysContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import { StreakService } from '../services/StreakService';
import { DaysOfWeek } from '../types';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { getStyles } from '../styles/screens/telaPerfilStyles';

const screenWidth = Dimensions.get("window").width;

const TelaPerfil = () => {
  const { selectedDays, toggleDay } = useContext(DaysContext);
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(UserContext);
  const navigation = useNavigation<any>();
  const styles = getStyles(theme);

  const themeAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(themeAnim, {
      toValue: isDarkMode ? 1 : 0,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isDarkMode]);

  const spin = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = themeAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.7, 1],
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    xp: 0,
    missions: 0,
    workouts: 0,
    streak: 0,
    level: 1,
    weeklyXp: [0, 0, 0, 0, 0, 0, 0],
  });

  const loadData = async () => {
    try {
      const localStreak = await StreakService.getStreak();
      const currentXp = user?.xp || 0;
      
      const calculatedLevel = user?.level || Math.floor(currentXp / 500) + 1;
      
      const chartData = user?.weeklyXp?.length === 7 ? user.weeklyXp : [0, 0, 0, currentXp > 0 ? 150 : 0, 0, 0, 0];

      setUserStats({ 
        xp: currentXp, 
        missions: user?.totalMissions || 0, 
        workouts: user?.totalWorkouts || 0, 
        streak: user?.streak?.currentStreak ?? localStreak,
        level: calculatedLevel,
        weeklyXp: chartData
      });

      const savedImage = await StorageService.getItem<string>(StorageKeys.USER_PROFILE_IMAGE);
      if (savedImage) setProfileImage(savedImage);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
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
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }
    ]);
  };

  const chartData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [
      {
        data: userStats.weeklyXp
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => theme.colors.primary,
    labelColor: (opacity = 1) => theme.colors.textBody,
    barPercentage: 0.5,
    decimalPlaces: 0,
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: theme.colors.border,
      strokeDasharray: "4",
    },
  };

  const progressPercentage = (userStats.xp % 500) / 500 * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.themeToggleButton} 
          onPress={toggleTheme} 
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ rotate: spin }, { scale: scale }] }}>
            <FontAwesome5 
              name={isDarkMode ? 'moon' : 'sun'} 
              size={20} 
              color={isDarkMode ? '#F1C40F' : theme.colors.primary} 
              solid 
            />
          </Animated.View>
        </TouchableOpacity>

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
        
        <Text style={styles.userName}>{user?.name || 'Atleta FitTrack'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'email@fittrack.app'}</Text>
    
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Nível {userStats.level}</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: `${theme.colors.warning}20`,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          marginTop: 12,
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.warning }}>
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
        <Text style={styles.sectionTitle}>Desempenho Semanal (XP)</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth - 70}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero={true}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            style={{ borderRadius: 16 }}
          />
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