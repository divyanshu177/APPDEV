const mongoose = require('mongoose');
const referralSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referredAt: {
        type: Date,
        default: Date.now
    },
    referredTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
});

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
