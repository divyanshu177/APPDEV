import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axiosInstance from '../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ServicesScreen() {
  const [services, setServices] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/login/getOrders');
        setServices(response.data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const create = async (item) => {
    router.push({
      pathname: "../(prof)/createPost",
      params: item
    });
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.originalPrice}</Text>
      <Button title="Add Post" onPress={() => create(item)} color="#4FC3F7" />
    </View>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Your Orders</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#2c2c54', // Dark Violet background
    paddingTop: 40,
  },
  container: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#66FFFF', // Sky Blue
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#3d3d5c', // Deep Purple Card
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    color: '#66FFFF', // Sky Blue price
    marginBottom: 10,
  }
});
