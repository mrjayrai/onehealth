const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017/one";
// const mongoURI = "mongodb+srv://pritesh:pritesh%40mongodb1@cluster0.pyfudfg.mongodb.net/one?retryWrites=true&w=majority";
require('dotenv').config();

const connectToMongo = () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('DB connected'))
        .catch(err => console.error('DB connection error:', err));
};

module.exports = connectToMongo;
