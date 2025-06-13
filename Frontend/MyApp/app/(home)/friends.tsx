import { useRouter } from 'expo-router';

const router = useRouter();

import { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axiosInstance from '../axiosInstance';

type FriendRequest = {
  _id: string;
  name: string;
  email: string;
};

export default function FriendRequestsScreen() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFriends = async () => {
    try {
      const res = await axiosInstance.get('/login/getFriends');
      setFriends(res.data.friends || []);
    } catch (err) {
      setError('Failed to fetch friends');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const fetchFriendRequests = async () => {
    try {
      const res = await axiosInstance.get('/login/getFriendRequests');
      setFriendRequests(res.data.requests || []);
    } catch (err) {
      setError('Failed to fetch friend requests');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const handleAccept = async (senderId: string) => {
    try {
      await axiosInstance.post('/login/acceptFriendRequest', { senderId });
      Alert.alert('Success', 'Friend request accepted');
      fetchFriendRequests();
      fetchFriends();
    } catch (err) {
      Alert.alert('Error', 'Could not accept request');
      console.error(err);
    }
  };

  const handleReject = async (senderId: string) => {
    try {
      await axiosInstance.post('/login/rejectFriendRequest', { senderId });
      Alert.alert('Rejected', 'Friend request rejected');
      fetchFriendRequests();
    } catch (err) {
      Alert.alert('Error', 'Could not reject request');
      console.error(err);
    }
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FEE1B6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Friends</Text>
      <FlatList
  data={friends}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => router.push({ pathname: '/chat/[friendId]', params: { friendId: item._id, friendName: item.name } })}
      >
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  )}
  ListEmptyComponent={<Text style={styles.emptyText}>No friends yet.</Text>}
/>

      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.heading}>Friend Requests</Text>
      </View>

      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item._id)}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item._id)}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No requests found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Deep black background
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B084FF', // Soft neon purple
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#1A1A1D', // Dark card base
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#B084FF', // Neon purple border
    shadowColor: '#B084FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EDEDED',
  },
  email: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#2EE5AC', // Soft neon green
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: '#2EE5AC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  rejectButton: {
    backgroundColor: '#FF5C8A', // Neon pink
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: '#FF5C8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#0A0A0A',
    fontWeight: '700',
    fontSize: 14,
  },
  error: {
    color: '#FF4D4F',
    fontSize: 16,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#444', // Subtle separator
    marginRight: 8,
  },
  chatButton: {
    backgroundColor: '#7F5FFF', // Neon blue-violet
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 6,
    shadowColor: '#7F5FFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
