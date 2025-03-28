import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    params: { params: Promise<{ id: string[] }> }
) {
    const id = (await params.params).id;
    if (!id[0]) return NextResponse.json({ error: true });
    const data = await prisma.quizs.findFirst({
        where: {
            id: id[0],
        },
    });
    if (!data?.id) return NextResponse.json({ error: true });
    return NextResponse.json({
        error: false,
        data: data,
    });
}
