const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentLink = async (req, res) => {
  console.log('okookok')
  
   
  const { amount, name = 'Divyansh', contact = '9027065493', email = 'test@example.com' } = req.body;
  console.log(amount)

  const options = {
    amount: (amount.fee.cost) * 100, 
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
    callback_url: 'http://10.61.36.91:3000/payment-success', // Change to your own URL
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

const paymentSuccess=async (req,res) =>{
      console.log('payment success');
      try{
        const{sellerId,dummysellerId,serviceId,cost}=req.body;

        console.log(sellerId);
        console.log(dummysellerId);
        const seller=await User.findById(sellerId);
        console.log(seller);
        const dummySeller=await User.findById(dummysellerId);
        console.log(dummySeller);
        const service=await Service.findById(serviceId);
        console.log(service);

        const prof1=((service.sellerSharePercent)/100)*cost;
        console.log(prof1);
        const prof2=((service.dummysellerSharePercent)/100)*cost;
        console.log(prof2);

        seller.walletBalance=(seller.walletBalance)+prof1;
        console.log(seller.walletBalance);
        dummySeller.walletBalance=(dummySeller.walletBalance)+prof2;
        console.log(dummySeller.walletBalance);

        await seller.save();
        console.log("saved");
        await dummySeller.save();

        console.log("seller:",seller);
        console.log("dummyseller",dummySeller);

        return res.status(200).json({seller});
      }
      catch(err){
        console.log("error updating wallet");
        return res.status(500).json({error : err.message});
      }

        
};

const storeOrders=async(req,res)=>{
  try{
    console.log("storing order");
    const {serviceId}=req.body;
    console.log(serviceId);
    const userId=req.user._id;
    console.log(userId);
    const user=await User.findById(userId);
    
    const service=await Service.findById(serviceId);
    console.log(service);
    user.orders.push(serviceId);
    user.save();

    return res.status(201).json({message:"order saved succesfully"});

  }
  catch(err){
    return res.status(404).json({error:err.message});
  }
};

const getOrders=async(req,res) => {
  try{
    const userId=req.user._id;
    const user=await User.findById(userId);
    const orders=user.orders;

    return res.status(200).json({orders});
  }
  catch(err){
    return res.status(404).json({error:err.message});
  }
}


module.exports = { createPaymentLink, getOrders, storeOrders, paymentSuccess};