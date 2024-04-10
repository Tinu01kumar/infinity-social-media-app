import React, { useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import {useState} from 'react';
import { Navigate, useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Cookies from "js-cookie";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


const size = {
  mobile: "max-width:425px",
  tablet: "max-width:768px",
  mobiles: "max-width:320px and max-width:400px",
};
const Components = styled.div`
  width: 450px;
  margin: 4rem auto;
background-color:white;

  box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);




  @media (${size.mobile}) {
   width: 350px;

 
  }
  @media (${size.mobiles}) {
    width: 300px;
    background-color:red;
 
  }
  @media (${size.tablet}) {
    max-width: 600px;
  }


`;
const Section = styled.div`
padding-bottom:1rem;
`;

const Wrapper = styled.div`
padding: 2px 35px;
display: flex;


flex-direction: column;
& > button{
    margin-top:20px;
    border-radius:3rem;
}
&>button:hover{
   
}
& > p 
{
 
  text-align:center;
}

input{
    padding-left:1.3rem;
}

  
`;

const Parafirst=styled.p`
margin-top:-10px;
margin-bottom:-10px;
`
const TextFont = styled.h1`
  text-align: center;
  padding-top:0.8rem;
  color:#7360DF;
`;


const InputBox = styled.input`



  
  padding: 0.6rem;

  border-radius: 5rem;
  border: 2px solid #7360DF;
  &:hover {
    border: 2px solid #7360DF;
  }
`;

const LoginButton =styled.button`
text-transform: none;
background:#7360DF;
color: black;
font-size:16px;
color:white;
height: 48px;
border-radius: 2px;
border:none;
&:hover{
  background:#11009E;

  border:none;
  cursor:pointer;

 }

`


const Forgot=styled.div`

text-align:right;
margin-top:13px;



  
`

const Checkbox =styled.div`

&>input[type=checkbox]{
    accent-color:#C780FA;
}
&>input{
    height:1.2rem;
    width:1.9rem;
    position:relative;
    background-color: #2196F3;
    
}
&>label{
   position:absolute;
 
}

`
const Line=styled.div`
  &>h4{
    display:flex;
    flex-direction:row;
  }
  &>h4:before,
  &>h4:after{
    content: "";
    flex: 1;
    border-bottom: 1px solid #000;
    margin: auto;
  }
  font-size:13px;
  
`
const Linksection =styled(Link)`

text-decoration:none;


`
const Highlight=styled.span`
color:orange;


  &:hover{
    color:red;
    text-decoration: underline orange;
  }


`


const Label=styled.label`

margin-left:15px;
padding-bottom:5px;


`
const Inlinediv=styled.div`

  display:flex;
  flex-direction:column;
  margin-bottom:20px;
  position:relative;
  &>span{
    position:absolute;
    left:21rem;
    bottom:3px;
  }
  @media (${size.mobile}){
    &>span{
        position:absolute;
        left:15rem;
    }
  }
`
const GoogleLoginContainer = styled.div`
  display: flex;
  justify-content: center;
`;
let x=VisibilityOffIcon;
const Login = () => {

const navigate=useNavigate();
    const [user , setuser]=useState({
      email:"",
      password:""
    })
       
    const [type ,setType]=useState('password');
    const[icon,setIcon]=useState(VisibilityOffIcon);

       const handleChange=(e)=>{
        const {name , value}=e.target
        setuser({...user , [name]:value})

       }
    const handleToggle=()=>{    
        if(type==='password'){
          setIcon(VisibilityIcon);      
          setType('text');
        }
        else{
          setIcon(VisibilityOffIcon);     
          setType('password');
        }
      }


      const googleaccount=async(data)=>{
        try{

        
       const response= await axios.post(`${process.env.REACT_APP_API_URL}/auth/googleaccount` , data)
      
    //    sessionStorage.setItem("email", response.data.details.email);
    // sessionStorage.setItem("accessToken", response.data.details.access_Token);
    // sessionStorage.setItem("refreshToken", response.data.details.refresh_Token);
    // sessionStorage.setItem("username", response.data.details.username);
    // sessionStorage.setItem("name", response.data.details.name);
    Cookies.set("email", response.data.details.email);
    Cookies.set("accessToken", response.data.details.access_Token);
    Cookies.set("refreshToken", response.data.details.refresh_Token);
    Cookies.set("username", response.data.details.username)
    Cookies.set("name", response.data.details.name)
    Cookies.set("mode" , response.data.details.mode)
    Cookies.set("userid" , response.data.details.id)
       if(response.data.success)
       {
        console.log(response.data.details.username , "fdsf")
        navigate("/" + response.data.details.username)
       }
      }catch(error)
      {
        console.log(`error on frontend while login from google account:${error}`)
      }
     
     }


     const Login= async()=>{
      try{
      
       
        
        const res=await axios.post(`${process.env.REACT_APP_API_URL}/auth/login` , user);

console.log(res, "fddsfd")
  if(res.data.success)
  {
  
    // sessionStorage.setItem("email", res.data.details.email);
    // sessionStorage.setItem("accessToken", res.data.details.access_Token);
    // sessionStorage.setItem("refreshToken", res.data.details.refresh_Token);
    // sessionStorage.setItem("username", res.data.details.username);
    // sessionStorage.setItem("name", res.data.details.name);
  
 Cookies.set("email", res.data.details.email);
 Cookies.set("accessToken", res.data.details.access_Token);
 Cookies.set("refreshToken", res.data.details.refresh_Token);
 Cookies.set("username" , res.data.details.username)
 Cookies.set("name", res.data.details.name)
 Cookies.set("mode" , res.data.details.mode)
 Cookies.set("userid" , res.data.details.id)

navigate("/" + res.data.details.username)
  }
alert(res.data.message);
       
      } catch (error) {
        console.log('login error', error);
        alert(error.message);
      }
    
         

     }
     
  return (
    <Components>
      <Section>
              
            
        <TextFont>Login</TextFont>

           
      
        <Wrapper>


             
               
           
       <Inlinediv>
     
            <Label>Email</Label>
            <InputBox type="text" placeholder="Email" name="email" value={user.email}  onChange={handleChange}></InputBox>
            

</Inlinediv>
          

<Inlinediv>
            <Label>Password</Label>
            <InputBox  type={type} name="password" value={user.password}  onChange={handleChange}  placeholder="Password"></InputBox>

            <span onClick={handleToggle}>  {x===icon ? <VisibilityOffIcon/>
            : <VisibilityIcon/>}</span>
            </Inlinediv>


            <Checkbox>
              <input  type="checkbox" ></input>
              <label>Remember me</label>
            </Checkbox>




        
            
     

          <LoginButton onClick={Login}>Login</LoginButton>



          
          <Forgot><Linksection to="/auth/forgotpassword"><Highlight>Forgot password</Highlight></Linksection>  </Forgot>
            
          <Line><h4>OR</h4></Line>
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
       
           <Parafirst>Don't have an account?<Linksection to="/auth/signup"> <Highlight>Sign up</Highlight>  </Linksection></Parafirst>


           <p>By Login, you agree to the <Highlight>Terms & Conditions</Highlight> and acknowledge our <Highlight>Privacy Policy</Highlight></p>
        </Wrapper>
      </Section>
    </Components>
  );
};

export default Login;
