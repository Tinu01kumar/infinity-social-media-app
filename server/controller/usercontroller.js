import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userRegister from "../models/userRegister.js";
import otpmodel from "../models/otp.js";
import profilemodel from "../models/profile.js";
import verifytokenmodel from "../models/verifyToken.js";
import sendEmail from "../utils/sendEmail.js";
dotenv.config();

export const createUser = async (req, res) => {
  try {
    console.log(req.body.email, "!!!!!!!!!!!!!!")
    const isExist = await userRegister.findOne({
      email: req.body.email.toLowerCase(),
    });
    console.log(isExist , "$$$$$$");
    if (isExist) {
      console.log( "######" , isExist.status, "###############")
      if (isExist.status===true) {
        return res.json({
          errorCode: 0,
          message: "you already exist in our database",
        });
      } else {
        const payload = { user_id: isExist._id };
        const emailverifytokenmodel = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );
        const now = new Date();
        const token = new verifytokenmodel({
          email: isExist.email,
          token: emailverifytokenmodel,
          created_at: now,
        });
        await token.save();
        const token_id = token._id;
        const text = `http://localhost:3000/auth/verify/${emailverifytokenmodel}/${token_id}`;
        
        await sendEmail(isExist.email, text);

        return res.json({
          errorCode: 0,
          message:
            "you are not verified , verification Email sent to your mail ",
        });
      }
    } else {
      const now = new Date();
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const username = await generateUniqueUsername(req.body.name);
      console.log(username, "^^^^^^^^^^^^^", req.body);

      const newcoustomer = new userRegister({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: hashedPassword,
        status: false,
        created_at: now,
        username: username,
        updated_at: now,
      });
      const result = await newcoustomer.save();
      console.log("result", result, newcoustomer._id);
      const payload = { userid: newcoustomer._id };

      res.json({
        errorCode: 0,
        message: "email sent to your mail",
      });
      const emailverifytokenmodel = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const token = new verifytokenmodel({
        email: newcoustomer.email,
        token: emailverifytokenmodel,
        created_at: now,
      });
      await token.save();
      const token_id = token._id;
      const text = `http://localhost:3000/auth/verify/${emailverifytokenmodel}/${token_id}`;

      await sendEmail(newcoustomer.email, text);
    
    }
  } catch (error) {
    return { errorCoe: 1, message: `error during signup : ${error}` };
  }
};

async function generateUniqueUsername(name) {
  let baseUsername = name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
  let username = baseUsername;
  let counter = 1;

  while (await isUsernameTaken(username)) {
    username = `${baseUsername}-${counter}`;
    counter++;
  }

  return username;
}

async function isUsernameTaken(username) {
  const existingUser = await userRegister.findOne({ username: username });
  return !!existingUser;
}

export const login = async (req, res) => {
  try {
    const userExist = await userRegister.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (userExist) {
      console.log(userExist.status)
      if (userExist.status===true) {
        const passwordMatch = await bcrypt.compare(
          req.body.password,
          userExist.password
        );
        if (passwordMatch) {
          const now = new Date();

          const payload = { user_id: userExist._id };

          const access_Token = jwt.sign(payload, process.env.JWT_SECRET);

          const refresh_Token = jwt.sign(payload, process.env.JWT_SECRET);

          if (access_Token === refresh_Token) {
            console.log("@@@@@@@@@@@@@@2");
          }
          userExist.log_in = now;
          const details = {
            id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            access_Token: `Bearer ${access_Token}`,
            refresh_Token: `Bearer ${refresh_Token}`,
            log_in: now,
            username: userExist.username,
            mode:userExist.mode
          };
          userExist.refreshToken = refresh_Token;
          const userprofile=new profilemodel({
            user:userExist._id,
            username:userExist.username,
          })
          await userprofile.save()
          res.json({
            errorCode: 0,
            details: details,
            message: "successfully login",
            success: true,
          });
        } else {
          res.json({
            errorCode: 1,
            message: "password is not correct",
            success: false,
          });
        }
      } else {
        console.log("@@@@@@@@@@##################")
        const payload = { user_id: userExist._id };
        const emailverifytokenmodel = jwt.sign(payload ,process.env.JWT_SECRET, {
          expiresIn: "15m",
        });
        let now = new Date();
        const token = new verifytokenmodel({
          email: userExist.email,
          token: emailverifytokenmodel,
          created_at: now,
         
        });
        await token.save();
        const token_id = token._id;
        const text = `process.env.URL_OF_EMAIL/auth/verify/${emailverifytokenmodel}/${token_id}`;

        await sendEmail(req.body.email, text);
       console.log("dsfds")
       
      
      
        res.json({
          errorCode: 0,
     
          message:
            " your email is not verified , please verifiy it email send to your mail",
          success: false,
        });
      }
    } else {
      res.json({
        errorCode: 0,
        message: "you are not exist in our database, please register",
        success: false,
      });
    }
  } catch (error) {
    return {
      errorCode: 1,
      message: `error in login:  ${error}`,
      success: false,
    };
  }
};

