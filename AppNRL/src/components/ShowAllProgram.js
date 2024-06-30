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

const ShowAllProgram = (props) => {
    const { program } = props;
    const [fontsLoaded] = useFonts({
       'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
       'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
       'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf')
    });

    if (!fontsLoaded) {
        return null;
    }

    return(
        <View>
            <View style={styles.resultPG}>
                <Image style={styles.imageDetail} source={{ uri: program.image }}/>
                <Text numberOfLines={2} style={{margin:5, textAlign:'center', fontFamily:'Roboto-Medium',fontSize:13, lineHeight:18, fontWeight:'100'}}>{program.programName}</Text>
                <View style={{marginStart:10,marginEnd:10, flexDirection:'row', justifyContent:'space-between', marginTop:5}}>
                    <BlinkingText style={{fontFamily:'Roboto-Medium',fontSize:13, lineHeight:18, fontWeight:'100'}}>Mở đăng kí: {new Date(program.registerDate).toLocaleDateString()}</BlinkingText>
                    <Text style={{textAlign:'right',fontFamily:'Roboto-Medium',fontSize:13, lineHeight:18, fontWeight:'100'}}>Số lượng: {program.quantity}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    imageDetail: {
        width: '100%',
        height: 200,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        alignSelf: 'center', 
        justifyContent: 'center',
        resizeMode: 'stretch', 
    },
    resultPG: {
        backgroundColor: '#F0FFFF',
        margin:15,
        borderRadius: 20,
        position:'relative',
        marginBottom:0,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.26,
        shadowRadius: 8,
        elevation: 5,
        bottom:10,
        paddingBottom:10
    },
});

export default ShowAllProgram;
