import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Platform,
    PermissionsAndroid,
  } from 'react-native';
  import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
  import Toast from "react-native-simple-toast";
  import RNFS from 'react-native-fs';
  
  
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
                    gallers.images[todaydate] = [response, ...gallers.images[todaydate]];
                    await AsyncStorage.setItem('galle', JSON.stringify(gallers));
                }
                else{
                    
                    const newobj = {
                      [todaydate] : [response],
                      ...gallers.images
                    }
                    gallers.images = newobj
                    await AsyncStorage.setItem('galle', JSON.stringify(gallers));
                }
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

        Toast.showWithGravity(`Your file added in your private space now you can remove the file from your device file-Manager`,
            Toast.SHORT,
            Toast.BOTTOM
        );
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
        if (response.didCancel) {
          return false;
        } else if (response.errorCode == 'camera_unavailable') {
          return false;
        } else if (response.errorCode == 'permission') {
          return false;
        } else if (response.errorCode == 'others') {
          return false;
        }
        return response;
      });

    if (response?.assets?.[0]?.uri) {
      console.log("reponse checking ", response)
        settingInAsync(response, refreshing);
        return response;
    }
  }

  export default uploadImageFromGallery
