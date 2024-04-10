import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import styled from "styled-components";
import { useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import defaultimage from "./image/defaultprofileimage.jpg";
import CreatePost from "./Activity/CreatePost";
import MainCreatePost from "./post/MainCreatePost";
import similey from "./image/simile.jpg";
import EmojiPicker from "emoji-picker-react";
import { Link, useLocation } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Header from "./Header";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import FriendCard from "./FriendCard";
const SmallImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: 4px;
  border: 5px solid #fff;
  cursor: pointer;
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
`;

const Button = styled.button`
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
  border-radius: 8px;
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
`;

const ImageWrapper = styled.div`
  margin-right: 10px;
`;

const UserName = styled.div`
  font-weight: bold;
`;

const UpperSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SecondButton = styled.button`
  padding: 0.5rem 1.1rem;
  font-size: 1rem;
  border-radius: 5px;
  margin-top:10px;
  border: none;
  text-align: center;
  color: white;
  cursor: pointer;
  background-color: #7360df;
  margin-left: auto;
  &:hover {
    background-color: #5c4acd;
  }
`;

const CommentSection = styled.div`
  padding: 10px;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: space-around;
  text-align: center;
  align-item: center;
`;

const CommentAndLikeSection = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #ccc;
  text-align: center;
  align-item: center;
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

const Textareasection = styled.div`

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

const CommentSendSection = styled.div`

                  
  cursor: pointer;

  padding:1rem;
}
`;
const LikedButtonSection = styled.div`
  display: flex;
  padding: 0rem 2rem;
`;
const SimileySection = styled.div`
  padding-right: 1rem;
`;
const SmileyImage = styled.img`
  position: absolute;
  top: 40%;

  transform: translateY(-50%);
  right: 1.6rem; /* Adjust the right positioning of the smiley image */
  height: 30px;
  width: 30px;
  background-color: #eee;
  cursor: pointer;
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
const SeeMoreLink = styled.span`
  color: blue;
  cursor: pointer;
`;



const RequestButton = styled.button`
  padding: 0.5rem 1.1rem;
 margin-top:10px;
  border-radius: 5px;
  border: none;

  text-align: center;
  cursor: pointer;
  ${({ mode }) => {
    if (mode === "accept") {
      return `
        background-color: green;
        color: white;
      `;
    } else if (mode === "ignore") {
      return `
        background-color: red;
        color: white;
      `;
    } else {
      return `
        background-color: #7360df;
        color: white;
      `;
    }
  }}
  &:hover {
    background-color: ${({ mode }) => {
      if (mode === "accept") {
        return "darkgreen";
      } else if (mode === "ignore") {
        return "darkred";
      } else {
        return "#5c4acd";
      }
    }};
  }
`;



const MainSection = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [imageshow, setshowimage] = useState(defaultimage);
  const [showpost, setShowpost] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);
  const [openComments, setOpenComments] = useState({});
  const [comments, setcomments] = useState();
  const [likeCounts, setLikeCounts] = useState({});
  const [chosenEmoji, setChosenEmoji] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState({});
  const [textareaValue, setTextareaValue] = useState("");
  const [commentsVisible, setCommentsVisible] = useState({});
  const textareaRef = useRef(null);
  const [loderposition,setloaderpositon]=useState(false);
  const [postCount, setPostCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [page, setPage] = useState(0);
  const usernameFromParmas = location.pathname.split("/").pop();

  const handleEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };
  const handleClick = () => {
    setShowCreatePost(true);
  };

  const handleChange = (e) => {
    setTextareaValue(e.target.value);
  };
  const handleCloseModal = () => {
    setShowCreatePost(false);
  };

  const toggleEmojiPicker = async () => {};
  const handleCommentSection = async (postId) => {
    try {
      const commentText = textareaValue;
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
            commentText: res.data.comment.comment,
            profileimage: res.data.comment.profileImage,
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

  const toggleDescription = (postId) => {
    setShowFullDescription((prevDescriptionState) => ({
      ...prevDescriptionState,
      [postId]: !prevDescriptionState[postId],
    }));
  };

  useEffect(() => {
    console.log("dffffffff");
    const getallpost = async () => {
      setLoading(true);
      const username = Cookies.get("username");
      const email = Cookies.get("email");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/getallpost`,
        {
          username,
          email,
          page,
        }
      );
      
      console.log("hhjhjkhk", response);
      setShowpost((prevPosts) => {
        if (prevPosts === null) {
          return response.data.result;
        } else {
          return [...prevPosts, ...response.data.result];
        }
      });
      const likeCounts = {};
      const fetchedComments = {};

      response.data.result.forEach((post) => {
        likeCounts[post.postId] = post.countlike;
        fetchedComments[post.postId] = post.comments || [];
      });
      setLikeCounts(likeCounts);
      setcomments(fetchedComments);
      setLoading(false);
    };
    getallpost();
  }, []);

  const fetchMoreData = async () => {
    try {
      setloaderpositon(true)
      const nextPage = page + 1; // Increment the page number
      setPage(nextPage); // Update the page state

      const username = Cookies.get("username");
      const email = Cookies.get("email");
      const pageSize = 5; // Adjust the page size as needed

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/getallpost`,
        {
          username,
          email,
          page: nextPage,
          pageSize,
        }
      );
      if (response.data.result.length > 0) {
        setShowpost((prevPosts) => [...prevPosts, ...response.data.result]);
      } else {
        // No more posts to load
        setloaderpositon(false);
      }
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  useEffect(() => {
    const gettingimage = async () => {
      const username = Cookies.get("username");
      const email = Cookies.get("email");
      const data = {
        username: username,
        email: email,
      };
      const dataimage = await axios.post(
        `${process.env.REACT_APP_API_URL}/getprofileimage`,
        data
      );
      if (dataimage.data.status) {
        Cookies.set("profileimageurlmain", dataimage.data.profileimageurl);
        setshowimage(dataimage.data.profileimageurl || defaultimage);
      } else {
        Cookies.set("profileimageurlmain", defaultimage);
      }
    };
    gettingimage();
  }, []);

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
            post.postId === postId ? { ...post, likedpost: "not liked" } : post
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
            post.postId === postId ? { ...post, likedpost: "liked" } : post
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

  const toggleCommentSection = async(postId) => {
    // const res=await axios.post(`${process.env.REACT_APP_API_URL}/fetchComments` , {postId})
    
    setOpenComments({
      ...openComments,
      [postId]: !openComments[postId],
    });
    setCommentsVisible((prevVisible) => ({
      ...prevVisible,
      [postId]: !prevVisible[postId],
    }));
  };

  const handleExploreMode = async (receiverUserId) => {
    const username = Cookies.get("username");
 
    const receiverId = receiverUserId;

    setShowpost((prevState) =>
      prevState.map((post) => {
        if (post.id === receiverId) {
          return { ...post, friendmap: "pending" };
        }
        return post;
      })
    );

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/friendRequest`,
      {
        username,
    
        receiverId,
      }
    );
    if (res.data.status) {
      alert(`Friend request send to ${res.data.name}(${res.data.username})`);
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
      setShowpost((prevState) =>
        prevState.map((post) =>
          post.id === receiveruserid ? { ...post, friendmap: "normal" } : post
        )
      );
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

    setShowpost((prevState) =>
      prevState.map((post) =>
        post.id === recieveruserId ? { ...post, followstatus: "follow" } : post
      )
    );
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

    setShowpost((prevState) =>
      prevState.map((post) =>
        post.id === receiveruserid ? { ...post, followstatus: "not follow" } : post
      )
    );
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
        console.log("DDDDDDDDDDDDDDDDDDDD");
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


  const handleacceptbutton = async (postid) => {
    const username = Cookies.get("username");
    const email = Cookies.get("email");
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/acceptedFriendRequest`,
      { postid, username, email }
    );
    if (res) {
      setShowpost((prevState) =>
      prevState.map((post)=>{
        if(post.id === postid){
          return { ...post , friendmap:"accepted"};
        }
        return post;
      })
      
      )
    }
  };

  const handleignorebutton = async (postid) => {
    const username = Cookies.get("username");
    const email = Cookies.get("email");
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/ignoreFriendRequest`,
      { postid, username, email }
    );
    if (res) {
     
       setShowpost((prevState)=>
        prevState.map((post)=>{
          if(post.id === postid){
            return { ...post , friendmap:"normal"};
          }
          return post;
        })
       )
   
    }
  };
  

  return (
    <div>
    <Header profileImageurl={imageshow || defaultimage}/>
      <Section>
        <div>
          <Link to={`/profile/${Cookies.get("username")}`}>
            <SmallImage src={imageshow || defaultimage} />
          </Link>
        </div>
        <Button onClick={handleClick}>Show your activity</Button>
        {showCreatePost && (
          <ModalBackground onClick={handleCloseModal}>
            <MainCreatePost
              onClose={handleCloseModal}
              image={imageshow || defaultimage}
            />
          </ModalBackground>
          )}
    
      </Section>
     
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <CircularProgress />
        </div>
      ) : showpost.length === 0 ? (<p style={{textAlign:"center" }}>No posts available</p>) : (
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
              showpost.map((post) => (
                <PostBox key={post.postId}>
                  <PostContent>
                    <UpperSection>
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to={`/profile/${post.username}`}
                      >
                        <div>
                          <UserInfo>
                            <ImageWrapper>
                              <SmallImage
                                src={post.profileimage || defaultimage}
                              />
                            </ImageWrapper>
                            <UserName>{post.name}</UserName>
                          </UserInfo>
                        </div>
                      </Link>
                      { usernameFromParmas === Cookies.get("username") ? (
                        <div>
                          {post.mode === "creator" && post.friendmap ==="normal" ? (
                            <>
                              {post.followstatus === "not follow" ? (
                                <SecondButton
                                  mode="creator"
                                  onClick={() => handleCreatorMode(post.id)}
                                >
                                  Follow
                                </SecondButton>
                              ) : (
                                <SecondButton
                                  mode="creator"
                                  onClick={() => handleNotFollow(post.id)}
                                >
                                  Following
                                </SecondButton>
                              )}
                            </>
                          ) : (
                            <>
                              
                            
                            </>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </UpperSection>
                    <Description expand={showFullDescription[post._id]}>
                      {showFullDescription[post.id]
                        ? post.description
                        : post.description.slice(0, 100)}
                      {post.description.length > 100 && (
                        <SeeMoreLink
                          onClick={() => toggleDescription(post._id)}
                        >
                          {showFullDescription[post.id]
                            ? "See less"
                            : "See more"}
                        </SeeMoreLink>
                      )}
                    </Description>
                    {post.postimage && (
                      <PostImage src={post.postimage} alt="Post" />
                    )}
                  </PostContent>

                  <CommentAndLikeSection>
                    <LikedButtonSection>
                      <LikedButton
                        onClick={() => handleLike(post.postId, post.likedpost)}
                      >
                        {post.likedpost === "liked" ? (
                          <ThumbUpAltIcon />
                        ) : (
                          <ThumbUpAltOutlinedIcon />
                        )}
                      </LikedButton>
                      <div style={{ marginTop: "0.9rem" }}>
                        <span>{likeCounts[post.postId]}</span>
                      </div>
                    </LikedButtonSection>
                    <CommentButton
                      onClick={() => toggleCommentSection(post.postId)}
                    >
                      {openComments[post.postid] ? "Hide Comments" : "Comments"}
                    </CommentButton>
                  </CommentAndLikeSection>
                  {openComments[post.postId] && (
                    <CommentSection>
                      <div>
                        <SmallImage src={imageshow || defaultimage} />
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
                        onClick={() => handleCommentSection(post.postId)}
                      >
                        <SendOutlinedIcon />
                      </CommentSendSection>
                    </CommentSection>
                  )}
                  {commentsVisible[post.postId] && (
                    <RealComments>
                      {comments[post.postId] &&
                        comments[post.postId].map((comment, index) => (
                          <div key={index}>
                            <div>
                              <SmallImage
                                src={comment.profileimage || defaultimage}
                              />
                            </div>
                            <CommentText>
                              <div>{comment.commentText}</div>
                              {comment.userId ===
                              Cookies.get("userid") ? (
                                <div
                                  onClick={() =>
                                    handleDeletecomment(
                                      comment.commentid,
                                      post.postId
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
        </InfiniteScroll>
      )}
    {loderposition &&  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <CircularProgress />
  </div>}

    </div>
  );
};

export default MainSection;
