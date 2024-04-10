import React, { useEffect, useState } from "react";
import Header from "../Header";
import axios from "axios";
import styled from "styled-components";
import Cookies from "js-cookie";
import defaultprofileimage from "../image/defaultprofileimage.jpg";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import FriendCard from "../FriendCard";

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

const ButtonGroup = styled.div`
  display: flex;
`;

const Button = styled.button`
  padding: 8px 15px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ accept }) => (accept ? "#4caf50" : "#f44336")};
  color: #fff;
`;

const FriendsRequest = () => {
  const [showdata, setshowdata] = useState(null);

  useEffect(() => {
    const fetchfriends = async () => {
      const username = Cookies.get("username");
      const email = Cookies.get("email");
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/getfriends`, {
        username,
        email,
      });
      console.log(res.data.result);
      if (res) {
        setshowdata(res.data.result);
      }
    };
    fetchfriends();
  }, []);
  
    

  const handleacceptbutton = async (postid) => {
    const username = Cookies.get("username");
    const email = Cookies.get("email");
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/acceptedFriendRequest`,
      { postid, username, email }
    );
    if (res) {
      console.log("data")
      // Remove the request card from the UI
      setshowdata((prevData) => prevData.filter((post) => post.id !== postid));
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
      // Remove the request card from the UI
      console.log("fdfsd")
      setshowdata((prevData) => prevData.filter((post) => post.id !== postid));
    }
  };
  
  return (
    <div >
      <Header />
      <Container>
      <div style={{backgroundColor:"white" , padding:" 5px 10px", marginBottom:"1rem" , textAlign:"center" , width:"34rem" , maxWidth:"500px" ,  boxShadow:" 0 4px 8px rgba(0, 0, 0, 0.1)" }}><h2>Friend's List</h2></div>
        <div>
          {showdata &&
            showdata.map((post) => (
              <RequestCard key={post.id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                <Link style={{textDecoration:"none" , color:"black"}} to={`/profile/${post.username}`}>
                  <SmallImage
                    src={post.profileImage || defaultprofileimage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultprofileimage;
                    }}
                  ></SmallImage>
                  </Link>
                  <div> <Link style={{textDecoration:"none" , color:"black"}} to={`/profile/${post.username}`}> {post.name}</Link></div>
                </div>
                <ButtonGroup>
                  <Button onClick={()=>handleignorebutton(post._id)}>Ignore</Button>
                  <Button
                    accept
                    onClick={() => {
                      handleacceptbutton(post.id);
                    }}
                  >
                    Accept
                  </Button>
                </ButtonGroup>
              </RequestCard>
            ))}
        </div>
      </Container>

      <div>
       <FriendCard/>
      </div>
    </div>
  );
};

export default FriendsRequest;
