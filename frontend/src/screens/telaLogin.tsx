import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { getStyles } from '../styles/screens/telaLoginStyles';

WebBrowser.maybeCompleteAuthSession();

interface Props {
  navigation: any; 
}

const TelaLogin = ({ navigation }: Props) => {
  const { register, login, loginWithGoogle, isLoading } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);  
  const styles = getStyles(theme);
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      fetchGoogleUserInfo(response.authentication.accessToken);
    } else if (response?.type === 'error') {
      setError('Ocorreu um erro ao tentar fazer login com o Google.');
    }
  }, [response]);

  const fetchGoogleUserInfo = async (token: string) => {
    setIsGoogleLoading(true);
    try {
      const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await userInfoResponse.json();

      await loginWithGoogle(userInfo.email, userInfo.name, userInfo.id);
      
      await StorageService.setItem(StorageKeys.IS_FIRST_TIME, false);
      navigation.navigate('MainTabs');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao vincular conta do Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha email e senha.');
      return;
    }

    if (!isLoginMode && !nome.trim()) {
      setError('Por favor, informe seu nome de herói.');
      return;
    }

    setError('');
    
    try {
      if (isLoginMode) {
        await login(email, password);
        await StorageService.setItem(StorageKeys.IS_FIRST_TIME, false);
        navigation.navigate('MainTabs');
      } else {
        await register(nome, email, password);
        navigation.navigate('Verificacao', { email });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao conectar com o servidor. Verifique suas credenciais.');
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setPassword('');
  };

  const handleAppleMock = () => {
    Alert.alert('Em breve!', 'A integração com a Apple será implementada no próximo ciclo.');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo ao FitTrack</Text>
        <Text style={styles.subtitle}>
          {isLoginMode ? 'Acesse sua conta para continuar' : 'Crie sua conta para sincronizar seu progresso'}
        </Text>

        {!isLoginMode && (
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
        )}

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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Sua senha secreta"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, (isLoading || isGoogleLoading) && styles.buttonDisabled]} 
          onPress={handleSubmit} 
          activeOpacity={0.8}
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
              {isLoginMode ? 'Entrar' : 'Começar Jornada'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity 
          style={[styles.socialButton, (isLoading || isGoogleLoading) && { opacity: 0.7 }]} 
          onPress={() => promptAsync()}
          activeOpacity={0.7}
          disabled={!request || isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <ActivityIndicator color="#DB4437" />
          ) : (
            <>
              <FontAwesome5 name="google" size={18} color="#DB4437" />
              <Text style={styles.socialButtonText}>Continuar com o Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.socialButton} 
          onPress={handleAppleMock}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="apple" size={20} color={theme.colors.textTitle} />
          <Text style={styles.socialButtonText}>Continuar com a Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMode} style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {isLoginMode ? 'Não possui conta? Crie uma agora!' : 'Já tem uma conta? Entre aqui.'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TelaLogin;