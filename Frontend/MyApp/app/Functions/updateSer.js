import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert } from 'react-native';
// import { addService } from '../services/api';

const AddService = () => {
  const [form, setForm] = useState({
    name: '',
    stock: '',
    description: '',
    category: '',
    image: '',
    seller: '', // seller _id from backend
    originalPrice: '',
    reducedPrice: '',
    dummyseller: 'false', // or true
    dummysellerSharePercent: '',
    sellerSharePercent: '',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        stock: Number(form.stock),
        originalPrice: Number(form.originalPrice),
        reducedPrice: Number(form.reducedPrice),
        dummyseller: form.dummyseller === 'true',
        dummysellerSharePercent: Number(form.dummysellerSharePercent),
        sellerSharePercent: Number(form.sellerSharePercent),
      };

      const res = await addService(payload);
      Alert.alert('Success', res.message);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {[
        'name',
        'stock',
        'description',
        'category',
        'image',
        'seller',
        'originalPrice',
        'reducedPrice',
        'dummyseller',
        'dummysellerSharePercent',
        'sellerSharePercent',
      ].map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          value={form[field]}
          onChangeText={(text) => handleChange(field, text)}
          style={styles.input}
        />
      ))}
      <Button title="Add Service" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
});

export default AddService;
