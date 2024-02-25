import { NextResponse } from "next/server";
import { mysqlQueryAll } from "@/database/_getData";
import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port,
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const param = searchParams.get("search");
    let result;
    if (param) {
      const queryString = `SELECT disease_id, disease_name_th, disease_name_en, description, symptom, ifNULL(medicine_name, 'ปัจจุบันยังไม่มียารักษา') as medicine, medicine_usage FROM disease LEFT OUTER JOIN medicine ON disease.medicine_id = medicine.medicine_id WHERE disease_id LIKE ? OR disease_name_th LIKE ? OR disease_name_en LIKE ?`;
      const values = [`%${param}%`, `%${param}%`, `%${param}%`];
      [result] = await db.execute(queryString, values);
    } else {
      const queryString = `SELECT disease_id, disease_name_th, disease_name_en, description, symptom, ifNULL(medicine_name, 'ปัจจุบันยังไม่มียารักษา') as medicine, medicine_usage FROM disease LEFT OUTER JOIN medicine ON disease.medicine_id = medicine.medicine_id`;
      [result] = await db.execute(queryString, []);
    }
    return NextResponse.json(result);
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function PUT(req, res) {
  try {
    const data = await req.json();
    console.log(data);
    const queryString = `UPDATE disease SET disease_name_th = ?, disease_name_en = ?, description = ?, symptom = ?, medicine_id = ?, medicine_usage = ? WHERE disease_id = ?`;
    const values = [data.disease_name_th, data.disease_name_en, data.description, data.symptom, data.medicine_id, data.medicine_usage, data.disease_id];
    await db.execute(queryString, values);
    return NextResponse.json({ message: 'ok' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export async function DELETE(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const param = searchParams.get("id");
    const queryString = `DELETE FROM disease WHERE disease_id = ?`;
    const values = [param];
    await db.execute(queryString, values);
    return NextResponse.json({ message: 'ok' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}