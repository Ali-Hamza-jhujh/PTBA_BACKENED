import mongoose from 'mongoose';
const { Schema } = mongoose;

const hearingSchema = new Schema({
  hearingdate: {
    type: Date,
    required: true
  },
  hearingremarks: {
    type: String,
    required: true
  },
 case:{
    type:mongoose.Schema.Types.ObjectId,
     ref:"Cases",
     required:true
 },
  user:{
    type:mongoose.Schema.Types.ObjectId,
     ref:"User",
     required:true
 },
 issent:{
    type:Boolean,
    default:false
 }
}
,{timestamps:true});
export default mongoose.model('hearing', hearingSchema);
