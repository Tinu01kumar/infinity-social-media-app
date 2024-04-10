
import React, { useState, useEffect } from "react";
import SmallUserImage from "../Profile/SmallUserImage";
import styled from "styled-components";
import Cookies from "js-cookie";
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
const ImageAndName = () => {
    const [name, setName] = useState("");
  useEffect(() => {
    const username = Cookies.get("name");
    setName(username);
  }, []);

  return (
    <UserInfo>
    <ImageWrapper>
      <SmallUserImage />
    </ImageWrapper>
    <UserName>{name}</UserName>
  </UserInfo>
  )
}

export default ImageAndName