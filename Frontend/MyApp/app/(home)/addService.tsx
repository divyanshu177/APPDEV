import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  StyleSheet, ScrollView, Alert
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
  originalPrice: number;
  reducedPrice: number;
  dummysellerSharePercent: number;
  sellerSharePercent: number;
}

export default function AddServiceScreen() {
  const router = useRouter();
  const [localImageUri, setLocalImageUri] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string[]>([]); // URLs from backend

  const [formData, setFormData] = useState<FormData>({
    name: '',
    stock: 0,
    description: '',
    category: '',
    originalPrice: 0,
    reducedPrice: 0,
    dummysellerSharePercent: 10,
    sellerSharePercent: 90,
  });

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
    console.log("picking image");
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
      allowsMultipleSelection: true,
    });

    console.log("Image Picker Result:", result);
    if (!result.canceled) {
      const formDataUpload = new FormData();
      result.assets.forEach((asset, index) => {
        formDataUpload.append('images', {
          uri: asset.uri,
         name: `img-${index}.jpg`,
          type: `image/jpeg`,
        } as any);
      });

      const response = await axiosInstance.post('/login/uploadImages', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(response.data);

      const imageUrls = response.data.imageUrls;
      console.log("Image URLs received:", imageUrls);
      setImageUri(imageUrls); // store URLs for backend submission

      setLocalImageUri(result.assets.map((asset) => asset.uri)); // local preview
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

      return {
        name: formData.name,
        stock: formData.stock,
        description: formData.description,
        category: formData.category,
        images: imageUri, // ✅ corrected key
        originalPrice: formData.originalPrice,
        reducedPrice: formData.reducedPrice,
        dummysellerSharePercent: formData.dummysellerSharePercent,
        sellerSharePercent: formData.sellerSharePercent,
        seller: user.id,
      };
    } catch (error) {
      console.error('Payload Error:', error);
      return null;
    }
  };

  const postDataCreate = (response) => {
    return {
      images: imageUri,
      desc: formData.description,
      serviceId: response.data.service._id,
      sellerId: response.data.service.seller,
    };
  };

  const handleSubmit = async () => {
    try {
      const data = await payload();
      if (!data) return;

      console.log('Submitting service data:', data);
      const response = await axiosInstance.post('/login/addService', data);
      const postData = postDataCreate(response);

      const res2 = await axiosInstance.post('/login/createPost', postData);

      Alert.alert('Success', 'Service and Post created successfully!');
      console.log('Service creation response:', response.data);
      console.log('Post creation response:', res2.data);
    } catch (error: any) {
      console.error('Axios Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to add service or post. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Service</Text>

      {Object.keys(formData).map((key, index) => (
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
      ))}

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>
          {localImageUri.length > 0 ? 'Change Image' : 'Upload Image'}
        </Text>
      </TouchableOpacity>

      {localImageUri.length > 0 && (
        <ScrollView horizontal style={{ marginBottom: 20 }}>
          {localImageUri.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={[styles.imagePreview, { width: 200, height: 200, marginRight: 10 }]}
            />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
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
  },
  buttonText: {
    color: '#1f1f2e',
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});