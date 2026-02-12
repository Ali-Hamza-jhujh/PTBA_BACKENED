import dotenv from 'dotenv'
import nodemailer from 'nodemailer';
dotenv.config();
const Sendmailregect=async(to)=>{
   try {
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
           user:process.env.USER_EMAIL,
           pass:process.env.USER_PASS
        }
    });
   const mail=await transporter.sendMail({
    from:`Admin <${process.env.USER_EMAIL}>`,
    to,
    subject: "Account Verification",
      html: `
        <h2>Regetced</h2>
        <p>You are regected by the admin ,Admin do not accept your request!</p>
      `
   })
   console.log("Email regected!")
} catch (error) {
        console.error(`Error sending email to ${to}: `, error.message);
    }
}

export default Sendmailregect;