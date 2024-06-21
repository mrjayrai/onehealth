const mongoose = require('mongoose');

// Define a schema for hospital equipment requirements
const HospitalRequirementSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
  email: {
    type: String,
    required: true
  },
  requests: [{
    equipment: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    urgent:{
      type: Boolean,
      default: false
    }
  }]
});

// Create model for HospitalRequirement
const HospitalRequirement = mongoose.model('HospitalRequirement', HospitalRequirementSchema);

module.exports = HospitalRequirement;
