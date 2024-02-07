import { NextResponse } from "next/server";
import { mysqlQueryAll } from "@/database/_getData";
import mysql from 'mysql2/promise';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const param = searchParams.get("search");
  if (param) {
    const db = await mysql.createConnection({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database,
      port: process.env.port,
    });
    try {
      const queryString = `SELECT * FROM medicine WHERE medicine_id LIKE ? OR medicine_name LIKE ?`;
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
    const medicineQuery = await mysqlQueryAll("medicine");
    return NextResponse.json(medicineQuery);
  }
}