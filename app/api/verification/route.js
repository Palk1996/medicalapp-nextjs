import { NextResponse } from "next/server";
import { transporter, emailOptions } from "@/app/config/nodemailer";
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export async function POST(req) {
    const db = await mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
        port: process.env.port,
    });
    try {
        const data = await req.json();
        console.log(data);

        const { email, username, tel } = data;
        const birthDate = new Date(data.birth);
        const query = `INSERT INTO admin (username, password, email, telephone, gender, birthdate, status, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const plainPassword = data.password;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const values = [username, hashedPassword, email, tel, data.gender, birthDate, 'pending', 'creator', data.firstName, data.lastName];
        await db.query(query, values);
        const emailTemplate = `
            <body style="width: 100%; padding-bottom: 2rem;">
                <div style=" border: 1px solid #000;">
                <div style="padding: 3rem; text-align: center; color: #eeeeee; background-color: #242424;">
                    <h1>MEDICAL APP</h1>
                </div>

                <div style="font-weight: bold; padding: 3rem; text-align: center;">
                    <p>จากผู้ใช้ <span style="color: #00adb5;">${username}</span> || email: <span style="color: #00adb5;">${email}</span></p>
                    <p>คุณได้รับคำขอสมัครสมาชิกจากผู้ใช้ <span style="color: #00adb5;">${username}</span></p>
                    <p>กรุณาตอบรับคำขอ</p>
                </div>

                <center>
                <a href="http://localhost:3000/api/verification/accepted/${username}" style="padding: 1rem 2rem; font-size: 16px; border-radius: 10px; cursor: pointer; font-weight: bold; color: #eeeeee; background-color: #4caf50; border: 1px solid #4caf50;">ยืนยัน</a>
                <a href="http://localhost:3000/api/verification/declined/${username}" style="padding: 1rem 2rem; font-size: 16px; border-radius: 10px; cursor: pointer; font-weight: bold; color: #eeeeee; background-color: #f44336; border: 1px solid #f44336;">ปฏิเสธ</a>
                </center>

                <p style="text-align: center; padding-top: 2rem;">โทร <span style="color: #00adb5;">${tel}</span> เพื่อติดต่อสอบถาม</p>
                </div>
            </body>
        `;
        await transporter.sendMail({
            ...emailOptions,
            subject: "Test Sender",
            text: "Hello, World",
            html: emailTemplate
        });
        return NextResponse.json({ status: "sent" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error });
    } finally {
        await db.end();
    }
}