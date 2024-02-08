
import {
  Image,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Animated,
  Easing,
  AppState
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { IMAGE } from '../assets/images';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import ClockScreen from './ClockScreen';
import { NavigationContainer } from '@react-navigation/native';
import SelectCities from './SelectCity';
import GalleryScreen from './GalleryScreen';
import Singlescreen from './SingleScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {

  const checkingStore = async () =>{
    const statusOfClock = await AsyncStorage.getItem('tourOfApplicationOnclock');
    const statusOfCity = await AsyncStorage.getItem('tourOfApplicationOncity');

    console.log("statusOfClock statusOfClock", statusOfClock, statusOfCity)
    if(!statusOfClock){
      try{
        await AsyncStorage.setItem('tourOfApplicationOnclock', 'true');
      }
      catch(e){}
    }
    if(!statusOfCity){
      try{
        await AsyncStorage.setItem('tourOfApplicationOncity', 'true');
      }
      catch(e){}
    }
  }

  useEffect(()=>{
    checkingStore();
  },[])

  return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='clockScreen'>
            <Stack.Screen
              name="clockScreen"
              component={ClockScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="selectcities"
              component={SelectCities}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="galleryScreen"
              component={GalleryScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="singleScreen"
              component={Singlescreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>  
  );
}

const styles = StyleSheet.create({

});

export default App;
