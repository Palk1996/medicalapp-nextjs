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
  const { searchParams } = new URL(req.url);
  const param = searchParams.get("search");
  if (param) {

    try {
      const queryString = `SELECT * FROM medicine_type WHERE type_id LIKE ? OR type_name LIKE ?`;
      const values = [`%${param}%`, `%${param}%`];
      const [result] = await db.execute(queryString, values);
      return NextResponse.json(result);
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    } finally {
      db.end();
    }
  } else {
    const medicineTypeQuery = await mysqlQueryAll("medicine_type");
    return NextResponse.json(medicineTypeQuery);
  }
}

export async function PUT(req, res) {
  try {
    const data = await req.json();
    console.log(data);
    const queryString = `UPDATE medicine_type SET type_name = ? WHERE type_id = ?`;
    const values = [data.type_name, data.type_id];
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
    const queryString = `DELETE FROM medicine_type WHERE type_id = ?`;
    const values = [param];
    await db.execute(queryString, values);
    return NextResponse.json({ message: 'ok' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}