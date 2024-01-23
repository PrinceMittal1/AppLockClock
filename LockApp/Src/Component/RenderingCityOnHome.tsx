import React, {useState, useEffect} from "react"
import {Text, View} from "react-native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import AsyncStorage from "@react-native-async-storage/async-storage";

const CityOnHome =() =>{ 
    const [selectcity, setselectedcity] = useState({})
    const [time, setTime] = useState(new Date());

    const gettingListOfSelectedCities = async () =>{
        try{
            let list = await AsyncStorage.getItem('listofselectedcity');
            if(list){
                list = JSON.parse(list);
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

    console.log("some issue list", time);

    return (
    <View style={{marginLeft:RFPercentage(5)}}>
        <View><Text style={{color:"black", fontSize:RFValue(17)}}>{element?.element?.city}</Text></View>
        <View><Text style={{color:"black", opacity:0.7, fontSize:RFValue(13)}}>{`${element?.element?.country} GMT${element?.element?.gmt}`}</Text></View>
    </View>
    )
}

export default CityOnHome