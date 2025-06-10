// import { Tabs } from 'expo-router';

// export default function HomeLayout() {
//   return (
//     <Tabs>
//       <Tabs.Screen name="index" options={{ title: 'Home' }} />
//       <Tabs.Screen name="network" options={{ title: 'Network' }} />
//       <Tabs.Screen name="addPost" options={{ title: 'Add Post' }} />
//       <Tabs.Screen name="notification" options={{ title: 'Notification' }} />
//       <Tabs.Screen name="addService" options={{ title: 'Add Service' }} />
//     </Tabs>
//   );
// }

import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FEE1B6',
        tabBarStyle: {
          backgroundColor: '#2F2F2F',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown :false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Network',
            headerShown :false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addPost"
        options={{
          title: 'Add Post',
            headerShown :false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notifications',
            headerShown :false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addService"
        options={{
          title: 'Services',
            headerShown :false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="DisplayUsers"
        options={{
          title: 'Profiles',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
