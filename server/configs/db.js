import mongoose from "mongoose";

const connectDb = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Using existing MongoDB connection');
        return;
    }

    mongoose.connection.on('connected', () => console.log('MongoDB Connected'));
    mongoose.connection.on('error', (err) => console.log('MongoDB Connection Error:', err));

    await mongoose.connect(`${process.env.MONGO_URI}/libSystem`);
}

export default connectDb;