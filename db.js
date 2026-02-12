import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
 const MONGO_URL =process.env.MONGO_URL|| "mongodb+srv://ali-hamza:aidasyou.123@cluster0.4hnk97j.mongodb.net/ptba?retryWrites=true&w=majority"
const ConnectToMongo=async()=>{
    try{
     await mongoose.connect(MONGO_URL);
console.log("Connected to server successfully!");
    }catch(error){
        console.log("error",error);
    }
}
// "mongodb://ali:hamza@localhost:27017/Diary?authSource=admin";
export default ConnectToMongo