const mongoose = require('mongoose');

require('dotenv').config();

const connectToMongo = () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('DB connected'))
        .catch(err => console.error('DB connection error:', err));
};

module.exports = connectToMongo;
