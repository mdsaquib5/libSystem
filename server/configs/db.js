import mongoose from "mongoose";

// Cache the connection across serverless invocations — this is the #1 fix for Vercel cold starts.
// Without this, every request creates a NEW connection to MongoDB, adding 1-3 seconds of delay.
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(`${process.env.MONGO_URI}/libSystem`, opts)
            .then((mongoose) => {
                console.log("MongoDB Connected");
                return mongoose;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

export default connectDb;