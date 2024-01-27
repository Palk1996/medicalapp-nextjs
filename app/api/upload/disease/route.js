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
    const diseaseData = await req.json();
    console.log(diseaseData);
    const insertQuery = `INSERT INTO disease (disease_name_th, disease_name_en, description, symptom, medicine_id, medicine_usage) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(insertQuery, [diseaseData.disease_name_th, diseaseData.disease_name_en, diseaseData.description, diseaseData.symptom, diseaseData.medicine_id, diseaseData.medicine_usage]);

    console.log('Data inserted successfully');
    return NextResponse.json({ message: 'Upload successful', result });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ error: 'Internal Server Error' });
  } finally {
    db.end();
  }
}
