
import {
  Image,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Animated,
  Easing
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { IMAGE } from '../assets/images';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import ClockScreen from './ClockScreen';
import { NavigationContainer } from '@react-navigation/native';
import SelectCities from './SelectCity';
import GalleryScreen from './GalleryScreen';
import Singlescreen from './SingleScreen';
import { CopilotProvider } from "react-native-copilot";

const Stack = createStackNavigator();

const App = () => {


  return (
    <CopilotProvider>
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
    </CopilotProvider>
  );
}

const styles = StyleSheet.create({

});

export default App;
