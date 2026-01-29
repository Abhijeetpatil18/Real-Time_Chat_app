import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();



const connectDB = async ()=>{
    try {

        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected -> ", db.connection.host)
        
    } catch (error) {
        console.log("failed to connect to database", error)
        
    }
}

export default connectDB;