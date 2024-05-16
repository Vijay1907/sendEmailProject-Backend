// emailUtils.js

const Queue = require('bull');
const nodemailer = require('nodemailer');

// Create a Bull queue
const emailQueue = new Queue('emailQueue', {
    redis: {
        host: 'localhost',
        port: 6379,
    },
});

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ajayraj072001@gmail.com', // Your Gmail email address
        pass: 'ktvh gzbg xceh upsh', // Your Gmail password or App Password if 2-factor authentication is enabled
    },
});

// Worker function to send email with attachment
// Worker function to send email with attachment
emailQueue.process(async (job) => {
    try {
        const { to, subject, text, attachment, attachmentFilename } = job.data;

        // Check if the file exists
        if (!fs.existsSync(attachment)) {
            console.error('Attachment file does not exist:', attachment);
            return false;
        }

        // Send email
        await transporter.sendMail({
            from: 'ajayraj072001@gmail.com',
            to,
            subject,
            text,
            attachments: [{ filename: attachmentFilename, path: attachment }],
        });

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
});



// Function to enqueue emails to be sent
// Function to enqueue emails to be sent
async function sendEmails(emails) {
    console.log('timeout');
    for (const email of emails) {
        console.log('kheyi', email);
        await emailQueue.add({
            to: email.to,
            subject: email.subject,
            text: email.text,
            attachment: email.attachment,
            attachmentFilename: email.attachmentFilename, // Add attachment filename
        });
        console.log('kahalhai');
    }
}


module.exports = sendEmails;
