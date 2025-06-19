import * as ImagePicker from 'expo-image-picker';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

 const uploadImage = async (image: { uri: string }) => {
  try {
    const userString = await AsyncStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    console.log(user)
    
    const userId = user?.id;
    if (!userId) return alert('User not found');
    console.log(userId)

    const formData = new FormData();
    formData.append('profilePicture', {
      uri: image.uri,
      name: `profile-${Date.now()}.jpg`,
      type: 'image/jpeg',
    } as any);
    formData.append('userId', userId); 

    const res = await axiosInstance.post(
      `/login/updateProfilePicture/${userId}`,
     
      formData,
      
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    console.log("Upload response:", res.data);

    setImageUri(res.data.profilePicture); // <-- use returned image URL
    alert('Uploaded successfully!');
  } catch (err) {
    console.error('Upload failed:', err.response?.data || err.message);
    alert('Upload failed');
  }
};

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Permission required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      setImageUri(selected.uri);
      uploadImage(selected);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown}>
        <TouchableOpacity style={styles.glowButton} onPress={pickImage}>
          <Text style={styles.glowButtonText}>Pick Profile Picture</Text>
        </TouchableOpacity>
      </Animated.View>

      {imageUri && (
        <Animated.View entering={FadeInDown.delay(200)} style={styles.imagePreview}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Text style={styles.previewText}>Profile Preview</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e1c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  glowButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: '#9d8bff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  glowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  imagePreview: {
    marginTop: 30,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#a78bfa',
  },
  previewText: {
    marginTop: 10,
    fontSize: 14,
    color: '#c7bdfc',
    fontStyle: 'italic',
  },
});
