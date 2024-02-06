import React, { useState, useEffect, useRef } from "react"
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Pressable, Modal , AppState} from "react-native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Video from "react-native-video";
import { IMAGE } from "../assets/images";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Slider from '@react-native-community/slider';
import Orientation, { OrientationLocker, PORTRAIT, LANDSCAPE } from "react-native-orientation-locker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNFS from 'react-native-fs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
// import VideoProcessing from 'react-native-video-processing';

const { width, height } = Dimensions.get('window');

const Singlescreen = ({ route, navigation }) => {
    const [active, setActive] = useState(false);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(null);
    const [fullScreen, SetFullScreen] = useState(false);
    const [images, setimages] = useState({});
    const [modal, setModal] = useState(false);

    let widthVideo = JSON.parse(JSON.stringify(width));
    let heightVideo =JSON.parse(JSON.stringify(height));
    let currenttime = "0";
    let totaltime = "0";

    if (progress) {
        let timeHour = parseInt(parseInt(progress?.currentTime) / 3600);
        let timemMinutes = parseInt(parseInt(progress?.currentTime) / 60);
        if (timemMinutes > 59) {
            timemMinutes = timemMinutes % 60;
        }
        let tmeSeconds = parseInt(parseInt(progress?.currentTime) % 60);

        if (timeHour) {
            currenttime = `${timeHour < 10 ? `0${timeHour}` : timeHour}:${timemMinutes < 10 ? `0${timemMinutes}` : timemMinutes}:${tmeSeconds < 10 ? `0${tmeSeconds}` : tmeSeconds}`
        }
        if (timemMinutes) {
            currenttime = `${timemMinutes < 10 ? `0${timemMinutes}` : timemMinutes}:${tmeSeconds < 10 ? `0${tmeSeconds}` : tmeSeconds}`
        }
        else {
            currenttime = `00:${tmeSeconds < 10 ? `0${tmeSeconds}` : tmeSeconds}`
        }
    }
    if (progress?.seekableDuration) {
        // console.log("come in condition totaltime");
        let timeHourForfull = parseInt(parseInt(progress?.seekableDuration) / 3600);
        let timemMinutesForfull = parseInt(parseInt(progress?.seekableDuration) / 60);
        if (timemMinutesForfull > 59) {
            timemMinutesForfull = timemMinutes % 60;
        }
        let tmeSecondsForfull = parseInt(parseInt(progress?.seekableDuration) % 60);

        if (timeHourForfull) {
            totaltime = `${timeHourForfull < 10 ? `0${timeHourForfull}` : timeHourForfull}:${timemMinutesForfull < 10 ? `0${timemMinutesForfull}` : timemMinutesForfull}:${tmeSecondsForfull < 10 ? `0${tmeSecondsForfull}` : tmeSecondsForfull}`
        }
        if (timemMinutesForfull) {
            totaltime = `${timemMinutesForfull < 10 ? `0${timemMinutesForfull}` : timemMinutesForfull}:${tmeSecondsForfull < 10 ? `0${tmeSecondsForfull}` : tmeSecondsForfull}`
        }
        else {
            totaltime = `00:${tmeSecondsForfull < 10 ? `0${tmeSecondsForfull}` : tmeSecondsForfull}`
        }
    }

    if (route?.params?.ele?.width < route?.params?.ele?.height) {
        if (fullScreen) {
            heightVideo = JSON.parse(JSON.stringify(width));
            widthVideo = JSON.parse(JSON.stringify(height));
            console.log('Image saved to camera roll: full screen');
        }
        else {
            widthVideo = JSON.parse(JSON.stringify(width));
            heightVideo = JSON.parse(JSON.stringify(height / 1.1));
            console.log('Image saved to camera roll: not ',);
        }
    }
    else {
        if (fullScreen) {
            heightVideo = JSON.parse(JSON.stringify(width));
            widthVideo = JSON.parse(JSON.stringify(height));
        }
        else {
            heightVideo = JSON.parse(JSON.stringify(height));
            widthVideo = JSON.parse(JSON.stringify(width));
        }
    }

    console.log("come in condition currenttime",widthVideo, width, heightVideo, height);

    const refreshing = async () => {
        let image = await AsyncStorage.getItem('galle');
        if (image) {
            image = JSON.parse(image);
            console.log("indxex is .,", image)
            setimages(image)
        }
        else {
            setimages(null);
        }
    }

    const saveToCameraRoll = async (ele) => {

        console.log("saved to camera roll checking", ele?.duration)

        try {

            const imageUrl = ele?.uri; // Replace with your image path
            const targetFolder = ele?.originalPath; // Replace with your desired folder name

            // Create the target folder if it doesn't exist
            const targetPath = `${RNFS.CachesDirectoryPath}/${targetFolder}`;
            await RNFS.mkdir(targetPath);

            // Copy the image to the target folder
            let destinationPath;
            if(ele?.duration){
                destinationPath = `${targetPath}/video.mp4`
            }
            else{
                destinationPath = `${targetPath}/image.jpg`
            }
            await RNFS.copyFile(imageUrl, destinationPath);

            const result = await CameraRoll.save(`file://${destinationPath}`);

            console.log("reponse checking photo saved", result)

            if (result) {
                Toast.showWithGravity(`Your file is restored to original path`,
                    Toast.SHORT,
                    Toast.BOTTOM
                );
            }
            else {
                Toast.showWithGravity(`failed to restored file to original path, please try again`,
                    Toast.SHORT,
                    Toast.BOTTOM
                );
            }
        } 
        catch (error) {
            Toast.showWithGravity(`failed to restored file to original path, please try again`,
                Toast.SHORT,
                Toast.BOTTOM
            );
        }
    };

    // console.log("proprps in images 1",images?.videos[route?.params?.time])


    let deletingFile = async () => {
        if (route?.params?.ele?.duration) {
            let newarray = images?.videos[route?.params?.time].filter((index) => {
                return index?.assets?.[0]?.uri !== route?.params?.ele?.uri
            })

            images.videos[route?.params?.time] = newarray

            console.log("proprps in videos", images.videos[route?.params?.time])
            try {
                await AsyncStorage.setItem('galle', JSON.stringify(images));
                Toast.showWithGravity(`Your Video is deleted from private space`,
                    Toast.SHORT,
                    Toast.BOTTOM
                );
                Orientation.lockToPortrait();
                navigation.goBack();
            }
            catch (e) {
                Toast.showWithGravity(`Failed to delete video please try again`,
                    Toast.SHORT,
                    Toast.BOTTOM
                );
                // console.log("proprps in images in e", e);
            }
        }
        else {
            let newarray = images?.images[route?.params?.time].filter((index) => {
                console.log("is same ", index?.assets?.[0]?.uri === JSON.stringify(route?.params?.ele?.uri))
                return index?.assets?.[0]?.uri !== route?.params?.ele?.uri
            })

            images.images[route?.params?.time] = newarray
            try {
                await AsyncStorage.setItem('galle', JSON.stringify(images));
                Toast.showWithGravity(`Your Photo is deleted from private space`,
                    Toast.SHORT,
                    Toast.BOTTOM
                );
                Orientation.lockToPortrait();
                navigation.goBack();
            }
            catch (e) {
                Toast.showWithGravity(`Failed to delete Photo please try again`,
                    Toast.SHORT,
                    Toast.BOTTOM
                );
                console.log("proprps in images in e", e);
            }
        }
    }

    let restoringFile = () => {
        saveToCameraRoll(route?.params?.ele);
        deletingFile();
    }

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
          if(nextAppState == "background") navigation.navigate('clockScreen')
        };
        AppState.addEventListener('change', handleAppStateChange);
        // return () => {
        //   AppState.removeEventListener('change', handleAppStateChange);
        // };
      }, []);

    useEffect(() => { refreshing() }, [])

    const ref = useRef();
    return (
        <>
            {
                route?.params?.ele?.duration
                    ?
                    <Pressable
                        onPress={() => {
                            setActive(true);
                        }}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: widthVideo, height: heightVideo,
                            backgroundColor: 'rgba(0,0,0,1)',
                        }}>
                        <Video
                            source={{ uri: route?.params?.ele?.uri }}
                            paused={paused}
                            ref={ref}
                            onProgress={(x) => {
                                // console.log("proprps in single screen", x)
                                setProgress(x)
                            }}
                            style={{ width: widthVideo, height: heightVideo }}
                            resizeMode='contain'
                        />
                        {active &&

                            <Pressable
                                onPress={() => setActive(false)}
                                style={{ position: "absolute", width: widthVideo, height: heightVideo, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', top: height / 2.1 }}>
                                    <TouchableOpacity onPress={() => { ref?.current?.seek(parseInt(progress?.currentTime) - 10) }}>
                                        <Image style={{ width: RFValue(24), height: RFValue(24), tintColor: 'white' }} source={IMAGE.backwardIcon} />
                                    </TouchableOpacity>
                                    {
                                        paused ?
                                            <TouchableOpacity onPress={() => { setPaused(false) }}>
                                                <Image style={{ width: RFValue(24), height: RFValue(24), tintColor: 'white' }} source={IMAGE.playIcon} />
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={() => { setPaused(true) }}>
                                                <Image style={{ width: RFValue(24), height: RFValue(24), tintColor: 'white' }} source={IMAGE.stopIcon} />
                                            </TouchableOpacity>
                                    }
                                    <TouchableOpacity onPress={() => { ref.current.seek(parseInt(progress?.currentTime) + 10) }}>
                                        <Image style={{ width: RFValue(24), height: RFValue(24), tintColor: 'white' }} source={IMAGE.forwardIcon} />
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        }
                        <View style={{ position: 'absolute', bottom: 0, width: width / 1.1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View><Text style={{ fontSize: RFValue(12), color: 'white' }}>{currenttime}</Text></View>

                                <View>
                                    <View><Text style={{ fontSize: RFValue(12), color: 'white' }}>{totaltime}</Text></View>
                                </View>

                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                <Slider
                                    style={{ width: '90%', height: 40 }}
                                    minimumValue={0}
                                    maximumValue={progress?.seekableDuration}
                                    minimumTrackTintColor="#FFFFFF"
                                    maximumTrackTintColor="#fff"
                                    value={progress?.currentTime}
                                    onValueChange={(x) => {
                                        ref?.current?.seek(parseInt(x))
                                    }}
                                />

                                <TouchableOpacity onPress={() => {
                                    if (fullScreen) {
                                        Orientation.lockToPortrait();
                                    }
                                    else {
                                        Orientation.lockToLandscape();
                                    }
                                    SetFullScreen(!fullScreen)
                                }}>
                                    <Image style={{ width: 24, height: 24 }} source={IMAGE?.videoExpandIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => { setPaused(true), setModal(true) }} style={{ position: 'absolute', top: RFValue(0), right: RFValue(0), padding: RFValue(15) }}><Image source={IMAGE.settingIcon} style={{ width: RFValue(24), tintColor: 'white', height: RFValue(24) }} /></TouchableOpacity>
                    </Pressable>
                    :
                    <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center' }}>
                        <Image style={{ width: width, height: height / 1.1, marginTop: RFPercentage(5) }} source={{ uri: route?.params?.ele?.uri }} />
                        <TouchableOpacity onPress={() => { setModal(true) }} style={{ position: 'absolute', top: RFValue(0), right: RFValue(0), padding: RFValue(15) }}><Image source={IMAGE.settingIcon} style={{ width: RFValue(24), tintColor: 'white', height: RFValue(24) }} /></TouchableOpacity>
                    </View>

            }
            {modal &&
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={() => { setModal(false) }}
                >
                    <KeyboardAwareScrollView
                        contentContainerStyle={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                        }} >
                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderTopLeftRadius: RFValue(20), borderTopRightRadius: RFValue(20), padding: RFValue(30), width: '100%' }}>
                            <TouchableOpacity onPress={() => { setModal(false) }} style={{ alignSelf: 'flex-end' }}>
                                <Image style={{ width: RFValue(22), height: RFValue(22) }} source={IMAGE?.cancelIcon} />
                            </TouchableOpacity>

                            <View style={{ width: '100%' }}>
                                <TouchableOpacity onPress={deletingFile}
                                    style={{ justifyContent: "center", alignItems: "center", backgroundColor: "gray", width: '100%', marginTop: RFValue(15), paddingVertical: RFValue(10), borderRadius: RFValue(15) }}>
                                    <Text style={{ color: "white", fontSize: RFValue(15) }}>Delete file</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={restoringFile}
                                    style={{ justifyContent: "center", alignItems: "center", backgroundColor: "green", width: '100%', marginTop: RFValue(15), paddingVertical: RFValue(10), borderRadius: RFValue(15) }}>
                                    <Text style={{ color: "white", fontSize: RFValue(15), }}>Restore file</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </KeyboardAwareScrollView>
                </Modal>
            }
        </>
    )
}
export default Singlescreen

const style = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
})
