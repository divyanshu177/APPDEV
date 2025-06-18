import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import axiosInstance from '../axiosInstance'; 
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getposts = () => router.push('/(prof)/posts');
  const update = () => router.push('/(prof)/pictureProf');
  const updateProfile = () => router.push('/(prof)/updateProfile');

    const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    router.replace('/login');
  };

  const getProfile = async () => {
    try {
      const response = await axiosInstance.get('/login/getProfile');
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} color="#a78bfa" />;
  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#fff' }}>Unable to load profile.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 🔓 Logout Button at Top-Right */}
  
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={update}>
        <Text style={styles.updateLink}>🔄 Update Profile Picture</Text>
      </TouchableOpacity>

      <Animatable.View animation="fadeInDown" duration={600} style={styles.card}>
        <Image
          source={{ uri: profile.profilePicture }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>📧 {profile.email}</Text>
        <Text style={styles.phone}>📱 {profile.phone}</Text>
        <Text style={styles.wallet}>Wallet Balance: ₹{profile.walletBalance}</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} duration={600} style={styles.card}>
        <Text style={styles.sectionTitle}>🛠️ Services Posted</Text>
        {profile.services.length > 0 ? (
          profile.services.map((service: any, index: number) => (
            <Text key={index} style={styles.serviceItem}>• {service}</Text>
          ))
        ) : (
          <Text style={styles.serviceItem}>No services posted yet.</Text>
        )}
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={400} duration={600} style={styles.buttonCard}>
        <TouchableOpacity onPress={getposts}>
          <Text style={styles.postsText}>📄 View Your Posts</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={600} duration={600} style={styles.buttonCard}>
        <TouchableOpacity onPress={updateProfile}>
          <Text style={styles.postsText}>📝 Update Profile</Text>
        </TouchableOpacity>
      </Animatable.View>
       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1a',
  },
  updateLink: {
    color: '#a78bfa',
    fontSize: 16,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  card: {
    width: '100%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#a78bfa33',
  },
  buttonCard: {
    width: '100%',
    backgroundColor: '#2b2b3c',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#a78bfa',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#2e2e3e',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#a78bfa88',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f0e6ff',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: { fontSize: 15, color: '#ccc', textAlign: 'center' },
  phone: { fontSize: 15, color: '#ccc', textAlign: 'center' },
  wallet: {
    fontSize: 16,
    color: '#4afcb1',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#a78bfa',
    marginBottom: 10,
  },
  serviceItem: {
    fontSize: 15,
    color: '#ddd',
    marginBottom: 6,
  },
  postsText: {
    color: '#f0e6ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
   logoutTopWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    backgroundColor: '#fff',
  },
  logoutButton: {
    backgroundColor: '#a78bfa',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
