import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import axiosInstance from '../../app/axiosInstance';
import { useRouter } from 'expo-router';

type Post = {
  _id: string;
  image?: string;
  desc: string;
  cost: number;
  serviceId?: { name?: string };
  sellerId?: { name?: string };
  dummyseller?: number;
  dummysellerId?: { name?: string; _id?: string };
};

export default function YourPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    try {
      const response = await axiosInstance.get('/login/getMyPosts');
      const data = response.data;
      setPosts(data.posts);
    } catch (error) {
      console.log('Error fetching your posts', error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    getPosts();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
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
                <Text style={styles.detailLabel}>Seller Name:</Text>
                <Text style={styles.detailValue}>{item.sellerId?.name || 'Unknown'}</Text>
              </View>

              {item.dummyseller === 1 && item.dummysellerId && (
                <View style={styles.detailsRow}>
                  <Text style={styles.detailLabel}>Dummy Seller:</Text>
                  <Text style={styles.detailValue}>
                    {item.dummysellerId?.name || item.dummysellerId?._id || 'Unknown'}
                  </Text>
                </View>
              )}

              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Cost:</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
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
