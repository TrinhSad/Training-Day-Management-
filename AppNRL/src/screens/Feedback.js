import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, Image, Modal, TextInput, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from "expo-font";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../API/Config'; 

const Feedback = () => {
  const [imageUri, setImageUri] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [MSSV, setMSSV] = useState('');
  const [fullName, setFullName] = useState('');
  const [programId, setProgramId] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('COMPLAINT');
  const navigation = useNavigation();
  const route = useRoute();

  const [fontsLoaded] = useFonts({
    'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf')
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedMSSV = await AsyncStorage.getItem('MSSV');
        const savedFullName = await AsyncStorage.getItem('fullName');
        if (savedMSSV) setMSSV(savedMSSV);
        if (savedFullName) setFullName(savedFullName);

        const { programId } = route.params;
        if (programId) {
            setProgramId(programId);
        }
      } 
      catch (error) {
        //console.error('Failed to load MSSV or fullName from AsyncStorage:', error);
      }
    };
    fetchData();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      setOpenModal(false);
    }
  };

  const openLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      setOpenModal(false); 
    }
  };

  const deletePhoto = () => {
    setImageUri('');
    setOpenModal(false); 
  };

  const renderModal = () => {
    return (
      <Modal visible={openModal} animationType='slide' transparent={true} >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={openCamera} style={styles.iconPF}>
              <Image source={require('../../assets/camera.png')} style={styles.img_icon} />
              <View style={styles.viewPF}>
                <Text style={styles.txtmodal}>Mở camera</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={openLibrary} style={styles.iconPF}>
              <Image source={require('../../assets/gallary.png')} style={styles.img_icon} />
              <View style={styles.viewPF}>
                <Text style={styles.txtmodal}>Mở thư viện</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={deletePhoto} style={styles.iconPF}>
              <Image source={require('../../assets/remove.png')} style={styles.img_icon} />
              <View style={styles.viewPF}>
                <Text style={styles.txtmodal}>Xóa ảnh</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

 const handleSend = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('programId', programId);
    formData.append('content', content);
    formData.append('type', type);
    
    if (imageUri) {
      const localUri = imageUri;
      const filename = localUri.split('/').pop();

      formData.append('image', {
        uri: localUri,
        name: filename,
        type: 'image/jpeg',
      });
    }

    const response = await axios.post(`${BASE_URL}/propose/create-propose`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    Alert.alert('Thành công', 'Gửi đề xuất thành công!');
    navigation.navigate('Main');
  } catch (error) {
    console.error('Lỗi khi gửi đề xuất:', error);
    Alert.alert('Lỗi', 'Gửi đề xuất thất bại.');
  }
};


  return (
    <View style={styles.BK}>
      <View style={styles.header}>
        <ImageBackground source={require('../../assets/backgroundPF.png')} style={styles.imageBackground} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View contentContainerStyle={styles.scrollViewContent}>
        <View style={{ width: '100%', backgroundColor: '#faf9fe', padding: 15, marginTop: 80 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Roboto-Light',
              fontWeight: '600',
              textAlign: 'left',
              lineHeight: 18
            }}
          >Mọi thông tin đề xuất cần phải đầy đủ vui lòng nhập vào các thông tin bên dưới *</Text>
        </View>
        <View style={{ width: '100%', padding: 15, flexDirection: 'column' }}>
          <View style={styles.view_demon}>
            <Text style={styles.nametag}>
              Họ và tên*
            </Text>
            <TextInput
              style={styles.input_demon}
              value={fullName}
              onChangeText={setFullName}
              placeholder='Họ và tên'
            />
          </View>
          <View style={styles.view_demon}>
            <Text style={styles.nametag}>
              MSSV*
            </Text>
            <TextInput
              style={styles.input_demon}
              value={MSSV}
              onChangeText={setMSSV}
              placeholder='MSSV'
            />
          </View>
          <View style={styles.view_demon}>
            <Text style={styles.nametag}>
              Mã chương trình*
            </Text>
            <TextInput
              style={styles.input_demon}
              value={programId}
              onChangeText={setProgramId}
              placeholder='Mã chương trình'
            />
          </View>
          <View style={styles.view_demon}>
            <Text style={styles.nametag}>
              Loại*
            </Text>
            <TextInput
              style={styles.input_demon}
              value={type}
              onChangeText={setType}
              placeholder='Loại'
            />
          </View>
          <View style={styles.view_demon}>
            <Text style={styles.nametag}>
              Nội dung*
            </Text>
            <TextInput
              style={styles.input_demon}
              value={content}
              onChangeText={setContent}
              placeholder='Nội dung'
            />
          </View>
        </View>
        <View style={{ width: '100%', paddingHorizontal: 40 }}>
          <Image resizeMode="stretch" source={imageUri ? { uri: imageUri } : require('../../assets/img_loading.png')} style={styles.img} />
          <View style={styles.cameraIconContainer}>
            <TouchableOpacity onPress={() => setOpenModal(true)}>
              <Entypo name="camera" size={24} color="black" />
            </TouchableOpacity>
            {renderModal()}
          </View>
          <TouchableOpacity onPress={handleSend}>
            <Text style={styles.txtbtnsend}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  BK: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  header: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    bottom: 13,
    zIndex: 1,
  },
  container: {
    flex: 1,
    marginTop: 80,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: 150,
  },
  nametag: {
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    fontWeight: '100',
    left: 5
  },
  input_demon: {
    top: 5,
    padding: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f3f3f4',
    borderRadius: 5,
    backgroundColor: '#faf9fe',
  },
  view_demon: {
    position: 'relative', marginBottom: 15
  },
  cameraIconContainer: {
    alignItems: 'flex-end',
    bottom: 22
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the background color to see the modal content clearly
  },
  modalContent: {
    width: '90%',
    height: 140,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  iconPF: {
    margin: 5,
    width: 80,
    height: 80,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    borderRadius: 10
  },
  viewPF: {
    position: 'relative',
    marginTop: 55
  },
  txtmodal: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    fontWeight: '100',
    textAlign: 'center',
    justifyContent: 'center'
  },
  img_icon: {
    position: 'absolute',
    width: '55%',
    height: '50%',
    marginTop: 10,
    resizeMode: 'stretch'
  },
  txtbtnsend: {
    padding: 12,
    backgroundColor: '#0032a0',
    color: 'white',
    borderRadius: 10,
    textAlign: 'center',
    marginVertical: 10,
  }
});

export default Feedback;
