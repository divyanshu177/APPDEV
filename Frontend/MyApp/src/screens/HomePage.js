import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://'); // Replace with your API
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.role}>{item.title}:</Text>
      <Text style={styles.poem}>{item.tagline}</Text>
      {item.description && <Text style={styles.description}>{item.description}</Text>}
      {item.hashtags && <Text style={styles.hashtags}>{item.hashtags}</Text>}
      <Text style={styles.price}>PRICE: {item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2ff',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff7e6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007acc',
    marginBottom: 4,
  },
  role: {
    fontWeight: 'bold',
    color: '#5a5a5a',
  },
  poem: {
    marginBottom: 8,
    fontStyle: 'italic',
  },
  description: {
    marginBottom: 6,
  },
  hashtags: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  price: {
    fontWeight: 'bold',
    color: '#d17c00',
  },
});
