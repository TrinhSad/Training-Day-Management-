import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, ImageBackground, ScrollView, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../API/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserHistory = async () => {
  try {
    const storedAccessToken = await AsyncStorage.getItem('accessToken');
    const response = await axios.get(`${BASE_URL}/user/get-history`, {
      headers: {
        Authorization: `Bearer ${storedAccessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    // console.error('Error fetching user history:', error);
    throw error;
  }
};

const History = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getUserHistory();
      setPrograms(data.programs);
    } catch (error) {
      // console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View style={styles.BK}>
      <View style={styles.header}>
        <ImageBackground source={require('../../assets/backgroundPF.png')} style={styles.imageBackground}>
          <Text style={styles.headerText}>LỊCH SỬ</Text>
        </ImageBackground>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : programs.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Không có dữ liệu lịch sử</Text>
          </View>
        ) : (
          programs.map((program) => (
            <View key={program._id} style={styles.programContainer}>
              <Image source={{ uri: program.programDetails.image }} style={styles.programImage} />
              <View style={{ left: 3, padding: 2, flex: 1, justifyContent: 'space-between' }}>
                <Text numberOfLines={2} style={styles.title}>{program.programDetails.programName}</Text>
                <Text style={styles.titledetail}>Trạng thái: {program.status}</Text>
                <Text style={styles.titledetail}>Ngày đăng kí: {new Date(program.registrationDate).toLocaleString()}</Text>
                <Text style={styles.titledetail}>Ngày tham gia: {new Date(program.joiningDate).toLocaleString()}</Text>
                <Text style={styles.titledetail}>Điểm: {program.programDetails.point} NRL</Text>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 80 }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  BK: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  header: {
    width: '100%',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  content: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 18,
    color: 'white',
    left: 5,
    fontFamily: 'Roboto-Bold',
    fontWeight: '600',
    padding: 15,
    marginTop: 32,
    textAlign: 'center',
  },
  programContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#F0FFFF',
    borderRadius: 20,
    borderColor: '#f3f3f4',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 13,
  },
  programImage: {
    width: 130,
    height: 120,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    resizeMode: 'stretch',
  },
  titledetail: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  noDataText: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
  },
});

export default History;
