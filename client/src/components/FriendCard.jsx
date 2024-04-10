import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import defaultimage from "./image/defaultprofileimage.jpg";
import axios from "axios";
import Cookies from "js-cookie";

const FriendCard = () => {
  const [showdata, setShowData] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const friendData = async () => {
      const username = Cookies.get("username");
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/friendcard`,
          { username, page }
        );
        console.log(res.data.data, "$$$$$$$$$$$$$$$$$$$DDDDDDDDDDDDDDD");
        if (res.data.data) {
          setShowData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching friend data:", error);
      }
    };
    friendData();
  }, [page]);

  const handleClick = async (receiverId, index) => {
    const username = Cookies.get("username");
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/friendRequest`,
      { username, receiverId }
    );
    if (res.data.status) {
      const updatedData = [...showdata];
      updatedData[index].pending = true;
      setShowData(updatedData);
    }
  };

  const handleRemoveCard = (id) => {
    const updatedData = showdata.filter((friend) => friend.id !== id);
    setShowData(updatedData);
  };

  return (
    <FriendCardContainer>
      <h2 style={{ marginLeft: "60px" }}>Connect with the world</h2>
      <CardContainer>
      {showdata.map((friend, index) => {
        if (friend.username !== Cookies.get("username")) {
          return (
            <Card key={index}>
              <RemoveButton onClick={() => handleRemoveCard(friend.id)}>X</RemoveButton>
              <Link style={{ textDecoration: "none" }} to={`/profile/${friend.username}`}>
                <ImageContainer>
                  <ProfileImage
                    src={friend.profileimage ? friend.profileimage : defaultimage}
                    alt="Profile"
                  />
                </ImageContainer>
              </Link>
              <Link
                to={`/profile/${friend.username}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "500", // corrected from fontBold to fontWeight
                }}
              >
                <Username>{friend.name}</Username>
              </Link>
              {!friend.pending ? (
                <ConnectButton onClick={() => handleClick(friend.id, index)}>
                  + Connect
                </ConnectButton>
              ) : (
                <PendingButton disabled>Pending</PendingButton>
              )}
            </Card>
          );
        } else {
          return null; // If the username is the same as the current user, return null
        }
      })}
      
      </CardContainer>
    </FriendCardContainer>
  );
};

const FriendCardContainer = styled.div`
  background-color: white;
  padding: 10px;
  margin: 20px;
  padding-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  padding-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 200px;
  margin: 10px;
  background-color: #fff;
  text-align: center;
`;

const ImageContainer = styled.div`
  width: 200px;
  height: 200px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Username = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ConnectButton = styled.button`
  padding: 0.5rem 1.1rem;
  font-size: 1rem;
  border-radius: 5px;
  margin-top: 10px;
  border: none;
  text-align: center;
  color: white;
  cursor: pointer;
  background-color: #7360df;
  margin-bottom: 10px;
  &:hover {
    background-color: #5c4acd;
  }
`;

const PendingButton = styled.button`
  padding: 0.5rem 1.1rem;
  font-size: 1rem;
  border-radius: 5px;
  margin-top: 10px;
  border: none;
  text-align: center;
  color: white;
  cursor: pointer;
  background-color: #7360df;
  margin-bottom: 10px;
  &:hover {
    background-color: #5c4acd;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #eeeeee;
  border: none;
  color: black;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
`;

export default FriendCard;
