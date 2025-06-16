import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  ActivityIndicator, Image, TextInput, TouchableOpacity,
} from 'react-native';
import axiosInstance from '../axiosInstance';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Post = {
  dummysellerId: any;
  _id: string;
  image?: string;
  desc: string;
  cost: number;
  serviceId?: { name?: string };
  sellerId?: { name?: string; _id?: string };
};

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
 

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/login/displayPost');
      setPosts(response.data.posts);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = () => router.replace('/(prof)/profile');

  const searchPosts = async () => {
    if (!searchQuery.trim()) return fetchAllPosts();
    setLoading(true);
    try {
      const response = await axiosInstance.get('/login/searchPost', {
        params: { serviceName: searchQuery.trim() },
      });
      setPosts(response.data.posts);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllPosts(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGlow} />
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={getProfile}>
          <Ionicons name="person-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={searchPosts} style={styles.searchButton}>
          <FontAwesome name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#a78bfa" />
      ) : posts.length === 0 ? (
        <Text style={styles.emptyText}>No posts available.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollWrapper}>
          <View style={styles.postContainerWrapper}>
            {posts.map((item) => (
              <View key={item._id} style={styles.card}>
                {item.image && (
                  <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
                )}
                <Text style={styles.title}>{item.serviceId?.name || 'Service Name'}</Text>
                <Text style={styles.description}>{item.desc}</Text>

                <View style={styles.detailsRow}>
  <Text style={styles.detailLabel}>sellerName:</Text>




  <TouchableOpacity onPress={() => router.push(`/(prof)/user/${item.sellerId?._id}`)}>
    <Text style={[styles.detailValue, styles.linkText]}>
      {item.sellerId?.name || 'Unknown'}
    </Text>
  </TouchableOpacity>
</View>


                {item.dummysellerId === 1 && item.dummysellerId && (
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailLabel}>dummyseller:</Text>
                    <Text style={styles.detailValue}>
                      {item.dummysellerId?.name || item.dummysellerId?._id || 'Unknown'}
                    </Text>
                  </View>
                )}

                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>cost -</Text>
                  <Text style={styles.detailValue}>₹{item.cost}</Text>
                </View>

                {item.sellerId?.name === 'dummyseller' && (
                  <Text style={styles.referredText}>Referred by: dummyseller</Text>
                )}

                <TouchableOpacity
  style={[styles.buyButton, { marginTop: 12 }]}
 onPress={() => router.push({
  pathname: '/(prof)/PaymentScreen',
  params: { 
    fee: item.cost 
  }
})}
>
  <Text style={styles.buyButtonText}>BUY NOW</Text>
</TouchableOpacity>

            </View>
          ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', position: 'relative' },
  backgroundGlow: { ...StyleSheet.absoluteFillObject, backgroundColor: '#a78bfa11', zIndex: -1 },
  iconButton: { padding: 6, marginRight: 8, borderRadius: 20, backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  searchContainer: {
    flexDirection: 'row', margin: 16, backgroundColor: '#1c1c2b', borderRadius: 12,
    alignItems: 'center', paddingHorizontal: 10, borderWidth: 1, borderColor: '#a78bfa',
    shadowColor: '#a78bfa', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4,
    shadowRadius: 6, elevation: 5
  },
  searchInput: { flex: 1, fontSize: 16, color: '#fff' },
  searchButton: {
    backgroundColor: '#a78bfa', padding: 10, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center'
  },
  scrollWrapper: { padding: 16, paddingBottom: 32, alignItems: 'center' },
  postContainerWrapper: {
  width: '100%',
  padding: 0,           // removed inner padding
  borderWidth: 0,       // remove border
  backgroundColor: 'transparent',  // no background
  shadowColor: 'transparent',      // no shadow
},

  card: {
    backgroundColor: '#1c1c2b', borderRadius: 16, padding: 16,
    marginBottom: 20, borderColor: '#a78bfa88', borderWidth: 1,
    shadowColor: '#a78bfa', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6
  },
  postImage: {
    width: '100%', height: 180, borderRadius: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#c4b5fd'
  },
  title: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 6 },
  description: { fontSize: 14, color: '#d1d5db', marginBottom: 12, lineHeight: 20 },
  detailsRow: { flexDirection: 'row', marginBottom: 6 },
  detailLabel: { fontSize: 15, fontWeight: '500', color: '#c4b5fd', marginRight: 6 },
  detailValue: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  referredText: { fontSize: 13, fontStyle: 'italic', color: '#f472b6', marginTop: 4 },
  buyButton: {
    marginTop: 12, backgroundColor: '#a78bfa', paddingVertical: 12,
    borderRadius: 12, alignItems: 'center',
    shadowColor: '#a78bfa', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6
  },
  buyButtonText: {
    fontSize: 16, fontWeight: 'bold', color: '#1f1f2e',
    textTransform: 'uppercase', letterSpacing: 1
  },
  emptyText: { marginTop: 40, fontSize: 18, color: '#aaa', textAlign: 'center' },
  linkText: { color: '#60a5fa', textDecorationLine: 'underline' },
});
