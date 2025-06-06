import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axiosInstance from '../../app/axiosInstance';
import { FontAwesome } from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


type Post = {
  _id: string;
  image?: string;
  desc: string;
  cost: number;
  serviceId?: { name?: string };
  sellerId?: { name?: string };
};

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

const getProfile = async() =>{
    const router=useRouter();
    router.replace('/(auth)/profile');
  }
 

const searchPosts = async () => {
  console.log("reached serchpost");
    if (!searchQuery.trim()) {
      fetchAllPosts();
      return;
    }
    
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

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.searchContainer}>
  <TouchableOpacity style={styles.iconButton} onPress={getProfile}>
    <Ionicons name="person-circle-outline" size={28} color="#333" />
  </TouchableOpacity>

  <TextInput
    style={styles.searchInput}
    placeholder="Search services..."
    value={searchQuery}
    onChangeText={setSearchQuery}
    placeholderTextColor="#666"
  />

  <TouchableOpacity onPress={searchPosts} style={styles.searchButton}>
    <FontAwesome name="search" size={20} color="#fff" />
  </TouchableOpacity>
</View>

      {loading ? (
        <ActivityIndicator size="large" color="#007acc" />
      ) : posts.length === 0 ? (
        <Text style={styles.emptyText}>No posts available.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {posts.map((item) => (
            <View key={item._id} style={styles.card}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
              )}

              <Text style={styles.title}>{item.serviceId?.name || 'Service Name'}</Text>
              <Text style={styles.description}>{item.desc}</Text>

              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>sellerName:</Text>
                <Text style={styles.detailValue}>{item.sellerId?.name || 'Unknown'}</Text>
              </View>
             {item.dummyseller === 1 && item.dummysellerId && (
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

              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10, // spacing between items (if using newer RN versions)
    backgroundColor: '#fff',
  },
  iconButton: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#2F2F2F',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#003366',
    marginRight: 6,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0056b3',
  },
  referredText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#cc0066',
    marginTop: 4,
  },
  buyButton: {
    marginTop: 12,
    backgroundColor: '#ff6b81',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#ff4d6d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  emptyText: {
    marginTop: 40,
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },

});
