import FriendModel from "../models/SendFriendRequest.js";
import PostModel from "../models/createPost.js";
import profilemodel from "../models/profile.js";
import userRegister from "../models/userRegister.js";

export const SendfriendRequest = async (req, res) => {
  console.log(req.body.receiverId);


  const SenderWhoSendRequest = await userRegister.findOne({
    username: req.body.username,
   
  });

  const now = new Date();
  const data = new FriendModel({
    sender: SenderWhoSendRequest._id,
    receiver: req.body.receiverId,
    FriendRequestSend_at: now,
  });
  const savedata = await data.save();
  console.log(savedata, "**********");
  res.json({
    status:true
  })
};


export const friendRequestBack=async(req,res)=>{
  try{

 
  console.log(req.body)
   const checkFriendStatus=await FriendModel.findOne({
    sender:req.body.userid,
    receiver:req.body.receiveruserid,
  
   })
   if(checkFriendStatus)
   {

   
   if(checkFriendStatus.status==="pending")
   {
      await FriendModel.deleteOne({
        sender:req.body.userid,
        receiver:req.body.receiveruserid,
      })
   }
else if(checkFriendStatus.status==="accepted")
   {
    await FriendModel.deleteOne({
      sender:req.body.userid,
      receiver:req.body.receiveruserid,
    })

    await profilemodel.findOneAndUpdate(
      {user:req.body.userid},
      {
        $pull:{
          following:req.body.receiveruserid,
          followers:req.body.receiveruserid,
          friends:req.body.receiveruserid
        }
      }
    )

    await profilemodel.findOneAndUpdate(
      {user:req.body.receiveruserid},
      {
        $pull:{
          following:req.body.userid,
          followers:req.body.userid,
          friends:req.body.userid

        }
      }
    )
  }
   }else{
    const checkFriendStatusOpposite=await FriendModel.findOne({
      sender:req.body.receiveruserid,
      receiver:req.body.userid,
    
     })

       if(checkFriendStatusOpposite.status==="accepted")
       {
        await FriendModel.deleteOne({
          sender:req.body.receiveruserid,
          receiver:req.body.userid,

        })

        await profilemodel.findOneAndUpdate(
          {user:req.body.userid},
          {
            $pull:{
              following:req.body.receiveruserid,
              followers:req.body.receiveruserid,
              friends:req.body.receiveruserid
            }
          }
        )
    
        await profilemodel.findOneAndUpdate(
          {user:req.body.receiveruserid},
          {
            $pull:{
              following:req.body.userid,
              followers:req.body.userid,
              friends:req.body.userid
    
            }
          }
        )
       }

   }
  res.json({
   status:true
  })
  }catch(error)
  {
     console.log(`e`)
  }
}


