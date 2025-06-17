import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../axiosInstance";
import * as ImagePicker from 'expo-image-picker';

export default function Create() {
  const item = useLocalSearchParams();
  const [review, setReview] = useState<string>("");
  const [ImageUri, setImageUri] = useState<string[]>([]);

  const handleAddPost = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (!id) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const payload = {
        serviceId: item._id,
        sellerId: item.seller,
        desc: item.description,
        images: ImageUri,
        dummySellerId: id,
        review: review
      };

      console.log("Sending Post Request with Payload:", payload);
      const response = await axiosInstance.post('/login/createPost', payload);
      Alert.alert('Success', 'Post added successfully');
      console.log('Post Response:', response.data);
    } catch (error) {
      console.error('Error adding post:', error);
      Alert.alert('Error', 'Failed to add post');
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        allowsMultipleSelection: true
      });

      if (!result.canceled && result.assets) {
        const formDataUpload = new FormData();
        result.assets.forEach((asset, index) => {
          formDataUpload.append('images', {
            uri: asset.uri,
            name: `img-${index}.jpg`,
            type: 'image/jpeg'
          } as any); // 'as any' necessary due to FormData limitation in React Native
        });

        const response = await axiosInstance.post('/login/uploadImages', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const imageUrls = response.data.imageUrls;
        console.log("Uploaded Image URLs:", imageUrls);
        setImageUri(imageUrls);
      }
    } catch (error) {
      console.error('Error picking/uploading image:', error);
      Alert.alert('Error', 'Failed to pick or upload image');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your review here..."
        placeholderTextColor="#888"
        value={review}
        onChangeText={setReview}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Photo/Video</Text>
      </TouchableOpacity>

      <View style={styles.previewContainer}>
        {ImageUri.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.previewImage}
          />
        ))}
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#00ffff' }]} onPress={handleAddPost}>
        <Text style={styles.buttonText}>Add Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#20232a',
    flexGrow: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#00ffff'
  },
  input: {
    height: 100,
    borderColor: '#333',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    textAlignVertical: 'top'
  },
  button: {
    backgroundColor: '#0055ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'center'
  },
  previewImage: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 8,
  }
});
