import mongoose from "mongoose";
import express from 'express'
import dotenv from 'dotenv'
import Sendmailregect from "../mails/emailregect.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import Sendmail from "../mails/acceptancemail.js";
const router=express.Router();
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import user from "../models/user.js";
dotenv.config();
router.post('/register',async(req,res)=>{
    try{
    const {name,email,businesName,businessAddress,phone,cnic,qualification,city,barRegister,isVarifield,isregected,setpassword}=req.body;
    if(!name||!email||!businesName||!businessAddress|| !cnic||!phone){
        return res.status(400).json({message:"All fields required!"});
    }
    const users=await user.findOne({cnic});
    if(users){
        return res.status(400).json({message:"You already submit the request!"});
    }
    const creatuser= await user.create({name,email,businesName,businessAddress,phone,cnic,qualification,city,barRegister,isVarifield:false,isregected:false,role:"Member",setpassword:false})
    res.status(200).json({message:"User created successfully, wait for admin premission!"});
     
    }catch(error){
  return res.status(400).json({
    message: error.message,
    name: error.name
  });
    }
})
router.post('/accept/:id',AuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const reqid=req.user
    const userDoc = await user.findById(id);
   if(reqid.role !== "admin" && reqid.role !== "Admin")
  return res.status(403).send({ message: "Unauthorized, Only admin allowed this!" });

    if (!userDoc) {
      return res.status(400).send({ message: "Invalid Credential!" });
    }
    userDoc.isVarifield = true;
    await userDoc.save();

    const token = jwt.sign({ id: userDoc._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    const link = `http://localhost:3000/setpassword?token=${token}`;
    await Sendmail(link, userDoc.email);
    res.status(200).send({ message: "Request accepted successfully, email sent!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/reject/:id',AuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const reqid=req.user;
    const users = await user.findById(id);
      if(reqid.role !== "admin" && reqid.role !== "Admin")
  return res.status(403).send({ message: "Unauthorized, Only admin allowed this!" });

    if (!users) {
      return res.status(400).json({ message: "Invalid credential!" });
    }
    users.isregected = true;
    await users.save();
    await Sendmailregect(users.email);
    res.status(200).json({
      message: "Request rejected successfully, email sent!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/setpassword', async (req, res) => {
  try {
    const { password, newpassword } = req.body;
    const token = req.query.token; 
    if (!token) return res.status(401).json({ message: "Token is required" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userDoc = await user.findById(decoded.id);
    if (!userDoc) return res.status(400).json({ message: "Invalid Credential!" });
    if(userDoc.role === "admin") return res.status(400).json({ message: "Admin not allowed to set password!" });
    if(userDoc.setpassword) return res.status(400).json({ message: "Password Already set, Login please!" });
    if (password !== newpassword) return res.status(400).json({ message: "Password Mismatch!" });
      const hashpassword=await bcrypt.hash(password,10);
    userDoc.passwords = hashpassword; 
    userDoc.setpassword = true;
    await userDoc.save();
    return res.status(200).json({ message: "Password set successfully!" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/login', async(req, res) => {
    const { cnic, password } = req.body;
    try {
        if (!cnic || !password) {
            return res.status(400).json({ message: "Wrong username or password" });
        }
        const newuser = await user.findOne({ cnic });
        if (!newuser) {
            return res.status(400).json({ message: "Wrong username or password" });
        }
        
        if (!newuser.isVarifield) {
            return res.status(400).json({ message: "You are not verified by admin yet!" });
        }
        
        if (newuser.isregected) {
            return res.status(400).json({ message: "You are rejected by admin!" });
        }
        const corectpassword=bcrypt.compare(password,newuser.passwords);
        if (!corectpassword) {
            return res.status(400).json({ message: "Wrong username or password" });
        }
       const token = jwt.sign(
  { 
    id: newuser._id, 
    role: newuser.role 
  },
  process.env.SECRET_KEY,
  { expiresIn: "1d" }
);
res.status(200).json({
  message: "Login successfully!",
  token,
  user: {
    _id: newuser._id,
    name: newuser.name,
    email: newuser.email,
    role: newuser.role,
    businesName: newuser.businesName,
    phone: newuser.phone
  }
});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/alluers',AuthMiddleware,async(req,res)=>{
    try{
    const users=await user.find();
    res.status(200).send(users);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})
export default router