import React, { useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import { api } from '../services/api';
import { getStyles } from '../styles/screens/telaRankingStyles';

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  level: number;
}

interface LeaderboardData {
  topUsers: LeaderboardUser[];
  currentUser: LeaderboardUser;
  userRank: number;
}

const TelaRanking = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const styles = getStyles(theme);

  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get(`/users/${user.id}/leaderboard`);
      setData(response.data);
    } catch (error) {
      console.error('Erro ao buscar classificação:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchLeaderboard();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  const getRankColor = (index: number) => {
    if (index === 0) return '#FFD700';
    if (index === 1) return '#C0C0C0';
    if (index === 2) return '#CD7F32';
    return theme.colors.border;
  };

  const renderItem = ({ item, index }: { item: LeaderboardUser; index: number }) => {
    const isCurrentUser = item.id === user?.id;
    const rankColor = getRankColor(index);

    return (
      <View style={[styles.card, isCurrentUser && styles.cardHighlight]}>
        <View style={[styles.rankBadge, { backgroundColor: rankColor }]}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name} {isCurrentUser && '(Você)'}</Text>
          <Text style={styles.userLevel}>Nível {item.level}</Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>{item.xp} XP</Text>
        </View>
      </View>
    );
  };

  if (isLoading && !data) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="trophy" size={40} color="#FFD700" />
        <Text style={styles.title}>Hall da Fama</Text>
        <Text style={styles.subtitle}>Os 10 melhores atletas do FitTrack</Text>
      </View>

      <FlatList
        data={data?.topUsers || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      />

      {data && (
        <View style={styles.footerFixed}>
          <View>
            <Text style={styles.footerTextSubtitle}>A Sua Posição Atual</Text>
            <Text style={styles.footerTextTitle}>{data.userRank}º Lugar Global</Text>
          </View>
          <View style={[styles.xpBadge, { backgroundColor: '#FFF' }]}>
            <Text style={[styles.xpText, { color: theme.colors.primary }]}>
              {data.currentUser.xp} XP
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TelaRanking;