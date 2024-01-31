import nodemailer from 'nodemailer';

const email = process.env.email;
const password = process.env.emailPass

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: password
    }
});

export const emailOptions = {
    from: email,
    to: email
};