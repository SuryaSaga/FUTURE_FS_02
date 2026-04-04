const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Lead = require('./models/leadModel');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data (optional, but good for demo setup)
        await User.deleteMany({});
        await Lead.deleteMany({});

        // Create Admin User
        const admin = await User.create({
            username: 'admin',
            password: 'password123'
        });
        console.log('Admin user created: admin / password123');

        // Create Dummy Leads
        const leads = [
            { name: 'John Doe', email: 'john@example.com', source: 'Website', status: 'new' },
            { name: 'Jane Smith', email: 'jane@business.com', source: 'Referral', status: 'contacted' },
            { name: 'Alice Wilson', email: 'alice@startup.io', source: 'LinkedIn', status: 'converted' },
            { name: 'Bob Brown', email: 'bob@tech.com', source: 'Website', status: 'new' }
        ];

        await Lead.insertMany(leads);
        console.log('Dummy leads inserted.');

        mongoose.connection.close();
        console.log('Seeding completed.');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
