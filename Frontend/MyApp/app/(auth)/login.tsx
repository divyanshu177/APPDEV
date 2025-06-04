import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Use this for navigation


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  
  const handleLogin = () => {
    console.log('Logging in with:', email, password);
    axios.post('http://10.70.13.161:3000/login', { email, password })
      .then(async (response) => 
         {
          const token= response.data.token;
         
          if (token) {
            await AsyncStorage.setItem('userToken', token);
            console.log('Token stored successfully:', token);
             router.replace('/(home)');// Navigate to home on success
          console.log('Login successful:', response.data);
         }



        // Navigate to home on success
      })
      

  };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <View style={styles.container}>
//         {/* Left Login Form */}
//         <View style={styles.loginSection}>
//           <Text style={styles.logo}>KARC</Text>
//           <Text style={styles.welcome}>Hello!</Text>
//           <Text style={styles.subtitle}>Welcome back to the community</Text>

//           <TextInput
//             placeholder="Your email"
//             value={email}
//             onChangeText={setEmail}
//             style={styles.input}
//             placeholderTextColor="#999"
//           />
//           <TextInput
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//             style={styles.input}
//             placeholderTextColor="#999"
//           />

//           <TouchableOpacity>
//             <Text style={styles.forgotText}>Forgot Password?</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//             <Text style={styles.loginButtonText}>Log in</Text>
//           </TouchableOpacity>

//           <Text style={styles.signupText}>
//             Don’t have an account? <Text style={styles.signupLink}>Sign up</Text>
//           </Text>
//         </View>

//         {/* Right Image Section */}
//         <View style={styles.imageSection}>
// <Image
//   source={require('./loginBg.webp')}
//   style={styles.image}
//   resizeMode="cover"
// />
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// import { Dimensions } from 'react-native';

// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: width > 600 ? 'row' : 'column-reverse',
//   },
//   loginSection: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 32,
//     justifyContent: 'center',
//     borderTopLeftRadius: 40,
//     borderBottomLeftRadius: 40,
//   },
//   logo: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 30,
//     color: '#000',
//   },
//   welcome: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#000',
//   },
//   subtitle: {
//     fontSize: 14,
//     marginBottom: 30,
//     color: '#666',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   forgotText: {
//     textAlign: 'right',
//     color: '#007BFF',
//     marginBottom: 20,
//   },
//   loginButton: {
//     backgroundColor: '#000',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   loginButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   signupText: {
//     marginTop: 20,
//     textAlign: 'center',
//     color: '#555',
//   },
//   signupLink: {
//     color: '#007BFF',
//     fontWeight: 'bold',
//   },
//   imageSection: {
//     flex: 1,
//     backgroundColor: '#111',
//     borderTopRightRadius: 40,
//     borderBottomRightRadius: 40,
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
// });

// export default Login;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#EEDEF6" barStyle="dark-content" />

      <Animatable.Text animation="fadeInDown" style={styles.title}>
        Welcome Back
      </Animatable.Text>

      <Animatable.Text animation="fadeInDown" delay={200} style={styles.subtitle}>
        Sign in to your account
        {' '}{' '}
        
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
export default Login;