import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    PermissionsAndroid,
  } from 'react-native';
  import { launchImageLibrary} from 'react-native-image-picker';
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

        Toast.showWithGravity(`file added in your private-space now you can remove file from your device file-Manager`,
            Toast.SHORT,
            Toast.BOTTOM
        );
    }
    catch(e){ console.log(e)};

    // await AsyncStorage.setItem('gallery', JSON.stringify(response))
  }

  async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to delete photos.',
        }
      );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Photo deleted successfully. Storage permission granted.');
      } else {
        console.log('Photo deleted successfully. Storage permission denied.');
      }
    } catch (error) {
      console.error('Photo deleted successfully. Error requesting storage permission:', error);
    }
  }

  // async function deletePhoto(originalPath) {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       {
  //         title: 'Storage Permission',
  //         message: 'App needs access to your storage to delete photos.',
  //       }
  //     );
  
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       await RNFS.unlink(originalPath);
  //       console.log('Photo deleted successfully.');
  //     } else {
  //       console.log('Photo deleted successfully. Storage permission denied.');
  //     }
  //   } catch (error) {
  //     console.error('Photo deleted successfully. Error deleting photo:', error);
  //   }
  // }

   const uploadImageFromGallery = async (refreshing) => {
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
      // console.log("reponse checking ", response?.assets?.[0]?.uri)
      // deletePhoto(response?.assets?.[0]?.originalPath)
        settingInAsync(response, refreshing);
        return response;
    }
  }

  export default uploadImageFromGallery
