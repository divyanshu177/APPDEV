

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ImageBackground
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';
import axios from 'axios';

export default function Signup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    axios.post('http://10.61.90.94:3000/register', { name, phone, email, password })
      .then(response => {
        router.replace('/login');
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/signUp.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />

      <View style={styles.overlay} />

      <Animatable.View animation="fadeInDown" style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => router.replace('/login')}>
            Login
          </Text>
        </Text>

        <Animatable.View animation="fadeInUp" delay={300} style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#bbb"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            placeholderTextColor="#bbb"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  container: {
    paddingHorizontal: 30,
   marginBottom: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 25,
  },
  link: {
    color: '#4EF1E3',
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    // backdropFilter: 'blur(10px)', // Note: works on web; not natively in RN
  },
  input: {
    height: 48,
    borderColor: '#4EF1E3',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginBottom: 15,
    color: '#fff',
  },
  button: {
    backgroundColor: '#4EF1E3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#4EF1E3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
