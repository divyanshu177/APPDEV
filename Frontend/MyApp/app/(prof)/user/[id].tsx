
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axiosInstance from '../../axiosInstance';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OtherUserProfile() {
  const { id } = useLocalSearchParams(); 
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<any[]>([]);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get(`/api/user/${id}`);
      setProfile(res.data.profile);
    } catch (err) {
      console.error('Error fetching seller profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await axiosInstance.post('/login/getPostByUser', { userId: id });
      setUserPosts(res.data.posts || []);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Seller not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: profile.profilePicture?.startsWith('http')
            ? profile.profilePicture
            : `http://10.61.90.94:3000/uploads/${profile.profilePicture}`,
        }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.infoText}>📧 {profile.email}</Text>
      <Text style={styles.infoText}>📱 {profile.phone}</Text>
      <Text style={styles.wallet}>💰 Wallet: ₹{profile.walletBalance}</Text>

<TouchableOpacity
  onPress={async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const currentUser = userString ? JSON.parse(userString) : null;
      if (!currentUser || !currentUser.id) {
        Alert.alert('Error', 'You must be logged in to send a friend request.');
        return;
      }

      await axiosInstance.post('/login/sendFriendRequest', {
        fromUserId: currentUser.id,
        toUserId: id,
      });

      Alert.alert('Success', 'Friend request sent!');
    } catch (err: any) {
      console.error('Error sending request:', err);
      Alert.alert('Error', err?.response?.data?.message || 'Failed to send request');
    }
  }}
  style={{
    backgroundColor: '#50D9C4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 20,
  }}
>
  <Text style={{ color: '#0B0F1A', fontWeight: 'bold', fontSize: 16 }}>
    🤝 Send Friend Request
  </Text>
</TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📸 Past Posts</Text>
        {userPosts.length === 0 ? (
          <Text style={styles.infoText}>No posts yet.</Text>
        ) : (
          userPosts.map((post) => (
            <View key={post._id} style={styles.postCard}>
              {post.image && (
                <Image
                  source={{ uri: `http://10.61.90.94:3000/uploads/${post.image}` }}
                  style={styles.postImage}
                />
              )}
              <Text style={styles.postContent}>{post.desc || 'No content'}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#0B0F1A', // Dark background
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#00FFF7',
    shadowColor: '#00FFF7',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#50D9C4',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  wallet: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00FFD1',
    marginTop: 10,
    textShadowColor: '#00FFD155',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0F1A',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
  },
  section: {
    marginTop: 30,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#50D9C4',
    marginBottom: 12,
  },
  postCard: {
    backgroundColor: '#131A2B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2DE9EB55',
    shadowColor: '#2DE9EB',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  postContent: {
    fontSize: 14,
    color: '#E0E0E0',
  },
});

