import mongoose from "mongoose";

const isConnected = false;
export const ConnectedToDB = async (): Promise<void> => {
    mongoose.set('strictQuery', true);
    
    if (isConnected) {
        console.log("MongoDB is already connected");
        return
    }

    try {
        await mongoose.connect(process.env.MOGODB_CONNECTION || '', {
            dbName: process.env.MOGODB_NAME
        })
        isConnected: true;
        console.log("MongoDb is connected");

    } catch (error) {
        console.log(error);
    }
};