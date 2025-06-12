import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface FormData {
  sellerId: string;
  serviceId: string;
  serviceName: string;
  desc: string;
  image: string;
  dummySeller: string;
}

export default function AddPostScreen() {
  const router = useRouter(); // <-- Use router instead of navigation

  const [formData, setFormData] = useState<FormData>({
    sellerId: '',
    serviceId: '',
    serviceName: '',
    desc: '',
    image: '',
    dummySeller: '0',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          if (user && user.id) {
            setFormData((prev) => ({ ...prev, sellerId: user.id }));
          }
        }
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.sellerId) {
      Alert.alert('Error', 'Seller ID not found. Please login first.');
      return;
    }

    try {
      const payload = {
        ...formData,
        dummySeller: Number(formData.dummySeller),
      };
      const token = await AsyncStorage.getItem('userToken');

      const response = await axios.post(
        'http://10.61.51.179:3000/login/createPost',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', response.data.message || 'Post created!');
    } catch (error: any) {
      console.error('Axios Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Post</Text>

      
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
