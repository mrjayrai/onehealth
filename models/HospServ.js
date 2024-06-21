const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  }
});

const hospitalSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  services: [serviceSchema], 
});

const Hospital = mongoose.model('HospitalService', hospitalSchema);

module.exports = Hospital;
