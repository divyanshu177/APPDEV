import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, FlatList,
  Image, SafeAreaView, StatusBar, TouchableOpacity, TextInput,
} from 'react-native';
import axiosInstance from '../axiosInstance';

export default function DisplayUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const handleAddFriend = async (user: { _id: any; name: any }) => {
    try {
      const response = await axiosInstance.post('/login/sendFriendRequest', {
        receiverId: user._id,
      });
      console.log('Friend request response:', response.data);
      alert(`Friend request sent to ${user.name}`);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const searchUsers = async (searchText: string) => {
    if (!searchText.trim()) {
      fetchUsers();
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get('/login/searchUser', {
        params: { query: searchText.trim() },
      });
      console.log('Search results:', response.data);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/login/getAllUsers');
      console.log('Fetched users:', response.data);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const renderUser = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.profilePicture || 'https://via.placeholder.com/100' }}
        style={styles.profileImage}
      />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>📧 {item.email}</Text>
        <Text style={styles.phone}>📱 {item.phone}</Text>
        <Text style={styles.date}>Joined: {new Date(item.createdAt).toLocaleDateString()}</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleAddFriend(item)}>
          <Text style={styles.addFriendButton}>➕ Add Friend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />
      <Text style={styles.header}>All Registered Users</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search users..."
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => searchUsers(query)}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => searchUsers(query)}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#a78bfa" />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#a78bfa',
    textAlign: 'center',
    marginVertical: 12,
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#a78bfa33',
  },
  profileImage: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#2e2e3e', marginRight: 16,
    borderWidth: 2, borderColor: '#a78bfa66',
  },
  userInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: '700', color: '#f0e6ff', marginBottom: 4 },
  email: { fontSize: 14, color: '#c0c0cc', marginBottom: 2 },
  phone: { fontSize: 14, color: '#c0c0cc', marginBottom: 2 },
  wallet: { fontSize: 16, fontWeight: '600', color: '#4afcb1', marginBottom: 4 },
  date: { fontSize: 12, color: '#888', marginBottom: 6 },
  buttonContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#a78bfa',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  addFriendButton: { color: '#1a1a2e', fontSize: 14, fontWeight: '700' },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#1f1f2e',
    borderWidth: 1,
    borderColor: '#a78bfa55',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 8,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
  },
  searchButtonText: {
    fontSize: 18,
    color: '#a78bfa',
  },
});
