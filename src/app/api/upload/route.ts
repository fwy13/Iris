import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";

export type DataQuiz = {
    name: string;
    type: string;
    data: string;
    time: number;
};
export async function POST(req: Request) {
    const payload: DataQuiz = await req.json();
    const idExam = new ShortUniqueId({ length: 10 });
    if (!payload.data || !payload.name || !payload.type || !payload.time)
        return NextResponse.json({ error: true });
    const data = await prisma.quizs.create({
        data: {
            id: idExam.rnd(),
            name: payload.name,
            data: payload.data,
            time: payload.time,
            count: 0,
        },
    });
    return NextResponse.json({
        error: false,
        message: "Thành công!",
        data: data,
    });
}
