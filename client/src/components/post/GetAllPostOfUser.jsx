import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import ImageAndName from '../Profile/ImageAndName'

const PostContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const PostBox = styled.div`
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 20px;
    width: 100%;
    max-width: 600px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const PostContent = styled.div`
    padding: 20px;
`

const PostImage = styled.img`
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
`

const Description = styled.p`
    margin-top: 10px;
    font-size: 16px;
`

const GetAllPostOfUser = () => {
    const [showpost, setShowpost] = useState(null)

    useEffect(() => {
        const username = Cookies.get("username");
        const email = Cookies.get("email")
        const data = {
            username: username,
            email: email
        }

        const getuserallpost = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/getalluserpost`, data)
                console.log(response)
                if (response.data.status) {
                    setShowpost(response.data.findallpost);
                } else {
                    // Handle error if needed
                }
            } catch (error) {
                // Handle error if needed
            }
        }
        getuserallpost();
    }, [])

    return (
        <PostContainer>
            {showpost && showpost.map((post, index) => (
                <PostBox key={index}>
                    <PostContent>
                        <ImageAndName /> {/* Render your ImageAndName component here */}
                        <Description>{post.description}</Description>
                        {post.postImage && <PostImage src={post.postImage} alt="Post" />} {/* Render image if available */}
                    </PostContent>
                </PostBox>
            ))}
        </PostContainer>
    )
}

export default GetAllPostOfUser
