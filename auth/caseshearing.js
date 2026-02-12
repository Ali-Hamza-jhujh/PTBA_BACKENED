  import express from "express";
  import cases from "../models/cases.js";
  import user from "../models/user.js";
  import mongoose from "mongoose";
  import AuthMiddleware from "../middlewares/authMiddleware.js";
  import hearings from "../models/hearings.js";
  // import redisclient from "../middlewares/redix.js";
  const caserouter=express.Router();
  caserouter.post('/addcase',AuthMiddleware,async(req,res)=>{
      const {caseid,partyname,taxyear,noticesection,authority,remarks,dateofnoticeissue,dateofcomplaince,status}=req.body;
      try{
          const userId=req.user.id;
        if(!caseid||!partyname||!taxyear||!noticesection||!authority||!remarks||!dateofnoticeissue||!dateofcomplaince||!status){
          return res.status(400).send({message:"All fields required!"})
        }
        const newcase=await cases.findOne({caseid})
        if(newcase){
            return res.status(400).send({message:"Case with this id already exist!"})
        }
        if(!mongoose.Types.ObjectId.isValid(userId)){
          return res.status(400).send({message:"Invalid user!"})
        }
        const newuser=await user.findById(userId)
        if(!newuser){
          return res.status(400).json({message:"User not found!"})
        }
        const register=new cases({caseid,partyname,taxyear,noticesection,authority,remarks,dateofnoticeissue,dateofcomplaince,status,user:userId})
        await register.save();
        return res.status(201).json({
      message: "Case registered successfully",
      data: register
  });
      }catch(error){
          res.status(500).json({
        message: "Error in case creation",
        error: error.message
      });
      }
  })

  caserouter.get('/getcases',AuthMiddleware,async(req,res)=>{
  try{
      const userId=req.user.id;
       if(!mongoose.Types.ObjectId.isValid(userId)){
          return res.status(400).send({message:"Invalid user!"})
      }
      // const allcash=await redisclient.get(`cases:${userId}`)
  //     if(allcash){
  //       return res.status(200).json({
  //   message: "All cases data fetched from cash successfully!",
  //   data: JSON.parse(allcash)
  // })
  //     }

      const users=await user.findById(userId);
     
      if(!users){
          return res.status(400).json({message:"User not found!"})
      }
  const allcases=await cases.find({ user: userId }).populate("user");
  // await redisclient.setEx(`cases:${userId}`,60,JSON.stringify(allcases))
  res.status(200).json({
    message: "All cases data fetched successfully!",
    data: allcases
  })

  }catch(error){
      res.status(500).json({
        message: "Error in case creation",
        error: error.message
      });
  }
  })

  caserouter.put('/updatehearing/:id', AuthMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const hearingId = req.params.id;
      const { hearingdate, hearingremarks } = req.body;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID!" });
      }

      if (!mongoose.Types.ObjectId.isValid(hearingId)) {
        return res.status(400).json({ message: "Invalid hearing ID!" });
      }

      const users = await user.findById(userId);
      if (!users) {
        return res.status(404).json({ message: "User not found!" });
      }

      if (!hearingdate && !hearingremarks) {
        return res.status(400).json({
          message: "At least one field is required to update"
        });
      }

      const updateData = {};
      if (hearingdate) updateData.hearingdate = hearingdate;
      if (hearingremarks) updateData.hearingremarks = hearingremarks;

      const updatedHearing = await hearings
        .findOneAndUpdate(
          { _id: hearingId, user: userId },
          updateData,
          { new: true, runValidators: true }
        )
        .populate("case")
        .populate("user");

      if (!updatedHearing) {
        return res.status(404).json({
          message: "Hearing not found or you are not authorized to update it"
        });
      }
      // await redisclient.del(`hearings:${userId}`)
      // res.status(200).json({
      //   message: "Hearing updated successfully!",
      //   data: updatedHearing
      // });

    } catch (error) {
      res.status(500).json({
        message: "Error updating hearing",
        error: error.message
      });
    }
  });


  caserouter.put('/updatecase/:id', AuthMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const caseId = req.params.id;
      const {
        caseid,
        partyname,
        taxyear,
        noticesection,
        authority,
        remarks,
        dateofnoticeissue,
        dateofcomplaince,
        status
      } = req.body;

      // Validate IDs
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID!" });
      }
      if (!mongoose.Types.ObjectId.isValid(caseId)) {
        return res.status(400).json({ message: "Invalid case ID!" });
      }

      // Check if user exists
      const existingUser = await user.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      // Ensure at least one field is provided
      if (!caseid && !partyname && !taxyear && !noticesection && !authority && !remarks && !dateofnoticeissue && !dateofcomplaince && !status) {
        return res.status(400).json({ message: "At least one field is required to update" });
      }

      // Build update object dynamically
      const updateData = {};
      if (caseid) updateData.caseid = caseid;
      if (partyname) updateData.partyname = partyname;
      if (taxyear) updateData.taxyear = taxyear;
      if (noticesection) updateData.noticesection = noticesection;
      if (authority) updateData.authority = authority;
      if (remarks) updateData.remarks = remarks;
      if (dateofnoticeissue) updateData.dateofnoticeissue = dateofnoticeissue;
      if (dateofcomplaince) updateData.dateofcomplaince = dateofcomplaince;
      if (status) updateData.status = status;

      // Update the hearing
      const updatedHearing = await cases
        .findOneAndUpdate(
          { _id: caseId, user: userId },
          updateData,
          { new: true, runValidators: true }
        )
        .populate("user");

      if (!updatedHearing) {
        return res.status(404).json({
          message: "case not found or you are not authorized to update it"
        });
      }
    //  redisclient.del(`cases:${userId}`)

      res.status(200).json({
        message: "case updated successfully!",
        data: updatedHearing
      });

    } catch (error) {
      res.status(500).json({
        message: "Error updating case",
        error: error.message
      });
    }
  });

  caserouter.delete('/deletehearing/:id', AuthMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const hearingId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID!" });
      }

      if (!mongoose.Types.ObjectId.isValid(hearingId)) {
        return res.status(400).json({ message: "Invalid hearing ID!" });
      }

      const users = await user.findById(userId);
      if (!users) {
        return res.status(404).json({ message: "User not found!" });
      }

      const hearing = await hearings.findOneAndDelete({
        _id: hearingId,
        user: userId
      });
