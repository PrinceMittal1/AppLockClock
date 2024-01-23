import React from "react"
import {Text, View} from "react-native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"

const CityList =(element) =>{ 
    return (
    <View style={{marginLeft:RFPercentage(5)}}>
        <View><Text style={{color:"black", fontSize:RFValue(17)}}>{element?.element?.city}</Text></View>
        <View><Text style={{color:"black", opacity:0.7, fontSize:RFValue(13)}}>{`${element?.element?.country} GMT${element?.element?.gmt}`}</Text></View>
    </View>
    )
}

export default CityList


 // let times = new Date(element?.time);
    // times.setHours(element?.time.getHours() + element?.element?.item?.timechangehours)

    // times.setMinutes(element?.time.getMinutes() + element?.element?.item?.timechangeminutes)

    // console.log("new element is ", element?.element?.item?.timechangeminutes)
{/* <View style={{flexDirection:"row", borderColor:"green", paddingHorizontal:RFValue(10), paddingTop:RFValue(10), alignItems:"center"}}>
           <View><Text style={{color:"black", fontSize:RFValue(40)}}>{times.getHours() < 10 ? `0${times.getHours()}`: times.getHours()}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(30)}}>{`:`}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(40)}}>{times.getMinutes() < 10 ? `0${times.getMinutes()}` :  times.getMinutes()}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(30)}}>{`:`}</Text></View>
           <View><Text style={{color:"black", fontSize:RFValue(40)}}>{times.getSeconds() < 10 ? `0${times.getSeconds()}` : times.getSeconds()}</Text></View>
        </View> */}