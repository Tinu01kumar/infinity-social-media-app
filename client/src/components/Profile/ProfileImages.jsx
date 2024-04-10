import React, { useState, useEffect, useRef } from "react";
import Header from "../Header";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import MainCreatePost from "../post/MainCreatePost";
import styled from "styled-components";
import defaultBannerImage from "../image/banner.png";
import defaultProfileImage from "../image/profile.jpg";
import Cookies from "js-cookie";
import axios from "axios";

import ProfileContent from "./ProfileContent";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ImageAndName from "./ImageAndName";
import Diversity3 from "@mui/icons-material/Diversity3";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

import defaultimage from "../image/defaultprofileimage.jpg";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

const ProfileContainer = styled.div`
  text-align: center;
`;
const Bannerdiv = styled.div`
  width: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 350px;
    object-fit: cover;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-top: -75px;
  border: 5px solid #fff;
  cursor: pointer;
`;
const BannerEditButton = styled.button`
  position: absolute;
  top: 120px;
  right: 50px;

  background-color: transparent;

  border: none;
`;

const EditModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  z-index: 999;

  img {
    max-width: 100%;
    height: auto;
    max-height: 450px;
    margin-bottom: 15px;
  }
`;

const TemporaryImage = styled.img`
  max-width: 100%;
  height: auto;
  max-height: 150px; /* Adjust the max height as needed */
  margin-bottom: 15px;
`;

const Button = styled.label`
  cursor: pointer;
  padding: 12px 30px; /* Adjust top and bottom padding */
  background-color: #7360df;
  color: #fff;

  border-radius: 0.3rem;
`;
const Buttonupload = styled.label`
  cursor: pointer;
  display: inline-block;
  padding: 0px 10px;

  background-color: #3498db;
  color: #fff;
  background-color: transparent;
  color: #7360df;

  border-radius: 5px;
`;
const FileInput = styled.input`
  display: none;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Section = styled.div`
  background-color: white;
  padding: 1rem 2rem;
  width: 96%;
  max-width: 475px;
  border-radius: 1rem;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @media (max-width: 600px) {
    padding: 1rem 1.6rem;
    width: 90%;
  }
  @media (max-width: 500px) {
    width: 90%;
    padding: 1rem 1rem;
  }
  position: relative;
  z-index: 3;
`;

const Buttoncre = styled.button`
  background-color: #eee;
  border-radius: 3rem;
  padding: 0.8rem 2rem;
  border: 1px solid black;
  padding-right: 23%;
  text-align: center;
  margin: 10px;
  cursor: pointer;
  &:hover {
    background-color: #7360df;
    color: white;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SmallImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: 4px;
  border: 5px solid #fff;
  cursor: pointer;
`;

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PostBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 96%;
  max-width: 530px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PostContent = styled.div`
  padding: 20px;
`;

const PostImage = styled.img`
  width: 100%;
  max-height: auto;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;
const Description = styled.p`
  font-size: 16px;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 2rem;
`;

const ImageWrapper = styled.div`
  margin-right: 10px;
  margin-top: -4px;
`;

const UserName = styled.div`
  font-weight: bold;
`;

const Followconcept = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  gap: 2rem;
  @media (max-width: 400px) {
    gap: 1rem;
  }
`;
const OptionsDiv = styled.div`
  background-color: #fff;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  top: 5rem; /* Adjust the distance from the dot button */
  right: 0;
  display: ${(props) =>
    props.showOptions ? "block" : "none"}; /* Show or hide based on props */
  div {
    padding: 0.5rem 2rem;
  }
`;

const OptionsContainer = styled.div`
  position: relative;
  display: inline-block;
`;
const SeeMoreLink = styled.span`
  color: blue;
  cursor: pointer;
`;
const CommentAndLikeSection = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #ccc;
  text-align: center;
  align-item: center;
`;
const CommentSection = styled.div`
  padding: 10px;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: space-around;
  text-align: center;
  align-item: center;
`;

const Dot = styled.h1`
  cursor: pointer;

  position: relative;
  z-index: 1;
