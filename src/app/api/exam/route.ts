import { addData } from "@/db/addData";
import { NextResponse } from "next/server";

export async function GET() {

    await addData();
    return NextResponse.json({
        error: false,
        data: [],
    })
}