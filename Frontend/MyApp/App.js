import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import { Ionicons } from '@expo/vector-icons'; // Icon library
import HomePage from './src/screens/HomePage'; // Assuming HomePage is another screen component

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Welcome') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Login') {
              iconName = focused ? 'log-in' : 'log-in-outline';
            } else if (route.name === 'SignUp') {
              iconName = focused ? 'person-add' : 'person-add-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2F2F2F',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Welcome" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        {/* <Tab.Screen name="Login" component={Login} /> */}
        <Tab.Screen name="HomePage" component={HomePage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
