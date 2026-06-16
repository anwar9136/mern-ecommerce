import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'anwar91di@gmail.com' });
        if (user) {
            console.log('User found:', user.email);
            console.log('isVerified:', user.isVerified);
            console.log('verificationToken:', user.verificationToken);
        } else {
            console.log('User not found');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
