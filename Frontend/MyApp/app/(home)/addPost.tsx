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
        'http://10.61.4.86:3000/login/createPost',
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

      {(Object.keys(formData) as (keyof FormData)[]).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          placeholderTextColor="#66788a"
          value={formData[key]}
          keyboardType={key === 'dummySeller' ? 'numeric' : 'default'}
          onChangeText={(text) => handleChange(key, text)}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity>

      {/* Navigate to Update Post using router.push */}
     <TouchableOpacity
  style={[styles.button, {
    backgroundColor: '#EEDEF6', // pastel neon purple
    shadowColor: '#EEDEF6',
    marginTop: 12,
  }]}
  onPress={() => router.push('/updatePost')}
>
  <Text style={[styles.buttonText, { color: '#2F2F2F' }]}>
    Go to Update Post
  </Text>
</TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FEE1B6',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#FEE1B6AA',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#2F2F2F',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    color: '#F0F0F0',
    fontSize: 15,
    shadowColor: '#FEE1B6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#FEE1B6',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FEE1B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#2F2F2F',
    fontWeight: '700',
    fontSize: 16,
  },
});
