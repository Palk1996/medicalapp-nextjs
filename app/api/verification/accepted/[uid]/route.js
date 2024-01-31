import { NextResponse } from "next/server";
import mysql from 'mysql2/promise';

export function POST(req) {
  const uid = req.body.uid;
  return NextResponse.json({ Post: uid });
}

export async function GET(req, { params }) {
  const db = await mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: process.env.port,
  });
  const username = params.uid;
  try {

    const queryUsername = `SELECT status FROM admin WHERE username = '${username}'`;
    const [status] = await db.query(queryUsername);

    if (status[0].status === 'pending') {
      const changeStatusQuery = `
        UPDATE admin
        SET status = 'verified'
        WHERE username = '${username}'
      `;
      await db.query(changeStatusQuery);
      return new NextResponse(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verified</title>
      </head>
      <body style="height: 100 vh;">
          <center style="transform: translateY(100%);">
              <svg xmlns="http://www.w3.org/2000/svg" width="10rem" height="10rem" viewBox="0 0 24 24">
                  <g fill="none" stroke="#00adb5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                      <circle cx="12" cy="12" r="9" />
                      <path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12L11 15L16 10">
                          <animate fill="freeze" attributeName="stroke-dashoffset" dur=".5s" values="14;0" />
                      </path>
                  </g>
              </svg>
              <h1 style=" font-weight: bold;">This account: <span style="color: #00adb5;">${username}</span> is verified</h1>
              <a href="http://localhost:3000/">return to your website</a>
          </center>
      </body>
      </html>
      `, { status: 200, headers: { 'content-type': 'text/html' } });
    } else if (status[0].status === 'verified') {
      return new NextResponse(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verified</title>
      </head>
      <body style="height: 100 vh;">
          <center style="transform: translateY(100%);">
              <svg xmlns="http://www.w3.org/2000/svg" width="10rem" height="10rem" viewBox="0 0 24 24">
                  <g fill="none" stroke="#00adb5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                      <circle cx="12" cy="12" r="9" />
                      <path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12L11 15L16 10">
                          <animate fill="freeze" attributeName="stroke-dashoffset" dur=".5s" values="14;0" />
                      </path>
                  </g>
              </svg>
              <h1 style=" font-weight: bold;">This account: <span style="color: #00adb5;">${username}</span> is already verified</h1>
              <a href="http://localhost:3000/">return to your website</a>
          </center>
      </body>
      </html>
      `, { status: 200, headers: { 'content-type': 'text/html' } });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
    </head>
    <body style="height: 100 vh;">
        <center style="transform: translateY(100%);">
            <svg xmlns="http://www.w3.org/2000/svg" width="10rem" height="10rem" viewBox="0 0 24 24">
                <g fill="none" stroke="#ea2a2a" stroke-linecap="round" stroke-width="2">
                    <path stroke-dasharray="60" stroke-dashoffset="60" d="M5.63604 5.63603C9.15076 2.12131 14.8492 2.12131 18.364 5.63603C21.8787 9.15075 21.8787 14.8492 18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364C2.12132 14.8492 2.12132 9.15075 5.63604 5.63603Z">
                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0" />
                    </path>
                    <path stroke-dasharray="18" stroke-dashoffset="18" d="M6 6L18 18">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="18;0" />
                    </path>
                </g>
            </svg>
            <h1 style=" font-weight: bold;">Unknow user: <span style="color: #ea2a2a;">${username}</span></h1>
            <p>${error}</p>
            <a href="http://localhost:3000/">return to your website</a>
        </center>
    </body>
    </html>
    `, { status: 200, headers: { 'content-type': 'text/html' } });
  } finally {
    await db.end();
  }
}
