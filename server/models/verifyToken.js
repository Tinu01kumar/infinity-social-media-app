import mongoose from "mongoose";
export const verifyTokenSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,

    },
    updated_at:{
        type:Date,
        default:Date.now
    }
})

const verifytokenmodel=mongoose.model('verifyToken' , verifyTokenSchema)
export default verifytokenmodel;