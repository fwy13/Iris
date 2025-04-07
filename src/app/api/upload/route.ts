import { NextResponse } from "next/server";

export type DataQuiz = {
    name: string;
    type: string;
    data: string;
    time: number;
};
export async function POST(req: Request) {
    const payload: DataQuiz = await req.json();
    if (!payload.data || !payload.name || !payload.type || !payload.time)
        return NextResponse.json({ error: true });
    // const data = await prisma.quizs.create({
    //     data: {
    //         id: idExam.rnd(),
    //         name: payload.name,
    //         data: payload.data,
    //         time: payload.time,
    //         count: 0,
    //     },
    // });
    return NextResponse.json({
        error: false,
        message: "Thành công!",
        data: "data",
    });
}
