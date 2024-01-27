import { NextResponse } from "next/server";
import { mysqlQueryAll } from "@/database/_getData";

export async function GET(req) {
  const medicineTypeQuery = await mysqlQueryAll("medicine_type");
  return NextResponse.json(medicineTypeQuery);
}