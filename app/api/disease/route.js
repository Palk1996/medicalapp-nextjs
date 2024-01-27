import { NextResponse } from "next/server";
import { mysqlQueryAll } from "@/database/_getData";

export async function GET(req) {
  const diseaseQuery = await mysqlQueryAll("disease");
  return NextResponse.json(diseaseQuery);
}