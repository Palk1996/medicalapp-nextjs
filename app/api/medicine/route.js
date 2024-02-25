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
      const queryString = `SELECT medicine_id, medicine_name, type_name FROM medicine LEFT JOIN medicine_type ON medicine.type_id = medicine_type.type_id WHERE medicine_id LIKE ? OR medicine_name LIKE ?`;
      const values = [`%${param}%`, `%${param}%`];
      [result] = await db.execute(queryString, values);
    } else {
      const queryString = `SELECT medicine_id, medicine_name, type_name FROM medicine LEFT JOIN medicine_type ON medicine.type_id = medicine_type.type_id`;
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
    const queryString = `UPDATE medicine SET medicine_name = ?, type_id = ? WHERE medicine_id = ?`;
    const values = [data.medicine_name, data.type_id, data.medicine_id];
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
    const queryString = `DELETE FROM medicine WHERE medicine_id = ?`;
    const values = [param];
    await db.execute(queryString, values);
    return NextResponse.json({ message: 'ok' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}