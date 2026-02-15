import dotenv from 'dotenv'
import nodemailer from 'nodemailer';
dotenv.config();

const Sendmail = async (link, to) => {
    try {
        // Fixed configuration with explicit SMTP settings and IPv4
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // Changed to 587 for better Railway compatibility
            secure: false, // false for port 587
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS
            },
            family: 4, // Force IPv4 to avoid IPv6 connection issues
            connectionTimeout: 15000,
            greetingTimeout: 15000,
            socketTimeout: 15000,
        });

        // Test connection first
        await transporter.verify();
        console.log('✅ SMTP Server ready to send emails');

        // Fixed: Use colon instead of backtick for 'from' field
        const mail = await transporter.sendMail({
            from: `Admin <${process.env.USER_EMAIL}>`,
            to,
            subject: "Account Verification",
            html: `
                <h2>Verify Your Account</h2>
                <p>Click the link below to set your account password:</p>
                <a href="${link}">${link}</a>
            `
        });

        // FIXED: Use parentheses, not backticks!
        console.log(`✅ Email sent successfully to ${to}`);
        return mail;

    } catch (error) {
        // FIXED: Use parentheses, not backticks!
        console.error(`❌ Error sending email to ${to}:`, error.message);
        throw error; // Re-throw to handle upstream
    }
}

export default Sendmail;
