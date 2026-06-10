import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const telaMissoes = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela em Construção</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7F6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});

export default telaMissoes;