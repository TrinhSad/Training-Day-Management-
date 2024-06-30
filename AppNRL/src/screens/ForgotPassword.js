import React, { useState } from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../API/Config';

const ForgotPassword = () => {
    const navigation = useNavigation();
    const [MSSV, setMSSV] = useState('');

    const handleForgotPassword = async () => {
        if (!MSSV) {
            Alert.alert('Lỗi', 'Vui lòng nhập MSSV.');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/user/forgot-password`, { MSSV });
            if (response.data && response.data.result) {
                const { email } = response.data.result;
                await AsyncStorage.setItem('MSSV', MSSV);
                Alert.alert('Thành công', `OTP đã được gửi đến email: ${email}`);
                navigation.navigate('OTP');
            } else {
                Alert.alert('Lỗi', 'Không thể gửi OTP. Vui lòng thử lại sau.');
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
                <Image source={require('../../assets/resetpass.jpg')} style={{width: 300, height: 300}} />
                <View style={styles.formTxt}>
                    <TextInput 
                        placeholder='Nhập MSSV'
                        style={styles.oldpass}
                        value={MSSV}
                        onChangeText={setMSSV}
                    />
                </View>
                <TouchableOpacity onPress={handleForgotPassword}
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
        marginTop:200
    },
    txtbtnchangepass:{
         color:'white', textAlign:'center'
    }
});

export default ForgotPassword;