`;

const RealComments = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem;

  div {
    display: flex;
    margin-bottom: 9px;

    align-items: flex-start;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 9px;
  }
`;
const CommentText = styled.div`
  margin-top: 0.5rem;
  background-color: #eee;
  padding: 0.5rem 0.7rem 0.5rem 0.7rem;
  text-align: center;
`;
const CommentSendSection = styled.div`

                  
  cursor: pointer;

  padding:1rem;
}
`;
const LikedButtonSection = styled.div`
  display: flex;
  padding: 0rem 2rem;
`;
const Textareasection = styled.div`
  position: relative;
  padding-right: 4rem; /* Adjust the padding to accommodate the smiley image */

  margin-top: 9px;
  color: black;
  textarea {
    border-radius: 4rem;

    padding: 0.6rem 3rem 0rem 0.8rem; /* Adjust padding to make room for the smiley image */
    width: 100%;
    resize: none;
    height: auto;
    color: black;
    background-color: transparent;
    &::placeholder {
      color: black;
    }
  }
  textarea:hover {
    color: black;
  }
`;
const LikedButton = styled.button`
  border: none;
  background-color: white;

  font-weight: 800;
  padding: 1rem;
  &:hover {
  }
`;

const CommentButton = styled.button`
  border: none;
  background-color: white;
  padding: 0rem 2rem;
  border-radius: 3px;
  &:hover {
    background-color: #eee;
  }
`;

