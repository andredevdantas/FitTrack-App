import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeData(key: String, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Erro ao salvar dados", e);
  }
}

export async function getData(key: String) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Erro ao recuperar dados", e);
  }
}

export async function removeData(key: String) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("Erro ao remover dados", e);
  }
}