export const forgotpassword = async (req, res) => {
  try {
    console.log("FFFFFFFFFFF");
    const email = req.body.email.toLowerCase();
    const isExist = await userRegister.findOne({
      email: email,
    });
    if (isExist) {
      console.log("DDDDDDDDDDDDDD");
      let otpcode = Math.floor(Math.random() * 10000) + 1;
      let otpreq = new otpmodel({
        email: req.body.email.toLowerCase(),
        otp: otpcode,
        expireIn: new Date().getTime() + 300 * 1000,
        created_at: new Date(),
      });
      await otpreq.save();
      const lastestotpreq = await otpmodel
        .findOne({
          email: email.toLowerCase(),
        })
        .sort({ expireIn: -1 });

      const text = `your otp code is ${lastestotpreq.otp}`;
      await sendEmail(email, text);

      res.json({
        errorCode: 0,
        id: isExist._id,
        message: "otp send to your mail",
      });
    } else {
      res.json({ errorCode: 0, message: "this email is not exist" });
    }
  } catch (error) {
    return { errorCode: 1, message: `error while forgotpassword: ${error}` };
  }
};

export const otpverification = async (req, res) => {
  try {
    const user_details = await userRegister.findOne({
      _id: req.body.id,
    });

    const otpcode = await otpmodel
      .findOne({
        email: user_details.email,
      })
      .sort({ expireIn: -1 });

    console.log(otpcode, "dsfdsfdsds");
    if (otpcode.otp === req.body.code) {
      res.json({ erorCode: 0, id: req.body.id, message: "success" });
    } else {
      res.json({ errorCode: 0, message: "otp is not correct" });
    }
  } catch (error) {
    return { errorCode: 1, message: `error while otpverficiation ${error}` };
  }
};

export const resetpassword = async (req, res) => {
  console.log(req.body);
  try {
    const now = new Date();
    const user_details = await userRegister.findOne({ _id: req.body.id });
    console.log(user_details);
    if (user_details) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user_details.password = hashedPassword;
      user_details.updated_at = now;
      await user_details.save();

      res.json({ errorCode: 0, message: "success" });
    } else {
      res.json({ errorCode: 1, message: "user not exist" });
    }
  } catch (error) {
    return {
      errorCode: 1,
      message: `error while reset password error is: ${error}`,
    };
  }
};

export const emailVerificaton = async (req, res) => {
  // console.log(req.body.id, req.body.token, "************");
  try {
    if (req.body.id && req.body.token) {
      try {
        const bodybaseTokenId = await verifytokenmodel
          .findOne({ _id: req.body.id })
          .sort();

        if (req.body.token === bodybaseTokenId.token) {
          const statuschange = await userRegister.findOne({
            email: bodybaseTokenId.email,
          });
          console.log(statuschange.status);
          if (statuschange.status === false) {
            console.log("dsjfkj");
           const res= await userRegister.updateOne(
              { email: bodybaseTokenId.email },
              { $set: { status: true } }
            );
            console.log(res, '@@@@@@#########')
          } else {
            res.json({
              errorCode: 0,
              message: "Email is already verified",
              success: true,
            });
          }

          res.json({
            errorCode: 0,
            message: "email verifed",
            success: true,
          });
        } else {
          res.json({
            errorCode: 0,
            message: "Link is not valid",
            success: true,
          });
        }
      } catch (error) {
        res.json({
          errorCode: 1,
          message: "Link is not valid",
          success: true,
        });
      }
    } else {
      res.json({
        errorCode: 1,
        message: "link is not valid",
        success: true,
      });
    }
  } catch (error) {
    return { errorCode: 1, message: `error while verification :  ${error}` };
  }
};

