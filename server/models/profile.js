import mongoose from "mongoose";

const profileSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
     profileImageUrl:{
        type:String,
     },
     profileBannerImageUrl:{
        type:String
     },
     username:{
      type:String
     },
    
     status_des:{
      type:String
     },
     created_at:{
        type:Date
     },
     updated_at:{
        type:Date
     },
     following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
  }],
  followers:[
   {type:mongoose.Schema.Types.ObjectId , ref:'user'}
  ],
  friends:[{
   type:mongoose.Schema.Types.ObjectId , ref:'user'
  }]
})

const profilemodel=mongoose.model('profile', profileSchema);
export default profilemodel;