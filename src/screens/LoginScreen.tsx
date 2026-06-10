import React, { useState, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { UserContext } from '../contexts/UserContext.js';
import { StorageService, StorageKeys } from '../storage/StorageService';

interface Props {
  navigation: any; 
}

const LoginScreen = ({ navigation }: Props) => {
  const { updateUser } = useContext(UserContext);
  
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
            placeholderTextColor="#A0A0A0"
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
            placeholderTextColor="#A0A0A0"
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
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Começar Jornada</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9F9',
    borderWidth: 1,
    borderColor: '#E5E8E8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  button: {
    backgroundColor: '#27AE60', 
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#E74C3C',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoginScreen;