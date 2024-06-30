import React, { useEffect, useState, useCallback } from "react";
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, FlatList, ActivityIndicator, Modal, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from 'axios';
import { BASE_URL } from '../API/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResultNotice from "../components/ResultNotice";

const getUserNotifications = async () => {
  try {
    const storedAccessToken = await AsyncStorage.getItem('accessToken');
    const response = await axios.get(`${BASE_URL}/notification/get-notification`, {
      headers: {
        Authorization: `Bearer ${storedAccessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

const markAsRead = async (notificationId) => {
  try {
    const storedAccessToken = await AsyncStorage.getItem('accessToken');
    const response = await axios.put(`${BASE_URL}/notification/mark-as-read/${notificationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${storedAccessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

const Notice = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getUserNotifications();
      setNotifications(data.userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const openModal = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const closeModal = async () => {
    if (selectedNotification) {
      try {
        await markAsRead(selectedNotification.notificationId._id);
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.notificationId._id === selectedNotification.notificationId._id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    setSelectedNotification(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.BK}>
      <View style={styles.header}>
        <ImageBackground source={require('../../assets/backgroundPF.png')} style={styles.imageBackground}>
          <Text style={styles.headerText}>THÔNG BÁO</Text>
        </ImageBackground>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          style={{ position: 'relative', flex: 1, marginTop: 90 }}
          vertical
          showsVerticalScrollIndicator={false}
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => openModal(item)}
            >
              <ResultNotice notification={item.notificationId} isRead={item.isRead} />
            </TouchableOpacity>
          )}
          ListFooterComponent={() => (
            <View>
              <View style={{ height: 80 }} />
            </View>
          )}
        />
      )}

      {selectedNotification && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Thông báo chi tiết</Text>
              <Text style={styles.modaltxtTT}>{selectedNotification.notificationId.title}</Text>
              <View style={{ backgroundColor: '#e0fbff', padding: 10 }}>
                <Text style={styles.modalText}>{selectedNotification.notificationId.message}</Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={{ marginTop: 12, backgroundColor: 'red', padding: 10, paddingHorizontal: 15, borderRadius: 10 }}>
                <Text style={{ color: 'white' }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  BK: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  header: {
    width: '100%',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  headerText: {
    fontSize: 18,
    color: 'white',
    left: 5,
    fontFamily: 'Roboto-Bold',
    fontWeight: '600',
    padding: 15,
    marginTop: 32,
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modaltxtTT: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10
  },
  modalText: {
    fontSize: 13,
    marginBottom: 5,
    textAlign: 'justify'
  },
});

export default Notice;
