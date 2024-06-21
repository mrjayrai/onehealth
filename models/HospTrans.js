const mongoose = require('mongoose');

const TransactionHistorySchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    transactions: [
        {
            requirementName: {
                type: String,
            },
            givento: {
                type: String,
                default:null
            },
            takenfrom: {
                type: String,
                default:null
            },
            askedForRequirement: {
                type: Boolean,
                required: true
            },
            dateOfCompletion: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const TransactionHistory = mongoose.model('TransactionHistory', TransactionHistorySchema);

module.exports = TransactionHistory;
