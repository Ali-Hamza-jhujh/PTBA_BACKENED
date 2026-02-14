import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  businesName: {   
    type: String,
    required: true
  },
  businessAddress: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  cnic: {
    type: String,
    required: true
  },
  qualification: {
    type: String
  },
  city: {
    type: String
  },
 passwords: { type: String},
  barRegister: {
    type: String
  },
  isVarifield:{
    type:Boolean,
    default:false
  },
  isregected:{
    type:Boolean,
    default:false
  },
  setpassword:{
    type:Boolean,
    default:false
  },
  role:{
    type:String,
    default:"Member"
  }
});
userSchema.index({ cnic: 1 });
userSchema.index({ email: 1 });
export default mongoose.model('User', userSchema);
