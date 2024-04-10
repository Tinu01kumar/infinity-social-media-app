import React, { useEffect, useState } from "react";
import Mainpagecontent from "./components/Mainpagecontent";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Profile } from "./components/Profile/Profile";
import ProfileImages from "./components/Profile/ProfileImages";
import Forgotpassword from "./components/Forgotpassword";
import Verify from "./components/Verify";
import Changepassword from "./components/Changepassword";
import Otpverification from "./components/Otpverification";
import Mode from "./components/Activity/Mode";
import FriendsRequest from "./components/Activity/FriendsRequest";
import Following from "./components/Activity/Following";
import Cookies from "js-cookie";
import LoginUserProfile from "./components/Profile/LoginUserProfile";
import { Navigate } from "react-router-dom";

import NotFound from "./components/NotFound";
const App = () => {

console.log(process.env.CLIENT_ID , "####################@@")
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Mainpagecontent />} />
            <Route exact path="/:username" element={<Mainpagecontent />} />
            <Route exact path="/auth/login" element={<Login />} />
            <Route exact path="/auth/signup" element={<Signup />} />
            <Route
              exact
              path="/profile/:username"
              element={<ProfileImages />}
            />
            <Route 
                 exact 
                 path="/profiles/:username" element={<LoginUserProfile/>}/>

            <Route
              exact
              path="/auth/forgotpassword"
              element={<Forgotpassword />}
            />
            <Route
              exact
              path="/auth/otpverification/:id"
              element={<Otpverification />}
            />
            <Route
              exact
              path="/auth/changepassword/:id"
              element={<Changepassword />}
            />
            <Route path="/auth/verify/:token/:id" element={<Verify />} />

            <Route path="/profiles/:username/mode" element={<Mode />} />
            <Route
              path="/profile/:username/friends"
              element={<FriendsRequest />}
            />
            <Route path="/:username/following" element={<Following />} />
            <Route path="/:username/followers" element={<Following />} />
            <Route path="/:username/connections" element={<Following />} />


            <Route path="*" element={<Navigate to="/404" />} />
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
      ;
    </>
  );
};

export default App;
