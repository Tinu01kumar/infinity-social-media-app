import mongoose from "mongoose";
const createPostSchema=new mongoose.Schema({
    userId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'user'
    },
    profileId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'profile'
    },
     username:{
        type:String
     },
    description:{
        type:String
    },
    postImage:{
        type:String
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    comments:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        comment:{
            type:String
        },
        profileImage:{
            type:String,
        },

        updated_at:{
            type:Date,
        }
        
    }],

    created_at:{
        type:Date
     },
     updated_at:{
        type:Date
     },

})

const PostModel=mongoose.model('createpost', createPostSchema);
export default PostModel;