import { useLocalSearchParams } from "expo-router";
import React,{ useState } from "react";
import { Text, View, TextInput, Alert,Button,StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../axiosInstance";

export default function create() {
    const item=useLocalSearchParams();
    const [review,setReview]=useState("");

    const handleAddPost = async () => {
        const id=await AsyncStorage.getItem('userId');
        console.log(id);
        
        
        const payload = {
          serviceId: item._id,
          sellerId: item.seller,          
          desc: item.description,         
          image: item.image,
          dummySellerId:id, 
          serviceName: item.name,  
          review:review        
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


    return(
        <View style={styles.container}>
        <Text style={styles.heading}>Create Post</Text>
        <TextInput 
           style={styles.input}
           placeholder="Review"
           value={review}
           onChangeText={setReview}
           multiline
         />

         <Button title="Add Post" onPress={handleAddPost}/>
        </View>

    );
};

const styles =StyleSheet.create({
    container:{
        padding:20,
         backgroundColor: '#f5f5f5',
        flex: 1,
        justifyContent: 'center'
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: 'white',
        textAlignVertical: 'top' 
}}
);
    
