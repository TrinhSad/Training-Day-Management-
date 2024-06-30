import React, { useState } from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../API/Config';

const ResetPassword = () => {
    const navigation = useNavigation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordReset = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới và xác nhận mật khẩu.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                Alert.alert('Lỗi', 'Không tìm thấy token. Vui lòng thử lại.');
                return;
            }

            const response = await axios.put(`${BASE_URL}/user/reset-password`, { newPassword }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && response.data.message) {
                Alert.alert('Thành công', 'Mật khẩu của bạn đã được đặt lại thành công.');
                navigation.navigate('Login');
            } else {
                Alert.alert('Lỗi', 'Đặt lại mật khẩu không thành công. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
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
                <Image source={require('../../assets/changeps1.jpg')} style={{width: 300, height: 300}} />
                <View style={styles.formTxt}>
                    <TextInput 
                        placeholder='Nhập mật khẩu mới'
                        style={styles.newpass}
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />

                    <TextInput 
                        placeholder='Xác nhận mật khẩu mới'
                        style={styles.cfnewpass}
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
                <TouchableOpacity onPress={handlePasswordReset}
                style={{padding:15, backgroundColor:'#0032a0', width:'85%', flex: 1,
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
        marginTop:50, width:'85%'
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
        marginTop:350
    },
    txtbtnchangepass:{
         color:'white',  textAlign:'center'
    }
});

export default ResetPassword;