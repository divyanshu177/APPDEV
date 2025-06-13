import React, { useState } from 'react';
import { View, Button, Modal, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';


export default function PaymentScreen() {
  const [paymentUrl, setPaymentUrl] = useState(null);
 const params = useLocalSearchParams();
      console.log(params)
      const fee=params;  
      
  const handlePayment = async () => {
    try {
     const { data } = await axios.post('http://10.61.4.86:3000/login/createPaymentLink', {
        amount: fee.fee, 
        name: 'Test User',
        email: 'bt23cse006@nituk.com',
        contact: '9027065493',
      });

      setPaymentUrl(data.url); 
    } catch (err) {
      console.log('Error creating payment link:', err);
    }
  };

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