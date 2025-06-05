import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import axiosInstance from '../../app/axiosInstance';

export default function DisplayUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

 const handleAddFriend = async (user: { _id: any; name: any; }) => {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUser = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.profilePicture ? item.profilePicture : 'https://via.placeholder.com/100' }}
        style={styles.profileImage}
      />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>📧 {item.email}</Text>
        <Text style={styles.phone}>📱 {item.phone}</Text>
        <Text style={styles.wallet}>Wallet: ₹{item.walletBalance}</Text>
        <Text style={styles.date}>
          Joined: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => handleAddFriend(item)}
        >
          <Text style={styles.addFriendButton}>➕ Add Friend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#5DADE2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F4FA" />
      <Text style={styles.header}>All Registered Users</Text>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#E8F4FA',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A5276',
    textAlign: 'center',
    marginVertical: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F4FA',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D6EAF8',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#154360',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#566573',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#566573',
    marginBottom: 2,
  },
  wallet: {
    fontSize: 16,
    fontWeight: '600',
    color: '#148F77',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#839192',
  },
  buttonContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#58D68D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addFriendButton: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
