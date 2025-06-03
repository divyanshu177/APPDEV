import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import axiosInstance from '../../app/axiosInstance';

export default function CreatePostScreen() {
  const [formData, setFormData] = useState({
    serviceId: '',
    serviceName: '',
    sellerId: '',
    desc: '',
    cost: '',
    image: '',
    dummyseller: false,
    dummysellerId: '',
  });

  interface FormData {
    serviceId: string;
    serviceName: string;
    sellerId: string;
    desc: string;
    cost: string;
    image: string;
    dummyseller: boolean;
    dummysellerId: string;
  }

  type FormDataKey = keyof FormData;

  const handleChange = (key: FormDataKey, value: FormData[FormDataKey]) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        cost: Number(formData.cost),
        dummyseller: formData.dummyseller ? 1 : 0,
      };

      const response = await axiosInstance.post('/login/createPost', payload);
      Alert.alert('✅ Post Created', 'Your post has been successfully submitted!');
      setFormData({
        serviceId: '',
        serviceName: '',
        sellerId: '',
        desc: '',
        cost: '',
        image: '',
        dummyseller: false,
        dummysellerId: '',
      });
    } catch (error) {
      console.error('POST Error:', error);
      Alert.alert('❌ Error', 'Something went wrong while submitting the post.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Post</Text>

      <TextInput style={styles.input} placeholder="Service ID" value={formData.serviceId} onChangeText={(text) => handleChange('serviceId', text)} />
      <TextInput style={styles.input} placeholder="Service Name" value={formData.serviceName} onChangeText={(text) => handleChange('serviceName', text)} />
      <TextInput style={styles.input} placeholder="Seller ID" value={formData.sellerId} onChangeText={(text) => handleChange('sellerId', text)} />
      <TextInput style={styles.input} placeholder="Description" value={formData.desc} onChangeText={(text) => handleChange('desc', text)} multiline />
      <TextInput style={styles.input} placeholder="Cost (₹)" value={formData.cost} onChangeText={(text) => handleChange('cost', text)} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Image URL" value={formData.image} onChangeText={(text) => handleChange('image', text)} />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Dummy Seller?</Text>
        <Switch value={formData.dummyseller} onValueChange={(value) => handleChange('dummyseller', value)} />
      </View>

      {formData.dummyseller && (
        <TextInput style={styles.input} placeholder="Dummy Seller ID" value={formData.dummysellerId} onChangeText={(text) => handleChange('dummysellerId', text)} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F4FC',
    padding: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#144272',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d0e4f5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    color: '#1b1b1b',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 16,
    color: '#144272',
  },
  button: {
    backgroundColor: '#0077b6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
