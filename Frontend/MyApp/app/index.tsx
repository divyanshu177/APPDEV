
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import Animated, { ZoomIn, FadeInDown } from 'react-native-reanimated';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';

const { width, height } = Dimensions.get('window');

import logo from '../assets/images/b.jpg';

export default function HomeScreen() {
  const router = useRouter();

  // Redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 5000);

    return () => clearTimeout(timer); // clean up
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={{ uri: 'https://cdn.pixabay.com/video/2024/04/15/208082_large.mp4' }}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      {/* Overlay */}
      <LinearGradient
        colors={['rgba(238,222,246,0.6)', 'rgba(204,229,227,0.5)', 'rgba(47,47,47,0.8)']}
        style={styles.overlay}
      >
        <Animated.View entering={ZoomIn.duration(1000).delay(100)} style={styles.content}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View entering={ZoomIn.duration(1200).delay(300)} style={styles.content}>
          <Text style={styles.title}>Welcome to EARNN!</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1600).duration(1000)} style={styles.content}>
          <Text style={styles.subtitle}>Explore, Share, and Connect</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 41,
    fontFamily: 'Poppins_700Bold',
    color: '#FEE1B6',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#2F2F2F',
    textShadowOffset: { width: 4, height: 2 },
    textShadowRadius: 7,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#EEDEF6',
    textAlign: 'center',
    textShadowColor: '#2F2F2F',
    textShadowOffset: { width: 4, height: 2 },
    textShadowRadius: 7,
    opacity: 0.9,
  },
});
