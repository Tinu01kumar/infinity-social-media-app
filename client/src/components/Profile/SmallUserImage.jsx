import React  ,{useEffect , useState} from 'react'
import defaultimage from "../image/defaultprofileimage.jpg";
import Cookies from 'js-cookie';
import styled from 'styled-components';
const SmallImage=styled.img`
width: 40px;
height: 40px;
border-radius: 50%;
margin-top:4px;
border: 5px solid #fff;
cursor: pointer;

`
const SmallUserImage = ({image}) => {
  const [tempimage, settempimage]=useState(defaultimage)
  useEffect(()=>{

    // const image=Cookies.get('profileimageurl');
    // settempimage(image)
  },[])
  return (
    <div>
     <SmallImage src={image}></SmallImage>

    </div>
  )
}

export default SmallUserImage