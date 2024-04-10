import profilemodel from "../models/profile.js";
import userRegister from "../models/userRegister.js";
import PostModel from "../models/createPost.js";
import FriendModel from "../models/SendFriendRequest.js";

export const createPost = async (req, res) => {
  try {
    const userExist = await userRegister.findOne({
      username: req.query.data.username,
      email: req.query.data.email,
    });

    if (userExist) {
      const now = new Date();
      const newpost = new PostModel({
        userId: userExist._id,

        description: req.query.data.description,
        postImage: req.file ? req.file.location : "",
        created_at: now,
        updated_at: now,
        username: req.query.data.username,
      });

      try {
        const result = await newpost.save();

        if (result) {
          res.json({
            status: true,
            message: "post created",
          });
        } else {
          res.json({
            status: false,
            message: "post not created",
          });
        }
      } catch (saveError) {
        console.error(saveError);
        res.json({
          status: false,
          message: `Error while saving post: ${saveError}`,
        });
      }
    } else {
      res.json({
        status: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      status: false,
      message: `Error while creating post: ${error}`,
    });
  }
};

export const updatedPost = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.query.data, "##########DDDDDDDDDDDD");
    const postExist = await PostModel.findOne({
      _id: req.params.id,
    });
    console.log(postExist, "############");

    if (postExist) {
      const now = new Date();
      if (req.file) {
        await PostModel.findByIdAndUpdate(req.params.id, {
          postImage: req.file.location,
          description: req.query.data.description,
          updated_at: now,
        });
      } else {
        const result = await PostModel.findByIdAndUpdate(req.params.id, {
          description: req.query.data.description,
          updated_at: now,
        });
        console.log(result, "######");
      }

      res.json({
        status: true,
        message: "post updated",
      });
    } else {
      res.json({
        status: false,
        message: "post not exist",
      });
    }
  } catch (error) {
    res.json({
      status: false,
      message: `error while post updation:${error}`,
    });
  }
};

