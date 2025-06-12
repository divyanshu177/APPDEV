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
import axiosInstance from '../axiosInstance';
import { FontAwesome } from '@expo/vector-icons';

type Post = {
  dummysellerId: any;
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

  const searchPosts = async () => {
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
    backgroundColor: '#0f0f1a',
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#4c4cff55',
    shadowColor: '#4c4cff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#4c4cff',
    padding: 10,
    borderRadius: 8,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderColor: '#4c4cff40',
    borderWidth: 1,
    shadowColor: '#4c4cff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4c4cff88',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#cfcfcf',
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
    color: '#9d9dff',
    marginRight: 6,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  referredText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#ffa3e0',
    marginTop: 4,
  },
  buyButton: {
    marginTop: 12,
    backgroundColor: '#7f00ff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#bb86fc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyText: {
    marginTop: 40,
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
  },
});
