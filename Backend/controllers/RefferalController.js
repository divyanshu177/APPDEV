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

const getAll=async(req,res)=>{
    try{
        const referrals = await Referral.find({referredBy:req.user._id}).populate('product').populate('referredTo');
        res.status(200).json(referrals);
    }
    catch (error) {
        console.error("Error fetching referrals:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
 const ProdRef =async (req,res)=>{
    try{
    const referrals = await Referral.find({product:req.params.id}).populate('referredTo').populate('referredBy');
    res.status(200).json(referrals);
    }
    catch (error) {
        console.error("Error fetching product referrals:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createRefferal,
    getAll,
    ProdRef
};