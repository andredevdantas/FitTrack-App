import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DaysContext } from '../context/DaysContext';
import { UserDataContext } from '../context/UserDataContext';
 
const SettingsScreen = () => {
  const [userName, setUserName] = useState('Usuário');
  const [isEditing, setIsEditing] = useState(false);
  const { idade, peso, altura, setIdade, setPeso, setAltura } = useContext(UserDataContext);
  const { selectedDays, setSelectedDays } = useContext(DaysContext);
 
  const [profileImage, setProfileImage] = useState(null);
  const handleImageUpload = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelado', 'Seleção de imagem cancelada.');
      } else if (response.errorCode) {
        Alert.alert('Erro', 'Ocorreu um erro ao selecionar a imagem.');
      } else {
        setProfileImage(response.assets[0].uri);
      }
    });
  };
 
  const toggleDay = (day) => {
    setSelectedDays({ ...selectedDays, [day]: !selectedDays[day] });
  };
 
  const calculateBMI = () => {
    const alturaEmMetros = parseFloat(altura?.replace(',', '')) / 100;
    const pesoEmKg = parseFloat(peso);
    if (!alturaEmMetros || !pesoEmKg) return null;
    return (pesoEmKg / (alturaEmMetros * alturaEmMetros)).toFixed(2);
  };
 
  const getBMIStatus = () => {
    const bmi = calculateBMI();
    if (!bmi) return '---';
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi >= 18.5 && bmi < 24.9) return 'Peso normal';
    if (bmi >= 25 && bmi < 29.9) return 'Sobrepeso';
    return 'Obesidade';
  };
 
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
 
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="person" size={50} color="#888" />
            </View>
          )}
          <TouchableOpacity style={styles.imageUploadIcon} onPress={handleImageUpload}>
            <Icon name="camera-alt" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        {!isEditing ? (
          <Text style={styles.userName}>{userName}</Text>
        ) : (
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Digite seu nome"
            placeholderTextColor="#888"
          />
        )}
      </View>
 
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Peso: </Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
        ) : (
          <Text style={styles.infoText}>{peso} kg</Text>
        )}
      </View>
 
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Altura: </Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={altura}
            onChangeText={setAltura}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
        ) : (
          <Text style={styles.infoText}>{altura} metros</Text>
        )}
      </View>
 
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Idade: </Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />
        ) : (
          <Text style={styles.infoText}>{idade} anos</Text>
        )}
      </View>
 
      <View style={styles.bmiContainer}>
        <Text style={styles.label}>IMC: {calculateBMI() || '---'}</Text>
        <Text style={styles.bmiStatus}>Status: {getBMIStatus()}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
          <Text style={styles.editButtonText}>{isEditing ? 'Salvar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>
 
      <Text style={styles.label}>Dias de Treino</Text>
      {Object.keys(selectedDays).map((day) => (
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            selectedDays[day] ? styles.dayButtonSelected : styles.dayButtonUnselected,
          ]}
          onPress={() => toggleDay(day)}
        >
          <Text style={styles.dayButtonText}>{capitalizeFirstLetter(day)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
 
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333333',
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    color: '#000000',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#000000',
  },
  bmiContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  bmiStatus: {
    fontSize: 14,
    color: '#333333',
    marginVertical: 5,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  dayButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  dayButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  dayButtonUnselected: {
    backgroundColor: '#CCCCCC',
  },
  dayButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
 
export default SettingsScreen;