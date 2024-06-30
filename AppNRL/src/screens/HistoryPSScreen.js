import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, ImageBackground, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { BASE_URL } from '../API/Config';
import ResultPropose from '../components/ResultPropose';

const ProposeScreen = () => {
    const navigation = useNavigation();
    const [proposes, setProposes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fontsLoaded] = useFonts({
        'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf')
    });

    const fetchProposes = useCallback(async () => {
        try {
            const storedAccessToken = await AsyncStorage.getItem('accessToken');
            if (storedAccessToken) {
                const response = await axios.get(`${BASE_URL}/propose/get-propose-by-mssv`, {
                    headers: {
                        Authorization: `Bearer ${storedAccessToken}`
                    }
                });

                if (response.data && Array.isArray(response.data.result)) {
                    setProposes(response.data.result);
                } else {
                    console.error('Invalid data structure received:', response.data);
                    setProposes([]); 
                }
            } else {
                console.error('Access token not found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error fetching proposes:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProposes();
    }, [fetchProposes]);

    useFocusEffect(
        useCallback(() => {
            fetchProposes();
        }, [fetchProposes])
    );

    if (!fontsLoaded || loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
    }

    return (
        <View style={styles.BK}>
            <View style={styles.header}>
                <ImageBackground source={require('../../assets/backgroundPF.png')} style={styles.imageBackground}>
                    <Text style={styles.headerText}>ĐỀ XUẤT</Text>
                </ImageBackground>
            </View>
            {proposes.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Bạn không có đề xuất nào</Text>
                </View>
            ) : (
                <FlatList
                    data={proposes}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => <ResultPropose propose={item} />}
                />
            )}
            <View style={{height:70}}>

            </View>
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
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        color: 'black',
    },
    headerText: {
        fontSize: 18,
        color: 'white',
        left:5,
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        padding: 15,
        marginTop: 32,
        textAlign: 'center'
    }
});

export default ProposeScreen;
