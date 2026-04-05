const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('FATAL ERROR: MONGO_URI environment variable is not set.');
        console.error('Please set MONGO_URI in your Render dashboard Environment Variables.');
        return;
    }
    if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET environment variable is not set.');
        console.error('Please set JWT_SECRET in your Render dashboard Environment Variables.');
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
};

module.exports = connectDB;
