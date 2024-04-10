import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AuthContext from "./Context/EmailContext";
import { GoogleLogin } from '@react-oauth/google';
const size = {
  mobile: "max-width: 425px",
  tablet: "max-width: 768px",
  mobiles: "max-width: 320px and max-width: 400px",
};

const Components = styled.div`
  width: 450px;
  background-color:white;
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

const Section = styled.div`
  padding-bottom: 0rem;
`;

const Wrapper = styled.div`
  padding: 2px 35px;
  display: flex;
  flex-direction: column;

  & > button {
    margin-top: 12px;
    border-radius: 3rem;
  }

  & > button:hover {
    /* Add any hover styles for the button here */
  }

  & > p {
    text-align: center;
  }

  input {
    padding-left: 1.3rem;
  }
`;
const Parafirst = styled.p`
  margin-top: -10px;
  margin-bottom: -10px;
`;
const TextFont = styled.h1`
  text-align: center;
  padding-top: 0.8rem;
  color: #7360df;
`;

const InputBox = styled.input`
  padding: 0.6rem;
  border-radius: 5rem;
  border: 2px solid #7360df;

  &:hover {
    border: 2px solid #7360df;
  }
`;

const SignButton = styled.button`
  text-transform: none;
  background: #7360df;
  color: black;
  font-size: 16px;
  height: 48px;
  color: white;
  border-radius: 2px;
  border: none;

  &:hover {
    background: white;
 
    color:white;
    border: none;
    background:#11009E;
    cursor:pointer;
  }
`;

const Forgot = styled.div`
  text-align: right;
  margin-top: 13px;
`;

const Checkbox = styled.div`
  & > input[type="checkbox"] {
    accent-color: #c780fa;
  }

  & > input {
    height: 1.2rem;
    width: 1.9rem;
    position: relative;
    background-color: #2196f3;
  }

  & > label {
    position: absolute;
  }
`;

const Line = styled.div`
  color: #7360df;
  & > h4 {
    display: flex;
  }

  & > h4:before,
  & > h4:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #7360df;
    margin: auto;
  }

  font-size: 13px;
`;

const Linksection = styled(Link)`
  text-decoration: none;
`;

const Highlight = styled.span`
  color: orange;

  &:hover {
    color: red;
    text-decoration: underline;
  }
`;

const Label = styled.label`
  margin-left: 15px;
  padding-bottom: 0px;
`;

const Inlinediv = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  position: relative;

  & > span {
    position: absolute;
    left: 21rem;
    bottom: 3px;
  }

  @media (${size.mobile}) {
    & > span {
      position: absolute;
      left: 15rem;
    }
  }
`;
const GoogleLoginContainer = styled.div`
  display: flex;
  justify-content: center;
`;
let x = VisibilityOffIcon;

const Signup = () => {
 
  const navigate = useNavigate();
  const [user, setUsers] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(VisibilityOffIcon);
  const [passwordError, setPasswordError] = useState("");

  const handleToggle = () => {
    if (type === "password") {
      setIcon(VisibilityIcon);
      setType("text");
    } else {
      setIcon(VisibilityOffIcon);
      setType("password");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers({
      ...user,
      [name]: value,
    });
  };

  const googleaccount=async(data)=>{
    try{

    
   const response= await axios.post(`${process.env.REACT_APP_API_URL}/auth/googleaccount` , data)

   Cookies.set("email", response.data.details.email);
        Cookies.set("accessToken", response.data.details.access_Token);
        Cookies.set("refreshToken", response.data.details.refresh_Token);
        Cookies.set("username", response.data.details.username)
        Cookies.set("name", response.data.details.name)
        Cookies.set("mode", response.data.details.mode)
        Cookies.set("userid" , response.data.details.id)
   if(response.data.success)
   {
    navigate("/" + response.data.details.username)
   }
  }catch(error)
  {
    console.log(`error on frontend while login from google account:${error}`)
  }
 
 }
  const register = async (e) => {
    sessionStorage.setItem("email" , user.email)
    e.preventDefault();
    try {
      const { name, email, password, reEnterPassword } = user;

      if (!name || !email || password !== reEnterPassword) {
        alert("Invalid input");
        return;
      }
    const lowercaseEmail=email.toLowerCase();
      const isStrongPassword = validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      });

      if (
        !validator.isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        alert(
          "Password is too weak. Please include:\n" +
            "- at least 8 characters\n" +
            "- at least one lowercase letter\n" +
            "- at least one uppercase letter\n" +
            "- at least one number\n" +
            "- at least one special character\n"
        );
        return;
      }

      if (!validator.isEmail(lowercaseEmail)) {
        alert("Invalid email address");
        return;
      }

      if (name && lowercaseEmail && password === reEnterPassword && isStrongPassword) {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, user);

        alert(res.data.message);
      } else {
        alert("password not matched");
      }
    } catch (error) {
      console.log("error during registration", error);
    }
  };

  return (
    <Components>
      <Section>
        <TextFont>Sign up</TextFont>
        <Wrapper>
          <Inlinediv>
            <Label>Name</Label>
            <InputBox
              type="text"
              name="name"
              value={user.name}
              placeholder="Name"
              onChange={handleChange}
            />
          </Inlinediv>
          <Inlinediv>
            <Label>Email</Label>
            <InputBox
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />
          </Inlinediv>
          <Inlinediv>
            <Label>Password</Label>
            <InputBox
              type={type}
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <span onClick={handleToggle}>
              {x === icon ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </Inlinediv>
          <Inlinediv>
            <Label>ReEnterPassword</Label>
            <InputBox
              type={type}
              name="reEnterPassword"
              placeholder="ReEnterPassword"
              onChange={handleChange}
            />
            <span onClick={handleToggle}>
              {x === icon ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </Inlinediv>
          {passwordError && (
            <p style={{ color: "red", fontSize: "1.5rem" }}>{passwordError}</p>
          )}
          <SignButton onClick={register}>Signup</SignButton>
          <Line>
            <h4>OR</h4>
          </Line>
          <GoogleLoginContainer style={{marginBottom:"20px" , textAlign:"center" , alignItems:"center" , }}>
          
     
          <GoogleLogin
          onSuccess={credentialResponse => {
            // console.log(credentialResponse);
            var credentialResponseDecoded=jwtDecode(credentialResponse.credential)
            console.log(credentialResponseDecoded)
            const googledata={
              name:credentialResponseDecoded.name,
              email:credentialResponseDecoded.email,
              status:credentialResponseDecoded.email_verified,
        
            }
           googleaccount({googledata})
        
          
          } }
          onError={() => {
            console.log('Login Failed');
          }}
          type="standard"
          theme="filled_blue"
          text="signin"
          shape="circle"
          useOneTap="boolean"
       login_uri="string"
        />
        </GoogleLoginContainer>
          <Parafirst>
            Already a User?
            <Linksection to="/auth/login">
              <Highlight>Login</Highlight>
            </Linksection>
          </Parafirst>
          <p>
            By Signup, you agree to the{" "}
            <Highlight>Terms & Conditions</Highlight>
            and acknowledge our <Highlight>Privacy Policy</Highlight>
          </p>
        </Wrapper>
      </Section>
    </Components>
  );
};

export default Signup;
