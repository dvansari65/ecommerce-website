import mongoose from "mongoose"

const connectDB  = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string)
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("database failed to connect1!")
       process.exit(1);
    }
}

export default connectDB