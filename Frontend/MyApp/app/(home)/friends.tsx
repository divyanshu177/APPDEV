import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axiosInstance from '../../app/axiosInstance'; // Adjust path

export default function FriendRequestsScreen() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFriendRequests = async () => {
    try {
      const res = await axiosInstance.get('/login/getFriendRequests');
      console.log('Friend requests:', res.data);
      setFriendRequests(res.data.requests || []);
    } catch (err) {
      setError('Failed to fetch friend requests');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const handleAccept = async (senderId) => {
    try {
      await axiosInstance.post('/login/acceptFriendRequest', { senderId });
      Alert.alert('Success', 'Friend request accepted');
      fetchFriendRequests(); // refresh list
    } catch (err) {
      Alert.alert('Error', 'Could not accept request');
      console.error(err);
    }
  };

  const handleReject = async (senderId) => {
    try {
      await axiosInstance.post('/login/rejectFriendRequest', { senderId });
      Alert.alert('Rejected', 'Friend request rejected');
      fetchFriendRequests(); // refresh list
    } catch (err) {
      Alert.alert('Error', 'Could not reject request');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
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
      <Text style={styles.title}>Friend Requests</Text>
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAccept(item._id)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleReject(item._id)}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No requests found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  name: { fontSize: 16, fontWeight: '600' },
  email: { fontSize: 14, color: '#555' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: { color: 'red', fontSize: 16 },
});
