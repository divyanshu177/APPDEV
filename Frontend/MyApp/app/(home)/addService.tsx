import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import axiosInstance from '../../app/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface FormData {
  name: string;
  stock: number;
  description: string;
  category: string;
  image: string;
  originalPrice: number;
  reducedPrice: number;
  dummysellerSharePercent: number;
  sellerSharePercent: number;
}


   
     
   
export default function AddServiceScreen() {   
  const [formData, setFormData] = useState<FormData>({
    name: '',
    stock: 0,
    description: '',
    category: '',
    image: '',
    originalPrice: 0,
    reducedPrice: 0,
    dummysellerSharePercent: 10,
    sellerSharePercent: 90,
  });

  const handleChange = (key: keyof FormData, value: string) => {
    const numberFields: (keyof FormData)[] = [
      'stock',
      'originalPrice',
      'reducedPrice',
      'dummysellerSharePercent',
      'sellerSharePercent',
    ];

    setFormData((prev) => ({
      ...prev,
      [key]: numberFields.includes(key) ? Number(value) : value,
    }));
  };

  const payload = async () => {
      try {
          console.log('Reached payload');
          const userString = await AsyncStorage.getItem('user');
          console.log('User String:', userString);
          const user = userString ? JSON.parse(userString) : null;

    if (!user || !user.id) {
      Alert.alert('Error', 'User info not found. Please log in again.');
      return;
    }

    const sellerId = user.id;
    console.log('Seller ID:', sellerId);

    const payload = { ...formData, seller: sellerId };
    console.log('Payload:', payload);
    return payload;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      }
  catch (error) {
    console.error('Error in payload function:', error);  
    return null; 
  }
}
     
      



const handleSubmit = async (payload:any) => {
    try {
      const response = await axiosInstance.post('/login/addService', payload);
      Alert.alert('Service Added Successfully!');
      console.log('Response:', response.data);
    } 
    catch (error: any) {
      console.error('Axios Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to add service. Please try again.');
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
          placeholderTextColor="#66788a"
          keyboardType={
            ['stock', 'originalPrice', 'reducedPrice', 'dummysellerSharePercent', 'sellerSharePercent'].includes(key)
              ? 'numeric'
              : 'default'
          }
          value={String(formData[key as keyof FormData])}
          onChangeText={(text) => handleChange(key as keyof FormData, text)}
        />
      ))}
      

      <TouchableOpacity 
      onPress={async () => {
        const data = await payload();
        if(data){
           handleSubmit(data);
        }
      }} 
        style={styles.button}>
        <Text style={styles.buttonText}>Add Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0fa',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2a3f5f',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cddff6',
    backgroundColor: '#f4f8ff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    color: '#1f2d3d',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#007acc',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007acc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});