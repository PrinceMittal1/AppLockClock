
import AsyncStorage from "@react-native-async-storage/async-storage";
import React,{useState, useEffect, useRef} from "react";
import {Text, Image, TouchableOpacity, Pressable, View} from "react-native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import CityOnHome from "../Component/RenderingCityOnHome";

const ClockScreen = ({navigation}) =>{
    const [time, setTime] = useState(new Date());
    const [selectcity, setselectedcity] = useState({})
    

    const gettingListOfSelectedCities = async () =>{
        try{
            let list = await AsyncStorage.getItem('listofselectedcity');
            if(list){
                list = JSON.parse(list);

                console.log("city from async ", list)
                setselectedcity(list);
            }
        }catch(e){
            console.log("some issue", e);
        }
    }
    
    useEffect(()=>{
        setInterval(()=>{
            let time = new Date();
            setTime(time);
        },1000)
        gettingListOfSelectedCities();
    },[])


    return (
    <View style={{flex:1}}>

        <View style={{alignItems:"center", justifyContent:"center", marginTop:RFPercentage(10)}}>
          <View style={{flexDirection:"row", borderColor:"green", paddingHorizontal:RFValue(10), paddingTop:RFValue(10), alignItems:"center"}}>
           <View><Text style={{color:"black", fontSize:RFValue(40)}}>{time.getHours() < 10 ? `0${time.getHours()}`: time.getHours()}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(30)}}>{`:`}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(40)}}>{time.getMinutes() < 10 ? `0${time.getMinutes()}` :  time.getMinutes()}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(30)}}>{`:`}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(40)}}>{time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()}</Text></View>
          </View>
          
          <View style={{marginTop:RFValue(-5)}}>
            <Text style={{color:"black", fontSize:RFValue(12)}}>{`Current:${time.getDate()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours() > 11 ? "AM" : "PM"}`}</Text>
          </View>
        </View>

        

        <TouchableOpacity 
        onPress={()=>{
            navigation.navigate('selectcities')
        }}
        style={{borderWidth:1, borderColor:"black", width:RFPercentage(10), height:RFPercentage(10), borderRadius:100, alignSelf:"center", position:"absolute", bottom:RFPercentage(10),backgroundColor:"black", opacity:0.7, flexDirection:"row"}}>
               <View style={{backgroundColor:"white", height:RFValue(40), width:RFValue(5), left:RFPercentage(4.6), borderRadius:RFValue(10), top:RFPercentage(2)}}></View>
               <View style={{backgroundColor:"white", height:RFValue(40), width:RFValue(5), borderRadius:RFValue(10),top:RFPercentage(2.1),left:RFPercentage(3.8), transform: [{ rotate: `90deg` }]}}></View>
        </TouchableOpacity>
    </View>
    )
}
 
export default ClockScreen;