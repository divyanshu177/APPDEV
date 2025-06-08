import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios.post('http://10.81.16.90:3000/login', { email, password })
      .then(async (response) => {
        const { token, user } = response.data; // expect backend sends user info here

        if (token && user) {
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          console.log('Token and user stored:', token, user);
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
      <StatusBar backgroundColor="#EEDEF6" barStyle="dark-content" />
      <Animatable.Text animation="fadeInDown" style={styles.title}>
        Welcome Back
      </Animatable.Text>
      <Animatable.Text animation="fadeInDown" delay={200} style={styles.subtitle}>
        Sign in to your account {' '}
        <Text style={{ color: 'blue' }} onPress={() => router.push('/signup')}>
          Sign Up
        </Text>
      </Animatable.Text>
      <Animatable.View animation="fadeInUp" delay={400} style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#2F2F2F"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#2F2F2F"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEDEF6', justifyContent: 'center', paddingHorizontal: 30 },
  title: { fontSize: 34, fontWeight: 'bold', color: '#2F2F2F', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#2F2F2F', textAlign: 'center', marginBottom: 25 },
  form: { backgroundColor: '#CCE5E3', padding: 20, borderRadius: 20, elevation: 5 },
  input: { height: 50, borderColor: '#FEE1B6', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, backgroundColor: '#fff', marginBottom: 15, color: '#2F2F2F' },
  button: { backgroundColor: '#FEE1B6', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#2F2F2F', fontSize: 18, fontWeight: 'bold' },
});

export default Login;
