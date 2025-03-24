import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("DataBase Connected");
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

export default connectDB;