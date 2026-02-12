import mongoose from 'mongoose';
const { Schema } = mongoose;

const caseSchema = new Schema({
  caseid: {
    type: String,
    required: true
  },
  partyname: {
    type: String,
    required: true
  },
  taxyear: {   
    type: String,
    required: true
  },
  noticesection: {
    type: String,
    required: true
  },
  authority: {
    type:String,
    enum:[ "FBR","Commissioner","Appellate","Authority","Court"],
    required: true
  },
  remarks: {
    type: String,
    required: true
  },
  dateofnoticeissue: {
    type: Date
  },
  dateofcomplaince: {
    type: Date
  },
 status: { type: String,
    enum:["Open","In Progress","Adjourned","Closed"],
    required:true
 },
 user:{
    type:mongoose.Schema.Types.ObjectId,
     ref:"User",
     required:true
 }
}
,{timestamps:true});

export default mongoose.model('Cases', caseSchema);
