import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Foundation, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { BASE_URL } from '../API/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';


const colors = ['red', 'orange'];

const BlinkingText = (props) => {
    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <Text
            style={{
                ...props.style,
                color: colors[currentColorIndex],
            }}
        >
            {props.children}
        </Text>
    );
};

const DetailShowScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;
    const [fontsLoaded] = useFonts({
       'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
       'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
       'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf')
    });

    const [program, setProgram] = useState(null);

    useEffect(() => {
        const fetchProgramDetail = async () => {
            try {
                const storedAccessToken = await AsyncStorage.getItem('accessToken');
                const response = await axios.get(`${BASE_URL}/program/get-program/${id}`, {
                    headers: {
                        Authorization: `Bearer ${storedAccessToken}`
                    }
                });
                if (response.data && response.data.program) {
                    setProgram(response.data.program);
                } else {
                    console.error('Invalid response format or program data not found');
                }
            } catch (error) {
                console.error('Error fetching program details:', error);
            }
        };

        fetchProgramDetail();
    }, []);

    const handleRegister = async () => {
        try {
            const storedAccessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.post(`${BASE_URL}/join-program/register/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${storedAccessToken}`
                }
            });
            if (response.data && response.data.joinProgram) {
                Alert.alert("Thành công", "Bạn đã đăng kí thành công chương trình này", [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate('Main'),
                    },
                ]);
            } else {
                Alert.alert("Xin lỗi", "Failed to register for the program.");
            }
        } catch (error) {
            Alert.alert("Xin lỗi", error.response?.data?.error || 'Failed to register for the program.');
        }
    };

    if (!fontsLoaded) {
        return null;
    }

    if (!program) {
        return (
            <View style={styles.BK}>
                <Text>Đang tải thông tin chương trình...</Text>
            </View>
        );
    }

    const formattedStartDate = format(new Date(program.startDate), 'dd/MM/yyyy');
    const formattedRegisterDate = format(new Date(program.registerDate), 'dd/MM/yyyy');

    return (
        <View style={styles.BK}>
            <View style={styles.header}>
                <ImageBackground source={require('../../assets/backgroundPF.png')} style={styles.imageBackground} />
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="white" />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.content}>
                <Image source={{ uri: program.image }} style={styles.image} />
                <Text style={styles.title}>{program.programName}</Text>
                <Text style={styles.description}>{program.description}</Text>
                <Text style={{marginHorizontal:10, marginTop:10, fontSize:17}}>THÔNG TIN CHƯƠNG TRÌNH:</Text>
                <View style={styles.row_dateAt}>
                    <MaterialCommunityIcons name="timetable" size={18} color="brown" style={{margin:2}} />
                    <Text style={styles.dateAt}>Thời gian diễn ra: {formattedStartDate}</Text>
                </View>
                <View style={styles.row_amount}>
                    <Ionicons name="person" size={16} color="red" style={{margin:2}}/>
                    <Text style={styles.amount}>Số lượng tham gia: {program.quantity} sinh viên</Text>
                </View>
                <View style={styles.row_amount}>
                    <Ionicons name="people" size={20} color="black" />
                    <Text style={styles.amount}>Đối tượng: Sinh viên Học viện Hàng không VN</Text>
                </View>
                <View style={styles.row_timeline}>
                    <MaterialCommunityIcons name="sign-text" size={18} color="green" style={{margin:2}}/>
                    <Text style={styles.timeline}>Thời gian đăng kí: {formattedRegisterDate}</Text>
                </View>
                <View style={styles.row_point}>
                    <MaterialCommunityIcons name="star-four-points" size={16} color="yellow" style={{margin:2}} />
                    <Text style={styles.point}>Quyền lợi: {program.point} NRL</Text>
                </View>
                <View style={styles.row_point}>
                    <MaterialCommunityIcons name="identifier" size={20} color="black" />
                    <Text style={styles.point}>Mã chương trình: {program._id}</Text>
                </View>
                <View style={{width:'100%', backgroundColor:'#faf9fe', padding:20,}}>
                    <BlinkingText style={{
                            fontSize:13,
                            fontFamily:'Roboto-Medium',
                            fontWeight:'600',
                            textAlign: 'left',
                            lineHeight:18
                        }}>
                        *Lưu ý: Sinh viên đăng ký mà không tham gia sẽ bị trừ NRL tương đương(tùy thuộc vào chương trình BTC đưa ra)
                    </BlinkingText>
                </View>
                <View style={styles.btn_Signup}>
                    <TouchableOpacity style={{width:'100%'}} onPress={handleRegister}>
                        <Text style={styles.txtbtnsignup}>Đăng kí ngay</Text>
                    </TouchableOpacity>
                </View>
                <View  style={{width:'100%', backgroundColor:'#faf9fe', padding:20,}} >
                    <Text style={{
                            fontSize:13,
                            fontFamily:'Roboto-Bold',
                            fontWeight:'600',
                            textAlign: 'left',
                            lineHeight:18
                        }}>Nếu có chương trình cần minh chứng hoặc sinh viên cần khiếu nại về việc tham gia vui lòng chọn phía dưới để gửi thông tin sớm nhất để được xử lí.</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Demon', { programId: program._id })}>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 13, textAlign: 'left', color: '#0032a0', marginLeft: 25 }}>Minh chứng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Feed', { programId: program._id })}>
                            <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 13, textAlign: 'right', color: '#0032a0', marginRight: 45 }}>Khiếu nại</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    BK: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    header: {
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        bottom: 10,
        zIndex: 2,
    },
    content: {
        marginTop: 70, 
    },
    image: {
        width: '100%',
        height: 280,
        resizeMode: 'stretch',
        marginVertical: 10,
    },
    title: {
        fontSize: 17,
        fontFamily:'Roboto-Medium',
        fontWeight: '500',
        textAlign:'center',
        marginHorizontal:5,
        marginVertical:-5,
        lineHeight:22
    },
    description: {
        fontSize: 15,
        fontFamily:'Roboto-Regular',
        fontWeight:'500',
        marginHorizontal: 10,
        lineHeight: 22,
        marginTop:10
    },
    row_dateAt:{
        flexDirection: 'row',
        marginHorizontal: 10,
        marginTop:5,
    },
    dateAt:{
        fontSize: 15,
        fontFamily:'Roboto-Regular',
        fontWeight:'500',
        marginHorizontal: 3,
    },
    row_address:{
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 3,
    },
    address:{
        fontSize: 15,
        fontFamily:'Roboto-Regular',
        fontWeight:'500',
        marginHorizontal: 5,
    },
    row_amount:{
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 2,
    },
    amount:{
        fontSize: 15,
        fontFamily:'Roboto-Regular',
        fontWeight:'500',
        marginHorizontal: 5,
    },
    row_timeline:{
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 3,
    },
    timeline:{
        fontSize: 15,
        fontFamily:'Roboto-Regular',
        fontWeight:'500',
        marginHorizontal: 5,
        lineHeight:22
    },
    row_point:{
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 3,
    },
    point:{
        fontSize: 15,
        fontFamily:'Roboto-Regular',
        fontWeight:'500',
        marginHorizontal: 5,
    },
    btn_Signup:{
        width:'100%',
        marginVertical:5
    },
    txtbtnsignup:{
        padding:12, 
        marginHorizontal:20, 
        backgroundColor:'#0032a0', 
        color:'white', 
        borderRadius:10, 
        textAlign:'center'
    }
});

export default DetailShowScreen;
