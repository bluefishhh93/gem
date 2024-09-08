import nodemailer from 'nodemailer';
import { env } from "@/env";
import {render} from "@react-email/components";

const transporter = nodemailer.createTransport({
    service: 'SMTP',
    host: env.NODE_EMAIL_SERVER_HOST,
    port: Number(env.NODE_EMAIL_SERVER_PORT),
    secure: env.NODE_EMAIL_SERVER_SECURE === 'true',
    auth: {
        user: env.NODE_EMAIL_SERVER_USER,
        pass: env.NODE_EMAIL_SERVER_PASSWORD,
    },
} as nodemailer.TransportOptions);

export async function sendEmail(
    email: string,
    subject: string,
    htmlBody: React.ReactElement
) {
    const mailOptions = {
        from: env.NODE_EMAIL_FROM,
        to: email,
        subject: subject,
        html: render(htmlBody),
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}