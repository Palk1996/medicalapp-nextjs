import { NextResponse } from "next/server";
import { mysqlQueryAll } from "@/database/_getData";

export async function GET(req) {
  const medicineQuery = await mysqlQueryAll("medicine");
  return NextResponse.json(medicineQuery);
}