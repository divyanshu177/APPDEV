// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, Image } from 'react-native';
// import axiosInstance from '../../app/axiosInstance'; // Adjust path

// type Post = {
//   _id: string;
//   image?: string;
//   desc: string;
//   cost: number;
//   serviceId?: { name?: string };
//   sellerId?: { name?: string };
// };

// const HomePage = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axiosInstance.get('/login/displayPost');
//         setPosts(response.data.posts);
//       } catch (error) {
//         setPosts([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPosts();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#007acc" />
//       ) : posts.length === 0 ? (
//         <Text style={styles.emptyText}>No posts available.</Text>
//       ) : (
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           {posts.map((item) => (
//             <View key={item._id} style={styles.card}>
//               {item.image && (
//                 <Image
//                   source={{ uri: item.image }}
//                   style={styles.postImage}
//                   resizeMode="cover"
//                 />
//               )}
//               <Text style={styles.serviceName}>{item.serviceId?.name || 'Service Name'}</Text>
//               <Text style={styles.description}>{item.desc}</Text>
//               <View style={styles.footer}>
//                 <Text style={styles.sellerName}>{item.sellerId?.name || 'Seller'}</Text>
//                 <Text style={styles.cost}>₹{item.cost}</Text>
//               </View>
//             </View>
//           ))}
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// };

// export default HomePage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e6f0fa', // light blue background for screen
//   },
//   scrollContainer: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   card: {
//     backgroundColor: '#d0e7ff', // light blue card background
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: '#4a90e2', // blue shadow color
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   postImage: {
//     width: '100%',
//     height: 180,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   serviceName: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#003d99', // dark blue text
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 15,
//     color: '#003366', // slightly lighter blue text
//     marginBottom: 12,
//     lineHeight: 22,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   sellerName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#0059cc', // medium blue
//   },
//   cost: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#004080', // dark blue for price
//   },
//   emptyText: {
//     marginTop: 40,
//     fontSize: 18,
//     color: '#888',
//     textAlign: 'center',
//   },
// });


import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, Image, TextInput, TouchableOpacity } from 'react-native';
import axiosInstance from '../../app/axiosInstance'; 
import { FontAwesome } from '@expo/vector-icons';// Adjust path

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
    } catch (error) {
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
    } catch (error) {
      setPosts([]); // Show "No posts available" if nothing found
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
         {/* 🔍 Search Bar */}
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
                <Image
                  source={{ uri: item.image }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.serviceName}>{item.serviceId?.name || 'Service Name'}</Text>
              <Text style={styles.description}>{item.desc}</Text>
              <View style={styles.footer}>
                <Text style={styles.sellerName}>{item.sellerId?.name || 'Seller'}</Text>
                <Text style={styles.cost}>₹{item.cost}</Text>
              </View>
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
    backgroundColor: '#e6f0fa', // light blue background for screen
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    color: '#333',
  },
   searchButton: {
    backgroundColor: '#007acc',
    padding: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#d0e7ff', // light blue card background
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#4a90e2', // blue shadow color
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003d99', // dark blue text
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#003366', // slightly lighter blue text
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0059cc', // medium blue
  },
  cost: {
    fontSize: 16,
    fontWeight: '700',
    color: '#004080', // dark blue for price
  },
  emptyText: {
    marginTop: 40,
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
});
