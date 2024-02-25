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
            const queryString = `SELECT * FROM admin WHERE email LIKE ? OR username LIKE ? OR telephone LIKE ?`;
            const values = [`%${param}%`, `%${param}%`, `%${param}%`];
            const [result] = await db.execute(queryString, values);
            const formattedAdminQuery = result.map((admin) => {
                const originalBirthdate = new Date(admin.birthdate);
                const formattedBirthdate = `${originalBirthdate.getFullYear()}-${String(
                    originalBirthdate.getMonth() + 1
                ).padStart(2, "0")}-${String(originalBirthdate.getDate()).padStart(2, "0")}`;

                return { ...admin, birthdate: formattedBirthdate };
            });
            return NextResponse.json(formattedAdminQuery);
        } catch (error) {
            console.log(error.message);
            throw new Error(error.message);
        }
    } else {
        const adminQuery = await mysqlQueryAll("admin");

        const formattedAdminQuery = adminQuery.map((admin) => {
            const originalBirthdate = new Date(admin.birthdate);
            const formattedBirthdate = `${originalBirthdate.getFullYear()}-${String(
                originalBirthdate.getMonth() + 1
            ).padStart(2, "0")}-${String(originalBirthdate.getDate()).padStart(2, "0")}`;

            return { ...admin, birthdate: formattedBirthdate };
        });

        return NextResponse.json(formattedAdminQuery);
    }
}

export async function PUT(req, res) {
    try {
        const data = await req.json();
        console.log(data);
        const queryString = `UPDATE admin SET username = ?, first_name = ?, last_name = ?, password = ?, email = ?, telephone = ?, gender = ?, birthdate = ?, role = ?, status = ? WHERE admin_id = ?`;
        const values = [
            data.username,
            data.first_name,
            data.last_name,
            data.password,
            data.email,
            data.telephone,
            data.gender,
            data.birthdate,
            data.role,
            data.status,
            data.admin_id
        ];
        await db.execute(queryString, values);
        return NextResponse.json({ message: 'Admin information updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' });
    }
}

export async function DELETE(req, res) {
    try {
      const { searchParams } = new URL(req.url);
      const param = searchParams.get("id");
      const queryString = `DELETE FROM admin WHERE admin_id = ?`;
      const values = [param];
      await db.execute(queryString, values);
      return NextResponse.json({ message: 'ok' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' });
    }
  }