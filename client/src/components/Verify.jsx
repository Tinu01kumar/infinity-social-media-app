import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import forgotpassword from "./Forgotpassword";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UserContext from "./Context/EmailContext";
const size = {
  mobile: "max-width:425px",
  tablet: "max-width:768px",
  mobiles: "max-width:320px and max-width:400px",
};

const Components = styled.div`
  width: 450px;
  margin: 4rem auto;

  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);

  @media (${size.mobile}) {
    width: 350px;
  }
  @media (${size.mobiles}) {
    width: 300px;
    background-color: red;
  }
  @media (${size.tablet}) {
    max-width: 600px;
  }
`;

const SuccessAnimation = keyframes`
from {
  opacity: 0;
  transform: scale(0.8);
}
to {
  opacity: 1;
  transform: scale(1);
}
`;

const FailureAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const FailureMessage = styled.p`
  animation: ${FailureAnimation} 0.5s ease-in-out;
  color: red;
  font-size: 23px;
  position: relative;
  animation-delay: 0.2s;
`;

const SuccessMessage = styled.p`
  animation: ${SuccessAnimation} 0.5s ease-in-out;
  display: flex;
  align-items: center;
  text-align: center;
  margin-left: 2rem;
  font-size: 23px;
`;

const Section = styled.div`
  padding-bottom: 1rem;
`;

const Wrapper = styled.div`
  padding: 2px 35px;
  display: flex;

  flex-direction: column;
  & > button {
    margin-top: 20px;
    border-radius: 3rem;
  }
  & > button:hover {
  }
  & > p {
    text-align: center;
  }

  input {
    padding-left: 1.3rem;
  }
`;
const TextFont = styled.h1`
  text-align: center;
  padding-top: 0.8rem;
  color: #c780fa;
`;

const LoginButton = styled.button`
  text-transform: none;
  background: #c780fa;
  color: black;
  font-size: 16px;

  height: 48px;
  border-radius: 2px;
  border: none;
  &:hover {
    background: white;
    outline: 3px solid aqua;
    border: none;
  }
`;

const Line = styled.div`
  & > h4 {
    display: flex;
    flex-direction: row;
  }
  & > h4:before,
  & > h4:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #000;
    margin: auto;
  }
  font-size: 13px;
`;

const Highlight = styled.span`
  color: orange;

  &:hover {
    color: red;
    text-decoration: underline orange;
  }
`;
const Verify = () => {
 
  const { token } = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [displayMessage, setDisplayMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log(token, id, "@@@@@@@@@@@");
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/verify/${token}/${id}`,
          { token, id }
        );
        console.log(response);
        if (response.data.success) {
          if (response.data.message === "Email is already verified") {
            setDisplayMessage(response.data.message);
            setVerificationStatus("success");
          } else {
            setDisplayMessage(response.data.message);
            setVerificationStatus("success");
          }
        } else {
          setDisplayMessage(response.data);
          setVerificationStatus("failure");
          console.log("Given link is not correct");
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };

    verifyEmail();
  }, [token]);

  const gotologin = () => {
    navigate("/auth/login");
  };
  return (
    <Components>
      <Section>
        <TextFont>Verification</TextFont>
        <Wrapper>
          {verificationStatus === "success" ? (
            <>
              <SuccessMessage>
                {" "}
                <CheckCircleOutlineIcon
                  style={{
                    color: "green",
                    fontSize: "2rem",
                    marginRight: "0.5rem",
                    textAlign: "center",
                  }}
                />
                {displayMessage}
              </SuccessMessage>

              <LoginButton onClick={gotologin}>Login</LoginButton>
            </>
          ) : (
            <>
              <FailureMessage>{displayMessage}</FailureMessage>
            </>
          )}

          <Line>
            <h4>OR</h4>
          </Line>
          <p>
            By Login, you agree to the <Highlight>Terms & Conditions</Highlight>{" "}
            and acknowledge our <Highlight>Privacy Policy</Highlight>
          </p>
        </Wrapper>
      </Section>
    </Components>
  );
};

export default Verify;