export const googleaccount = async (req, res) => {
  try {
    console.log(req.body.googledata.name, "req.body");
    const now = new Date();
    var flag = false;
    var user = await userRegister.findOne({
      email: req.body.googledata.email,
    });
    if (user) {
      console.log("fdsfsdfsdfds88888888888888888888888888");
      if (req.body.googledata.status) {
        flag = true;
      } else {
        res.json({
          errorCode: 0,
          message: "your email is not verified from google service",
          success: false,
        });
      }
    } else {
      if (req.body.googledata.status) {
        flag = true;
        const now = new Date();
        const username = await generateUniqueUsername(req.body.googledata.name);
        console.log(username, "dfffffffff");
        console.log(req.body.googledata.status , "&*&***&*&*&**&&&*&**")
        user = new userRegister({
          name: req.body.googledata.name,
          email: req.body.googledata.email,
          status: true,
          password: await bcrypt.hash(process.env.GOOGLE_USER_PASSWORD, 10),

          log_in: now,
          created_at: now,
          updated_at: now,
          username: username,
        });

        const userprofile=new profilemodel({
          user:user._id,
          profileImageUrl:"",
          username:user.username,
        })
        await userprofile.save()
        console.log(userprofile)

      
  const result = await user.save();
  
      console.log(result,")))))))))))")
      } else {
        res.json({
          errorCode: 0,
          message: "your email is not verified from google service",
          success: false,
        });
      }
    }
    console.log(flag,"$$$$$$$$$$$$")


    if (flag) {
      console.log("@@@@@@############");
      const payload = {
        user_id: user._id,
      };
      const access_Token = jwt.sign(payload, process.env.JWT_SECRET);

      const refresh_Token = jwt.sign(payload, process.env.JWT_SECRET);

      const userdata = {
        id: user._id,
        email: user.email,
        name: user.name,
        access_Token: `Bearer ${access_Token}`,
        refresh_Token: `Bearer ${refresh_Token}`,
        log_in: now,
        username: user.username,
        mode:user.mode
      };
     return res.json({
        errorCode: 0,
        details: userdata,
        success: true,
      });
    }
  } catch (error) {
    res.json({
      errorCode: 1,
      mssage: `error while google account linking :${error}`,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const now = new Date();

    // Update the user's logout timestamp
    const user = await userRegister.updateOne(
      { email: req.body.email },
      { $set: { log_out: now } }
    );

    res.json({
      errorCode: 0,
      success: true,
    });
    console.log(user);
    // Find the user
    const foundUser = await userRegister.findOne({ email: req.body.email });

    // Delete OTPs for the user
    const otpDelete = await otpmodel.deleteMany({ email: req.body.email });

    // Delete tokens older than 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const tokenDelete = await verifytokenmodel.deleteMany({
      exp: { $lt: fifteenMinutesAgo },
    });
    console.log(tokenDelete, "fsdfsd");
  } catch (error) {
    res.json({
      errorCode: 1,
      success: false,
      details: `Error while logout: ${error}`,
    });
  }
};




export const updateName=async(req,res)=>{
  try{

   console.log(req.body)
   const id=req.body.userid;
   const userData = await userRegister.findByIdAndUpdate(
    id,
    { name: req.body.editableName },
    { new: true } // Return the updated document
  );
  if(userData)
  {
    res.json({
      status:true
    })
  }
  else{
    res.json({
      status:false
    })
  }
}catch(error){
  console.log(`error while saving the name:${error}`)
}
}