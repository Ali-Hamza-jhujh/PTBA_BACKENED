import dotenv from 'dotenv'
import nodemailer from 'nodemailer';
dotenv.config();
const Sendmailremainder = async (to, date, caseid) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user:process.env.USER_EMAIL,
                pass:process.env.USER_PASS
            }
        });

        const mail = await transporter.sendMail({
            from:`Admin <${process.env.USER_EMAIL}>`,
            to,
            subject: "Hearing Reminder",
            html: `
                <h2>Hearing Reminder</h2>
                <p>Your hearing is scheduled on <strong>${new Date(date).toLocaleString()}</strong> for case <strong>${caseid}</strong>.</p>
                <p>Please make sure to attend.</p>
            `
        });

        console.log(`Reminder sent to ${to} for case ${caseid}`);
    } catch (error) {
        console.error(`Error sending email to ${to}: `, error.message);
    }
};

export default Sendmailremainder;
