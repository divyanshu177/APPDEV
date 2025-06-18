import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import axiosInstance from '../axiosInstance';

export default function UpdateProfileScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);

  const handleUpdateName = async () => {
    if (!name.trim()) return Alert.alert('Validation Error', 'Name cannot be empty');
    try {
      setLoadingName(true);
      const res = await axiosInstance.post('/login/updateName', { name });
      Alert.alert('Success', res.data.message || 'Name updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update name');
    } finally {
      setLoadingName(false);
    }
  };

  const handleUpdatePhone = async () => {
    if (!phone.trim()) return Alert.alert('Validation Error', 'Phone number cannot be empty');
    try {
      setLoadingPhone(true);
      const res = await axiosInstance.post('/login/updatePhone', { phone });
      Alert.alert('Success', res.data.message || 'Phone updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update phone number');
    } finally {
      setLoadingPhone(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mainHeading}>Update Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>New Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity
          style={[styles.buttonCard, loadingName && { opacity: 0.6 }]}
          onPress={handleUpdateName}
          disabled={loadingName}>
          {loadingName ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Name</Text>}
        </TouchableOpacity>

        <Text style={styles.label}>New Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new phone number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TouchableOpacity
          style={[styles.buttonCard, loadingPhone && { opacity: 0.6 }]}
          onPress={handleUpdatePhone}
          disabled={loadingPhone}>
          {loadingPhone ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Phone</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f0f1a',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#a78bfa', // neon purple heading
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#1a1a2e', // dark card
    borderRadius: 16,
    padding: 20,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#a78bfa33',
  },
  label: {
    fontSize: 16,
    color: '#f0e6ff', // light purple text
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2b2b3c', // dark input box
    color: '#f0e6ff',
    borderWidth: 1,
    borderColor: '#a78bfa', // neon purple border
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  buttonCard: {
    backgroundColor: '#a78bfa', // neon purple button
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#a78bfa',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
