const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendNotification = async (toEmail, subject, message) => {
    try {
        const msg = {
            to: toEmail,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: subject,
            text: message,
            html: `<strong>${message}</strong>` // Optional: Send as HTML
        };

        await sgMail.send(msg);
        console.log('Email sent successfully to:', toEmail);
    } catch (error) {
        console.error('Error sending email:', error.response.body.errors);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendNotification;
