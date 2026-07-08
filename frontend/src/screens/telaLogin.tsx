import React, { useState, useContext } from 'react';
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
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { getStyles } from '../styles/screens/telaLoginStyles';

interface Props {
  navigation: any; 
}

const TelaLogin = ({ navigation }: Props) => {
  const { register, login, isLoading } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);  
  const styles = getStyles(theme);
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      } else {
        await register(nome, email, password);
      }
      
      await StorageService.setItem(StorageKeys.IS_FIRST_TIME, false);
      navigation.navigate('MainTabs');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao conectar com o servidor. Verifique suas credenciais.');
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setPassword('');
  };

  const handleSocialLoginMock = (provider: string) => {
    Alert.alert('Em breve!', `A integração de login com a ${provider} será implementada no próximo ciclo de desenvolvimento.`);
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
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleSubmit} 
          activeOpacity={0.8}
          disabled={isLoading}
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

        {/* Botão Google */}
        <TouchableOpacity 
          style={styles.socialButton} 
          onPress={() => handleSocialLoginMock('Google')}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="google" size={18} color="#DB4437" />
          <Text style={styles.socialButtonText}>Continuar com o Google</Text>
        </TouchableOpacity>

        {/* Botão Apple */}
        <TouchableOpacity 
          style={styles.socialButton} 
          onPress={() => handleSocialLoginMock('Apple')}
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