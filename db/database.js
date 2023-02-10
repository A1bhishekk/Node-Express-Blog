import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            dbName:"NODE-EXPRESS-BLOG",
        });
        console.log(`MongoDB connected Successfully 🐰: ${conn.connection.host},${conn.connection.name}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}