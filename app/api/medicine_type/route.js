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