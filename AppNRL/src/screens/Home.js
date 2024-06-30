import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import ResultProgram from '../components/ResultProgram';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../API/Config';

const Home = () => {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf')
  });

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [fullName, setFullName] = useState('');

  const fetchPrograms = async () => {
    try {
      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedFullName = await AsyncStorage.getItem('fullName');
      if (storedAccessToken && storedFullName) {
        setFullName(storedFullName);
        const response = await axios.get(`${BASE_URL}/program/get-public-programs`, {
          headers: {
            Authorization: `Bearer ${storedAccessToken}` 
          }
        });

        if (response.data && Array.isArray(response.data.programs)) {
          setPrograms(response.data.programs);
        } else {
          console.error('Invalid response format or empty programs array');
        }
      } else {

        console.error('Access token or fullName not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchPrograms(); 
  }, []); 

  useFocusEffect(
    useCallback(() => {
      fetchPrograms(); 
    }, [])
  );

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/backgroundPF.png')} style={styles.header}>
        <Text style={styles.headerText}>Xin chào, {fullName}</Text>
      </ImageBackground>

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Demon')}>
          <Image style={styles.iconImage} source={require('../../assets/demonstration.png')} />
          <Text style={styles.iconText}>Minh chứng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Program')}>
          <Image style={styles.iconImage} source={require('../../assets/program.png')} />
          <Text style={styles.iconText}>Chương trình</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Feed')}>
          <Image style={styles.iconImage} source={require('../../assets/feedback.png')} />
          <Text style={styles.iconText}>Đề xuất</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ChangePass')}>
          <Image style={styles.iconImage} source={require('../../assets/password.png')} />
          <Text style={styles.iconText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0032a0" />
      ) : (
        <FlatList
          data={programs.slice(0, 5)} 
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: item._id })}>
              <ResultProgram program={item} />
            </TouchableOpacity>
          )}
          ListFooterComponent={() => <View style={{ height: 50 }} />} 
          contentContainerStyle={{ paddingBottom: 20 }} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    backgroundColor: 'white'
  },
  header: {
    height: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden'
  },
  headerText: {
    fontSize: 18,
    color: 'white',
    left:5,
    fontFamily: 'Roboto-Light',
    fontWeight: '600',
    padding: 20,
    marginTop: 30,
    textAlign: 'left'
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 5,
  },
  iconButton: {
    alignItems: 'center'
  },
  iconImage: {
    width: 40,
    height: 40,
    marginTop:5,
    resizeMode: 'stretch'
  },
  iconText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    fontWeight: '100',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Home;
