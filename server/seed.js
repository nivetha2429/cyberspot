import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';
import Category from './models/Category.js';

dotenv.config();

const initialProducts = [];

const seedDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI not found in .env. Cannot clear database.');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected!');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        await User.deleteMany({});
        console.log('Cleared existing users');

        await Order.deleteMany({});
        console.log('Cleared existing orders');

        await Category.deleteMany({});
        console.log('Cleared existing categories');

        await Product.insertMany(initialProducts);
        console.log('Seeded initial products');

        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
