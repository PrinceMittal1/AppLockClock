import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, PermissionsAndroid, Platform, StyleSheet, Dimensions, Modal } from "react-native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import uploadImageFromGallery from "../common/uploadImage";
import RNFS from 'react-native-fs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import DocumentPicker from 'react-native-document-picker';
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Video from "react-native-video";
import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const GalleryScreen = ({ navigation }) => {
    const [images, setimages] = useState({});
    const [videos, setvideos] = useState({});
    const [TopTeb, setTopTeb] = useState('Photos');
    const [index, setIndex] = useState(TopTeb == 'Photos' ? 0 : 1);
    const [imageOfModal, setImageOfModal] = useState(null);

    const isFocus = useIsFocused()

    const [routes] = useState([
        { key: 'first', title: 'Photos' },
        { key: 'second', title: 'Videos' },
    ]);

    // let todaydate = new Date();
    // todaydate = `${todaydate.getDate()}/${todaydate.getMonth() + 1}/${todaydate.getFullYear()}`


    const refreshing = async () => {
        let image = await AsyncStorage.getItem('galle');
        if (image) {
            image = JSON.parse(image);
            console.log("indxex is .,", image?.images["29/1/2024"])
            setimages(image)
        }
        else {
            setimages(null);
        }
    }

    const clearingall = async () => {
        await AsyncStorage.removeItem('galle');
    }

    useEffect(() => {
        refreshing();
    }, [isFocus])

    const saveToCameraRoll = async (ele) => {

        try {

            const imageUrl = ele?.ele?.item?.assets?.[0]?.uri; // Replace with your image path
            const targetFolder = ele?.ele?.item?.assets?.[0]?.originalPath; // Replace with your desired folder name

            // Create the target folder if it doesn't exist
            const targetPath = `${RNFS.CachesDirectoryPath}/${targetFolder}`;
            await RNFS.mkdir(targetPath);

            // Copy the image to the target folder
            const destinationPath = `${targetPath}/image.jpg`;
            await RNFS.copyFile(imageUrl, destinationPath);

            const result = await CameraRoll.save(`file://${destinationPath}`);

            console.log("resultstss", result)

            if (result) {
                console.log('Image saved to camera roll:', result);
            }
            else {
                console.error('Image saved to camera roll: Failed to save image to camera roll');
            }
        } catch (error) {
            console.error('Image saved to camera roll: Error saving image:', error);
        }
    };

    const Renderimage = (ele: any) => {
        console.log('Image saved to camera roll: Error saving image:', ele?.ele?.item?.assets?.[0]?.uri, ele?.time);
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate("singleScreen", { ele: ele?.ele?.item?.assets?.[0], time: ele?.time })
                // saveToCameraRoll(ele);
            }}>
                <Image style={{ width: width / 4, height: width / 4 }} source={{ uri: ele?.ele?.item?.assets?.[0]?.uri }} />
            </TouchableOpacity>
        )
    }

    console.log("indxex is jhgujvhjv", imageOfModal?.ele?.item?.assets?.[0])

    const renderItem2 = (index: number) => {
        return (

            <>
                {
                    index == 0
                        ?
                        <>
                            {images?.images ?
                                <View style={{ flex: 1 }}>

                                    <TouchableOpacity
                                        onPress={() => {
                                            uploadImageFromGallery(refreshing);
                                        }}
                                        style={{ borderWidth: 1, borderColor: "black", width: RFPercentage(10), height: RFPercentage(10), borderRadius: 100, alignSelf: "center", position: "absolute", bottom: RFPercentage(5), backgroundColor: "black", opacity: 0.7, flexDirection: "row", right: RFPercentage(5) }}>
                                        <View style={{ backgroundColor: "white", height: RFValue(40), width: RFValue(5), left: RFPercentage(4.6), borderRadius: RFValue(10), top: RFPercentage(2) }}></View>
                                        <View style={{ backgroundColor: "white", height: RFValue(40), width: RFValue(5), borderRadius: RFValue(10), top: RFPercentage(2.1), left: RFPercentage(3.8), transform: [{ rotate: `90deg` }] }}></View>
                                    </TouchableOpacity>

                                    {Object?.entries(images?.images)?.map(ele => {
                                        console.log("in compone", ele?.[1])
                                        return (
                                            <View key={ele?.[0]} style={{ marginTop: RFValue(10) }}>

                                                {ele?.[1].length > 0 &&
                                                    <Text style={{ fontSize: RFValue(20), color: 'black', marginBottom: RFValue(10) }}>{ele?.[0]}</Text>
                                                }

                                                <View>
                                                    <FlatList
                                                        data={ele?.[1]}
                                                        numColumns={4}
                                                        renderItem={eles =>
                                                            <Renderimage ele={eles} time={ele?.[0]} />
                                                        } />
                                                </View>

                                            </View>
                                        )
                                    })}

                                </View>
                                :
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            uploadImageFromGallery(refreshing);
                                        }}
                                        style={{ borderWidth: 1, borderColor: "gray", width: RFPercentage(10), height: RFPercentage(10), borderRadius: 100, alignSelf: "center", position: "absolute", bottom: RFPercentage(5), backgroundColor: "black", flexDirection: "row", right: RFPercentage(5) }}>
                                        <View style={{ backgroundColor: "white", height: RFValue(40), width: RFValue(5), left: RFPercentage(4.6), borderRadius: RFValue(10), top: RFPercentage(2) }}></View>
                                        <View style={{ backgroundColor: "white", height: RFValue(40), width: RFValue(5), borderRadius: RFValue(10), top: RFPercentage(2.1), left: RFPercentage(3.8), transform: [{ rotate: `90deg` }] }}></View>
                                    </TouchableOpacity>
                                </View>
                            }
                        </>
                        :
                        <>
                            {images?.videos ?
                                <View style={{ flex: 1 }}>

                                    <TouchableOpacity
                                        onPress={() => {
                                            uploadImageFromGallery(refreshing);
                                        }}
                                        style={{ borderWidth: 1, borderColor: "black", width: RFPercentage(10), height: RFPercentage(10), borderRadius: 100, alignSelf: "center", position: "absolute", bottom: RFPercentage(5), backgroundColor: "black", opacity: 0.7, flexDirection: "row", right: RFPercentage(5) }}>
                                        <View style={{ backgroundColor: "white", height: RFValue(40), width: RFValue(5), left: RFPercentage(4.6), borderRadius: RFValue(10), top: RFPercentage(2) }}></View>
                                        <View style={{ backgroundColor: "white", height: RFValue(40), width: RFValue(5), borderRadius: RFValue(10), top: RFPercentage(2.1), left: RFPercentage(3.8), transform: [{ rotate: `90deg` }] }}></View>
                                    </TouchableOpacity>

                                    {Object?.entries(images?.videos)?.map(ele => {
                                        console.log("in compone", ele?.[1])
                                        return (
                                            <View key={ele[0]} style={{ marginTop: RFValue(10) }}>

                                                {ele?.[1].length > 0 &&
                                                    <Text style={{ fontSize: RFValue(20), color: 'black', marginBottom: RFValue(10) }}>{ele?.[0]}</Text>
                                                }

                                                <View>
                                                    <FlatList
                                                        data={ele?.[1]}
                                                        numColumns={4}
                                                        renderItem={eles =>
                                                            <Renderimage ele={eles} time={ele?.[0]} />
                                                        } />
                                                </View>

                                            </View>
                                        )
                                    })}

                                </View>
                                :
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            uploadImageFromGallery(refreshing);
                                        }}
                                        style={{ borderWidth: 1, borderColor: "gray", width: RFPercentage(10), height: RFPercentage(10), borderRadius: 100, alignSelf: "center", position: "absolute", bottom: RFPercentage(5), backgroundColor: "gray", flexDirection: "row", right: RFPercentage(5) }}>
                                        <View style={{ backgroundColor: "white", height: RFValue(40), width: RFValue(5), left: RFPercentage(4.6), borderRadius: RFValue(10), top: RFPercentage(2) }}></View>
                                        <View style={{ backgroundColor: "white", height: RFValue(40), width: RFValue(5), borderRadius: RFValue(10), top: RFPercentage(2.1), left: RFPercentage(3.8), transform: [{ rotate: `90deg` }] }}></View>
                                    </TouchableOpacity>
                                </View>
                            }
                        </>
                }
            </>

        )
    }

    const renderScene = SceneMap({
        first: () => renderItem2(0),
        second: () => renderItem2(1),
    });

    const CustomTab = ({ title, active }) => {
        return (
            <View style={[style.tab, active ? style.activeTab : style.inactiveTab]}>
                <Text style={[style.TabTextColor]}>{title}</Text>
            </View>
        );
    };

    const renderTabBar = props => {
        return (
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: 'transparent' }}
                scrollEnabled={true}
                style={{ backgroundColor: 'black' }}
                android_ripple={false}
                tabStyle={{
                    marginHorizontal: RFValue(50),
                    width: 'auto',
                    justifyContent: 'space-around',
                }}
                renderLabel={({ route, focused }) => (
                    <CustomTab title={route.title} active={focused} />
                )}
            />
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <TabView
                style={{ zIndex: 5, elevation: 5 }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={e => {
                    setIndex(e), setTopTeb(e == 0 ? 'Photos' : 'Videos')
                }}
                renderTabBar={renderTabBar}
            />
        </View>

    )
}


const style = StyleSheet.create({
    tab: {},
    activeTab: {
        backgroundColor: 'black',
        // borderRadius:22,
        borderBottomWidth: 4,
        borderColor: 'white',
        paddingTop: RFValue(2),
        paddingBottom: RFValue(2),
        paddingLeft: RFValue(10),
        paddingRight: RFValue(10),
    },
    inactiveTab: {
        backgroundColor: 'black',
        // borderRadius:22,
        paddingTop: RFValue(2),
        paddingBottom: RFValue(2),
        paddingLeft: RFValue(10),
        paddingRight: RFValue(10),
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    video: {
        width: 100,
        height: 500,
    },
    TabTextColor: {
        color: 'white',
        fontFamily: "HELVETICA_BOLD",
        paddingBottom: RFValue(8),
    },
})

export default GalleryScreen;



// CameraRoll.deletePhotos([""]);