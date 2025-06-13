



import io from 'socket.io-client';
import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
const router = useRouter();
const socket = useRef<any>(null);


type Message = {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
};

export default function ChatScreen() {
  const { friendId, friendName } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const getMessages = async () => {
    try {
      const res = await axiosInstance.get(`/login/getMessages/${friendId}`);
      console.log("Friend ID:", friendId);

      setMessages(res.data.messages || []);
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setUserId(JSON.parse(user)._id);
      }
    };
    fetchUser();
  }, []);
  
  useEffect(() => {
  socket.current = io('http:// 10.61.4.86:3000'); // replace with your actual server URL
  socket.current.emit('join', { userId: friendId }); // join room or user-specific event

  socket.current.on('newMessage', (message: Message) => {
    setMessages(prev => [message, ...prev]); // new message at top (FlatList is inverted)
  });

  return () => {
    socket.current.disconnect();
  };
  }, []);


  const sendMessage = async () => {
    if (!newMessage.trim()) return;

  try {
    await axiosInstance.post('/login/sendMessage', {
      receiverId: friendId,
      content: newMessage,
    });

    socket.current.emit('sendMessage', {
      receiverId: friendId,
      content: newMessage,
    });

    setNewMessage('');
    getMessages();
  } catch (err) {
    console.error('Failed to send message', err);
  }
};

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(home)/friends')}>
  <Text style={styles.backButtonText}>← </Text>
</TouchableOpacity>

      <Text style={styles.header}>Chat with {friendName}</Text>

    <FlatList
  ref={flatListRef}
  data={messages}
  inverted
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => {
    const isSender = item.sender === friendId;
    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.sender : styles.receiver,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    );
  }}
  contentContainerStyle={{ paddingBottom: 10 }}
  
/>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FEE1B6',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: '#FEE1B6AA',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
  },
  messageContainer: {
    padding: 12,
    marginVertical: 6,
    maxWidth: '75%',
    borderRadius: 18,
    shadowColor: '#FEE1B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sender: {
    backgroundColor: '#FEE1B6',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  receiver: {
    backgroundColor: '#D1C2FA',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: '#1E1E1E',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#2B2B2B',
    padding: 12,
    borderRadius: 24,
    marginRight: 10,
    color: '#FFF',
    borderColor: '#888',
    borderWidth: 1,
  },
  sendButton: {
    backgroundColor: '#FEE1B6',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    shadowColor: '#FEE1B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  sendText: {
    color: '#1E1E1E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FEE1B6',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#FEE1B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  backButtonText: {
    color: '#1E1E1E',
    fontWeight: '600',
    fontSize: 16,
  },
});
