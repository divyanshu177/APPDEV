import React from "react";
import { Text,View,TextInput } from "react-native";

export default function create() {

    return(
        <View>
        <Text>Create Post</Text>
        <TextInput 
           placeholder="Review"
         />

         <Button title="Add Post" />
        </View>
    )
};