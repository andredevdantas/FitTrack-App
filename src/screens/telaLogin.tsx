import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { getStyles } from '../styles/screens/telaLoginStyles';

interface Props {
  navigation: any; 
}

const telaLogin = ({ navigation }: Props) => {
  const { updateUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);  
  const styles = getStyles(theme);
  
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [error, setError] = useState('');

  const limiteCaractere = (text: string, setAttribute: React.Dispatch<React.SetStateAction<string>>) => {
    if (text.length > 4) {
      setAttribute(text.slice(0, 4));
    } else {
      setAttribute(text);
    }
  };

  const handleAlturaChange = (text: string) => {
    let newText = text;
    if (newText.length === 2 && !newText.includes(',')) {
      newText = `${newText.slice(0, 1)},${newText.slice(1)}`;
    }
    limiteCaractere(newText, setAltura);
  };

  const handleLogin = async () => {
    if (!idade || !peso || !altura) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setError('');
    
    await updateUser({ idade, peso, altura });
    await StorageService.setItem(StorageKeys.IS_FIRST_TIME, false);
    
    navigation.navigate('MainTabs');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo ao FitTrack</Text>
        <Text style={styles.subtitle}>Configure seu perfil para começar</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Idade</Text>
          <TextInput
            style={styles.input}
            value={idade}
            onChangeText={(text) => limiteCaractere(text, setIdade)}
            keyboardType="numeric"
            placeholder="Ex: 25"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={(text) => limiteCaractere(text, setPeso)}
            keyboardType="numeric"
            placeholder="Ex: 70.5"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Altura (m)</Text>
          <TextInput
            style={styles.input}
            value={altura}
            onChangeText={handleAlturaChange}
            keyboardType="numeric"
            placeholder="Ex: 1,75"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Começar Jornada</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default telaLogin;