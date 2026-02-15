import dotenv from 'dotenv'
import nodemailer from 'nodemailer';
dotenv.config();
const Sendmail=async(link,to)=>{
    try{
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
        <h2>Verify Your Account</h2>
        <p>Click the link below to set your account password:</p>
        <a href="${link}">${link}</a>
      `
      
   })
   console.log("Email send!");
} catch (error) {
        console.error(`Error sending email to ${to}: `, error.message);
    }
}
export default Sendmail;
