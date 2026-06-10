import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
 
const Medalha = ({ label, color, onPress }) => {
  return (
    <View style={styles.medalhaContainer}>
      <TouchableOpacity onPress={onPress} style={[styles.medalha, { backgroundColor: color }]}>
        <AntDesign name="Trophy" size={30} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};
 
const PainelMedalhas = () => {
  const [medalColors, setMedalColors] = useState({
    "Iniciante": '#B0B0B0',
    "Guerreiro": '#B0B0B0',
    "Veterano": '#B0B0B0',
    "Eu Atleta": '#B0B0B0',
    "Atleta Pro": '#B0B0B0',
    "Meta Atingida 70%": '#B0B0B0',
    "Esforço Extremo": '#B0B0B0',
    "100 Treinos Completos": '#B0B0B0',
    "Desbravador": '#B0B0B0',
    "Desafio Superado": '#B0B0B0',
  });
 
  const handlePress = (medal) => {
    setMedalColors((prevColors) => ({
      ...prevColors,
      [medal]: prevColors[medal] === '#B0B0B0' ? '#FFD700' : '#B0B0B0',
    }));
  };
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>PAINEL DE MEDALHAS</Text>
      <View style={styles.medalhaGrid}>
        {Object.keys(medalColors).map((medal, index) => (
          <Medalha
            key={index}
            label={medal}
            color={medalColors[medal]}
            onPress={() => handlePress(medal)}
          />
        ))}
      </View>
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  medalhaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  medalhaContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 20,
    width: 80,
  },
  medalha: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
});
 
export default PainelMedalhas;