//  await redisclient.del(`hearings:${userId}`)
      if (!hearing) {
        return res.status(404).json({
          message: "Hearing not found or you are not authorized to delete it"
        });
      }

      res.status(200).json({ message: "Hearing deleted successfully!" });

    } catch (error) {
      res.status(500).json({
        message: "Error deleting hearing",
        error: error.message
      });
    }
  });


  caserouter.delete('/deletecase/:id', AuthMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const caseID = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID!" });
      }

      if (!mongoose.Types.ObjectId.isValid(caseID)) {
        return res.status(400).json({ message: "Invalid case ID!" });
      }

      const users = await user.findById(userId);
      if (!users) {
        return res.status(404).json({ message: "User not found!" });
      }

      const casees = await cases.findOneAndDelete({
        _id: caseID,
        user: userId
      });

      if (!casees) {
        return res.status(404).json({
          message: "case not found or you are not authorized to delete it"
        });
      }
      // redisclient.del(`cases:${userId}`)
      res.status(200).json({ message: "case deleted successfully!" });

    } catch (error) {
      res.status(500).json({
        message: "Error deleting hearing",
        error: error.message
      });
    }
  });

  caserouter.get('/getcases/:userid',AuthMiddleware,async(req,res)=>{
  try{
      const userId = req.params.userid;
       if(!mongoose.Types.ObjectId.isValid(userId)){
          return res.status(400).send({message:"Invalid user!"})
      }
  //     const allcash=await redisclient.get(`cases:${userId}`)
  //     if(allcash){
  //       return  res.status(200).json({
  //   message: "All cases data fetched successfully!",
  //   data: JSON.parse(allcash)
  // })
  //     }
      const users=await user.findById(userId);
     
      if(!users){
          return res.status(400).json({message:"User not found!"})
      }
  const allcases=await cases.find({ user: userId }).populate("user");
  // await redisclient.setEx(`cases:${userId}`,60,JSON.stringify(allcases))
  res.status(200).json({
    message: "All cases data fetched successfully!",
    data: allcases
  })

  }catch(error){
      res.status(500).json({
        message: "Error in case creation",
        error: error.message
      });
  }
  })
  caserouter.post('/hearings',AuthMiddleware,async(req,res)=>{
      const {hearingdate,hearingremarks,caseId }=req.body;
      try{
          const userId=req.user.id;
          if (!hearingdate || !hearingremarks || !caseId) {
    return res.status(400).json({ message: "All fields required!" });
  }

          if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user!" });
  }
          if (!mongoose.Types.ObjectId.isValid(caseId)) {
    return res.status(400).json({ message: "Invalid case ID!" });
  }

    const existingCase = await cases.findById(caseId);
      if (!existingCase) {
    return res.status(400).json({ message: "Case not found!" });
      }
          const hearindall= new hearings({hearingdate,hearingremarks,case:caseId,user: userId,issent:false});
          await hearindall.save();
          res.status(201).json({ message: "Hearing saved successfully!", data: hearindall });

        
      }catch(error){
          res.status(500).json({
        message: "Error in hearing creation",
        error: error.message
      });
      }
  })



  caserouter.get('/gethearings',AuthMiddleware,async(req,res)=>{
  try{
      const userId=req.user.id;
          if(!mongoose.Types.ObjectId.isValid(userId)){
          return res.status(400).send({message:"Invalid user!"})
      }
  //     const hearingcash=await redisclient.get(`hearings:${userId}`)
  //     if(hearingcash){
  //        return res.status(200).json({
  //   message: "All hearings data fetched successfully!",
  //   data: JSON.parse(hearingcash)
  // })
  //     }
  
      const users=await user.findById(userId);
      if(!users){
          return res.status(400).json({message:"User not found!"})
      }
  const allhearings=await hearings.find({ user: userId }).populate("case").populate("user");
  // await redisclient.setEx(`hearings:${userId}`,60,JSON.stringify(allhearings))
  res.status(200).json({
    message: "All hearings data fetched successfully!",
    data: allhearings
  })


  }catch(error){
      res.status(500).json({
        message: "Error in hearing creation",
        error: error.message
      });
  }
  })


  caserouter.get('/gethearings/:caseid',AuthMiddleware,async(req,res)=>{
  try{
      const {caseid}=req.params
      const userId=req.user.id;
       if(!mongoose.Types.ObjectId.isValid(caseid)){
          return res.status(400).send({message:"Invalid case!"})
      }
      if(!mongoose.Types.ObjectId.isValid(userId)){
          return res.status(400).send({message:"Invalid user!"})
      }
  //      const hearingcash=await redisclient.get(`hearings:${userId}:${caseid}`)
  //     if(hearingcash){
  //        return res.status(200).json({
  //   message: "All hearings data fetched successfully!",
  //   data: JSON.parse(hearingcash)
  // })
  //     }
     
      const users=await user.findById(userId);
      if(!users){
          return res.status(400).json({message:"User not found!"})
      }
  const hearinglist=await hearings.find({ user: userId,case:caseid }).populate("case").populate("user");
  //  await redisclient.setEx(`hearings:${userId}:${caseid}`,60,JSON.stringify(hearinglist))
    if (hearinglist.length === 0) {
        return res.status(404).json({ message: "No hearings found for this case" });
      }
  res.status(200).json({
    message: "All hearings data fetched successfully!",
    data: hearinglist
  })
  }catch(error){
      res.status(500).json({
        message: "Error in hearing creation",
        error: error.message
      });
  }
  })
  export default  caserouter





