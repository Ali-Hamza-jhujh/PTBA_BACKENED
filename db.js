import mongoose from "mongoose";

 const MONGO_URL = "mongodb://ali:hamza@localhost:27017/Diary?authSource=admin";
const ConnectToMongo=async()=>{
    try{
     await mongoose.connect(MONGO_URL);
console.log("Connected to server successfully!");
    }catch(error){
        console.log("error",error);
    }
}
export default ConnectToMongo