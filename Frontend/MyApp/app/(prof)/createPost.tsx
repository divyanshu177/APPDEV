import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, View, TextInput, Alert, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../axiosInstance";
import * as ImagePicker from 'expo-image-picker';

export default function create() {
    const item = useLocalSearchParams();
    const [review, setReview] = useState("");
    const [ImageUri, setImageUri] = useState("");

    const handleAddPost = async () => {
        const id = await AsyncStorage.getItem('userId');
        console.log(id);

        const payload = {
            serviceId: item._id,
            sellerId: item.seller,
            desc: item.description,
            image: ImageUri,
            dummySellerId: id,
            serviceName: item.name,
            review: review
        };

        try {
            console.log("sending request")
            console.log(payload);
            const response = await axiosInstance.post('/login/createPost', payload);
            Alert.alert('Success', 'Post added successfully');
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error adding post:', error);
            Alert.alert('Error', 'Failed to add post');
        }
    };

    const handleUpload = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== 'granted') {
            Alert.alert('Permission required');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            console.log(result);
            setImageUri(result.assets[0].uri);
            console.log("now uploading");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Create Post</Text>
            <TextInput
                style={styles.input}
                placeholder="Write your review here..."
                placeholderTextColor="#888"
                value={review}
                onChangeText={setReview}
                multiline
            />

            <TouchableOpacity style={styles.button} onPress={handleUpload}>
                <Text style={styles.buttonText}>Upload Photo/Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#00ffff' }]} onPress={handleAddPost}>
                <Text style={styles.buttonText}>Add Post</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#20232a', // dark background
        flex: 1,
        justifyContent: 'center'
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#00ffff' // cyan-blue
    },
    input: {
        height: 100,
        borderColor: '#333',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#1a1a1a', // dark gray
        color: '#fff',
        textAlignVertical: 'top'
    },
    button: {
        backgroundColor: '#0055ff', // blue button
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
