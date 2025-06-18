// utils/sendSMS.js
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
    console.log('Sending SMS to:', to);
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to, // Must be in international format like +91xxxxxxxxxx
    });
    console.log('Message sent:', result.sid);
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
};

module.exports = sendSMS;