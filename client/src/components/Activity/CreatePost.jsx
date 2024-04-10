import React, { useState, useEffect } from "react";
import SmallUserImage from "../Profile/SmallUserImage";
import styled from "styled-components";
import MainCreatePost from "../post/MainCreatePost";
import defaultimage from "../image/defaultprofileimage.jpg";
import Cookies from 'js-cookie';

const Section = styled.div`
  background-color: white;
  padding: 2rem;
  width: 100%;
  max-width: 539px; /* Adjust the max-width as per your requirement */
  border-radius: 1rem;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background-color: #eee;
  border-radius: 3rem;
  padding: 0.8rem 2rem; /* Adjust the padding as per your requirement */
  border: 1px solid black;
  padding-right: 10rem;
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

const CreatePost = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  const handleClick = () => {
    setShowCreatePost(true);
  };

  const handleCloseModal = () => {
    setShowCreatePost(false);
  };

  return (
    <Section>
      <SmallUserImage />
      <Button onClick={handleClick}>Show your activity</Button>
      {showCreatePost && (
        <ModalBackground onClick={handleCloseModal}>
          <MainCreatePost onClose={handleCloseModal} />
        </ModalBackground>
      )}
    </Section>
  );
};

export default CreatePost;
