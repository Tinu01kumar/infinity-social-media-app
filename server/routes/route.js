import express from "express";
import {
  createUser,
  emailVerificaton,
  forgotpassword,
  googleaccount,
  login,
  logout,
  otpverification,
  resetpassword,
  updateName,
} from "../controller/usercontroller.js";
import {
  uploadProfileImage,
  getProfielDetails,
  uploadBannerImage,
  changeCreatorMode,
} from "../controller/profile.js";
import { upload } from "../middleware/profileImageUpload.js";
import {
  createPost,
  updatedPost,
  getAllPostOfUser,
  getprofileimage,
  getallpost,
  LikedPost,
  commentSection,
  DeleteComment,
  deletePost,
  FetchComments
} from "../controller/post.js";
import {
  SendfriendRequest,
  friendRequestBack,
  getAllUserFriends,
  AcceptFriendRequest,
  IgnoreFriendRequest,
  Follow,
  NotFollowing,
  followAndConnections,
} from "../controller/FriendsSystem.js";
import { FriendCard , CheckFriendStatus } from "../controller/FriendData.js";
const router = express.Router();
// *************************authemtication********************************\\
router.post("/auth/signup", createUser);
router.post("/auth/login", login);
router.post("/auth/forgotpassword", forgotpassword);
router.post("/auth/otpverification/:id", otpverification);
router.post("/auth/changepassword/:id", resetpassword);
router.post("/auth/verify/:token/:id", emailVerificaton);
router.post("/auth/googleaccount", googleaccount);
router.post("/auth/logout", logout);
//*************************** profile image upload ***************************/
router.post("/upload/profileimage", upload.single("image"), uploadProfileImage);
router.post("/profile-details", getProfielDetails);
router.post("/upload/bannerimage", upload.single("image"), uploadBannerImage);
//****************************POST******************************************** */
router.post("/createpost", upload.single("image"), createPost);
router.post("/getalluserpost", getAllPostOfUser);
router.post("/getprofileimage", getprofileimage);
router.post("/getallpost", getallpost);
router.post("/creatorMode", changeCreatorMode);
router.post("/friendRequest", SendfriendRequest);
router.post("/getfriends", getAllUserFriends);
router.post("/acceptedFriendRequest", AcceptFriendRequest);
router.post("/ignoreFriendRequest" , IgnoreFriendRequest)
router.post("/follow" , Follow)
router.post("/notfollowing", NotFollowing)
router.post("/requestback" , friendRequestBack)

router.post("/followAndConnections" , followAndConnections)
router.post("/fetchcomments" ,FetchComments)
router.post("/updatepost/:id" , upload.single("image"),  updatedPost)
router.post("/deletepost" , deletePost)
router.post("/likedpost" , LikedPost)
router.post("/comment" , commentSection)
router.post("/deletecomment", DeleteComment)

router.post("/friendcard", FriendCard)
router.post("/checkFriendStatus",CheckFriendStatus)

router.post("/updateName", updateName)
export default router;
