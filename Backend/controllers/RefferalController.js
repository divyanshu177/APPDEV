const Referral = require('../models/referralSchema'); // Adjust the path as necessary
const createRefferal =async(req,res)=>{
    try{
       
        const {product,referredAt,referredTo} = req.body;
        const referral = new Referral({
            product,
            referredBy:req.user._id,
            referredAt: referredAt || Date.now(),
            referredTo: referredTo || [],
        });
        await referral.save();
        res.status(201).json({ message: "Referral created successfully", referral });
    }
    catch (error) {
        console.error("Error creating referral:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}
module.exports = {
    createRefferal
};