import React, { useEffect, useState } from "react";
import {View, Text, TouchableOpacity, Image, FlatList} from "react-native"
import { RFValue } from "react-native-responsive-fontsize";
import uploadImageFromGallery from "../common/uploadImage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GalleryScreen = () =>{
    const [images, setimages] = useState(null);


    const refreshing = async () =>{
        let image = await AsyncStorage.getItem('galle');
        let todaydate = new Date();
        todaydate = `${todaydate.getDate()}/${todaydate.getMonth() + 1}/${todaydate.getFullYear()}`
        if(image){
            image = JSON.parse(image);
            console.log("images are inside", image?.images)
            setimages(image?.images[todaydate]);
        }
        else{
            setimages(null);
        }
        console.log("images are outside")
    }

    const clearingall = async () =>{
        await AsyncStorage.removeItem('galle');
    }

    useEffect(()=>{
        refreshing();
    },[])

   const Renderimage = (ele) =>{
        console.log("ele is ele", ele?.ele?.item?.assets?.[0]?.uri)
        return(
        <View>
            <Image style={{width:100, height:100}} source={{uri : ele?.ele?.item?.assets?.[0]?.uri}}/>
        </View>
        )
   }

    return (
    <View>
        <Text style={{color:"black", fontSize:RFValue(30)}}>galler</Text>

            
        <TouchableOpacity onPress={()=>{
            uploadImageFromGallery(refreshing);
        }}>
            <Text style={{fontSize:RFValue(30), color:'black'}}>add image</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{
            clearingall();
        }}>
            <Text style={{fontSize:RFValue(30), color:'black'}}>clear all</Text>
        </TouchableOpacity>

        <FlatList
        data={images}
        renderItem={ele => 
            <Renderimage ele={ele}/>
        }/>
    </View>)
}

export default GalleryScreen;