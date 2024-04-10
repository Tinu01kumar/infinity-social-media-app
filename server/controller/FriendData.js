import FriendModel from "../models/SendFriendRequest.js";
import profilemodel from "../models/profile.js";
import userRegister from "../models/userRegister.js";

export const FriendCard = async (req, res) => {
  try {
    console.log("DDDFWE", req.body.username);

    if (req.body.username) {
      const userExist = await userRegister
        .find(
          {
            active: "active",
          },
          { _id: 1, name: 1, mode: 1, username: 1 }
        )
        .sort({ updated_at: -1 });

      console.log(
        "fgdsfsfsdf",
        userExist,
        "@@@------------------------------------------------------@@@@@@@"
      );
      const userNameMap = {};
      const userUsernameMap = {};
      const profileImageMap = {};

      userExist.forEach((user) => {
        userNameMap[user._id] = user.name;
        userUsernameMap[user._id] = user.username;
      });

      const userids = userExist.map((user) => user._id);
      const profileimage = await profilemodel.find({
        user: { $in: userids },
      });

      profileimage.forEach((profile) => {
        profileImageMap[profile.user] = profile.profileImageUrl;
      });

      console.log(userNameMap, "#################");

      const friendExist = await profilemodel.findOne({
        username: req.body.username,
      });

      const result = await Promise.all(
        userExist.map(async (user) => {
          const isFriend = await FriendModel.findOne({
            $or: [
              { sender: friendExist.user, receiver: user._id },
              { sender: user._id, receiver: friendExist.user },
            ],
          });
          if (!isFriend) {
            return {
              id: user._id,
              name: userNameMap[user._id],
              username: userUsernameMap[user._id],
              profileimage: profileImageMap[user._id],
            };
          }
          return null;
        })
      );
      
      // Filter out null values from the result array
      const filteredResult = result.filter(item => item !== null);
      
      res.status(200).json({ success: true, data: filteredResult });
      
    } else {
      res
        .status(400)
        .json({ success: false, message: "Missing username in request body" });
    }
  } catch (error) {
    console.error(`Error while fetching friend cards: ${error}`);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const CheckFriendStatus = async (req, res) => {
  try {
    const loginUserid = req.body.LoginUserId;
    var result;
    const frienddata = await userRegister.findOne({
      username: req.body.usernameFromParmas
    });
    const profiledata = await profilemodel.findOne({
      username: req.body.usernameFromParmas
    });

    if (frienddata.mode === "explore") {
      const isFriend = await FriendModel.findOne({
        $or: [
          { sender: loginUserid, receiver: frienddata._id },
          { sender: frienddata._id, receiver: loginUserid }
        ]
      });

      if (isFriend) {
        if (isFriend.status === "pending") {
          result = "pending";
        } else if (isFriend.status === "accepted") {
          result = "connected";
        } else {
          result = "connect";
        }
      } else {
        result = "connect"; // If no friend relationship found, default to "connect"
      }
    } else if (frienddata.mode === "creator") {
      if (profiledata) {
        if (profiledata.followers.includes(loginUserid)) {
          result = "following";
        } else {
          result = "follow";
        }
      }
    }
    res.json({
      status: true,
      result,
      mode: frienddata.mode
    });
  } catch (error) {
    console.error("Error in CheckFriendStatus:", error);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};
