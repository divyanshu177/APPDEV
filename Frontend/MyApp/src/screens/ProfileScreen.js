import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log('Logging in with:', email, password);
    navigation.navigate('Dashboard'); // Make sure "Dashboard" is registered in navigator
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#EEDEF6" barStyle="dark-content" />

      <Animatable.Text animation="fadeInDown" style={styles.title}>
        Welcome Back
      </Animatable.Text>

      <Animatable.Text animation="fadeInDown" delay={200} style={styles.subtitle}>
        Sign in to your account{' '}
        <Text 
          style={styles.signupLink}
          onPress={() => navigation.navigate('Signup')}
        >
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
  signupLink: {
    color: '#007AFF',
    fontWeight: 'bold',
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
