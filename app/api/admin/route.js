import { NextResponse } from "next/server";
import { mysqlQueryAll } from "@/database/_getData";

export async function GET(req) {
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