import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, ImageBackground, Image, FlatList, Alert } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from 'expo-font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../API/Config';
import { useNavigation ,useFocusEffect} from '@react-navigation/native';


const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [imageUri, setImageUri] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const navigation = useNavigation(); 

    const details = [
        { name: "Giới tính:", value: userInfo ? userInfo.gender : '' },
        { name: "Ngày sinh:", value: userInfo ? new Date(userInfo.birthDay).toLocaleDateString() : '' },
        { name: "MSSV:", value: userInfo ? userInfo.MSSV : '' },
        { name: "Khoa:", value: userInfo ? userInfo.facultyName : '' },
        { name: "Điểm:", value: userInfo ? userInfo.point : '' },
        { name: "Ngày tạo:", value: userInfo ? new Date(userInfo.createdAt).toLocaleDateString() : '' },
    ];

    const fetchUserInfo = async () => {
        try {
            const storedAccessToken = await AsyncStorage.getItem('accessToken');
            if (!storedAccessToken) {
                Alert.alert('Lỗi', 'Không tìm thấy token. Vui lòng đăng nhập lại.');
                return;
            }

            const response = await axios.get(`${BASE_URL}/user/get-information`, {
                headers: {
                    Authorization: `Bearer ${storedAccessToken}`
                }
            });

            if (response.data && response.data.result) {
                const { infoData, facultyName } = response.data.result;
                setUserInfo({ ...infoData, facultyName });
            } else {
                Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng. Vui lòng thử lại sau');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lấy thông tin người dùng. Vui lòng thử lại sau');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserInfo();
        }, [])
    );

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
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
        setOpenModal(false);
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
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
        setOpenModal(false);
    };

    const deletePhoto = () => {
        setImageUri('');
        setOpenModal(false);
    };

    const renderModal = () => {
        return (
            <Modal
                visible={openModal}
                animationType='slide'
                transparent={true}
            >
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

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('accessToken');
            navigation.navigate('Login'); 
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    const [fontsLoaded] = useFonts({
        'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf')
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.BK}>
            <View style={styles.header}>
                <ImageBackground source={require('../../assets/backgroundPF.png')} style={styles.backgroundImage} />
                <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle}>THÔNG TIN SINH VIÊN</Text>
                    </View>
                    <View>
                        <Image
                            resizeMode="stretch"
                            source={imageUri ? { uri: imageUri } : require('../../assets/img_loading.png')}
                            style={styles.image}
                        />
                        <View style={styles.cameraIconContainer}>
                            <TouchableOpacity onPress={() => setOpenModal(true)}>
                                <Entypo name="camera" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.studentName}>{userInfo ? userInfo.fullName : 'Loading...'}</Text>
                    </View>
                </View>
            </View>
            <SafeAreaView>
                <FlatList
                    style={styles.flatList}
                    vertical
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.name}
                    data={details}
                    renderItem={({ item }) => (
                        <View style={styles.detailContainer}>
                            <Text style={styles.detailName}>{item.name}</Text>
                            <Text style={styles.detailValue}>{item.value}</Text>
                        </View>
                    )}
                />
                <TouchableOpacity style={styles.logoutButtonContainer} onPress={handleLogout}>
                    <Text style={styles.logoutButton}>Đăng xuất</Text>
                </TouchableOpacity>
            </SafeAreaView>
            {renderModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    BK: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
    },
    header: {
        width: '100%',
        height: 250,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 45,
    },
    headerTitle: {
        fontSize: 17,
        color: 'white',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'white',
        alignSelf: 'center',
        marginTop: 10,
    },
    cameraIconContainer: {
        position: 'absolute',
        marginTop: 110,
        left: 230,
    },
    nameContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    studentName: {
        fontSize: 17,
        color: 'white',
    },
    flatList: {
        marginEnd: 10,
        marginStart: 10,
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent:'space-between',
        padding: 10,
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#838B83',
    },
    detailName: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
    },
    detailValue: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        paddingHorizontal:5
    },
    logoutButtonContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    logoutButton: {
        padding: 12,
        margin: 10,
        width: '50%',
        backgroundColor: '#0032a0',
        color: 'white',
        borderRadius: 10,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    }

});

export default Profile;
