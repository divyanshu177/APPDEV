import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Image, Button, View } from 'react-native';
import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [imageUri, setImageUri] = useState(null);


const uploadImage = async (image) => {
  console.log("uploading");
    const userString= await AsyncStorage.getItem('user');
    const user=JSON.parse(userString);
    const userId=user.id;

    const formData = new FormData();
    formData.append('profilePicture', {
      uri: image.uri,
      name: `profile-${Date.now()}.jpg`,
      type: 'image/jpeg',
    });
    console.log(formData)

    try {
      console.log(userId);
      const res = await axiosInstance.post(
        `/login/updateProfilePicture/${userId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
       
      console.log("uploaded");
      alert('Uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
    }
};

  
  

const pickImage = async () => {
    console.log("picking image");

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Permission required');
      return;
    }
    console.log(permission)

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      console.log(result);
      setImageUri(result.assets[0].uri);
      console.log("before upload");
      console.log(result.assets);
      uploadImage(result.assets[0]);
    }
};

  
  return (
    <View>
      <Button title="Pick Profile Picture" onPress={pickImage}/> 
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />}
   
    </View>
  );
}
