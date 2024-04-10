import userRegister from "../models/userRegister.js";
import profilemodel from "../models/profile.js";

  export const uploadProfileImage = async (req, res) => {
    try {
       console.log(req.file, "&&&&&&&&&&&&&&&&&&&&&&&&")
    
      if(req.file)
      {
         const UserExist=await userRegister.findOne({
        
          username:req.query.username
         })
         if(UserExist)
         {

         
        
         const profileExist=await profilemodel.findOne({
            user:UserExist._id
         })
         const now=Date.now();
         if(profileExist)
         {
            const updateProfile=await profilemodel.findOneAndUpdate(
              { user: UserExist._id },
              { profileImageUrl: req.file.location, updated_at: now }
            );
            
            res.json({
              message:"File uploded",
              details:req.file.location,
              result:true
            })
         
        }
        //  else{
        //       const createdProfile=new profilemodel({
        //           user : UserExist._id,
        //           profileImageUrl:req.file.location,
        //           created_at:now,
        //           updated_at:now,
        //           profileBannerImageUrl:""
        //       });
        //       const result=await createdProfile.save();
        //       res.json({
        //         details:req.file.location,
        //         message:"File uploaded",
        //         result:true
        //       })
        //  }
        }
        else{
          res.json({
            errorCode:0,
            message:"File not uploaded",
            result:false
          })
        }
      }
      else{
        res.json({
          message:"File not uploaded",
          errorCode:0,
          status:false
        })
      }
    }catch(error)
    {
        res.json({
          message:`error while profile pic uploading:${error}`,
          errorCode:0,
          status:false
        })
    }
  };

  



  export const uploadBannerImage = async (req, res) => {
    try {
      
    
      if(req.file)
      {
         const UserExist=await userRegister.findOne({
          email:req.query.email ,
          username:req.query.username
         })
         if(UserExist)
         {

         
        
         const profileExist=await profilemodel.findOne({
            user:UserExist._id
         })
         const now=Date.now();
         if(profileExist)
         {
            const updateProfile=await profilemodel.findOneAndUpdate(
              { user: UserExist._id },
              {
              profileBannerImageUrl:req.file.location,
              updated_at:now
            })
            res.json({
              message:"File uploded",
              details:req.file.location,
              result:true
            })
         
        }
        //  else{
        //       const createdProfile=new profilemodel({
        //           user : UserExist._id,
        //           profileBannerImageUrl:req.file.location,
        //           created_at:now,
        //           updated_at:now,
        //           profileImageUrl:""
        //       });
        //       const result=await createdProfile.save();
        //       res.json({
        //         details:req.file.location,
        //         message:"File uploaded",
        //         result:true
        //       })
        //  }
        }
        else{
          res.json({
            errorCode:0,
            message:"File not uploaded",
            result:false
          })
        }
      }
      else{
        res.json({
          message:"File not uploaded",
          errorCode:0,
          status:false
        })
      }
    }catch(error)
    {
        res.json({
          message:`error while profile pic uploading:${error}`,
          errorCode:0,
          status:false
        })
    }
  };


  export const getProfielDetails=async(req, res)=>{
    
      
    
      const username=req.body.params.username
      const userExist=await userRegister.findOne({
 
        username:username
      })

      if(userExist)
      {

        const profileExist=await profilemodel.findOne({
          user:userExist._id
        })

        console.log(profileExist , "$$$$$$$$$$$$$$")
        if(profileExist)
        {

          const details={
            name:userExist.name,
            username:userExist.username,
            email:userExist.email,
            profileImageUrl:profileExist.profileImageUrl,
            profileBannerImageUrl:profileExist.profileBannerImageUrl,
            following:profileExist.following.length,
            follower:profileExist.followers.length,
            friends:profileExist.friends.length,


          }
          res.json({
            details:details,
            status:true
          })
        }
      }

  }


  export const changeCreatorMode = async (req, res) => {
    console.log(req.body.username, req.body.email, req.body.mode, "&&&&&&&&&&&&");
    const isUser = await userRegister.findOne({
        username: req.body.username,
        email: req.body.email
    });
    if (isUser) {
        if (isUser.mode === req.body.mode) {
            res.json({
                message: `Currently you are in ${req.body.mode}`,
                status: true
            });
        } else {
            const updateMode = await userRegister.updateOne(
                { _id: isUser._id },
                { mode: req.body.mode }
            );
            console.log(updateMode, "^^^^^^^^^^^^^^^");
            res.json({
                message: `You activated your ${req.body.mode} mode`,
                status: true
            });
        }
    }
};
