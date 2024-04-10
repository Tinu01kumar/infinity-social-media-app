import React, { useState, useEffect } from "react";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Cookies from "js-cookie";
import {  useNavigate } from "react-router-dom";
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 2rem;
  border: none;
  border-radius: 5px;
  margin: 0px 11px;
  font-size: 1rem;
  background-color: #7360df;
  color: white;
  cursor: pointer;
`;

const Username = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    margin-right: 10px;
    position: relative;
  }

  .edit-icon {
    margin-left: 5px;
    cursor: pointer;
  }
`;

const ProfileContent = ({ name, differentusername }) => {
  const [editableName, setEditableName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);
  const navigate=useNavigate()

  useEffect(() => {
    setEditableName(name); // Initialize editableName with the name prop when component mounts
  }, [name]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editableName === name) {
      alert("You have not changed the previous name");
    } else {
      if(Cookies.get("username")===differentusername)
      {
      const userid = Cookies.get("userid");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/updateName`,
        { userid, editableName }
      );
      if (response.status) {
        name = editableName;
      }
    }

        navigate("/auth/login")
      
      
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleNameChange = (event) => {
    setEditableName(event.target.value);
  };

  return (
    <div>
      <Username>
        <h1>{editableName}</h1>
        {Cookies.get("username") === differentusername && (
          <EditIcon className="edit-icon" onClick={handleEdit} />
        )}
      </Username>
      {isEditing && Cookies.get("username") === differentusername && (
        <ModalWrapper>
          <ModalContent>
            <input
              style={{ padding: "10px 0.5rem", fontWeight: "600" }}
              type="text"
              value={editableName}
              onChange={handleNameChange}
            />
            <Button onClick={handleSave}>Save</Button>
            <CloseIcon style={{ cursor: "pointer" }} onClick={handleCancel} />
          </ModalContent>
        </ModalWrapper>
      )}
    </div>
  );
};

export default ProfileContent;
