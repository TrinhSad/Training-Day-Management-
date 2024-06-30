import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useFonts } from 'expo-font';

const ResultPropose = ({ propose }) => {
    const [fontsLoaded] = useFonts({
        'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf')
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.resultPG}>
            {propose.images && propose.images.length > 0 && (
                <Image style={styles.imageDetail} source={{ uri: propose.images[0] }} />
            )}
            <View style={{ padding: 5, flex: 1, justifyContent:'space-between', marginVertical:10 }}>
                <Text numberOfLines={2} style={styles.contentText}>{propose.content}</Text>
                <Text style={styles.statusText}>Trạng thái: {propose.status}</Text>
                <Text style={styles.dateText}>Ngày tạo: {new Date(propose.createdAt).toLocaleDateString()}</Text>  
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    imageDetail: {
        width: 130,
        height: '100%',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius:20,
        resizeMode: 'stretch',
    },
    resultPG: {
        backgroundColor: '#F0FFFF',
        margin: 15,
        borderRadius: 20,
        position: 'relative',
        flexDirection: 'row',
        marginBottom: -5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.26,
        shadowRadius: 8,
        elevation: 5,
        bottom: 10,
    },
    contentText: {
        fontFamily: 'Roboto-Medium', 
        fontSize: 12, 
        color: 'black', 
        justifyContent:'flex-start', 
        lineHeight:18, 
        bottom:10
    },
    statusText: {
        fontFamily: 'Roboto-Regular',
        fontWeight:'500', 
        fontSize: 12, 
        color: 'black', 
        lineHeight:18, 
        top:10
    },
    dateText: {
        fontFamily: 'Roboto-Regular',
        fontWeight:'500', 
        fontSize: 12, 
        color: 'black', 
        lineHeight:18,
        top:10
    },
});

export default ResultPropose;
