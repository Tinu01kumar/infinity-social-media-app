import mongoose from "mongoose";
export const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true
    },
    expireIn:{
        type:Date,
        default:Date.now,
        index:{expires:'15m'}
    },
    created_at:{type:Date,
    default:Date.now}
})

const otpmodel=mongoose.model('otp', otpSchema);
export default otpmodel;