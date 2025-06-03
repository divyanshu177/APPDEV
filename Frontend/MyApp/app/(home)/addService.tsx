// // import { View, Text } from 'react-native';

// // export default function AddService() {
// //   return (
// //     <View style={{ flex:1, justifyContent: 'center', alignItems: 'center' }}>
// //       <Text>Add Service Tab</Text>
// //     </View>
// //   );
// // }

// import React, { useState } from 'react';
// import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// export default function AddServiceScreen() {

// interface FormData {
//     name: string;
//     stock: string;
//     description: string;
//     category: string;
//     image: string;
//     seller: string;
//     originalPrice: string;
//     reducedPrice: string;
//     dummyseller: string;
//     dummysellerSharePercent: string;
//     sellerSharePercent: string;
// }

// const [formData, setFormData] = useState<FormData>({
//     name: '',
//     stock: '',
//     description: '',
//     category: '',
//     image: '',
//     seller: '',
//     originalPrice: '',
//     reducedPrice: '',
//     dummyseller: '',
//     dummysellerSharePercent: '',
//     sellerSharePercent: '',
// });

// const handleChange = (key: keyof FormData, value: string) => {
//     setFormData({ ...formData, [key]: value });
// };

//   const handleSubmit = () => {
//     // Replace this with Axios POST later
//     Alert.alert('Service Added!', JSON.stringify(formData, null, 2));
    
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Add New Service</Text>

//       {Object.keys(formData).map((key, index) => (
//         <TextInput
//           key={index}
//           style={styles.input}
//           placeholder={key}
//           placeholderTextColor="#2F2F2F"
//           value={formData[key as keyof FormData]}
//           onChangeText={(text) => handleChange(key as keyof FormData, text)}
//         />
//       ))}

//       <TouchableOpacity onPress={handleSubmit} style={styles.button}>
//         <Text style={styles.buttonText}>Add Service</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#EEDEF6',
//     padding: 16,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#2F2F2F',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#CCE5E3',
//     backgroundColor: '#FEE1B6',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 14,
//     color: '#2F2F2F',
//   },
//   button: {
//     backgroundColor: '#2F2F2F',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#FEE1B6',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function AddServiceScreen() {
  interface FormData {
    name: string;
    stock: string;
    description: string;
    category: string;
    image: string;
    seller: string;
    originalPrice: string;
    reducedPrice: string;
    dummyseller: string;
    dummysellerSharePercent: string;
    sellerSharePercent: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    stock: '',
    description: '',
    category: '',
    image: '',
    seller: '',
    originalPrice: '',
    reducedPrice: '',
    dummyseller: '',
    dummysellerSharePercent: '',
    sellerSharePercent: '',
  });

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    Alert.alert('Service Added!', JSON.stringify(formData, null, 2));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Service</Text>

      {Object.keys(formData).map((key, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          placeholderTextColor="#66788a"
          value={formData[key as keyof FormData]}
          onChangeText={(text) => handleChange(key as keyof FormData, text)}
        />
      ))}

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Add Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0fa',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2a3f5f',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cddff6',
    backgroundColor: '#f4f8ff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    color: '#1f2d3d',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#007acc',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007acc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});

