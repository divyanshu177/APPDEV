import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, View, TextInput, Alert, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../axiosInstance";
import * as ImagePicker from 'expo-image-picker';

export default function Create() {   // Capitalized component name (React convention)
    const item = useLocalSearchParams();
    const [review, setReview] = useState("");
    const [ImageUris, setImageUris] = useState<string[]>([]);

    const handleAddPost = async () => {
        const id = await AsyncStorage.getItem('userId');
        console.log(id);

        const payload = {
            serviceId: item._id,
            sellerId: item.seller,
            desc: item.description,
            image: ImageUris,
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
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            const uris = result.assets.map(asset => asset.uri);
            console.log("Selected URIs:", uris);
            setImageUris(prevUris => [...prevUris, ...uris]);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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

            {/* Show Selected Images Preview */}
            <View style={styles.previewContainer}>
                {ImageUris.map((uri, index) => (
                    <Image
                        key={index}
                        source={{ uri }}
                        style={styles.previewImage}
                    />
                ))}
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#00ffff' }]} onPress={handleAddPost}>
                <Text style={styles.buttonText}>Add Post</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#20232a',
        flexGrow: 1,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#00ffff'
    },
    input: {
        height: 100,
        borderColor: '#333',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#1a1a1a',
        color: '#fff',
        textAlignVertical: 'top'
    },
    button: {
        backgroundColor: '#0055ff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    previewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        justifyContent: 'center'
    },
    previewImage: {
        width: 80,
        height: 80,
        margin: 5,
        borderRadius: 8,
    }
});
