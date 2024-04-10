import nodemailer from "nodemailer"

const sendEmail = async (email , text) => {
    try {
        // Sending the OTP code via email
        const transporter = nodemailer.createTransport({
          host: process.env.EMAILHOST,
          service: process.env.EMAILSERVICE,
          port: process.env.EMAILPORT,
          secure: true,
          auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.FROMSENDEMAIL,
          to: email,
       
          text: text,
        });

        console.log("Email sent successfully");
       
      } catch (error) {
        console.log("Email not sent:", error.message);
      }
};


export default sendEmail