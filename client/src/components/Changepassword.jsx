import React from "react";
import styled from "styled-components";
import {useState} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
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
let x=VisibilityOffIcon;


const Changepassword = () => {
const {id}=useParams();
  const navigate = useNavigate();
       const [user , setuser]=useState({
       
        password:"",
        reEnterPassword:""
       })
    const [type ,setType]=useState('password');
    const[icon,setIcon]=useState(VisibilityOffIcon);


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
    
   const handleChange=(e)=>{
         const {name , value}=e.target
         setuser({
            ...user , [name]:value
         })
   }
     





   const register = async (e) => {
    e.preventDefault();
    const password = user.password;
    const reEnterPassword = user.reEnterPassword;
  
    try {
      if (password === reEnterPassword) {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/changepassword/${id}`, {
          id: id, // Include the 'id' field in the request body
          password: password,
        });
          console.log(res)
        const  message  = res.data.message;
        if (message === "success") {
          alert("Password changed successfully");
          navigate("/auth/login");
        } else {
          alert(message);
        }
      } else {
        alert("Both passwords do not match");
      }
    } catch (error) {
      console.log("Error while changing the password", error);
      alert(error.message);
    }
  };
  



            
   
  return (
    <Components>
      <Section>
              
            
        <TextFont>Reset-Password</TextFont>

     
      
        <Wrapper>


             
               
    
     
          

<Inlinediv>
            <Label>Password</Label>
            <InputBox type={type} name="password" placeholder="Password"  onChange={handleChange}></InputBox>

            <span onClick={handleToggle}>  {x===icon ? <VisibilityOffIcon/>: <VisibilityIcon/>}</span>
            </Inlinediv>


            <Inlinediv>

            <Label>ReEnterPassword</Label>
            <InputBox type={type} name="reEnterPassword" placeholder="ReEnterPassword"  onChange={handleChange}></InputBox>

            <span onClick={handleToggle}>  {x===icon ? <VisibilityOffIcon/>: <VisibilityIcon/>}</span>
            </Inlinediv>


           




        
            
     

          <LoginButton onClick={register}  >Change</LoginButton>



          
            
          <Line><h4>OR</h4></Line>
          
           <p>Already a User?<Linksection to="/login"> <Highlight>Login</Highlight>  </Linksection></p>


           <p>By Signup, you agree to the <Highlight>Terms & Conditions</Highlight> and acknowledge our <Highlight>Privacy Policy</Highlight></p>
        </Wrapper>
      </Section>
    </Components>
  );
};

export default Changepassword;







