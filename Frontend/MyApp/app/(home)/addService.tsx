import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../axiosInstance';

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
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '', stock: 0, description: '', category: '', image: '',
    originalPrice: 0, reducedPrice: 0, dummysellerSharePercent: 10, sellerSharePercent: 90,
  });

  const handleChange = (key: keyof FormData, value: string) => {
    const numberFields: (keyof FormData)[] = [
      'stock', 'originalPrice', 'reducedPrice', 'dummysellerSharePercent', 'sellerSharePercent',
    ];
    setFormData((prev) => ({
      ...prev, [key]: numberFields.includes(key) ? Number(value) : value,
    }));
  };

  const payload = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      if (!user || !user.id) {
        Alert.alert('Error', 'User info not found. Please log in again.');
        return;
      }
      return { ...formData, seller: user.id };
    } catch (error) {
      console.error('Payload Error:', error);
      return null;
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await axiosInstance.post('/login/addService', data);
      Alert.alert('Service Added Successfully!');
      console.log('Response:', response.data);
    } catch (error: any) {
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
          placeholderTextColor="#888"
          keyboardType={['stock', 'originalPrice', 'reducedPrice', 'dummysellerSharePercent', 'sellerSharePercent'].includes(key) ? 'numeric' : 'default'}
          value={String(formData[key as keyof FormData])}
          onChangeText={(text) => handleChange(key as keyof FormData, text)}
        />
      ))}
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
    borderWidth: 1, borderColor: '#a78bfa55', backgroundColor: '#1c1c2b', padding: 14,
    borderRadius: 12, marginBottom: 14, color: '#f0f0f0', fontSize: 15,
    shadowColor: '#a78bfa', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  button: {
    backgroundColor: '#a78bfa', paddingVertical: 15, borderRadius: 12,
    alignItems: 'center', marginTop: 10,
    shadowColor: '#a78bfa', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 10, elevation: 6,
  },
  buttonText: { color: '#1f1f2e', fontWeight: '700', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 },
});
