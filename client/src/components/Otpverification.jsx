import React from "react";
import styled from "styled-components";
import axios from "axios";
import {useState} from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Changepassword from "./Changepassword";
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
const TextFont = styled.h1`
  text-align: center;
  padding-top:0.8rem;
  color:#C780FA;
`;


const InputBox = styled.input`



  
  padding: 0.6rem;

  border-radius: 5rem;
  border: 2px solid #C780FA;
  &:hover {
    border: 2px solid #C780FA;
  }
`;

const LoginButton =styled.button`
text-transform: none;
background:#C780FA;
color: black;
font-size:16px;

height: 48px;
border-radius: 2px;
border:none;
&:hover{
  background:white;
  outline:3px solid aqua;
  border:none;

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

const Otpverification = () => {
    const {id}=useParams();
const navigate=useNavigate();
    const [user , setuser]=useState({
      otp:"",
      
    })
       
  

       const handleChange=(e)=>{
        const {name , value}=e.target
        setuser({...user , [name]:value})

       }
  

     const Login= async()=>{
        console.log(user);
        
      try{
        const res=await axios.post(`${process.env.REACT_APP_API_URL}/auth/otpverification/${id}` ,{id , code:user.otp });

console.log(res, "&&&&&&&&&")
        const  message   = res.data.message; 
           const userid=res.data.id;
           console.log(message, userid , "dfsd")
        if (message === "success") {
            alert("code matched")
            navigate(`/auth/changepassword/${userid}`);
          } else {
            alert(message);
          }
        } catch (error) {
          console.log('Error in password change', error);
          alert(error.message);
        }
    
         

     }
     
  return (
    <Components>
      <Section>
              
            
        <TextFont>Otp verification</TextFont>

     
      
        <Wrapper>


             
               
           
       <Inlinediv>
     
            <Label>Otp</Label>
            <InputBox type="text" placeholder="Enter otp code" name="otp" value={user.otp}  onChange={handleChange}></InputBox>
            

</Inlinediv>
          




        
            
     

          <LoginButton onClick={Login}>Continue</LoginButton>



          
          
            
          <Line><h4>OR</h4></Line>
          
           <p>Don't have an account?<Linksection to="/auth/signup"> <Highlight>Sign up</Highlight>  </Linksection></p>


           <p>By Login, you agree to the <Highlight>Terms & Conditions</Highlight> and acknowledge our <Highlight>Privacy Policy</Highlight></p>
        </Wrapper>
      </Section>
    </Components>
  );
};

export default Otpverification;













