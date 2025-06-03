import { Tabs } from 'expo-router';

export default function HomeLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="network" options={{ title: 'Network' }} />
      <Tabs.Screen name="addPost" options={{ title: 'Add Post' }} />
      <Tabs.Screen name="notification" options={{ title: 'Notification' }} />
      <Tabs.Screen name="addService" options={{ title: 'Add Service' }} />
    </Tabs>
  );
}
