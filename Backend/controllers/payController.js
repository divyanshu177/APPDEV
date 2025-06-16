const Razorpay = require('razorpay');
const User=require('../models/User');
const Service=require('../models/service')

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentLink = async (req, res) => {
  console.log(req.body)
  console.log('okookok')
  
   
  const { amount, name = 'Divyansh', contact = '9027065493', email = 'test@example.com' } = req.body;
  console.log(amount)

  const options = {
    amount: (amount) * 100, 
    currency: 'INR',
    description: 'Payment for your order',
    customer: {
      name,
      contact,
      email,
    },
    notify: {
      sms: true,
      email: true,
    },
    callback_url: 'http://10.61.90.94:3000/payment-success', // Change to your own URL
    callback_method: 'get',
    
  };

  try {
    const link = await instance.paymentLink.create(options);
    res.status(200).json({ url: link.short_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createPaymentLink};