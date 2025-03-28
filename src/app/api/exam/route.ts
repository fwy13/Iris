import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        data: await prisma.quizs.findMany(),
    });
}