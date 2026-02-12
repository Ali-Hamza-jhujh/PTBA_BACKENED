import cron from 'node-cron';
import hearings from '../models/hearings.js';
import Sendmailremainder from '../mails/remaindermaul.js';

const Allhearings = cron.schedule('*/5 * * * *', async () => {
    console.log('Running hearing reminders task at 12:20 PM Karachi');
    try {
        const now = new Date();
        const karachiOffset = 5 * 60;
        const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        const karachiNow = new Date(utc.getTime() + karachiOffset * 60000);
        const tomorrow = new Date(karachiNow);
        tomorrow.setDate(karachiNow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const startUTC = new Date(tomorrow.getTime() - karachiOffset * 60000);
        const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000 - 1); 
        const hearingsall = await hearings.find({
            hearingdate: { $gte: startUTC, $lte: endUTC },
            issent: false
        }).populate("user").populate("case");
        if (!hearingsall.length) {
            console.log("No hearings found for reminder tomorrow.");
            return;
        }
        console.log(`Found ${hearingsall.length} hearings for reminders tomorrow`);
        for (let hearing of hearingsall) {
            if (!hearing.user || !hearing.case) continue;
            console.log(`Sending reminder to: ${hearing.user.email} for case: ${hearing.case.caseid}`);
            try {
                await Sendmailremainder(
                    hearing.user.email,
                    hearing.hearingdate,
                    hearing.case.caseid
                );
                hearing.issent = true;
                await hearing.save();
            } catch(err) {
                console.error(`Failed to send email to ${hearing.user.email}:`, err.message);
            }
        }
        console.log("All hearing reminders processed.");
    } catch (error) {
        console.error("Error in hearing reminders cron job: ", error.message);
    }
}, {
    scheduled: true,
    timezone: "Asia/Karachi"
});
export default Allhearings;
