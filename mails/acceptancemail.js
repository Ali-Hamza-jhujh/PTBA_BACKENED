import dotenv from 'dotenv'
import nodemailer from 'nodemailer';
dotenv.config();

const Sendmail = async (link, to) => {
    try {
        // Fixed configuration with explicit SMTP settings and IPv4
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS
            },
            family: 4, // Force IPv4 to avoid IPv6 connection issues
            connectionTimeout: 10000,
            greetingTimeout: 10000,
        });

        // Test connection first
        await transporter.verify();
        console.log('✅ SMTP Server ready to send emails');

        // Fixed: Use colon instead of backtick for 'from' field
        const mail = await transporter.sendMail({
            from: `Admin <${process.env.USER_EMAIL}>`, // FIXED: was using backtick
            to,
            subject: "Account Verification",
            html: `
                <h2>Verify Your Account</h2>
                <p>Click the link below to set your account password:</p>
                <a href="${link}">${link}</a>
            `
        });

        console.log(`✅ Email sent successfully to ${to}`);
        return mail;

    } catch (error) {
        // Fixed: Use parentheses instead of backticks for console.error
        console.error(`❌ Error sending email to ${to}:`, error.message);
        throw error; // Re-throw to handle upstream
    }
}

export default Sendmail;
