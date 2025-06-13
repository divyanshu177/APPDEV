import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';

import axiosInstance from '../../axiosInstance';
import { useLocalSearchParams } from 'expo-router';

export default function OtherUserProfile() {
  const { id } = useLocalSearchParams(); // 🧠 Gets seller ID from route
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.post('/login/viewUserProfile', { userId: id });
      setProfile(res.data.profile);
    } catch (err) {
      console.error('Error fetching seller profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text>Seller not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: profile.profilePicture?.startsWith('http') ? profile.profilePicture : `http://10.61.4.86:3000/uploads/${profile.profilePicture}` }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.email}>📧 {profile.email}</Text>
      <Text style={styles.phone}>📱 {profile.phone}</Text>
      <Text style={styles.wallet}>Wallet: ₹{profile.walletBalance}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20, alignItems: 'center', backgroundColor: '#fff'
  },
  profileImage: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#ccc', marginBottom: 16
  },
  name: {
    fontSize: 22, fontWeight: 'bold', marginBottom: 6
  },
  email: {
    fontSize: 16, color: '#555', marginBottom: 4
  },
  phone: {
    fontSize: 16, color: '#555', marginBottom: 4
  },
  wallet: {
    fontSize: 16, fontWeight: 'bold', color: '#2F2F2F', marginTop: 8
  },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  }
});
