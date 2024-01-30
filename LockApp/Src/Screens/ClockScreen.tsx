
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Text, Image, TouchableOpacity, Pressable, View } from "react-native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
    CopilotProvider,
    CopilotStep,
    walkthroughable,
} from "react-native-copilot";
import {
    Align,
    AttachStep,
    Position,
    SpotlightTourProvider,
    TourStep,
} from '@stackbuilders/react-native-spotlight-tour';
import { DocsTooltip } from "../Component/SpotLightModal";
import { BoldText, ButtonsGroupView, DescriptionText, SpotDescriptionView } from "../Component/SpotLightStyle";
import { FONTS } from "../assets/fonts";

const ClockScreen = ({ navigation }) => {
    const [time, setTime] = useState(new Date());

    const ClockSpotlightRef = useRef();

    const DetailsTourSteps = useMemo(
        (): TourStep[] => [
            {
                alignTo: Align.SCREEN,
                position: Position.TOP,
                render: ({ next }) => (
                    <SpotDescriptionView>
                        <DescriptionText>
                            <BoldText>{'Click on plus icon to see all Cities-Code list\n'}</BoldText>
                            {'in Cities-Code list you can choose one city to access your private space\n'}
                            {/* {"If you want to go to the next step, please press "}<BoldText>{"Next.\n"}</BoldText> */}
                        </DescriptionText>
                        <ButtonsGroupView>
                            {/* <Button title="Next" onPress={next} color='transparent' /> */}
                            <TouchableOpacity
                                onPress={onStopTour}
                                style={{
                                    borderWidth: RFValue(1),
                                    borderColor: '#DDD',
                                    borderRadius: RFValue(4),
                                    paddingVertical: RFValue(4),
                                    paddingHorizontal: RFValue(10),
                                }}>
                                <Text
                                    style={{
                                        fontFamily: FONTS.HELVETICA_BOLD,
                                        fontSize: RFValue(12),
                                        color: '#DDD',
                                    }}>
                                    Next Step
                                </Text>
                            </TouchableOpacity>
                        </ButtonsGroupView>
                    </SpotDescriptionView>
                ),
            },
        ],
        [],
    );

    const startAppTour = async () => {

        const status = await AsyncStorage.getItem('tourOfApplicationOnclock');

        console.log("status of tourOfApplicationOnclock", status)
        if (status == 'true') {
            setTimeout(() => {
                ClockSpotlightRef.current.start();
                settingFalseinAsync();
            }, 500);
        }
    };

    const settingFalseinAsync = async () => {
        try {
            await AsyncStorage.setItem('tourOfApplicationOnclock', 'false');
        }
        catch (e) {
        }
    }

    const onStopTour = useCallback(({ index, isLast }: StopParams) => {
        ClockSpotlightRef.current.stop();
        settingFalseinAsync();
        navigation.navigate('selectcities')
    }, []);

    useEffect(() => {
        setInterval(() => {
            let time = new Date();
            setTime(time);
        }, 1000)
    }, [])

    useEffect(()=>{
        setTimeout(()=>{
            startAppTour()
        },2000)
    },[])

    return (
        <SpotlightTourProvider
            steps={DetailsTourSteps}
            overlayColor={'#000000'}
            overlayOpacity={0.85}
            nativeDriver={true}
            onBackdropPress="continue"
            motion="bounce"
            onStop={onStopTour}
            ref={ClockSpotlightRef}>
            <View style={{ flex: 1 }}>

                <View style={{ alignItems: "center", justifyContent: "center", marginTop: RFPercentage(10) }}>
                    <View style={{ flexDirection: "row", borderColor: "green", paddingHorizontal: RFValue(10), paddingTop: RFValue(10), alignItems: "center" }}>
                        <View><Text style={{ color: "black", fontSize: RFValue(40) }}>{time.getHours() % 12}</Text></View>
                        <View><Text style={{ color: "black", fontSize: RFValue(30) }}>{`:`}</Text></View>
                        <View><Text style={{ color: "black", fontSize: RFValue(40) }}>{time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}</Text></View>
                        <View><Text style={{ color: "black", fontSize: RFValue(30) }}>{`:`}</Text></View>
                        <View><Text style={{ color: "black", fontSize: RFValue(40) }}>{time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()}</Text></View>
                    </View>

                    <View style={{ marginTop: RFValue(-5) }}>
                        <Text style={{ color: "black", fontSize: RFValue(12) }}>{`Current:${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`}</Text>
                    </View>
                </View>


                <AttachStep index={0}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('selectcities')
                        }}
                        style={{ borderWidth: 1, borderColor: "gray", width: RFPercentage(10), height: RFPercentage(10), borderRadius: 100, alignSelf: "center", position: "absolute", bottom: RFPercentage(10), backgroundColor: "gray", flexDirection: "row" }}>
                        <View style={{ backgroundColor: "white", height: RFValue(40), width: RFValue(5), left: RFPercentage(4.6), borderRadius: RFValue(10), top: RFPercentage(2) }}></View>
                        <View style={{ backgroundColor: "white", height: RFValue(40), width: RFValue(5), borderRadius: RFValue(10), top: RFPercentage(2.1), left: RFPercentage(3.8), transform: [{ rotate: `90deg` }] }}></View>
                    </TouchableOpacity>
                </AttachStep>
            </View>
        </SpotlightTourProvider>
    )
}

export default ClockScreen;