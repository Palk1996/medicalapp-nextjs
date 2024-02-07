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
        } finally {
            db.end();
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