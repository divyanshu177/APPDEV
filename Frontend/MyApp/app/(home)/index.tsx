import React, { useEffect, useState } from 'react';
import {
  View, Text, SafeAreaView, ActivityIndicator, Image,
  TextInput, TouchableOpacity, FlatList, StyleSheet
} from 'react-native';
import axiosInstance from '../axiosInstance';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
const BASE_URL = 'https://appdev-production-bb12.up.railway.app';

type Post = {
  _id: string;
  images?: string[];
  desc: string;
  cost: number;
  review?: string;
  serviceId?: { name?: string; _id?: string };
  sellerId?: { name?: string; _id?: string };
  dummysellerId?: { name?: string; _id?: string };
};

type ImageSliderProps = {
  images: string[];
};

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => (
  <FlatList
    data={images}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(_, index) => index.toString()}
    renderItem={({ item }) =>
      typeof item === 'string' ? (
        <Image
          source={{ uri: item.startsWith('http') ? item : `${BASE_URL}/${item}` }}
          style={styles.postImage}
        />
      ) : null
    }
  />
);

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
      console.log('Posts:', response.data.posts);
    } catch (error) {
      console.error('Fetch all posts error:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async () => {
    if (!searchQuery.trim()) return fetchAllPosts();
    setLoading(true);
    try {
      const response = await axiosInstance.get('/login/searchPost', {
        params: { serviceName: searchQuery.trim() },
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Search posts error:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllPosts(); }, []);

  const goToProfile = () => router.replace('/(prof)/profile');

  const renderPost = ({ item }: { item: Post }) => {
    const isDummy = Boolean(item.dummysellerId);
    const images = item.images[0]; 

    return (
      <View style={[styles.card, isDummy && styles.dummyCard]}>
     {Array.isArray(images) && images.length > 0 && <ImageSlider images={images} />}


        <Text style={styles.title}>{item.serviceId?.name || 'Service'}</Text>
        <Text style={styles.description}>{item.desc}</Text>

        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Seller:</Text>
          <TouchableOpacity onPress={() => router.push(`/(prof)/user/${item.sellerId?._id}`)}>
            <Text style={[styles.detailValue, styles.linkText]}>
              {item.sellerId?.name || 'Unknown'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Cost:</Text>
          <Text style={styles.detailValue}>₹{item.cost}</Text>
        </View>

        {isDummy && (
          <>
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Referred by:</Text>
              <Text style={styles.detailValue}>{item.dummysellerId?.name || 'Bot'}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Review:</Text>
              <Text style={styles.detailValue}>{item.review || 'N/A'}</Text>
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() =>
            router.push({
              pathname: '/(prof)/PaymentScreen',
              params: {
                cost: item.cost.toString(),
                sellerId: item.sellerId?._id,
                serviceId: item.serviceId?._id,
                dummySellerId: item.dummysellerId?._id,
              },
            })
          }
        >
          <Text style={styles.buyButtonText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGlow} />

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={goToProfile}>
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
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.scrollWrapper}
          renderItem={renderPost}
        />
      )}
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  backgroundGlow: { ...StyleSheet.absoluteFillObject, backgroundColor: '#a78bfa11', zIndex: -1 },
  searchContainer: {
    flexDirection: 'row', margin: 16, backgroundColor: '#1c1c2b', borderRadius: 12,
    alignItems: 'center', paddingHorizontal: 10, borderWidth: 1, borderColor: '#a78bfa',
  },
  iconButton: {
    padding: 6, marginRight: 8, borderRadius: 20, backgroundColor: '#2a2a2a',
  },
  searchInput: { flex: 1, fontSize: 16, color: '#fff' },
  searchButton: {
    backgroundColor: '#a78bfa', padding: 10, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center'
  },
  scrollWrapper: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#1c1c2b', borderRadius: 16, padding: 16,
    marginBottom: 20, borderColor: '#a78bfa55', borderWidth: 1,
  },
  dummyCard: {
    backgroundColor: '#2c1d44', borderColor: '#c084fc',
  },
  postImage: {
    width: 250,
    height: 180,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#c4b5fd',
    resizeMode: 'cover',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 6 },
  description: { fontSize: 14, color: '#d1d5db', marginBottom: 12 },
  detailsRow: { flexDirection: 'row', marginBottom: 6 },
  detailLabel: { fontSize: 15, fontWeight: '500', color: '#c4b5fd', marginRight: 6 },
  detailValue: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  linkText: { color: '#60a5fa', textDecorationLine: 'underline' },
  buyButton: {
    marginTop: 12, backgroundColor: '#a78bfa', paddingVertical: 12,
    borderRadius: 10, alignItems: 'center'
  },
  buyButtonText: {
    fontSize: 16, fontWeight: 'bold', color: '#1f1f2e',
    textTransform: 'uppercase',
  },
  emptyText: { marginTop: 40, fontSize: 18, color: '#aaa', textAlign: 'center' },
});
