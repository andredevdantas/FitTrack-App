import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { getStyles } from '../styles/screens/telaLoginStyles';

interface Props {
  navigation: any; 
}

const TelaLogin = ({ navigation }: Props) => {
  const { register, isLoading } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);  
  const styles = getStyles(theme);
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!nome.trim() || !email.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setError('');
    
    try {
      await register(nome, email);
      await StorageService.setItem(StorageKeys.IS_FIRST_TIME, false);
      navigation.navigate('MainTabs');
    } catch (err: any) {
      setError('Erro ao conectar com o servidor. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo ao FitTrack</Text>
        <Text style={styles.subtitle}>Crie sua conta para sincronizar seu progresso</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome de Herói</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Arthur Pendragon"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Ex: heroi@fittrack.com"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin} 
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Começar Jornada</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TelaLogin;