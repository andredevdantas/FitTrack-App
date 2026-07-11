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
import { FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { getStyles } from '../styles/screens/telaVerificacaoStyles';

interface Props {
  route: any;
  navigation: any; 
}

const TelaVerificacao = ({ route, navigation }: Props) => {
  // Recebe o email repassado pela tela de login
  const { email } = route.params;
  
  const { verifyEmailCode, isLoading } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);  
  const styles = getStyles(theme);
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (code.trim().length !== 6) {
      setError('O código deve conter 6 dígitos exatos.');
      return;
    }

    setError('');
    
    try {
      await verifyEmailCode(email, code);
      await StorageService.setItem(StorageKeys.IS_FIRST_TIME, false);
      // Se validou com sucesso, destranca o app
      navigation.navigate('MainTabs');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Código inválido ou expirado.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="envelope-open-text" size={48} color={theme.colors.primary} />
        </View>
        
        <Text style={styles.title}>Verifique seu E-mail</Text>
        <Text style={styles.subtitle}>
          Enviamos um código de 6 dígitos para {email}. Digite-o abaixo para liberar sua conta.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleVerify} 
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Confirmar Código</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TelaVerificacao;