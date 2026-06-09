import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from '@react-native-material/core';
import * as db from '../utilites/globalFunctions.js';
import { UserDataContext } from '../context/UserDataContext';

function limiteCaractere(text: String, setAttribute) {
  if (text.length > 4) {
    setAttribute(text.slice(0, -1))
  }
}

const TelaLogin = ({ navigation }) => {
  const { idade, peso, altura, setIdade, setPeso, setAltura } = useContext(UserDataContext);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (idade === '' || peso === '' || altura === '') {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setError('');
    db.storeData('idade', idade);
    db.storeData('peso', peso);
    db.storeData('altura', altura);
    db.storeData('firstTime', 1)
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dados</Text>
      <TextInput
        label="Idade"
        value={idade}
        onChangeText={(idadeText) => {
          setIdade(idadeText);
          limiteCaractere(idadeText, setIdade);
        }}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Peso"
        value={peso}
        onChangeText={(pesoText) => {
          setPeso(pesoText);
          limiteCaractere(pesoText, setPeso);
        }}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Altura"
        value={altura}
        onChangeText={(alturaText) => {
          setAltura(alturaText);
          limiteCaractere(alturaText, setAltura);
          if (alturaText.length === 2 && alturaText[1] !== ',') {
            alturaText = `${alturaText.slice(0, 1)},${alturaText.slice(1)}`;
            setAltura(alturaText);
          }
        }}
        keyboardType="numeric"
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title="Confirmar"
        onPress={handleLogin}
        style={styles.button}
        color="black"
        tintColor="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default TelaLogin;
