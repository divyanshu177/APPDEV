const Razorpay = require('razorpay');
const User=require("../models/User");
const Service=require("../models/service");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentLink = async (req, res) => {
  console.log('okookok')

  try {
    const { amount, name = 'Divyansh', contact = '9027065493', email = 'test@example.com' } = req.body;
    console.log('Received amount:', amount);

    const finalAmount = (typeof amount === 'object') ? amount.fee.cost : amount;

    const options = {
      amount: finalAmount * 100, 
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
      callback_url: 'http://10.81.18.222:3000/payment-success', 
      callback_method: 'get',
    };

    const link = await instance.paymentLink.create(options); // ✅ options is properly defined now
    res.status(200).json({ url: link.short_url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const paymentSuccess = async (req, res) => {
    console.log("Inside payment success");
    console.log("Request body:", req.body);

    const { sellerId, dummySellerId, serviceId, cost } = req.body;

    let seller;

    try {
        
        seller = await User.findById(sellerId);
        const service = await Service.findById(serviceId);

        if (!seller || !service) {
            return res.status(404).json({ error: "Seller or Service not found" });
        }

        if (dummySellerId===undefined) {
            console.log("Direct seller payment");

            seller.walletBalance += cost;
            await seller.save();

            console.log("Updated seller wallet:", seller.walletBalance);
        } 
       
        else {
            console.log("Payment via dummy seller");

            const dummySeller = await User.findById(dummySellerId);

            if (!dummySeller) {
                return res.status(404).json({ error: "Dummy Seller not found" });
            }

            const sellerShare = (service.sellerSharePercent / 100) * cost;
            const dummySellerShare = (service.dummysellerSharePercent / 100) * cost;

            
            seller.walletBalance += sellerShare;
            dummySeller.walletBalance += dummySellerShare;

            
            await seller.save();
            await dummySeller.save();

            console.log("Updated seller wallet:", seller.walletBalance);
            console.log("Updated dummy seller wallet:", dummySeller.walletBalance);
        }

        console.log("Payment processing completed.");
        
        return res.status(200).json({
            message: "Wallets updated successfully",
            seller: {
                _id: seller._id,
                walletBalance: seller.walletBalance
            }
        });

    } catch (err) {
        console.error("Error updating wallet:", err);
        return res.status(500).json({ error: err.message });
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
    
    console.log("finding service");
    user.orders.push(serviceId);
    user.save();
    
    console.log("order saved");
    return res.status(201).json({message:"order saved succesfully"});

  }
  catch(err){
    return res.status(404).json({error:err.message});
  }
};

const getOrders = async (req, res) => {
    console.log("Getting orders for user:", req.user._id);
    const userId = req.user._id;
    try {
        const user = await User.findById(userId)
        console.log("User found:", user);
        const orders = user.orders;
        const services =[];
        for(let i=0;i<orders.length;i++){
            const service = await Service.findById(orders[i]);
            if(service){
                services.push(service);
            } else {
                console.warn(`Service with ID ${orders[i].serviceId} not found`);
            }
           
        }
        
        
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }
        return res.status(200).json({ message: "Orders found", services });

}
catch(e){
 console.error("Error getting orders:", e);
        return res.status(500).json({ message: "Internal server error" });
}
  }


module.exports = { createPaymentLink, getOrders, storeOrders, paymentSuccess};