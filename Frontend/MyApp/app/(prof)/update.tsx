import React ,{useState,useEffect} from 'react';
import {Text,View} from 'react-native';
import axiosInstance from '../axiosInstance';
import { useRouter } from 'expo-router';

export default function update(){
    const handleUpdate= async() =>{
    const response= await axiosInstance.get('/login/updateprofile');
    }

}