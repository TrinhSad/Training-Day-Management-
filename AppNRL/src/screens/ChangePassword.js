
import React, { useState } from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../API/Config';

const ChangePassword = () => {
    const navigation = useNavigation();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleChangePassword = async () => {
        try {
            if (newPassword !== confirmNewPassword) {
                Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu mới không trùng khớp');
                return;
            }

            const storedAccessToken = await AsyncStorage.getItem('accessToken');
            if (!storedAccessToken) {
                Alert.alert('Lỗi', 'Không tìm thấy token. Vui lòng đăng nhập lại.');
                return;
            }

            const response = await axios.put(`${BASE_URL}/user/change-password`, {
                oldPassword: oldPassword,
                newPassword: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${storedAccessToken}`
                }
            });

            if (response.data && response.data.result) {
                Alert.alert('Thành công', 'Thay đổi mật khẩu thành công');
                navigation.goBack();
            } else {
                Alert.alert('Lỗi', 'Không thể thay đổi mật khẩu. Vui lòng thử lại sau');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại sau');
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
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, right: 0, marginTop: 80}}>
                <Image source={require('../../assets/BGpassword.jpg')} style={{width: 300, height: 300}} />
                <View style={styles.formTxt}>
                    <TextInput 
                        placeholder='Mật khẩu cũ'
                        style={styles.oldpass}
                        secureTextEntry={true}
                        value={oldPassword}
                        onChangeText={text => setOldPassword(text)}
                    />
                    <TextInput 
                        placeholder='Mật khẩu mới'
                        style={styles.newpass}
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={text => setNewPassword(text)}
                    />
                    <TextInput 
                        placeholder='Xác nhận mật khẩu mới'
                        style={styles.cfnewpass}
                        secureTextEntry={true}
                        value={confirmNewPassword}
                        onChangeText={text => setConfirmNewPassword(text)}
                    />
                </View>
                <TouchableOpacity onPress={handleChangePassword}
                style={{padding:15, backgroundColor:'#0032a0', width:'70%', flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',borderRadius:10, marginTop:50
                    }}>
                    <Text style={styles.txtbtnchangepass}>Xác nhận</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    BK: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        position:'relative'
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
        position: 'relative'
    },
    backButton: {
        position: 'absolute',
        left: 15,
        bottom: 10,
        zIndex: 1,
    },
    formTxt:{
        marginTop:10, width:'85%'
    },
    oldpass:{
        bottom: 10,
        padding:10,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#f3f3f4',
        borderRadius: 5,
        backgroundColor: '#faf9fe',
    },
    newpass:{
        bottom: 10,
        padding:10,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#f3f3f4',
        borderRadius: 5,
        marginVertical:10,
        backgroundColor: '#faf9fe',
    },
    cfnewpass:{
        bottom: 10,
        padding:10,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#f3f3f4',
        borderRadius: 5,
        backgroundColor: '#faf9fe',
    },
    btnCFchangepass:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
        position:'relative', 
        marginTop:400
    },
    txtbtnchangepass:{
         marginHorizontal:25, backgroundColor:'#0032a0', color:'white', borderRadius:10, textAlign:'center'
    }
});

export default ChangePassword;
