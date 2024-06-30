import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ImageBackground, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';


import { FontAwesome5 } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

import LoginScreen from './src/screens/Login';
import WelcomeScreen from './src/screens/Welcome';
import Profile from './src/screens/Profile';
import Home from './src/screens/Home';
import Notice from './src/screens/Notice';
import History from './src/screens/History';
import AllProgram from './src/screens/AllProgram';
import ChangePassword from './src/screens/ChangePassword';
import DetailShowScreen from './src/screens/Detail';
import Demonstration from './src/screens/Demonstration';
import Feedback from './src/screens/Feedback';
import ForgotPassword from './src/screens/ForgotPassword';
import OtpForm from './src/screens/Otp';
import ResetPassword from './src/screens/ResetPassword';
import HistoryPSScreen from './src/screens/HistoryPSScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Main = () => {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;

  const getWidth = () => {
    let width = Dimensions.get("window").width;
    width = width - 50; // Adjusted to get more accurate spacing
    return width / 5;
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 10,
            marginHorizontal: 25,
            borderRadius: 10,
            height: 60,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 50 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 5,
          },
        }}
      >
        <Tab.Screen style={{alignItems:'center'}} name="Home" component={HomeScreen} options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ position: 'absolute', top: '33%', left: 25 }}>
              <FontAwesome5 name='home' size={20} color={focused ? '#0032a0' : 'gray'} />
            </View>
          ),
        }} listeners={{
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          },
        }} />

        <Tab.Screen name="Notice" component={NoticeScreen} options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ position: 'absolute', top: '33%', left: 25 }}>
              <Ionicons name='notifications' size={20} color={focused ? '#0032a0' : 'gray'} />
            </View>
          ),
        }} listeners={{
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: getWidth(),
              useNativeDriver: true,
            }).start();
          },
        }} />
        
        <Tab.Screen name="HistoryPropose" component={HistoryPS} options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ position: 'absolute', top: '30%', left: 25 }}>
              <AntDesign name="inbox" size={25} color={focused ? '#0032a0' : 'gray'} />
            </View>
          ),
        }} listeners={{
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: getWidth() *2,
              useNativeDriver: true,
            }).start();
          },
        }}/>
        <Tab.Screen name="History" component={HistoryScreen} options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ position: 'absolute', top: '25%' }}>
              <MaterialIcons name='history-edu' size={30} color={focused ? '#0032a0' : 'gray'} />
            </View>
          ),
        }} listeners={{
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: getWidth() * 3,
              useNativeDriver: true,
            }).start();
          },
        }} />
        <Tab.Screen name="User" component={UserScreen} options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ position: 'absolute', top: '28%', right: 25 }}>
              <FontAwesome name='user' size={25} color={focused ? '#0032a0' : 'gray'} />
            </View>
          ),
        }} listeners={{
          tabPress: e => {
            Animated.spring(tabOffsetValue, {
              toValue: getWidth() * 4,
              useNativeDriver: true,
            }).start();
          },
        }} />
      </Tab.Navigator>

      <Animated.View style={{
        width: getWidth()- 8,
        height: 2,
        backgroundColor: 'red',
        position:'absolute',
        bottom: 70,
        left: 30,
        borderRadius: 5,
        transform: [
          { translateX: tabOffsetValue }
        ]
      }} />
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Program" component={AllProgram} />
          <Stack.Screen name="ChangePass" component={ChangePassword} />
          <Stack.Screen name="Forgot" component={ForgotPassword} />
          <Stack.Screen name="OTP" component={OtpForm} />
          <Stack.Screen name="Reset" component={ResetPassword} />
          <Stack.Screen name="Detail" component={DetailShowScreen} />
          <Stack.Screen name="Demon" component={Demonstration} />
          <Stack.Screen name="Feed" component={Feedback} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Home/>
    </View>
  );
}

function NoticeScreen() {
  return (
    <View style={styles.container}>
      <Notice/>
    </View>
  );
}


function HistoryPS() {
  return (
    <View style={styles.container}>
      <HistoryPSScreen/>
    </View>
  );
}

function HistoryScreen() {
  return (
    <View style={styles.container}>
      <History/>
    </View>
  );
}

function UserScreen() {
  return (
    <View style={styles.container}>
      <Profile/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
