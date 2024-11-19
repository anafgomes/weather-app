import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Alert, Keyboard } from 'react-native';
import api from './src/services/api';

export default function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [weather, setWeather] = useState(null);
  const inputLatRef = useRef(null);
  const inputLonRef = useRef(null);

  async function buscar() {
    if (latitude === '' || longitude === '') {
      Alert.alert('Erro', 'Por favor, insira valores válidos de latitude e longitude.');
      return;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      Alert.alert('Erro', 'A latitude e a longitude devem ser numéricas.');
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      Alert.alert('Erro', 'Latitude deve estar entre -90 e 90 e longitude entre -180 e 180.');
      return;
    }

    try {
      const response = await api.get('/data/2.5/weather', {
        params: {
          lat,
          lon,
          appid: '87d9191ca4b50018debd20939f176972',
          units: 'metric',
          lang: 'pt_br',
        },
      });

      setWeather(response.data);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Erro na requisição:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert('Erro', 'Chave de API inválida. Verifique sua configuração.');
      } else if (error.response?.status === 400) {
        Alert.alert('Erro', 'Parâmetros inválidos. Verifique latitude e longitude.');
      } else if (error.response?.status === 500) {
        Alert.alert('Erro', 'Erro interno do servidor. Tente novamente mais tarde.');
      } else {
        Alert.alert('Erro', 'Algo deu errado. Verifique a conexão ou os parâmetros.');
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.text}>Consulta de Clima</Text>

        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={latitude}
          onChangeText={(text) => setLatitude(text)}
          keyboardType="decimal-pad"
          ref={inputLatRef}
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={longitude}
          onChangeText={(text) => setLongitude(text)}
          keyboardType="decimal-pad"
          ref={inputLonRef}
        />
      </View>

      <View style={styles.areaBtn}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#0782F9' }]}
          onPress={buscar}
        >
          <Text style={styles.btnText}>BUSCAR CLIMA</Text>
        </TouchableOpacity>
      </View>

      {weather && (
        <View style={styles.resultado}>
          <Text style={styles.itemText}>Temperatura: {weather.main.temp}°C</Text>
          <Text style={styles.itemText}>Umidade: {weather.main.humidity}%</Text>
          <Text style={styles.itemText}>Descrição: {weather.weather[0].description}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },

  text: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 50,
  },

  input: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    borderColor: '#000000',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },

  areaBtn: {
    alignItems: 'center',
    marginTop: 10,
  },

  btn: {
    width: '90%',
    height: 50,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: {
    color: '#ffffff',
    fontSize: 15,
  },

  resultado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 20,
    marginVertical: 5,
  },
});