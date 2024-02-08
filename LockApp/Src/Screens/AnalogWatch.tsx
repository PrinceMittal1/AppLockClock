import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image,  } from 'react-native';
import { IMAGE } from '../assets/images';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const AnalogWatch = () => {
  const [time, setTime] = useState(new Date());
 
  setInterval(()=>{
    setTime(new Date());
    console.log("time is" , time.getHours(), time.getMinutes(), time.getSeconds())
  }, 1000)
  

  return (
    <View style={styles.container}>
      <View style={{
        borderColor:'red',
        alignItems:"center" ,
        position : 'relative'
      }}>
         <Image 
         source={IMAGE.clockBackground}
         style={{
           height :RFPercentage(40),
           width:RFPercentage(40)
         }}
         />
         <View style={{transform: [{ rotate: `${time.getHours() * 30}deg` }], backgroundColor:'black', position:"absolute", width:RFPercentage(0.8), height:RFPercentage(8), borderRadius:RFValue(5), top:RFPercentage(12)}}></View>
         <View style={{transform: [{ rotate: `${time.getMinutes() * 6}deg` }],backgroundColor:'red', position:"absolute", width:RFPercentage(0.8), height:RFPercentage(10), borderRadius:RFValue(5),top:RFPercentage(10)}}></View>
         <View style={ [styles.minutehand, {transform: [{ rotate: `${time.getSeconds() * 6}deg` }]} ]}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchFace: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'lightgray',
    position: 'absolute',
  },
  minutehand :{
    backgroundColor:'green', 
    position:"absolute", 
    width:RFPercentage(0.8), 
    height:RFPercentage(13), 
    borderRadius:RFValue(5),
    top:RFPercentage(7.2),
    transformOrigin: 'bottom',
  },
  hand: {
    position: 'absolute',
    backgroundColor: 'black',
    height: 2,
    width: 100,
    top: '50%',
    left: '50%',
    transformOrigin: ['0%', '50%'],
  },
});

export default AnalogWatch;
