import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useFonts } from 'expo-font';

const colors = ['red', 'orange', 'green', 'blue', 'indigo', 'violet'];

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

const ResultNotice = (props) => {
    const { notification, isRead } = props;
    const [fontsLoaded] = useFonts({
        'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf')
    });

    if (!fontsLoaded) {
        return null;
    }

    if (!notification) {
        return (
            <View style={styles.resultPG}>
                <Image style={styles.imageDetail} source={require('../../assets/program-img.png')} />
                <View style={{ padding: 5, flex: 1, justifyContent:'space-between' }}>
                    <Text numberOfLines={2} style={{ fontFamily: 'Roboto-Medium', fontSize: 12, color: 'black', justifyContent:'flex-start', lineHeight:18 }}>No Data</Text>
                    <BlinkingText style={{ fontFamily: 'Roboto-Regular',fontWeight:'500', fontSize: 12, color: 'black', justifyContent:'flex-start', lineHeight:18 }}>No Data</BlinkingText>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.resultPG, isRead && styles.notificationItemRead]}>
            <Image style={styles.imageDetail} source={require('../../assets/program-img.png')} />
            <View style={{ padding: 5, flex: 1, justifyContent:'space-between', marginVertical:5 }}>
                <Text numberOfLines={2} style={{ fontFamily: 'Roboto-Medium', fontSize: 12, color: 'black', justifyContent:'flex-start', lineHeight:18, marginBottom:3 }}>{notification.title}</Text>
                <Text numberOfLines={2} style={{ fontFamily: 'Roboto-Regular',fontWeight:'500', fontSize: 12, color: 'black', lineHeight:18, marginBottom:3 }}>{notification.message}</Text>
                <BlinkingText style={{ fontFamily: 'Roboto-Regular',fontWeight:'500', fontSize: 12, color: 'black', justifyContent:'flex-start', lineHeight:18 }}>Ngày nhận: {new Date(notification.createdAt).toLocaleString()}</BlinkingText>
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
    notificationItemRead: {
        backgroundColor: '#EEEEEE',
    },
});

export default ResultNotice;
