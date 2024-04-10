import React, { useState } from "react";
import axios from "axios";
import { redirect, useNavigate, useParams } from "react-router-dom";
import Header from "../Header";
import styled from "styled-components";
import explorer from "../image/explorer.png";
import creator from "../image/explorer.png";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
const Section = styled.div`
  background-color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
  margin-bottom: 20px; /* Added margin to separate sections */
`;

const Image = styled.img`
  width: 100%; /* Adjusted image width to fit container */
  max-width: 300px; /* Added max-width for responsiveness */
`;

const Container = styled.div`
  display: flex;
  flex-direction: column; /* Changed to column layout for responsiveness */
  align-items: center;
  margin: 20px;
`;

const TextAreaContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* Added to allow flex items to wrap */
  justify-content: center; /* Added to center items */
  gap: 10px; /* Added to create space between items */
`;

const Paragraph = styled.p`
  flex: 1; /* Added to allow paragraph to take remaining space */
  margin: 0; /* Removed default margin */
`;

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  cursor:pointer;
`;

const ButtonSection=styled.div`
margin-bottom:20px;
`

const Button = styled.button`
  padding: 16px 40px;
  border: none;
  border-radius: 3rem;
  background-color: #7360df;
 cursor:pointer;
  color: white;
  transition: background-color 0.3s ease; /* Added transition for smooth hover effect */
  
  &:hover {
    background-color: #5a48b0; /* Change background color on hover */
  }
`
const Mode = () => {
  const [mode, setMode] = useState(Cookies.get("mode"));
  const data=useParams()
  const navigate =useNavigate();
  console.log(data, '&&&&&&&&&&&&&&&&&&^^^^^^^^^^^^^^^')
  const handleContainerClick = () => {
    alert(`Current mode is ${mode} mode`);
  };

  const handleModeChange = (event) => {
      alert("you want to change the mode")
    setMode(event.target.value);
    console.log(event.target.value)
  };
const handlechangebutton=async()=>{
    const username=Cookies.get("username");
    const email=Cookies.get("email")
    console.log(username , email)
    
    const res=await axios.post(`${process.env.REACT_APP_API_URL}/creatorMode` , {username , email , mode})
    console.log(res)
    if(res.data.status)
    {
        alert(res.data.message)
        navigate('/auth/login')
    }
}
  return (
    <div>
      <Header />
      <Container>
        <Section>
          <h1>Explorer Mode</h1>
          <Image src={mode === "explore" ? explorer : creator} alt="Mode Image" />
          <TextAreaContainer>
            <Paragraph>
              Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
              and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type
              specimen book. It has survived not only five centuries, but
              also the leap into electronic typesetting, remaining
              essentially unchanged. It was popularised in the 1960s with
              the release of Letraset sheets containing Lorem Ipsum
              passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum. Why do
              we use it?
            </Paragraph>
            <RadioContainer>
              <input
                type="radio"
                id="explore"
                name="mode"
                value="explore"
                checked={mode === "explore"}
                onChange={handleModeChange}
              />
              <label htmlFor="explore">Explorer Mode</label>
            </RadioContainer>
          </TextAreaContainer>
        </Section>
        <Section>
          <h1>Creator Mode</h1>
          <Image src={mode === "creator" ? creator : explorer} alt="Mode Image" />
          <TextAreaContainer>
            <Paragraph>
              Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
              and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type
              specimen book. It has survived not only five centuries, but
              also the leap into electronic typesetting, remaining
              essentially unchanged. It was popularised in the 1960s with
              the release of Letraset sheets containing Lorem Ipsum
              passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum. Why do
              we use it?
            </Paragraph>
            <RadioContainer>
              <input
                type="radio"
                id="creator"
                name="mode"
                value="creator"
                checked={mode === "creator"}
                onChange={handleModeChange}
              />
              <label htmlFor="creator">Creator Mode</label>
            </RadioContainer>
          </TextAreaContainer>
        </Section>
        <ButtonSection>
         <Button onClick={handlechangebutton}>Save Mode</Button>
        </ButtonSection>
      </Container>
    </div>
  );
};

export default Mode;
