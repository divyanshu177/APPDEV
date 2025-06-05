
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
import axiosInstance from '../../app/axiosInstance';

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
    backgroundColor: '#2F2F2F',
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: '#2F2F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FEE1B6',
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#CCE5E3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEE1B6',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F2F2F',
  },
  email: {
    fontSize: 14,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#FEE1B6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  rejectButton: {
    backgroundColor: '#EEDEF6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#2F2F2F',
    fontWeight: '600',
  },
  error: {
    color: '#FEE1B6',
    fontSize: 16,
  },
  emptyText: {
    color: '#EEDEF6',
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
    backgroundColor: '#FEE1B6',
    marginRight: 8,
  },
});
