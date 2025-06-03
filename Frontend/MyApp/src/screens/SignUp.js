import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Import navigation hook
import * as Animatable from 'react-native-animatable';

const Signup = () => {
  const navigation = useNavigation(); // ✅ Access navigation
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignup = () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Simulate success
    Alert.alert('Success', 'You are successfully registered on Earnn!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Login'), // ✅ Navigate to Login screen
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.Text animation="fadeInDown" duration={800} delay={100} style={styles.heading}>
          Create Account
        </Animatable.Text>

        <Animatable.View animation="fadeIn" delay={200}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={300}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={400}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={500}>
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </Animatable.View>

        <Animatable.View animation="zoomIn" delay={600}>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={700}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 25 }}>
            <Text style={styles.note}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1e1e2f',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2e2e42',
    color: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6c63ff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  note: {
    color: '#aaa',
    fontSize: 14,
  },
  link: {
    color: '#6c63ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Signup;
