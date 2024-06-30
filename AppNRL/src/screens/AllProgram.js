import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ShowAllProgram from '../components/ShowAllProgram';
import { BASE_URL } from '../API/Config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';


const AllProgram = () => {
    const navigation = useNavigation();
    const [searchInput, setSearchInput] = useState('');
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [fontsLoaded] = useFonts({
        'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf')
    });

    const fetchPrograms = async () => {
        try {
            const storedAccessToken = await AsyncStorage.getItem('accessToken');
            if (storedAccessToken) {
                const response = await axios.get(`${BASE_URL}/program/get-public-programs`, {
                    headers: {
                        Authorization: `Bearer ${storedAccessToken}` 
                    }
                });
                setPrograms(response.data.programs);
            } else {
                console.error('Access token not found in AsyncStorage');
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

    const filteredPrograms = programs.filter(programs => 
        programs.programName.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (!fontsLoaded || loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
    }

    return (
        <View style={styles.BK}>
            <View style={styles.header}>
                <ImageBackground source={require('../../assets/backgroundPF.png')} style={styles.imageBackground} />
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="white" />
                </TouchableOpacity>
                <View style={styles.search}>
                    <TextInput
                        placeholder='Tìm kiếm ở đây...'
                        value={searchInput}
                        onChangeText={(text) => setSearchInput(text)}
                        style={styles.searchInput}
                    />
                </View>
            </View>
            <FlatList
                vertical
                showsVerticalScrollIndicator={false}
                data={filteredPrograms}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: item._id })}>
                        <ShowAllProgram program={item} />
                    </TouchableOpacity>
                )}
            />
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
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        bottom: 13,
        zIndex: 1,
    },
    search: {
        right: 13,
        bottom: 10,
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        borderBottomColor: '#838B83',
        width: '84%',
        backgroundColor: 'white',
    },
    searchInput: {
        height: 30,
        paddingHorizontal: 10,
    },
});

export default AllProgram;
