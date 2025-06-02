import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { router, useNavigation } from 'expo-router';
import axios from 'axios';


export default function Signup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 


  const handleSignup = () => {
    console.log('Signing up with:', { name, phone, email, password });
    axios.post('http://10.61.3.92:3000/register', { name, phone, email, password })
      .then(response => {
        console.log('Signup successful:', response.data);
        // Navigate to login on success
       router.replace('/login'); // Use replace to avoid going back to signup

      })
      
    // You can add validation here
    router.replace('/login'); // Go back to login
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#EEDEF6" barStyle="dark-content" />

      <Animatable.Text animation="fadeInDown" style={styles.title}>
        Create Account
      </Animatable.Text>

      <Animatable.Text animation="fadeInDown" delay={200} style={styles.subtitle}>
        Already have an account?{' '}
        <Text style={{ color: 'blue' }} onPress={() => router.replace('/login')}>
          Login
        </Text>
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={400} style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#2F2F2F"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          placeholderTextColor="#2Ff2F2F"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#2F2F2F"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#2F2F2F"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEDEF6',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2F2F2F',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#2F2F2F',
    textAlign: 'center',
    marginBottom: 25,
  },
  form: {
    backgroundColor: '#CCE5E3',
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#FEE1B6',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    color: '#2F2F2F',
  },
  button: {
    backgroundColor: '#FEE1B6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#2F2F2F',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
