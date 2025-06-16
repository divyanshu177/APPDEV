import React, { useState } from 'react';
import { View, Button, Modal, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import axiosInstance from '../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function PaymentScreen() {
  const [paymentUrl, setPaymentUrl] = useState(null);
  const { cost, sellerId, serviceId, dummySellerId } = useLocalSearchParams();
  console.log(sellerId)
  console.log("dummySellerId",dummySellerId)
  


  const handlePayment = async () => {
    try {
      console.log("handling payment")
      const token = await AsyncStorage.getItem('userToken');

    
     const { data } = await axiosInstance.post('/createPaymentLink', {
        amount: Number(cost), 
        name: 'Test User',
        email: 'bt23cse006@nituk.com',
        contact: '9027065493',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ⬅️ Send token in Authorization header
        },
      }
    );

      setPaymentUrl(data.url); 
    }
    catch (err) {
      console.log('Error creating payment link:', err);
    }

    try{  
      console.log(sellerId);
    await axiosInstance.post('/login/paymentSuccess',{
      sellerId: sellerId,
      cost: Number(cost), 
      dummySellerId: dummySellerId,  
      serviceId: serviceId
  },{
    headers: {
        'Content-Type': 'application/json'
    }
});
    }
    catch(err){
      console.log('error in updating wallet');
    }

    try{
        await axiosInstance.post('/login/storeOrders',{
           serviceId:serviceId
        },{
    headers: {
        'Content-Type': 'application/json'
    }
      });
    }
    catch(err){
        console.log("error in storing error",err);

      }


    }
  return (
    <View style={{ flex: 1 }}>
      <Button title="Pay with Razorpay" onPress={handlePayment} />
      <Modal visible={!!paymentUrl} onRequestClose={() => setPaymentUrl(null)}>
        {paymentUrl && (
          <WebView
          
            source={{ uri: paymentUrl }}
            onNavigationStateChange={(navState) => {
              if (navState.url.includes('payment-success')) {
                alert('✅ Payment Success');
                setPaymentUrl(null);
              }
              if (navState.url.includes('payment-failure')) {
                alert('❌ Payment Failed');
                setPaymentUrl(null);
              }
            }}
          />
        )}
      </Modal>
    </View>
    );
  }
