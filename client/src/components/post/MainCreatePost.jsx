import React, { useState, useEffect, useRef } from "react";
import SmallUserImage from "../Profile/SmallUserImage";
import styled from "styled-components";
import Cookies from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const Container = styled.div`
  width: 50%;
  margin: auto;
  border: 1px solid #ccc;

  border-radius: 10px;
  background-color: white;
  padding: 30px;
  overflow-y: auto; 
  max-height: 80vh; /* Set maximum height */
  @media(max-width:850px)
  {
    width:70%;
  }
  @media(max-width:550px)
  {
    width:90%;
  }
   position:relative:
   z-index:3;
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

const DescriptionInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  margin-bottom: 20px;
  padding: 5px;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  font-size: 16px;
  word-wrap: break-word;
  white-space: pre-wrap;
`;
const UploadedImageContainer = styled.div`
  margin-top: 10px;
`;

const UploadedImage = styled.img`
  width: 100%;
  height: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ImageUploadButton = styled.label`
  border-radius: 3rem;
  padding: 0.8rem;
  color: #7360df;
  cursor: pointer;
`;

const PostButton = styled.button`
  background-color: #7360df;
  color: white;
  border: none;
  padding: 13px 30px;
  cursor: pointer;
  border-radius: 5px;
`;

const FileInput = styled.input`
  display: none;
`;

const MainCreatePost = ({ onClose, image, selectedPost }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageupload, setimageupload] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const descriptionRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const username = Cookies.get("name");
    setName(username);

    // If a selected post is passed, populate the fields with its data
    if (selectedPost) {
      setDescription(selectedPost.description);
      setSelectedImage(selectedPost.postImage);
    }
  }, [selectedPost]);

  useEffect(() => {
    // Automatically adjust textarea height based on content
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [description]);

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setimageupload(file);
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    try {
      const email = Cookies.get("email");
      const username = Cookies.get("username");

      const formData = new FormData();
      formData.append("image", imageupload);

      const data = {
        name: name,
        email: email,
        username: username,
        description: description,
      };

      let result;
      if (!data.description && !imageupload) {
        alert("No New data");
      } else {
        if (selectedPost) {
          setLoading(true);
          // If a selected post exists, update the post
          result = await axios.post(
            `${process.env.REACT_APP_API_URL}/updatepost/${selectedPost.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              params: {
                data,
              },
            }
          );
          setLoading(false);
        } else {
          // Otherwise, create a new post
          setLoading(true);
          result = await axios.post(
            `${process.env.REACT_APP_API_URL}/createpost`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              params: {
                data,
              },
            }
          );
          if (result) {
            setLoading(false);
          }
        }
      }
      if (result.data.status) {
        // Close the component if the post is successful
        window.location.reload();
        onClose();
      }
    } catch (error) {
      console.error("Error creating/updating post:", error);
    }
  };

  return (
    <Container onClick={handleModalClick}>
      <UserInfo>
        <ImageWrapper>
          <SmallUserImage image={image} />
        </ImageWrapper>
        <UserName>{name}</UserName>
      </UserInfo>
      <DescriptionInput
        ref={descriptionRef}
        placeholder="Share your thoughts..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <UploadedImageContainer>
        {selectedImage && (
          <UploadedImage src={selectedImage} alt="Uploaded Image" />
        )}
      </UploadedImageContainer>
      <ButtonContainer>
        <ImageUploadButton htmlFor="imageupload">
          <CloudUploadIcon style={{ fontSize: "3rem" }} />
        </ImageUploadButton>
        <FileInput
          id="imageupload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <PostButton onClick={handlePost}>Post</PostButton>
      </ButtonContainer>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </Container>
  );
};

export default MainCreatePost;
