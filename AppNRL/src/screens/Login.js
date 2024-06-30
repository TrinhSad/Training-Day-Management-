import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { BASE_URL } from '../API/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Peralta-Regular': require('../../assets/fonts/Peralta-Regular.ttf'),
    'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
    'SeymourOne-Regular': require('../../assets/fonts/SeymourOne-Regular.ttf'),
    'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
  });

  const [mssv, setMSSV] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!mssv || !password) {
      setError('Vui lòng nhập đầy đủ MSSV và mật khẩu.');
      return;
    }

    await AsyncStorage.setItem('MSSV', mssv);

    const apiUrl = `${BASE_URL}/auth/login`; 
    try {
      const response = await axios.post(apiUrl, {
        MSSV: mssv,
        password: password,
      });

      const accessToken = response.data.accessToken; 
      const fullName = response.data.user.fullName;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('fullName', fullName);

      navigation.navigate('Main');
    } catch (error) {
      console.error('Error:', error);
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Image source={require('../../assets/background.png')} style={{ position: 'absolute', width: '100%', height: '80%' }} />
      <View style={{ justifyContent: 'space-around', position: 'absolute', flexDirection: 'row' }}>
        <Image style={{ top: 240 }} source={require('../../assets/bay1.png')} />
        <Image style={{ left: 180, top: 20 }} source={require('../../assets/bay.png')} />
      </View>
      <SafeAreaView style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'space-around', paddingTop: 350, paddingBottom: 10 }}>
        <View>
          <View>
            <Text style={{ fontFamily: 'SeymourOne-Regular', fontSize: 25, color: '#0032a0', textAlign: 'center' }}>VAA STUDENT</Text>
            <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 14, textAlign: 'center', marginTop: 20 }}>Vui lòng đăng nhập tài khoản</Text>
          </View>
          <View style={{ marginVertical: 20 }}>
            <TextInput
              placeholder="MSSV"
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: 14,
                margin: 20,
                padding: 15,
                borderBottomColor: '#f3f3f4',
                backgroundColor: '#E0EEEE',
                borderRadius: 10
              }}
              value={mssv}
              onChangeText={text => setMSSV(text)}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: 14,
                margin: 20,
                marginVertical: -1,
                padding: 15,
                borderBottomColor: '#f3f3f4',
                backgroundColor: '#E0EEEE',
                borderRadius: 10
              }}
              value={password}
              onChangeText={text => setPassword(text)}
            />
          </View>
          {error ? (
            <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>{error}</Text>
          ) : null}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
              <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 14, textAlign: 'left', color: '#0032a0', marginLeft: 25 }} >Quên mật khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 14, textAlign: 'right', color: '#0032a0', marginRight: 25 }}>Góp ý - Phản hồi</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              padding: 20,
              backgroundColor: '#0032a0',
              marginVertical: 30,
              margin: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 100 },
              shadowOpacity: 0.8,
              shadowRadius: 10,
              elevation: 10
            }}
            onPress={handleLogin}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: "bold" }}>Đăng nhập</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles here
});

export default LoginScreen;
