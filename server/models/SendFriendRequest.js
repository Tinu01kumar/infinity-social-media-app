import mongoose from "mongoose"
const FriendSchema= new  mongoose.Schema({
     sender:{
        type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    
  },
      receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        
      },
      username:{
        type:String
      },
      receiverUsername:{
        type:String
      },
      status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
      },
      FriendRequestSend_at:{
        type:Date
      },
      FriendRequestAccepted_at:{
        type:Date
      },
      FriendRequestRejected_at:{
          type:Date
      }


})

const FriendModel=mongoose.model('friends', FriendSchema);
export default FriendModel;