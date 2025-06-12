import mongoose from "mongoose";

export const connection= async () => {
    try {
        const conn =await  mongoose.connect(process.env.MONGO_URI,{
            dbName: "Aution_platform",
        });
        console.log(`MongoDB connected`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}