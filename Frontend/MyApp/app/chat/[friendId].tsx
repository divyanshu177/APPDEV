import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';

const socket = io("http://10.61.89.72:3000", {
  transports: ['websocket'], // optional but recommended
});

type Message = {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp?: string;
};

export default function ChatScreen() {
  const { friendId, friendName } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const storedId = await AsyncStorage.getItem('userId');
      console.log('Fetched userId:', storedId);
      setUserId(storedId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const getMessages = async () => {
      try {
        const res = await axiosInstance.get(`/login/getMessages/${friendId}`);
        setMessages(res.data.messages || []);
      } catch (error) {
        console.error('Failed to load messages', error);
      }
    };

    getMessages();

    socket.emit('joinRoom', { userId });

    socket.on('receiveMessage', (message: Message) => {
      if (message.sender === friendId) {
        setMessages((prev) => [message, ...prev]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userId]);

  const sendMessage = async () => {

    if (!newMessage.trim() || !userId) return;
    const friendIdStr = String(friendId);
    const userIdStr = String(userId);

    try {
      console.log('Sending:', { senderId: userId, receiverId: friendId, content: newMessage });

      await axiosInstance.post('/login/sendMessage', {
        receiverId: friendId,
        content: newMessage,
      });

      socket.emit('sendMessage', {
        senderId: userId,
        receiverId: friendId,
        content: newMessage,
      });

      setMessages((prev) => [
        {
          sender: userId,
          receiver: friendId as string,
          content: newMessage,
        },
        ...prev,
      ]);

      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(home)/friends')}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Chat with {friendName}</Text>

      {userId ? (
        <FlatList
          ref={flatListRef}
          data={messages}
          inverted
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => {
            const isSender = item.sender === userId;
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
      ) : (
        <Text style={{ color: '#fff', textAlign: 'center' }}>Loading messages...</Text>
      )}

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
    backgroundColor: '#2F2F2F',
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEE1B6',
    marginBottom: 10,
    textAlign: 'center',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    maxWidth: '75%',
    borderRadius: 10,
  },
  sender: {
    backgroundColor: '#FEE1B6',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  receiver: {
    backgroundColor: '#EEDEF6',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: '#2F2F2F',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#FEE1B6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendText: {
    color: '#2F2F2F',
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FEE1B6',
    borderRadius: 6,
    marginBottom: 8,
  },
  backButtonText: {
    color: '#2F2F2F',
    fontWeight: '600',
    fontSize: 16,
  },
});