
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const videoUrl = 'https://videos.pexels.com/video-files/3141210/3141210-sd_640_360_25fps.mp4';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios.post('https://appdev-production-bb12.up.railway.app/login', { email, password })
      .then(async (response) => {
        const { token, user } = response.data;
        if (token && user) {
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          router.replace('/(home)');
        } else {
          alert('Invalid login response from server');
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        alert('Login failed, please check credentials.');
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Video
        source={{ uri: videoUrl }}
        style={StyleSheet.absoluteFillObject}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      <View style={styles.overlay} />

      <Animatable.View animation="fadeInUp" delay={200} style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to your account{' '}
          <Text style={styles.link} onPress={() => router.push('/signup')}>
            Sign Up
          </Text>
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#DDD"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#DDD"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  backgroundVideo: {
  ...StyleSheet.absoluteFillObject,
},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#EEE',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    color: '#50D9C4',
    fontWeight: '600',
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 20,
    borderRadius: 18,
     borderColor: 'rgba(255,255,255,0.2)',
  borderWidth: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 8,
  },
  input: {
    height: 50,
    borderColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
    color: '#FFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#50D9C4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#1E1E1E',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;

