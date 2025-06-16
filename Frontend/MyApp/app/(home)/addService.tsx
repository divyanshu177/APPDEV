import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from '../axiosInstance';

interface FormData {
  name: string;
  stock: number;
  description: string;
  category: string;
  image: string[]; // Fixed: should be an array
  originalPrice: number;
  reducedPrice: number;
  dummysellerSharePercent: number;
  sellerSharePercent: number;
}

export default function AddServiceScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    stock: 0,
    description: '',
    category: '',
    image: [], // Fixed here
    originalPrice: 0,
    reducedPrice: 0,
    dummysellerSharePercent: 10,
    sellerSharePercent: 90,
  });

  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const handleChange = (key: keyof FormData, value: string) => {
    const numberFields: (keyof FormData)[] = [
      'stock', 'originalPrice', 'reducedPrice', 'dummysellerSharePercent', 'sellerSharePercent',
    ];
    setFormData((prev) => ({
      ...prev,
      [key]: numberFields.includes(key) ? Number(value) : value,
    }));
  };

  const pickImage = async () => {
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
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const uri = asset.uri;
      setLocalImageUri(uri);

      await uploadImage(uri); // Fixed: directly upload image
    }
  };

  const uploadImage = async (uri: string) => {
    const form = new FormData();
    form.append('image', {
      uri,
      name: 'service.jpg',
      type: 'image/jpeg',
    } as any); // React Native specific FormData object

    try {
      const response = await axiosInstance.post('/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const filename = response.data.filename;
      setFormData((prev) => ({ ...prev, image: [...prev.image, filename] })); // Fixed: push filename into array
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Upload Failed", "Unable to upload image.");
    }
  };

  const payload = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      if (!user || !user.id) {
        Alert.alert('Error', 'User info not found. Please log in again.');
        return null;
      }
      return { ...formData, seller: user.id };
    } catch (error) {
      console.error('Payload Error:', error);
      return null;
    }
  };

  const postDataCreate = (response) => {
    console.log
    return {   
      image: response.data.image,
      desc: formData.description,
      serviceId: response.serviceId,
      sellerId: response.sellerId,
    };
  };

  const handleSubmit = async (data) => {
    try {
      console.log('Submitting data:', data);
      const response = await axiosInstance.post('/login/addService', data);
      const postData=postDataCreate(response);
      Alert.alert('Service Added Successfully!');
      console.log('Response:', response.data);
    } catch (error: any) {
      console.error('Axios Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to add service. Please try again.');
    }

    try{    
      await axiosInstance.post('/login/createPost',postData);
      console.log('Post created successfully');
    }
    catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Service</Text>

      {Object.keys(formData).map((key, index) => {
        if (key === 'image') return null; // Don't render input for image array
        return (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            placeholderTextColor="#888"
            keyboardType={
              ['stock', 'originalPrice', 'reducedPrice', 'dummysellerSharePercent', 'sellerSharePercent']
                .includes(key) ? 'numeric' : 'default'
            }
            value={String(formData[key as keyof FormData])}
            onChangeText={(text) => handleChange(key as keyof FormData, text)}
          />
        );
      })}

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>{localImageUri ? 'Change Image' : 'Upload Image'}</Text>
      </TouchableOpacity>

      {localImageUri && (
        <Image source={{ uri: localImageUri }} style={styles.imagePreview} />
      )}

      <TouchableOpacity
        onPress={async () => {
          const data = await payload();
          if (data) handleSubmit(data);
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Add Service</Text>
      </TouchableOpacity>

    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#a78bfa', textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#a78bfa55',
    backgroundColor: '#1c1c2b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    color: '#f0f0f0',
    fontSize: 15,
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  uploadButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
    borderColor: '#a78bfa',
    borderWidth: 1,
  },
  uploadText: {
    color: '#a78bfa',
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#a78bfa',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#1f1f2e',
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
