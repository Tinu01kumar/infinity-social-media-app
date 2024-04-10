import React, { useEffect, useState } from "react";
import Header from "../Header";
import Cookies from "js-cookie";
import axios from "axios";
import defaultimage from "../image/defaultprofileimage.jpg";
import { useLocation, useParams } from "react-router-dom";
import SmallUserImage from "../Profile/SmallUserImage";
import ProfileContent from "../Profile/ProfileContent";
import { Link } from "react-router-dom";
import styled from "styled-components";
import defaultprofileimage from "../image/defaultprofileimage.jpg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const RequestCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 34rem;
  max-width: 500px;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 550px) {
    width: 28rem;
  }

  @media (max-width: 500px) {
    width: 95%;
  }
`;

const SmallImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const BeautifulButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;
const PageHeader = styled.h2`
  text-align: center;
  background-color: white;
  padding: 2rem;
  margin: 0; /* Remove margin */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const Following = () => {
  const [showpost, setshowpost] = useState();
  const [userpathname, setuserpathname] = useState("");
  const location = useLocation();
  const username = location.pathname.split("/")[1];
  const whypart = location.pathname.split("/")[2];
  const realuser = Cookies.get("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/followAndConnections`,
          { username, whypart, realuser }
        );
        setshowpost(res.data.profileImageMap);
        console.log(res.data.profileImageMap, "################@@@@@@@@@@@");
        setuserpathname(res.data.profileImageMap[0]?.nameofurl || "No data");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  
  const handleExploreMode = async (receiverUserId) => {
    const username = Cookies.get("username");
    const receiverId = receiverUserId;
  
    try {
     


      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/friendRequest`,
        { username, receiverId }
      );
  
      if (res.data.status) {
        // Update the state to reflect the pending status
        setshowpost(prevState =>
          prevState.map(post => {
            if (post.userId === receiverUserId) {
              return { ...post, friendstatus: "pending" };
            }
            return post;
          })
        );
  
       
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
      setshowpost((prevState) =>
      prevState.map((post) =>
        post.userId === receiveruserid ? { ...post, friendstatus: "not friend" } : post
      )
    );
      
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

    setshowpost((prevState) =>
      prevState.map((post) =>
        post.userId === receiveruserid ? { ...post, status: "not follow" } : post
      )
    );
  };


  
  const handleCreatorMode = async (recieveruserId) => {
    const username = Cookies.get("username");
    const email = Cookies.get("email");

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/follow`, {
      username,
      email,
      recieveruserId,
    });

    setshowpost((prevState) =>
      prevState.map((post) =>
        post.userId === recieveruserId ? { ...post, status: "follow" } : post
      )
    );
  };
  return (
    <div>
      <Header />
      <PageHeader
        style={{
          textAlign: "center",
          backgroundColor: "white",
          padding: "2rem",
          display:"flex",
          justifyContent:"center",
          flexDirection:"column"
        }}
      >
      {userpathname === "No data" ? "No data" : `${userpathname}'s ${whypart}`}
  
      </PageHeader>
      <Container>
        <div>
          {showpost &&
            showpost.map((post) => (
             // Condition to check if realuser is not equal to post.username
              <RequestCard key={post.id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                <Link  to={`/profile/${post.username}`}>
                  <SmallImage
                    src={post.profileImage || defaultprofileimage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultprofileimage;
                    }}
                  /></Link>
                  <Link style={{textDecoration:"none"}} to={`/profile/${post.username}`}>
                  <div>{post.name}</div></Link>
                </div>

                {Cookies.get("username") && realuser !== post.username && (
                  <div>
                    {post.mode === "explore" ? (
                      post.friendstatus === "friend" ? (
                        <BeautifulButton onClick={()=>handleNotpending(post.userIds)}>Connected</BeautifulButton>
                      ) : post.friendstatus === "pending" ? (
                        <BeautifulButton onClick={()=>handleNotpending(post.userIds)}>Pending</BeautifulButton>
                      ) : (
                        <BeautifulButton onClick={() => handleExploreMode(post.userIds)}>
                          +Connect
                        </BeautifulButton>
                      )
                    ) : post.mode === "creator" ? (
                      post.status === "follow" ? (
                        <BeautifulButton   onClick={() => handleNotFollow(post.userIds)}>Following</BeautifulButton>
                      ) : (
                        <BeautifulButton   onClick={() => handleCreatorMode(post.userIds)}>Follow</BeautifulButton>
                      )
                    ) : null}
                  </div>
                )}
                
              </RequestCard>
            ))}
        </div>
      </Container>
    </div>
  );
};

export default Following;
