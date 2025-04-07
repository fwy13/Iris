import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ error: true });
    const user = await prisma.emailStatus.findFirst({
        where: {
            email: email,
        }
    })
    if (!user) return NextResponse.json({ error: true });
    if (user.code !== Number(code)) return NextResponse.json({ error: true, msg: "Xác minh thất bại!" });
    await prisma.emailStatus.update({
        where: {
            email: email,
        },
        data: {
            status: "TRUE",
            code: 0
        }
    })
    return NextResponse.json({ error: false, msg: "Xác minh thành công!" });
}