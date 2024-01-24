import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Platform,
    PermissionsAndroid,
  } from 'react-native';
  import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
  import Toast from "react-native-simple-toast";
  
  // Request External StoragePermission
  const requestExternalWritePermission = async () => {
    console.log("repoosne is in image permission in isStoragePermitted",)
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };
  
  const settingInAsync = async (response, refreshing) =>{
    try{
        let gallers = await AsyncStorage.getItem('galle');
        if(gallers){
            gallers = JSON.parse(gallers);
            let todaydate = new Date();
            todaydate = `${todaydate.getDate()}/${todaydate.getMonth() + 1}/${todaydate.getFullYear()}`

            if(response?.assets?.[0]?.duration){
                if(gallers?.videos[todaydate]){
                    gallers.videos[todaydate] = [response, ...gallers.videos[todaydate]];
                }
                else{
                    gallers.videos[todaydate] = [response]
                    console.log("checking store in else", gallers)
                }
                await AsyncStorage.setItem('galle', JSON.stringify(gallers));

                refreshing();
            }

            else{
                if(gallers?.images[todaydate]){
                    console.log("checking store in if",[todaydate], gallers?.images[todaydate])
                    gallers.images[todaydate] = [response, ...gallers.images[todaydate]];
                }
                else{
                    gallers.images[todaydate] = [response]
                    
                    console.log("checking store in else", gallers)
                }
                await AsyncStorage.setItem('galle', JSON.stringify(gallers));

                refreshing();
            }
            

        }
        else{
            let newgallery = {"images" : {}, "videos" : {}}
            
            let todaydate = new Date();
            todaydate = `${todaydate.getDate()}/${todaydate.getMonth() + 1}/${todaydate.getFullYear()}`

            if(response?.assets?.[0]?.duration){
                newgallery.videos[todaydate] = [response]
            }
            else{
                newgallery.images[todaydate] = [response]
            }

            await AsyncStorage.setItem('galle', JSON.stringify(newgallery));

            refreshing();
        }
    }
    catch(e){ console.log(e)};

    // await AsyncStorage.setItem('gallery', JSON.stringify(response))
  }


   const uploadImageFromGallery = async (refreshing) => {
    console.log("repoosne is in image")
    var options = {
      mediaType: 'videos',
      quality:1,
      includeBase64: false
    };   

    const response = await launchImageLibrary(options, (response) => {
        // console.log('launch img', response)
        if (response.didCancel) {
          Toast.showWithGravity(`User cancelled camera picker`,
            Toast.SHORT,
            Toast.BOTTOM
          );
          return false;
        } else if (response.errorCode == 'camera_unavailable') {
          Toast.showWithGravity(`Camera not available on device`,
            Toast.SHORT,
            Toast.BOTTOM
          );
          return false;
        } else if (response.errorCode == 'permission') {
          Toast.showWithGravity(`Permission not satisfied`,
            Toast.SHORT,
            Toast.BOTTOM
          );
          return false;
        } else if (response.errorCode == 'others') {
          Toast.showWithGravity(response.errorMessage,
            Toast.SHORT,
            Toast.BOTTOM
          );
          return false;
        }
        return response;
      });
    if (response) {
        console.log("reponse is reponse", response?.assets?.[0]?.duration)
        settingInAsync(response, refreshing);
        return response;
    }
  }

  export default uploadImageFromGallery