export const deletePost = async (req, res) => {
  console.log(req.body.postid, "#######");
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.body.postid);
    if (deletedPost) {
      res.json({
        status: true,
        message: "Post deleted successfully",
      });
    } else {
      res.json({
        status: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error deleting post: ${error}`,
    });
  }
};

export const getAllPostOfUser = async (req, res) => {
  try {
    console.log("hkhjk, ", req.body.usingusername);

    const getpostuser = await userRegister.findOne({
      username: req.body.username,
    });
    var likedid;
    if (req.body.usingusername) {
      likedid = req.body.usingusername;
    } else {
      likedid = req.body.usingusername;
    }
    const page = req.body.page;
    console.log("page ddfdsfsd", page);
    let resultperpage = 10;
    const findallpost = await PostModel.find({
      userId: getpostuser._id,
    })
      .skip(page * resultperpage)
      .limit(resultperpage)
      .sort({ updated_at: -1 });

    if (findallpost) {
      const postsWithDetails = await Promise.all(
        findallpost.map(async (post) => {
          const likesCount = post.likes.length;

          const liked = post.likes.includes(likedid);

          const commentsWithDetails = await Promise.all(
            post.comments.map(async (comment) => {
              const userprofile = await profilemodel.findOne({
                user: comment.userId,
              });

              return {
                userId: comment.userId,
                comment: comment.comment,
                profileImage: userprofile ? userprofile.profileImageUrl : null,
                updated_at: comment.updated_at,
                commentid: comment._id,
              };
            })
          );

          return {
            id: post._id,
            description: post.description,
            postImage: post.postImage,
            likesCount: likesCount,
            comments: commentsWithDetails,
            likedpost: liked ? "liked" : "not liked",
          };
        })
      );

      res.json({
        postsWithDetails,
        status: true,
        userid:getpostuser._id
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getprofileimage = async (req, res) => {
  try {
    const userexist = await userRegister.findOne({
      username: req.body.username,
      email: req.body.email,
    });
    if (userexist) {
      const profiledata = await profilemodel.findOne({
        user: userexist._id,
      });
      if (profiledata) {
        const profileimageurl = profiledata.profileImageUrl;

        res.json({
          status: true,
          profileimageurl: profileimageurl,
        });
      } else {
      }
    }
  } catch (error) {}
};

export const getallpost = async (req, res) => {
  try {
    if (req.body.username) {
      try {
      //  console.log(req.body, "DDDDDDDDDD");
        const userExist = await userRegister.find(
          {
            active: "active",
          },
          { _id: 1, name: 1, mode: 1, username: 1 }
        );

        const userIdTONameMap = {};
        const userIdToModeMap = {};
        const userIdToUserName = {};
        userExist.forEach((user) => {
          (userIdTONameMap[user._id] = user.name),
            (userIdToModeMap[user._id] = user.mode),
            (userIdToUserName[user._id] = user.username);
        });
        // console.log(userIdToUserName, "@@@@@@@@@@@@@@@@@@@@");
        const userIds = userExist.map((user) => user._id);
        const profilesimage = await profilemodel.find({
          user: { $in: userIds },
        });

        const profileImageMap = {};
        const bannerImgaeMap = {};

        profilesimage.forEach((profile) => {
          profileImageMap[profile.user] = profile.profileImageUrl;
          bannerImgaeMap[profile.user] = profile.profileBannerImageUrl;
        });

        const { username, email, page } = req.body;
        let resultperpage = 5;

        // console.log(page , "@@@@@@@@@@@")
        const posts = await PostModel.find({ userId: { $in: userIds } })
          .skip(page * resultperpage)
          .limit(resultperpage)
          .sort({ updated_at: -1 });

        const userdescriptionmap = {};
        const userpostimagesmap = {};
        const updatedAtmap = {};

        const UserToCheckFriendStatus = await userRegister.findOne({
          username,
          email,
        });
        const Following = await profilemodel.find({
          userId: UserToCheckFriendStatus._id,
        });
        
        const followmap = {}; 
        const likedpost = {};
        const friendmap = {};
        const countlike = {};
        const commentsMap = {};
        for (const post of posts) {
          userdescriptionmap[post._id] = post.description;
          userpostimagesmap[post._id] = post.postImage;
          updatedAtmap[post._id] = post.updated_at;
          const isliked = post.likes.includes(UserToCheckFriendStatus._id);
          likedpost[post._id] = isliked ? "liked" : "not liked";

          countlike[post._id] = post.likes.length;
          
          const checkFollowExist = await profilemodel.findOne({
            user: UserToCheckFriendStatus._id,
            following: post.userId,
          });
        
          if (
            checkFollowExist &&
            checkFollowExist.following.includes(post.userId)
          ) {
            followmap[post.userId] = "follow";
          } else {
            followmap[post.userId] = "not follow";
          }

          const comments = await PostModel.findOne({ _id: post._id });
          if (comments) {
            commentsMap[post._id] = comments.comments
              .sort((a, b) => b.updated_at - a.updated_at) // Sort comments by updated_at in descending order
              .map((comment) => ({
                userId: comment.userId,
                commentText: comment.comment,
                profileimage: comment.profileImage,
                commentid: comment._id,
              }));
          } else {
            commentsMap[post._id] = []; 
          }
         
      

        }

        const result = posts
          .filter(
            (post) =>
              post.userId.toString() !== UserToCheckFriendStatus._id.toString()
          ) // Filter out posts by UserToCheckFriendStatus
          .map((post) => ({
            id: post.userId,
            postId: post._id,
            name: userIdTONameMap[post.userId],
            username: userIdToUserName[post.userId],
            mode: userIdToModeMap[post.userId],
            profileimage: profileImageMap[post.userId] || "",
            bannerimage: bannerImgaeMap[post.userId] || "",
            description: userdescriptionmap[post._id] || "",
            postimage: userpostimagesmap[post._id] || "",
            updated_at: updatedAtmap[post._id] || "",
            // status: friendStatusMap[post.userId.toString()] || "normal", // Include friend status or "normal" if not found
            followstatus: followmap[post.userId], // Include follow status or "not follow" if not found
            likedpost: likedpost[post._id],
            countlike: countlike[post._id],
            comments: commentsMap[post._id],
            // friendmap:friendmap[post._id] || "normal"
          }));

        result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
     //   console.log(result);
        res.json({
          status: true,
          result: result || [],
        });
      } catch (error) {
        res.json({
          message: `Error while creating post data: ${error}`,
          status: false,
        });
      }
    } else {
     // console.log(req.body, "DDDDDDDDDD");
      const userExist = await userRegister.find(
        {
          active: "active",
        },
        { _id: 1, name: 1, mode: 1, username: 1 }
      );
     // console.log("2");
      const userIdTONameMap = {};
      const userIdToModeMap = {};
      const userIdToUserName = {};
      userExist.forEach((user) => {
        (userIdTONameMap[user._id] = user.name),
          (userIdToModeMap[user._id] = user.mode),
          (userIdToUserName[user._id] = user.username);
      });
      // console.log(userIdToUserName, "@@@@@@@@@@@@@@@@@@@@");
      const userIds = userExist.map((user) => user._id);
      const profilesimage = await profilemodel.find({ user: { $in: userIds } });

      const profileImageMap = {};
      const bannerImgaeMap = {};

      profilesimage.forEach((profile) => {
        profileImageMap[profile.user] = profile.profileImageUrl;
        bannerImgaeMap[profile.user] = profile.profileBannerImageUrl;
      });

      const { page } = req.body;
      let resultperpage = 10;

      // console.log(page , "@@@@@@@@@@@")
      const posts = await PostModel.find({ userId: { $in: userIds } })
        .skip(page * resultperpage)
        .limit(resultperpage)
        .sort({ updated_at: -1 });
      console.log("#", posts);
      const userdescriptionmap = {};
      const userpostimagesmap = {};
      const updatedAtmap = {};

      const countlike = {};
      const commentsMap = {};
      for (const post of posts) {
        userdescriptionmap[post._id] = post.description;
        userpostimagesmap[post._id] = post.postImage;
        updatedAtmap[post._id] = post.updated_at;

        countlike[post._id] = post.likes.length;

        const comments = await PostModel.findOne({ _id: post._id });
        if (comments) {
          commentsMap[post._id] = comments.comments
            .sort((a, b) => b.updated_at - a.updated_at) // Sort comments by updated_at in descending order
            .map((comment) => ({
              userId: comment.userId,
              commentText: comment.comment,
              profileimage: comment.profileImage,
              commentid: comment._id,
            }));
        } else {
          commentsMap[post._id] = []; // Set empty array if no comments found for the post
        }
      }
    //  console.log("%", posts);
      const result = posts.map((post) => ({
        id: post.userId,
        postId: post._id,
        name: userIdTONameMap[post.userId],
        username: userIdToUserName[post.userId],
        mode: userIdToModeMap[post.userId],
        profileimage: profileImageMap[post.userId] || "",
        bannerimage: bannerImgaeMap[post.userId] || "",
        description: userdescriptionmap[post._id] || "",
        postimage: userpostimagesmap[post._id] || "",
        updated_at: updatedAtmap[post._id] || "",
        status: "", // Include friend status or "normal" if not found
        followstatus: "", // Include follow status or "not follow" if not found
        likedpost: "",
        countlike: countlike[post._id],
        comments: commentsMap[post._id],
      }));

   //  console.log("DDFD", result);
      result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      res.json({
        status: true,
        result: result || [],
      });
    }
  } catch (error) {
    res.json({
      message: `Error while creating post data: ${error}`,
      status: false,
    });
  }
};

export const LikedPost = async (req, res) => {
  try {
    const user = await userRegister.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await PostModel.findOne({ _id: req.body.postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(user._id);
    if (isLiked) {
      await PostModel.findByIdAndUpdate(post._id, {
        $pull: { likes: user._id },
      });
      res.status(200).json({ message: "user remove from likes" });
    } else {
      await PostModel.findByIdAndUpdate(post._id, {
        $push: { likes: user._id },
      });
      res.status(200).json({ message: "User added to likes" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const commentSection = async (req, res) => {
  console.log(req.body);
  try {
    if (req.body.commentText) {
      const userId = await userRegister.findOne({
        username: req.body.username,
      });
      const profileimage = await profilemodel.findOne({
        user: userId,
      });

      console.log("FDDDD");
      const postdata = await PostModel.findOne({
        _id: req.body.postId,
      });

      if (postdata) {
        // Check if the user has already commented

        // If the user has not commented, add a new comment
        const newComment = {
          userId: userId._id,
          comment: req.body.commentText,
          profileImage: profileimage.profileImageUrl,
          updated_at: new Date(),
        };

        postdata.comments.push(newComment);
        const result = await postdata.save();
        console.log(result);
        newComment.commentid = result.comments[result.comments.length - 1]._id; 
        console.log(newComment, "########################");
        return res.status(200).json({
          status: true,
          comment: newComment,
          message: "Comment added successfully",
        });
      } else {
        return res
          .status(404)
          .json({ status: false, message: "Post not found" });
      }
    } else {
      return res.status(200).json({ status: false, message: "No comments" });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export const DeleteComment = async (req, res) => {
  try {
    console.log("FFFFFFFFFFFFFFFF");
    const { commentid, postid } = req.body;

    // Find the post by its ID
    const post = await PostModel.findById(postid);

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    // Find the index of the comment with the given commentid in the post's comments array
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentid
    );

    if (commentIndex === -1) {
      return res
        .status(404)
        .json({ status: false, message: "Comment not found" });
    }

    // Remove the comment from the post's comments array
    post.comments.splice(commentIndex, 1);

    // Save the updated post
    await post.save();

    return res
      .status(200)
      .json({ status: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};



export const FetchComments = async (req, res) => {
  try {
    const commentsMap = {};
    const comments = await PostModel.findOne({ _id: req.body.postId });

    if (comments) {
      commentsMap[req.body.postId] = comments.comments
        .sort((a, b) => b.updated_at - a.updated_at) // Sort comments by updated_at in descending order
        .map((comment) => ({
          userId: comment.userId,
          commentText: comment.comment,
          profileimage: comment.profileImage,
          commentid: comment._id,
        }));
    } else {
      commentsMap[req.body.postId] = []; // Set empty array if no comments found for the post
    }

    console.log(commentsMap[req.body.postId]);

    // Send the comments back in the response
    res.json({ comments: commentsMap[req.body.postId] });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
