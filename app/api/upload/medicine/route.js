import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const db = await mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: process.env.port,
  });

  try {
    const medicineData = await req.json();
    console.log(medicineData);
    const insertQuery = `INSERT INTO medicine (medicine_name, type_id) VALUES (?, ?)`;

    const [result] = await db.query(insertQuery, [medicineData.medicine_name, Number(medicineData.type_id)]);

    console.log('Data inserted successfully');
    return NextResponse.json({ message: 'Upload successful', result });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ error: 'Internal Server Error' });
  } finally {
    db.end();
  }
}
