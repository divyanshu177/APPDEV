// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from './src/screens/HomeScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import Login from './src/screens/Login';
// import SignUp from './src/screens/SignUp';
// import { Ionicons } from '@expo/vector-icons'; // Icon library
// import HomePage from './src/screens/HomePage'; // Assuming HomePage is another screen component

// const Tab = createBottomTabNavigator();

// // export default function App() {
// //   return (
// //     <NavigationContainer>
// //       <Tab.Navigator
// //         screenOptions={({ route }) => ({
// //           headerShown: false,
// //           tabBarIcon: ({ focused, color, size }) => {
// //             let iconName;

// //             if (route.name === 'Welcome') {
// //               iconName = focused ? 'home' : 'home-outline';
// //             } else if (route.name === 'Profile') {
// //               iconName = focused ? 'person' : 'person-outline';
// //             } else if (route.name === 'Login') {
// //               iconName = focused ? 'log-in' : 'log-in-outline';
// //             } else if (route.name === 'SignUp') {
// //               iconName = focused ? 'person-add' : 'person-add-outline';
// //             }

// //             return <Ionicons name={iconName} size={size} color={color} />;
// //           },
// //           tabBarActiveTintColor: '#2F2F2F',
// //           tabBarInactiveTintColor: 'gray',
// //         })}
// //       >
// //         <Tab.Screen name="Welcome" component={HomeScreen} />
// //         <Tab.Screen name="Profile" component={ProfileScreen} />
       
// //         <Tab.Screen name="HomePage" component={HomePage} />
// //       </Tab.Navigator>
// //     </NavigationContainer>
// //   );
// // }


// // App.tsx
// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Button, View, Text } from 'react-native';

// const Stack = createNativeStackNavigator();

// function HomeScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 24 }}>Home Screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details', { itemId: 42 })}
//       />
//     </View>
//   );
// }

// function DetailsScreen({ route, navigation }) {
//   // Get params passed from HomeScreen
//   const { itemId } = route.params;

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 24 }}>Details Screen</Text>
//       <Text>Item ID: {itemId}</Text>
//       <Button title="Go Back" onPress={() => navigation.goBack()} />
//     </View>
//   );
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         {/* Define screens in the stack */}
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen 
//           name="Details" 
//           component={DetailsScreen} 
//           options={{ title: 'Details Page' }} 
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