export const getAllUserFriends = async (req, res) => {
  console.log(req.body);

  try {
    const userExist = await userRegister.findOne({
      username: req.body.username,
      email: req.body.email,
    });

    const friendExist = await FriendModel.find({
      receiver: userExist._id,
      status: "pending", // Add status condition here
    });

    if (friendExist.length > 0) {
      // Check if there are pending friend requests
      console.log(friendExist);
      const friendsIds = friendExist.map((friend) => friend.sender);

      // Get user information for each friend
      const friendsUserInfo = await userRegister.find({
        _id: { $in: friendsIds },
      });

      // Get profile information for each friend
      const profileFriendsUserInfo = await profilemodel.find({
        user: { $in: friendsIds },
      });

      // Construct the result array
      const result = friendsUserInfo.map((friendInfo) => {
        const profileInfo = profileFriendsUserInfo.find(
          (profile) => profile.user.toString() === friendInfo._id.toString()
        );

        return {
          id: friendInfo._id,
          name: friendInfo.name,
          username: friendInfo.username,
          email: friendInfo.email,
          // Add other fields from friendInfo if needed
          profileImage: profileInfo ? profileInfo.profileImageUrl : "",
          // Add other fields from profileInfo if needed
        };
      });

      console.log(result);

      // Return the result array as response
      res.json({
        result,
        status: true,
      });
    } else {
      res.json({
        message: "No pending friend requests found for this user",
        status: true,
        result: [],
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const AcceptFriendRequest = async (req, res) => {
  console.log(req.body.postid, "()((*");
  // FriendRequestAccepted_at
  const userAcceptRequest = await userRegister.findOne({
    username: req.body.username,
    email: req.body.email,
  });
  const now = new Date();
  const AcceptFriendReqest = await FriendModel.updateOne(
    {
      sender: req.body.postid,
      receiver: userAcceptRequest._id,
    },
    { status: "accepted", FriendRequestAccepted_at: now }
  );
  console.log(AcceptFriendReqest, "^^^^^^^^^^^^");

  const updateFollowerAndFriendsOFSender = await profilemodel.findOneAndUpdate(
    { user: req.body.postid },
    {
      $addToSet: {
        following: userAcceptRequest._id,
        followers: userAcceptRequest._id,
        friends: userAcceptRequest._id,
      },
    }
  );

  const updateFollowerAndFriendofAcceptor = await profilemodel.findOneAndUpdate(
    { user: userAcceptRequest._id },
    {
      $addToSet: {
        following: req.body.postid,
        followers: req.body.postid,
        friends: req.body.postid,
      },
    }
  );
res.json({
    status:true
  })
};

export const IgnoreFriendRequest = async (req, res) => {
  const userexist = await userRegister.findOne({
    username: req.body.username,
    email: req.body.email,
  });

  const friendexist = await FriendModel.findOneAndDelete({
    sender: req.body.postid,
    receiver: userexist._id,
  });
  console.log(friendexist, "&&&&&&&&&&");
  res.json({
    status:true
  })
};

export const Follow = async (req, res) => {
  try {
    console.log(req.body.recieveruserId, "&&&&&&&&&&&&&&");
    const followingUser = await userRegister.findOne({
      username: req.body.username,
      email: req.body.email,
    });

    if (!followingUser) {
      return res.json({
        status: false,
        message: "User not found",
      });
    }

    const updatedFollowing = await profilemodel.findOneAndUpdate(
      { user: followingUser._id },
      {
        $addToSet: {
          following: req.body.recieveruserId,
        },
      },
      { new: true }
    );

    const updatedFollowers = await profilemodel.findOneAndUpdate(
      { user: req.body.recieveruserId },
      {
        $addToSet: {
          followers: followingUser._id,
        },
      },
      { new: true }
    );

    res.json({
      status: true,
      message: "Following and followers updated successfully",
      updatedFollowing,
      updatedFollowers,
    });
  } catch (error) {
    res.json({
      status: false,
      message: `Error while updating following and followers: ${error}`,
    });
  }
};

export const NotFollowing = async (req, res) => {
  try {
    console.log("data");
    const userdata = await userRegister.findOne({
      username: req.body.username,
      email: req.body.email,
    });

    console.log(
      await profilemodel.findOne({
        user: userdata._id,
      })
    );
    console.log(req.body.receiveruserid);
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^");
    // Update the profile of the logged-in user to remove the following
    await profilemodel.findOneAndUpdate(
      { user: userdata._id },
      { $pull: { following: req.body.receiveruserid } }
    );
    console.log(
      await profilemodel.findOne({
        user: userdata._id,
      })
    );
    // Update the profile of the user being unfollowed to remove the follower
    await profilemodel.findOneAndUpdate(
      { user: req.body.receiveruserid },
      { $pull: { followers: userdata._id } }
    );

    res.json({ status: true, message: "Unfollowed successfully" });
  } catch (error) {
    res.json({ status: false, message: `Error: ${error.message}` });
  }
};

export const followAndConnections = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.whypart === "following" && req.body.realuser) {
      const userExist = await userRegister.findOne({
        username: req.body.username,
      });
      const userreal = await userRegister.findOne({
        username: req.body.realuser,
      });

      if (!userExist || !userreal) {
        return res.status(404).json({ error: "User not found" });
      }

      const profile = await profilemodel.findOne({
        user: userExist._id,
      });
      const followingIds = profile.following.map((item) => item._id);

      const profileImagePromises = followingIds.map(async (userId) => {
        const user = await userRegister.findOne({ _id: userId });
        const profile = await profilemodel.findOne({ user: userId });

        if (!user || !profile) {
          // Handle if user or profile not found
          throw new Error(`User or profile not found for user ID: ${userId}`);
        }
        var isFollowing;
        var isfriend;
        if (user.mode === "creator") {
          isFollowing = await profilemodel.exists({
            user: user._id,
            following: userreal._id,
          });
        }
        if (user.mode === "explore") {
          isfriend = await profilemodel.exists({
            user:user._id,
            friends: userreal._id,
          });
          if(isfriend)
          {
            isfriend="friend"
          }
          else{

          
          if(!isfriend)
          {
            const check=await FriendModel.findOne({
              sender:userreal._id,
              receiver:user._id,
            

            })
            if(check){
              if (check.status==="accepted")
              {
                isfriend="friend"
              }
              else if(check.status==="pending")
              {
                isfriend="pending"
              }
            }
            else{
              const check=await FriendModel.findOne({
                sender:user._id,
                receiver:userreal._id,
              
  
              })
              if(check){
                if (check.status==="accepted")
                {
                  isfriend="friend"
                }
                else if(check.status==="pending")
                {
                  isfriend="pending"
                }
            }




          }
        }

      }
      if(!isfriend)
      {
             isfriend="not friend"
      }
    }
          

        
        
 

        return {
          userId: userId,
          name: user.name,
          profileImage: profile.profileImageUrl,
          mode: user.mode,
          status: isFollowing ? "follow" : "not follow",
          friendstatus: isfriend,
          nameofurl: userExist.name,
          username: user.username,
        };
      });

      const profileImageMap = await Promise.all(profileImagePromises);
      console.log(profileImageMap, "#########$$$$$$$$$$$");

      // Send the profileImageMap back in the response
      res.status(200).json({ profileImageMap });
    } else if (req.body.whypart === "followers" && req.body.realuser) {
      const userExist = await userRegister.findOne({
        username: req.body.username,
      });
      const userreal = await userRegister.findOne({
        username: req.body.realuser,
      });

      if (!userExist || !userreal) {
        return res.status(404).json({ error: "User not found" });
      }

      const profile = await profilemodel.findOne({
        user: userExist._id,
      });
      const followersIds = profile.followers.map((item) => item._id);

      const profileImagePromises = followersIds.map(async (userId) => {
        const user = await userRegister.findOne({ _id: userId });
        const profile = await profilemodel.findOne({ user: userId });

        if (!user || !profile) {
          // Handle if user or profile not found
          throw new Error(`User or profile not found for user ID: ${userId}`);
        }
        var isFollower;
        var isfriend;
        if (user.mode === "creator") {
          isFollower = await profilemodel.exists({
            user: userreal._id,
            followers: userId,
          });
        }
        if (user.mode === "explore") {
          isfriend = await profilemodel.exists({
            user: userreal._id,
            friends: userId,
          });
        }

        return {
          userId: userId,
          name: user.name,
          profileImage: profile.profileImageUrl,
          mode: user.mode,
          status: isFollower ? "follow" : "not follow",
          friendstatus: isfriend ? "friend" : "not friend",
          nameofurl: userExist.name,
          username: user.username,
        };
      });

      const profileImageMap = await Promise.all(profileImagePromises);
      console.log(profileImageMap, "#########$$$$$$$$$$$");

      // Send the profileImageMap back in the response
      res.status(200).json({ profileImageMap });
    } else if (req.body.whypart === "connections" && req.body.realuser) {
      const userExist = await userRegister.findOne({
        username: req.body.username,
      });
      const userreal = await userRegister.findOne({
        username: req.body.realuser,
      });

      if (!userExist || !userreal) {
        return res.status(404).json({ error: "User not found" });
      }

      const profile = await profilemodel.findOne({
        user: userExist._id,
      });
      const friendsIds = profile.friends.map((item) => item._id);

      const profileImagePromises = friendsIds.map(async (userId) => {
        const user = await userRegister.findOne({ _id: userId });
        const profile = await profilemodel.findOne({ user: userId });

        if (!user || !profile) {
          // Handle if user or profile not found
          throw new Error(`User or profile not found for user ID: ${userId}`);
        }
        var isfriendcretor;
        var isfriend;
        if (user.mode === "creator") {
          isfriendcretor = await profilemodel.exists({
            user: userreal._id,
            friends: userId,
          });
        }
        if (user.mode === "explore") {
          isfriend = await profilemodel.exists({
            user: userreal._id,
            friends: userId,
          });
        }
          
        return {
          userId: userId,
          name: user.name,
          profileImage: profile.profileImageUrl,
          mode: user.mode,
          status: isfriendcretor ? "follow" : "not follow",
          friendstatus: isfriend ? "friend" : "not friend",
          nameofurl: userExist.name,
          username: user.username,
        };
      });

      const profileImageMap = await Promise.all(profileImagePromises);
      console.log(profileImageMap, "#########$$$$$$$$$$$");

      // Send the profileImageMap back in the response
      res.status(200).json({ profileImageMap });
    } else {
      // res.status(200).json({message:"invalid"})
      const userExist = await userRegister.findOne({
        username: req.body.username,
      });
      if (!userExist) {
        return res.status(404).json({ error: "User not found" });
      }

      const profile = await profilemodel.findOne({
        user: userExist._id,
      });
      const followingIds = profile.following.map((item) => item._id);

      const profileImagePromises = followingIds.map(async (userId) => {
        const user = await userRegister.findOne({ _id: userId });
        const profile = await profilemodel.findOne({ user: userId });

        if (!user || !profile) {
          // Handle if user or profile not found
          throw new Error(`User or profile not found for user ID: ${userId}`);
        }

        return {
          userId: userId,
          name: user.name,
          profileImage: profile.profileImageUrl,
          mode: user.mode,
          status: "follow",
          friendstatus: "friend",
          nameofurl: userExist.name,
          username: user.username,
        };
      });

      const profileImageMap = await Promise.all(profileImagePromises);
      console.log(profileImageMap, "#########$$$$ggdgfdgfdgfdg$$$$$$$");

      // Send the profileImageMap back in the response
      res.status(200).json({ profileImageMap });
    }
  } catch (error) {
    console.error("Error in followAndConnections:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
