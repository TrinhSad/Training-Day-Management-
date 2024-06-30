import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';


const WelcomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Peralta-Regular': require('../../assets/fonts/Peralta-Regular.ttf'),
    'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
    'Danfo-Regular-VariableFont_ELSH': require('../../assets/fonts/Danfo-Regular-VariableFont_ELSH.ttf'),
    'SeymourOne-Regular': require('../../assets/fonts/SeymourOne-Regular.ttf'),
  })
  if(!fontsLoaded){
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageBackground 
          source={require('../../assets/logo.png')}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Let your dream fly</Text>
        </View>
        <View style={{position: 'absolute'}}>
          <TouchableOpacity style={{
            backgroundColor: '#0032a0',
            padding: 10,
            left:0,
            right:0,
            borderRadius: 10,
            margin: 20,
            top:300,
            width: 250,
            height:50,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 80},
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 10
          }}title="Welcome" onPress={() => navigation.navigate('Login')}>
            <Text style={{color: 'white', fontSize:17, fontWeight: "bold" }}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 280,
    height: 280,
    bottom: 200,
    left: 40,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    bottom: 420,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize:30,
    fontFamily: 'Peralta-Regular',
    color: '#0032a0',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
