import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axiosInstance from '../axiosInstance'; 
import {useRouter} from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';


export default function ProfileScreen() {
  const router=useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

const getposts= async() =>{
    router.push('/(prof)/posts')
}


const update = async () => {
  router.push('/(prof)/pictureProf');
};

const getProfile = async () => {
    try {
      const response = await axiosInstance.get('/login/getProfile');
      console.log('Profile Response:', response.data);
      console.log(response.data.profile)
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


  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text>Unable to load profile.</Text>
      </View>
    );
  }



   
  return (
  <ScrollView contentContainerStyle={styles.container}>
  <TouchableOpacity onPress={update}>
        <Text style={{ color: 'blue', fontSize: 16 }}>Update Profile Picture</Text>
  </TouchableOpacity>

  <View style={styles.profileContainer}>
        <Image
          source={{
           uri:profile.profilePicture
          }}
          style={styles.profileImage}
        />
      
    
  </View>


      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.email}>📧 {profile.email}</Text>
      <Text style={styles.phone}>📱 {profile.phone}</Text>
      <Text style={styles.wallet}>Wallet Balance: ₹{profile.walletBalance}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services Posted</Text>
        {profile.services.length > 0 ? (
          profile.services.map((service: any, index: number) => (
            <Text key={index} style={styles.serviceItem}>• {service}</Text>
          ))
        ) : (
          <Text style={styles.serviceItem}>No services posted yet.</Text>
        )}
      </View>
      <TouchableOpacity onPress={getposts} style={styles.postsContainer}>
          <Text style={styles.postsText}>📄 Your Posts</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={update} style={styles.postsContainer}>
          <Text style={styles.postsText}>📝 Update Profile</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  homeIcon: {
    top: 0,
    left: -120,
    zIndex: 1,
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    maxHeight:100, 
  },
  profileImage: {
    width: 100,
    height:100,
    borderRadius: 60,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  wallet: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 20,
  },
  section: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceItem: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsContainer: {
  width: '100%',
  backgroundColor: '#F5F5F5',
  padding: 15,
  marginTop: 25,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

postsText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2F2F2F',
},

});

