import React, { useContext, useState, useEffect } from "react";
import headerlogo from "./image/logo.png";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import MessageIcon from "@mui/icons-material/Message";
import axios from "axios";
import defaultimage from "./image/defaultprofileimage.jpg";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;

  align-items: center;
  text-align: center;
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.1);
  background-color: white;
  margin-bottom: 7px;
  position: relative;
`;

const Image = styled.img`
  height: 2rem;
  margin: 17px 18px;

  @media (max-width: 500px) {
    margin: 17px 15px;
  }
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

const Userview = styled.span`
  padding: 0px;
  border-radius: 50%;
  margin: 0px 11px 0px 0px;
  font-size: 1rem;
 
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px 29px 0px 0px;
  text-align: center;
  align-item: center;

  @media (max-width: 700px) {
    display: none;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  margin: 0px 16px;

  font-weight: 800;
  color: #4942e4;
  @media (max-width: 700px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  flex-direction: column;
  position: absolute;
  top: 68px;
  right: 10px;

  width: 150px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 0px;
  z-index: 1;
  @media (max-width: 700px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  }
`;
const Profilebutton = styled.div`
  a {
    color: black;
    text-decoration: none;
  }
  a:hover {
    color: white;
    background-color: #7360df;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  color: #333;
  text-decoration: none;
  padding: 10px;

  font-size: 18px;

  &:hover {
    background-color: #7360df; /* Change the background color on hover */
    color: white; /* Change the text color on hover */
    transition: background-color 0.3s ease, color 0.3s ease; /* Add a smooth transition effect */
  }
`;
const MenuItem = styled(Link)`
  color: #333;
  text-decoration: none;
  padding: 10px;

  font-size: 18px;

  &:hover {
    background-color: #7360df; /* Change the background color on hover */
    color: white; /* Change the text color on hover */
    transition: background-color 0.3s ease, color 0.3s ease; /* Add a smooth transition effect */
  }
`;

const Anchor=styled.a`
color: #333;
text-decoration: none;
padding: 10px;

font-size: 18px;

&:hover {
  background-color: #7360df; /* Change the background color on hover */
  color: white; /* Change the text color on hover */
  transition: background-color 0.3s ease, color 0.3s ease; /* Add a smooth transition effect */
}
`;


const HeaderText = styled.h2`
  font-family: "Lobster", sans-serif;
  font-weight: 500;
  font-size: 33px;
  // color: #7360DF
  margin: 15px 0px;

  @media (max-width: 700px) {
    font-size: 28px;
  }

  @media (max-width: 400px) {
    font-size: 18px;
  }
`;

const HeaderLogoText = styled.div`
  display: flex;
  align-items: center;
`;

const Buttonicon = styled.button`
  border: none;
  text-align: center;
  align-item: center;
  margin-top: 0.4rem;
  cursor: pointer;
  &:hover {
    + ${MenuItem} ${Userview} {
      background-color: #7360df;
    }
  }
`;

const SmallImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: 4px;
  border: 5px solid #fff;
  cursor: pointer;
`;
const Header = ({ profileImageurl}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const location = useLocation();
  const [profileimage, setProfileImage] = useState(defaultimage);
  const segments = location.pathname.split("/");
  console.log(segments, "{{{{");
  const usernameFromPath = Cookies.get("username");

  useEffect(() => {
 
    const gettingimage = async () => {
      const username = Cookies.get("username");
      const email = Cookies.get("email");
      const data = {
        username: username,
        email: email,
      };
      const dataimage = await axios.post(
        `${process.env.REACT_APP_API_URL}/getprofileimage`,
        data
      );
      console.log(dataimage, "%%%%%%");

      if (dataimage.data.status) {
        setProfileImage(dataimage.data.profileimageurl);
        console.log(dataimage.data.profileimageurl, "$$$$$$$$$$");
        Cookies.set("profileimageurlmain", dataimage.data.profileimageurl);
      } else {
        Cookies.set("profileimageurlmain", defaultimage);
      }
    };
    gettingimage();
  }, []);

  var username = Cookies.get("username");

  useEffect(() => {
    // Get user data from cookies when the component mounts
    setProfileImage(profileImageurl || Cookies.get("profileimageurl"));
    const user = Cookies.get("name");
    setUser(user);
  }, []);
  const toggleNavbar = () => {
    setNavbarOpen(!isNavbarOpen);
  };
  const logout = async () => {
    try {
      setNavbarOpen(!isNavbarOpen);

      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        user
      );

      // Clear session storage, set user to empty, and navigate to "/"
      sessionStorage.clear();
      const cookies = Cookies.get(); // Get all cookies
      for (const cookie in cookies) {
        Cookies.remove(cookie); // Remove each cookie
      }
      setUser("");
      navigate("/auth/login");
    } catch (error) {
      console.log("error while logout", error);
    }
  };

  useEffect(() => {
    const closeNavbar = (event) => {
      if (isNavbarOpen && !event.target.closest("#mobile-menu")) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener("mousedown", closeNavbar);

    return () => {
      document.removeEventListener("mousedown", closeNavbar);
    };
  }, [isNavbarOpen]);
const handleprofileLink=()=>{
  window.location.reload();
};
  return (
    <div>
      <HeaderSection>
        <HeaderLogoText>
          <Link to={`/${username}`}>
            <Image src={headerlogo} />
          </Link>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to={`/${username}`}
          >
            <HeaderText>infinity</HeaderText>
          </Link>
        </HeaderLogoText>
        <HamburgerButton style={{ size: "xx-large" }} onClick={toggleNavbar}>
          {isNavbarOpen ? (
            <CloseIcon style={{ fontSize: "xx-large" }} />
          ) : (
            <MenuIcon style={{ fontSize: "xx-large" }} />
          )}
        </HamburgerButton>
        <ButtonSection>
          {!user ? (
            <>
              <div>
                <Link to="/auth/login">
                  <Button>Login</Button>
                </Link>
              </div>
              <div>
                <Link to="/auth/signup">
                  <Button>Signup</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              {user && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <Link to={`/profile/${usernameFromPath}/friends`}>
                        <Buttonicon    style={{ marginRight: "0.5rem" , backgroundColor:"transparent" , color:"black"}}>
                          <Diversity3Icon  />
                        </Buttonicon>
                      </Link>
                      <Buttonicon
                     
                      ></Buttonicon>
                    </div>

                    <Link  
                      style={{ textDecoration: "none" }}
                      to={`/profiles/${username}`}
                    >
                      {" "}
                      <Userview onclick={handleprofileLink} >
                        {" "}
                        <SmallImage src={profileimage || defaultimage}></SmallImage>
                      </Userview>
                    </Link>
                    <Button onClick={logout}>Logout</Button>
                  </div>
                </>
              )}
            </>
          )}
        </ButtonSection>
        <MobileMenu isOpen={isNavbarOpen} id="mobile-menu">
          {!user ? (
            <>
              <MenuItem to="/auth/login" onClick={toggleNavbar}>
                Login
              </MenuItem>
              <MenuItem to="/auth/signup" onClick={toggleNavbar}>
                Signup
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem to={`/profile/${usernameFromPath}/friends`}>
               
           <Diversity3Icon/>
              
              </MenuItem>



              <MenuItem to={`/profile/${username}`} onClick={toggleNavbar}>
                profile
              </MenuItem>
             
              <MenuItem onClick={logout}>Logout</MenuItem>
            </>
          )}
        </MobileMenu>
      </HeaderSection>
    </div>
  );
};

export default Header;
