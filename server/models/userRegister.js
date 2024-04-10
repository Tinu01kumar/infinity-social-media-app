import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
    },
    refreshToken:{
        type:String,
        
    },
    active:{
        type:String,
        default:"active",
    },
    mode:{
        type:String,
        enum:["explore" , "creator"],
        default:"explore"
    },
    log_in:{
        type:Date,
    
    },
    log_out:{
        type:Date,
        
    },
    created_at:{
        type:Date
    },
    updated_at:{
        type:Date
    }


})

const userRegister =mongoose.model('user' , userSchema);
export default userRegister