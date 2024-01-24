import React, { useEffect, useState } from "react"
import { Text, View, TextInput,TouchableOpacity,  ScrollView, Modal, StyleSheet } from "react-native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import CityList from "../Component/RenderingCityList"
import { LISTOFCITY } from "../assets/cityfile/citylist"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-simple-toast";

const SelectCities = ({navigation}) => {
    const [textValue, setTextValue] = useState("");
    const [List, setList] = useState(LISTOFCITY);
    const [modalToBeOpen, setModalToBeOpen] = useState(false);
    const [wantToSetNewCode, setWantToSetNewCode] = useState(false);
    const [cityCodePassword, setCityCodePassword] = useState("");
    const [isFocusForNew, setIsFocusForNew] = useState(false);
    const [isFocusForOld, setIsFocusForOld] = useState(false);
    const [oldCityValue, setOldCityValue] = useState(null);
    const [newCityValue, setNewCityValue] = useState(null);


    const searchfunction = (text: string) => {
        setTextValue(text)
        const matchingCities = LISTOFCITY.filter(city => city.city.toLowerCase().includes(text.toLowerCase()));
        setList(matchingCities);
    }

    const gettingCodeCity = async () =>{
        let cityCodePasswords = await AsyncStorage.getItem('cityCodePassword');
        setCityCodePassword(cityCodePasswords);
    }

    const setNewCodeFirst = async()=>{
        if(cityCodePassword){
            setWantToSetNewCode(true);
        }
        else{
            AsyncStorage.setItem('cityCodePassword', JSON.stringify(newCityValue));

            setModalToBeOpen(false);
        }
    }

    const setNewCodeSecond = async()=>{
        if(newCityValue && oldCityValue){
            if(cityCodePassword === JSON.stringify(oldCityValue)){
                AsyncStorage.setItem('cityCodePassword', JSON.stringify(newCityValue));

                setModalToBeOpen(false);
                setWantToSetNewCode(false);
            }
            else{
                Toast.showWithGravity(`Wrong old city-code`,
                Toast.SHORT,
                Toast.BOTTOM
                )
            }
        }
        else{
            Toast.showWithGravity(`Please select old code and new code both`,
                Toast.SHORT,
                Toast.BOTTOM
            )
        }
    }

    const cityClicked = async (element) =>{
        if(JSON.stringify(element?.city) === cityCodePassword){
            
            return;
        }
        else{
            try{
                navigation.navigate('clockScreen');
            }
            catch(e){
                console.log("in try and cathc error", e)
            }
        }
    }

    useEffect(()=>{
        gettingCodeCity();
    },[])
   


    return (
        <>
            <View style={{ flex: 1 }}>

                <View style={{ flexDirection: "row", marginTop: RFValue(10) }}>
                    <TouchableOpacity 
                    onPress={()=>{navigation.goBack()}}style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 15, color: "black" }}>Back</Text>
                    </TouchableOpacity >
                    <View style={{ flex: 7, alignItems: "center" }}>
                        <View><Text style={{ fontSize: RFValue(20), color: "black", marginLeft: RFValue(-30) }}>Select City</Text></View>
                        <View><Text style={{ fontSize: RFValue(13), color: "black", marginLeft: RFValue(-30) }}>Time Zones</Text></View>
                    </View>
                </View>

                <View>
                    <View
                        style={{
                            borderWidth: 1,
                            flexDirection: "row",
                            borderRadius: RFValue(20),
                            alignItems: "center",
                            paddingLeft: RFValue(10),
                            marginHorizontal: RFValue(20)
                        }}>

                        <View>
                            <Text style={{ fontSize: 5, color: "black" }}>search</Text>
                        </View>

                        <TextInput
                            value={textValue}
                            onChangeText={(text) => {
                                searchfunction(text)
                            }}
                            style={{ color: "black", marginVertical: RFValue(-5) }}
                            placeholderTextColor={"black"}
                            placeholder="search your city"
                        />

                        <View>
                            <Text>cancel</Text>
                        </View>

                    </View>
                </View>

                <View>
                    <ScrollView>
                        {List.map((elemnt, index) => (
                            <TouchableOpacity
                                onLongPress={() => { 
                                    setModalToBeOpen(true)
                                    setWantToSetNewCode(false)
                                    setOldCityValue(null);
                                    setNewCityValue(elemnt?.city)
                                 }}
                                onPress={()=>{cityClicked(elemnt)}}
                                style={{ paddingTop: RFValue(10) }}
                                key={index}>
                                <CityList element={elemnt} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

            </View>

            {modalToBeOpen ?
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={() => { setModalToBeOpen(false) }}
                >
                    <KeyboardAwareScrollView
                        // extraScrollHeight={RFValue(50)}
                        contentContainerStyle={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                        }} >
                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderTopLeftRadius: RFValue(20), borderTopRightRadius: RFValue(20), padding: RFValue(30), width: '100%' }}>
                            <View style={{flexDirection:"row", justifyContent:'space-between', alignItems:"center", width:'100%'}}>
                                <View><Text style={{color:"black", fontSize:RFValue(20)}}>Choose New Code</Text></View>
                                <TouchableOpacity onPress={()=>{
                                    setModalToBeOpen(false)
                                    }}><Text style={{color:"black"}}>cancel</Text></TouchableOpacity>
                            </View>

                            {wantToSetNewCode
                                ?
                                <>
                                    <View style={{width:'100%', marginTop:RFValue(10)}}>
                                        <Text style={{color:"black", fontSize:RFValue(20),  textAlign:'left'}}>Please select old code</Text>
                                    </View>
                                    <View style={{ width:'100%', marginTop:RFValue(5)}}>
                                        <Dropdown
                                           style={[styles.dropdown]}
                                           placeholderStyle={styles.placeholderStyle}
                                           fontFamily={"Helvetica"}
                                           itemTextStyle={{color:"black"}}
                                           selectedTextStyle={styles.selectedTextStyle}
                                           inputSearchStyle={styles.inputSearchStyle}
                                           iconStyle={styles.iconStyle}
                                           data={LISTOFCITY}
                                           maxHeight={400}
                                           labelField="city"
                                           valueField="city"
                                           placeholder={!isFocusForOld ? 'Select old city-code' : '...'}
                                           value={oldCityValue}
                                           onFocus={() => setIsFocusForOld(true)}
                                           onBlur={() => setIsFocusForOld(false)}
                                           onChange={item => {
                                             console.log("item select through drop", item);
                                             setOldCityValue(item.city);
                                             setIsFocusForOld(false);
                                           }}
                                        />
                                    </View>
                                    <View style={{width:'100%', marginTop:RFValue(10)}}>
                                        <Text style={{color:"black", fontSize:RFValue(20), textAlign:'left'}}>Please choose new code</Text>
                                    </View>
                                    <View style={{ width:'100%', marginTop:RFValue(5)}}>
                                        <Dropdown
                                           style={[styles.dropdown]}
                                           placeholderStyle={styles.placeholderStyle}
                                           fontFamily={"Helvetica"}
                                           itemTextStyle={{color:"black"}}
                                           selectedTextStyle={styles.selectedTextStyle}
                                           inputSearchStyle={styles.inputSearchStyle}
                                           iconStyle={styles.iconStyle}
                                           data={LISTOFCITY}
                                           maxHeight={400}
                                           labelField="city"
                                           valueField="city"
                                           placeholder={!isFocusForNew ? 'Select new city-code' : '...'}
                                           value={newCityValue}
                                           onFocus={() => setIsFocusForNew(true)}
                                           onBlur={() => setIsFocusForNew(false)}
                                           onChange={item => {
                                             setNewCityValue(item.value);
                                             setIsFocusForNew(false);
                                           }}
                                        />
                                    </View>

                                    <View style={{width:'100%'}}>
                                        <TouchableOpacity onPress={()=>{
                                          setModalToBeOpen(false)
                                        }}
                                          style={{ justifyContent: "center", alignItems: "center", backgroundColor: "gray", width:'100%', marginTop:RFValue(15), paddingVertical:RFValue(10), borderRadius:RFValue(15) }}>
                                            <Text style={{ color: "white", fontSize: RFValue(15) }}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity  onPress={setNewCodeSecond} disabled={oldCityValue && newCityValue ? false : true}
                                          style={{ justifyContent: "center", alignItems: "center", backgroundColor: "green",width:'100%', marginTop:RFValue(15), paddingVertical:RFValue(10), borderRadius:RFValue(15) }}>
                                            <Text style={{ color: "white", fontSize: RFValue(15),}}>Set New Code</Text>
                                        </TouchableOpacity>
                                    </View>

                                </>
                                :
                                <>
                                    <View style={{marginTop:RFValue(15), marginBottom:RFValue(15)}}>
                                        <Text style={{ color:"black", fontSize:RFValue(18)}}>Do you want to set another time-zone as your new code to access you private space</Text>
                                    </View>

                                    <View style={{width:'100%'}}>
                                        <TouchableOpacity onPress={()=>{
                                            setModalToBeOpen(false)
                                        }}
                                          style={{ justifyContent: "center", alignItems: "center", backgroundColor: "gray", width:'100%', marginTop:RFValue(15), paddingVertical:RFValue(10), borderRadius:RFValue(15) }}>
                                            <Text style={{ color: "white", fontSize: RFValue(15) }}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity  onPress={setNewCodeFirst}
                                          style={{ justifyContent: "center", alignItems: "center", backgroundColor: "green",width:'100%', marginTop:RFValue(15), paddingVertical:RFValue(10), borderRadius:RFValue(15) }}>
                                            <Text style={{ color: "white", fontSize: RFValue(15),}}>Set New Code</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }

                        </View>
                    </KeyboardAwareScrollView>
                </Modal>
                : null}
        </>
    )
}

const styles = StyleSheet.create({
    dropdown: {
      height: RFValue(50),
      borderColor: '#AFA6D7',
      borderWidth: RFValue(1),
      borderRadius: RFValue(8),
      paddingLeft: RFValue(25),
      paddingRight:RFValue(8)
    },
    icon: {
      marginRight: RFValue(5),
    },
    label: {
      position: 'absolute',
      left: RFValue(22),
      top: RFValue(8),
      zIndex: RFValue(999),
      paddingHorizontal: RFValue(8),
      fontSize: RFValue(14),
    },
    placeholderStyle: {
      fontSize: RFValue(16),
      color:"black",
    },
    selectedTextStyle: {
      fontSize: RFValue(16),
      color:"black"
    },
    iconStyle: {
      width: RFValue(20),
      height: RFValue(20),
    },
  });

export default SelectCities