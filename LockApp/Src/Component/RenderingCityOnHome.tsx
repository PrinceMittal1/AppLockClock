import React, {useState, useEffect} from "react"
import {Text, View} from "react-native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import AsyncStorage from "@react-native-async-storage/async-storage";

const CityOnHome =({city}) =>{ 
    const [time, setTime] = useState(new Date());

    

    useEffect(()=>{
        setInterval(()=>{
            let time = new Date();
            time.setHours(time?.getHours() + city?.timechangehours)
            time.setMinutes(time?.getMinutes() + city?.timechangeminutes)
            setTime(time);
        },1000)
    },[])

    return (
    <View style={{marginLeft:RFPercentage(5)}}>
       <View style={{flexDirection:"row", borderColor:"green", paddingHorizontal:RFValue(10), paddingTop:RFValue(10), alignItems:"center"}}>
           <View><Text style={{color:"black", fontSize:RFValue(40)}}>{time.getHours() < 10 ? `0${time.getHours()}`: time.getHours()}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(30)}}>{`:`}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(40)}}>{time.getMinutes() < 10 ? `0${time.getMinutes()}` :  time.getMinutes()}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(30)}}>{`:`}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(40)}}>{time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()}</Text></View>
          </View>
    </View>
    )
}

export default CityOnHome