const FriendStatusButton=styled.button`
padding: 0.5rem 1.1rem;
font-size: 1rem;
border-radius: 5px;
margin-top:10px;
border: none;
text-align: center;
color: white;
cursor: pointer;
background-color: #7360df;
margin-bottom:10px;
&:hover {
  background-color: #5c4acd;
}
`
var paramsuserid;
const ProfileImages = () => {
  const [bannerImage, setBannerImage] = useState(defaultBannerImage);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [tempBannerImage, setTempBannerImage] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showBannerEditModal, setShowBannerEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState({});
  const [textareaValue, setTextareaValue] = useState("");
  const [commentsVisible, setCommentsVisible] = useState({});
  const [image, setimage] = useState(null);
  const [bannerimagesend, setbannerimagesend] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showpost, setShowpost] = useState(null);
  const [name, setName] = useState("");
  const [following, setfollowing] = useState("");
  const [followers, setfollowers] = useState("");
  const [connection, setConnection] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);
  const [openComments, setOpenComments] = useState({});
  const [comments, setcomments] = useState();
  const [likeCounts, setLikeCounts] = useState({});
  const [showOptions, setShowOptions] = useState({});
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bannerloading, setbannerloading] = useState(false);
  const [imageshow, setshowimage] = useState(defaultimage);
  const [checkFriendStatus, setFriendStatus] = useState();
  const usernameFromParmas = location.pathname.split("/").pop();
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTextareaValue(e.target.value);
  };
  var usernamemodes;
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/profile-details`,
        {
          params: {
            username: usernameFromParmas,
          },
        }
      );
      setName(res.data.details.name);
      setfollowers(res.data.details.follower);
      setfollowing(res.data.details.following);
      setConnection(res.data.details.friends);
      console.log(res.data.details.name, "@@@@@@@@@@@@################");
      console.log(res.data.details.profileImageUrl);
      Cookies.set("profileimageurl", res.data.details.profileImageUrl);
      Cookies.set(
        "profilebannerimageurl",
        res.data.details.profileBannerImageUrl
      );

      if (res.data.details.profileImageUrl) {
        setProfileImage(res.data.details.profileImageUrl);
        setimage(res.data.details.profileImageUrl);
      }
      if (res.data.details.profileBannerImageUrl) {
        setBannerImage(res.data.details.profileBannerImageUrl);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const data = {
      username: usernameFromParmas,
      usingusername: Cookies.get("userid"),
      page,
    };
    const getuserallpost = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/getalluserpost`,
          data
        );
    
        console.log(response, "@@@@@@@@@@@@@@@@@@");
        if (response.data.status) {
          paramsuserid=response.data.userid;
          console.log(paramsuserid , 'ddddddddddd"')
          setShowpost(response.data.postsWithDetails);
          const likeCounts = {};
          const fetchedComments = {};
          response.data.postsWithDetails.forEach((post) => {
            likeCounts[post.id] = post.likesCount;
            fetchedComments[post.id] = post.comments || [];
          });
          setLikeCounts(likeCounts);
          setcomments(fetchedComments);
          setLoading(false);
        } else {
        }
      } catch (error) {}
    };
    getuserallpost();
  }, []);

  const fetchMoreData = async () => {
    try {
      const nextPage = page + 1; // Increment the page number
      setPage(nextPage);
      const pageSize = 10;
      const data = {
        username: usernameFromParmas,
        usingusername: Cookies.get("userid"),
        page: nextPage,
        pageSize,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/getalluserpost`,
        data
      );

      paramsuserid=response.data.userid;
      console.log(response, "########");
      setShowpost((prevPosts) => [
        ...prevPosts,
        ...response.data.postsWithDetails,
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  const handleBannerImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    setbannerimagesend(file);

    reader.onloadend = () => {
      setTempBannerImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    setimage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempProfileImage(reader.result);
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const applyProfileChanges = async () => {
    setbannerloading(true);
    const username = Cookies.get("username");
    const email = Cookies.get("email");
    const formData = new FormData();
    formData.append("image", image);

    try {
      console.log(username);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload/profileimage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            username: username,
            email: email,
          },
        }
      );

      console.log(res.data.details, "*********************");
      setProfileImage(res.data.details);
      window.location.reload();
      setbannerloading(false);

      closeProfileEditModal();
      if (res) {
      }
    } catch (error) {}

    setProfileImage(tempProfileImage || defaultProfileImage);
  };

  const applyBannerChanges = async () => {
    setbannerloading(true);
    const username = Cookies.get("username");
    const email = Cookies.get("email");
    const formData = new FormData();
    formData.append("image", bannerimagesend);

    try {
      console.log(username);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload/bannerimage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            username: username,
            email: email,
          },
        }
      );

      console.log(res.data.details, "*********************");
      setBannerImage(res.data.details);
      setbannerloading(false);
      closeBannerEditModal();
      if (res) {
      }
    } catch (error) {}

    setBannerImage(tempBannerImage || defaultBannerImage);
  };

  const openProfileEditModal = () => {
    setShowProfileEditModal(true);
  };

  const closeProfileEditModal = () => {
    setShowProfileEditModal(false);
    setTempProfileImage(null);
  };

  const openBannerEditModal = () => {
    setShowBannerEditModal(true);
  };

  const closeBannerEditModal = () => {
    setShowBannerEditModal(false);
    setTempBannerImage(null);
  };
  const handleClick = () => {
    setShowCreatePost(true);
    setSelectedPost(null);
  };

  const handleCloseModal = () => {
    setShowCreatePost(false);
  };

  const toggleDescription = (postId) => {
    setShowFullDescription((prevDescriptionState) => ({
      ...prevDescriptionState,
      [postId]: !prevDescriptionState[postId],
    }));
  };
  const optionsRef = useRef(null);
  const toggleOptions = (postId) => {
    setShowOptions((prevOptions) => ({
      ...prevOptions,
      [postId]: !prevOptions[postId],
    }));

    const otherOptions = Object.keys(showOptions).filter((id) => id !== postId);
    otherOptions.forEach((id) => {
      setShowOptions((prevOptions) => ({
        ...prevOptions,
        [id]: false,
      }));
    });
  };

  const postDelete = async (postid) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/deletepost`,
      {
        postid,
      }
    );
    if (res.data.status) {
      setShowpost((prevPosts) =>
        prevPosts.filter((post) => post.id !== postid)
      );
    }
  };
  const toggleCommentSection = (postId) => {
    setOpenComments({
      ...openComments,
      [postId]: !openComments[postId],
    });
    setCommentsVisible((prevVisible) => ({
      ...prevVisible,
      [postId]: !prevVisible[postId],
    }));
  };
  const handleCommentSection = async (postId) => {
    try {
      const commentText = textareaValue;
      console.log(postId, "@@@@@@@@@@@@");
      console.log(commentText, "#########$$$$$$$$$$$");
      const username = Cookies.get("username");
      if (commentText) {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/comment`,
          {
            commentText,
            postId,
            username,
          }
        );
        if (res.data.status) {
          const newComment = {
            userId: res.data.comment.userId,
            comment: res.data.comment.comment,
            profileImage: res.data.comment.profileImage,
            commentid: res.data.comment.commentid,
          };
          setcomments((prevComments) => ({
            ...prevComments,
            [postId]: [newComment, ...(prevComments[postId] || [])], // Add new comment to the beginning
          }));
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  const handleLike = async (postId, likedCondition) => {
    const username = Cookies.get("username");
    try {
      let alreadyLiked = false;
      if (likedCondition === "liked") {
        alreadyLiked = true;
      }

      if (alreadyLiked) {
        setLikedPosts(likedPosts.filter((id) => id !== postId));
        setLikeCounts((prevCounts) => ({
          ...prevCounts,
          [postId]: prevCounts[postId] - 1,
        }));
        console.log("Updated Like Counts:", likeCounts);
        setShowpost((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likedpost: "not liked" } : post
          )
        );
      } else {
        setLikedPosts([...likedPosts, postId]);
        setLikeCounts((prevCounts) => ({
          ...prevCounts,
          [postId]: (prevCounts[postId] || 0) + 1,
        }));
        console.log("Updated Like Counts:", likeCounts);
        setShowpost((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likedpost: "liked" } : post
          )
        );
      }
      await axios.post(`${process.env.REACT_APP_API_URL}/likedpost`, {
        postId,
        username,
      });
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };
  const postupdate = (postId) => {
    console.log(postId, "fffffffffffffffffffffffffffffffffffffff");
    const selectedPost = showpost.find((post) => post.id === postId);
    setSelectedPost(selectedPost);
    setShowCreatePost(true);
  };
  const handleDeletecomment = async (commentid, postid) => {
    try {
      console.log(commentid, postid);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/deletecomment`,
        {
          commentid,
          postid,
        }
      );
      if (res.data.status) {
        // Update state to remove the deleted comment
        setcomments((prevComments) => ({
          ...prevComments,
          [postid]: prevComments[postid].filter(
            (comment) => comment.commentid !== commentid
          ),
        }));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    const checkFriendStatus = async () => {
      const LoginUserId = Cookies.get("userid");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/checkFriendStatus`,
        { usernameFromParmas, LoginUserId }
      );
      console.log(res.data, "WWWWWWWWWWWWWWW");
      if (res.data.status) {
        setFriendStatus(res.data);
      }
    };
    checkFriendStatus();
  },[]);



  
  const handleExploreMode = async (receiverUserId) => {
    console.log(receiverUserId,"jjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
    const username = Cookies.get("username");
    const receiverId = receiverUserId;
  
    try {
     


      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/friendRequest`,
        { username, receiverId }
      );
  
      if (res.data.status) {
        // Update the state to reflect the pending status
      setFriendStatus({mode:"explore" , result:"pending"})
  
       
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleNotpending = async (receiveruserid) => {
    const userid = Cookies.get("userid");
   
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/requestback`,
      { userid, receiveruserid }
    );
    if (res) {
      console.log("DFDf");
    
      setFriendStatus({mode:"explore" , result:"connect"})
    }
  };


  const handleNotFollow = async (receiveruserid) => {
    const username = Cookies.get("username");
    const email = Cookies.get("email");

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/notfollowing`,
      {
        username,
        email,
        receiveruserid,
      }
    );
    if(res)
    {
      setFriendStatus({mode:"creator" , result:"follow"})
    }

   
  };



  
  const handleCreatorMode = async (recieveruserId) => {
    const username = Cookies.get("username");
    const email = Cookies.get("email");

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/follow`, {
      username,
      email,
      recieveruserId,
    });
      if(res)
      {
        setFriendStatus({mode:"creator" , result:"following"})
      }
      
  };
  return (
    <div>
      <Header profileImageurl={profileImage} />
      <ProfileContainer>
        <EditModal style={{ display: showProfileEditModal ? "block" : "none" }}>
          <div
            style={{
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2>Edit Profile Image</h2>
            <div>
              {" "}
              <Buttonupload onClick={closeProfileEditModal}>
                <CloseIcon />
              </Buttonupload>
            </div>
          </div>
          {profileImage && (
            <TemporaryImage
              src={tempProfileImage || profileImage}
              alt="Temporary Profile"
            />
          )}
          <ButtonSection>
            {bannerloading ? (
              <div style={{ textAlign: "center", marginTop: "" }}>
                <CircularProgress />
              </div>
            ) : (
              <>
                <Buttonupload htmlFor="profileImageUpload">
                  <CloudUploadIcon style={{ fontSize: "3rem" }} />
                </Buttonupload>
                <FileInput
                  id="profileImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                />
                <Button onClick={applyProfileChanges}>Apply</Button>
              </>
            )}
          </ButtonSection>
        </EditModal>

        <EditModal style={{ display: showBannerEditModal ? "block" : "none" }}>
          <div
            style={{
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2>Edit Banner Image</h2>
            <Buttonupload onClick={closeBannerEditModal}>
              <CloseIcon />
            </Buttonupload>
          </div>
          {bannerImage && (
            <TemporaryImage
              src={tempBannerImage || bannerImage}
              alt="Temporary Banner"
            />
          )}
          <ButtonSection>
            {bannerloading ? (
              <div style={{ textAlign: "center", marginTop: "" }}>
                <CircularProgress />
              </div>
            ) : (
              <>
                <Buttonupload htmlFor="bannerImageUpload">
                  <CloudUploadIcon style={{ fontSize: "3rem" }} />
                </Buttonupload>
                <FileInput
                  id="bannerImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageUpload}
                />
                <Button onClick={applyBannerChanges}>Apply</Button>
              </>
            )}
          </ButtonSection>
        </EditModal>

        {bannerImage && (
          <Bannerdiv>
            <img src={bannerImage} alt="Banner" />
            {usernameFromParmas === Cookies.get("username") ? (
              <BannerEditButton onClick={openBannerEditModal}>
                <EditIcon style={{ color: "black" }} />
              </BannerEditButton>
            ) : null}
          </Bannerdiv>
        )}

        <ProfileImage
          src={profileImage || defaultProfileImage}
          alt="Profile"
          onClick={
            usernameFromParmas === Cookies.get("username")
              ? openProfileEditModal
              : null
          }
        />
      </ProfileContainer>

      <div>
      <div style={{display:"flex" , justifyContent:"center" , textAlign:"center" , alignItems:"center" , gap:"1rem"}}>
      
    
        <ProfileContent name={name}  differentusername={usernameFromParmas} />
        <div>
        {checkFriendStatus && (
          <>
            {checkFriendStatus.mode === "explore" && (
              <>
                {checkFriendStatus.result === "connect" ? (
                  <FriendStatusButton onClick={() => handleExploreMode(paramsuserid)}>+ Connect</FriendStatusButton>
                ) : checkFriendStatus.result === "connected" ? (
                  <FriendStatusButton onClick={()=>handleNotpending(paramsuserid)}>Connected</FriendStatusButton>
                ) : checkFriendStatus.result === "pending" && (
                  <FriendStatusButton onClick={()=>handleNotpending(paramsuserid)}>Pending</FriendStatusButton>
                )}
              </>
            )}
            {checkFriendStatus.mode === "creator" &&
              (checkFriendStatus.result === "follow" ? (
                <FriendStatusButton  onClick={() => handleCreatorMode(paramsuserid)}>Follow</FriendStatusButton>
              ) : checkFriendStatus.result === "following" && (
                <FriendStatusButton onClick={() => handleNotFollow(paramsuserid)}>Following</FriendStatusButton>
              ))}
          </>
        )}
      </div>
      
        </div>
        <Followconcept>
          <Link to={`/${usernameFromParmas}/following`}>
            <div>Following {following}</div>{" "}
          </Link>
          <Link to={`/${usernameFromParmas}/followers`}>
            <div>Followers {followers}</div>{" "}
          </Link>
          <Link to={`/${usernameFromParmas}/connections`}>
            <div> Connection {connection}</div>{" "}
          </Link>

          {usernameFromParmas === Cookies.get("username") ? (
            <Link to={`mode`}>Mode</Link>
          ) : null}
        </Followconcept>
      </div>
      {usernameFromParmas === Cookies.get("username") ? (
        <div>
          <Section>
            <SmallImage src={profileImage || defaultProfileImage} />
            <Buttoncre onClick={handleClick}>Show your activity</Buttoncre>
            {showCreatePost && (
              <ModalBackground onClick={handleCloseModal}>
                <MainCreatePost
                  onClose={handleCloseModal}
                  image={profileImage || defaultProfileImage}
                  selectedPost={selectedPost}
                />
              </ModalBackground>
            )}
          </Section>
        </div>
      ) : null}

      <div>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <CircularProgress />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={showpost.length}
            next={fetchMoreData}
            hasMore={true}
            // loader={<CircularProgress />}
            endMessage={<p>No more posts to load</p>}
            scrollableTarget="scrollableDiv"
          >
            <PostContainer>
              {showpost &&
                showpost.map((post, index) => (
                  <PostBox key={index}>
                    <PostContent>
                      <div
                        style={{
                          display: "flex",
                          textAlign: "center",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "-2rem",
                          marginBottom: "-2rem",
                        }}
                      >
                        <div>
                          <UserInfo>
                            <ImageWrapper>
                              <SmallImage
                                src={profileImage || defaultProfileImage}
                              />
                            </ImageWrapper>

                            <UserName>{name}</UserName>
                          </UserInfo>
                        </div>
                      </div>

                      <Description expand={showFullDescription[post.id]}>
                        {showFullDescription[post.id]
                          ? post.description
                          : post.description.slice(0, 100)}
                        {post.description.length > 100 && (
                          <SeeMoreLink
                            onClick={() => toggleDescription(post.id)}
                          >
                            {showFullDescription[post.id]
                              ? "See less"
                              : "See more"}
                          </SeeMoreLink>
                        )}
                      </Description>

                      {post.postImage && (
                        <PostImage src={post.postImage} alt="Post" />
                      )}
                    </PostContent>
                    <CommentAndLikeSection>
                      <LikedButtonSection>
                        <LikedButton
                          onClick={() => handleLike(post.id, post.likedpost)}
                        >
                          {post.likedpost === "liked" ? (
                            <ThumbUpAltIcon />
                          ) : (
                            <ThumbUpAltOutlinedIcon />
                          )}
                        </LikedButton>
                        <div style={{ marginTop: "0.9rem" }}>
                          <span>{likeCounts[post.id]}</span>
                        </div>
                      </LikedButtonSection>
                      <CommentButton
                        onClick={() => toggleCommentSection(post.id)}
                      >
                        {openComments[post.id] ? "Hide Comments" : "Comments"}
                      </CommentButton>
                    </CommentAndLikeSection>
                    {openComments[post.id] && (
                      <CommentSection>
                        <div>
                          <SmallImage src={image || defaultimage} />
                        </div>
                        <div>
                          <Textareasection>
                            <textarea
                              onChange={handleChange}
                              placeholder="Leave your comments"
                            ></textarea>
                          </Textareasection>
                        </div>
                        <CommentSendSection
                          onClick={() => handleCommentSection(post.id)}
                        >
                          <SendOutlinedIcon />
                        </CommentSendSection>
                      </CommentSection>
                    )}
                    {commentsVisible[post.id] && (
                      <RealComments>
                        {comments[post.id] &&
                          comments[post.id].map((comment, index) => (
                            <div key={index}>
                              <div>
                                <SmallImage
                                  src={comment.profileImage || defaultimage}
                                />
                              </div>
                              <CommentText>
                                <div>{comment.comment}</div>
                                {comment.userId === Cookies.get("userid") ? (
                                  <div
                                    onClick={() =>
                                      handleDeletecomment(
                                        comment.commentid,
                                        post.id
                                      )
                                    }
                                  >
                                    <DeleteIcon />
                                  </div>
                                ) : (
                                  ""
                                )}
                              </CommentText>
                            </div>
                          ))}
                      </RealComments>
                    )}
                  </PostBox>
                ))}
            </PostContainer>
            <div></div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default ProfileImages;
