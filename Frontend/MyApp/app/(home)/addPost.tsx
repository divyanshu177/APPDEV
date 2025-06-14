import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axiosInstance from '../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ServicesScreen() {
  const [services, setServices] = useState([]);
  const router=useRouter();

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

  const handleAddPost = async (item) => {
    const id=await AsyncStorage.getItem('userId');
    console.log(id);
    
    const payload = {
      serviceId: item._id,
      sellerId: item.seller,          
      desc: item.description,         
      image: item.image,
      dummySellerId:id, 
      serviceName: item.name          
    };

    try {
      console.log("sending request")
      console.log(payload);
      const response = await axiosInstance.post('/login/createPost', payload);
      Alert.alert('Success', 'Post added successfully');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error adding post:', error);
      Alert.alert('Error', 'Failed to add post');
    }
  };

  const create= () =>{
     router.replace("/createPost");
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.originalPrice}</Text>
      <Button title="Add Post" onPress={() => handleAddPost(item) } />
    </View>
  );

  return (
    <View>
      <Text>Your Orders</Text>
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
  container: { padding: 10 },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  price: { marginVertical: 6, fontSize: 16, color: '#333' },
});
