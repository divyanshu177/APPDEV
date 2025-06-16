import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import {useRouter} from 'expo-router';

export default function ProfLayout() {
  const router=useRouter();
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ 
             headerTitle:'',
             headerLeft: () => (
              <TouchableOpacity style={{marginLeft :15}} onPress={() => router.replace('/(home)')}>
                <FontAwesome name="home" size={24} color="#000" />
                </TouchableOpacity>
             )
       }} />
      <Stack.Screen name="posts" options={{ headerTitle:'', }} />
      <Stack.Screen name="update" options={{ headerTitle:'go', }} />
      <Stack.Screen name="createPost" options={{ 
              headerTitle:'',
              headerStyle: { backgroundColor: '#2a2f45' },
              headerLeft: () => (
                <TouchableOpacity style={{marginLeft :15}} onPress={() => router.replace('../(home)/addPost')}>
                  <FontAwesome name="arrow-left" size={24} color="#0055ff" />
                  </TouchableOpacity>
              )
       }} />
    </Stack>
  );
}


