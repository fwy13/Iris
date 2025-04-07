import { prisma } from "@/db/prisma";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import { ReCreateToken } from "@/utils/ReCreateToken";

export async function GET(req: NextRequest) {
    const cookie = req.cookies.get("rememberToken");
    if (!cookie) return NextResponse.json({ error: true });
    const verify = await verifyToken(cookie.value);
    if (!verify) return NextResponse.json({ error: true });

    const user = await prisma.user.findFirst({ where: { id: verify.id } });
    const jwtToken = await ReCreateToken(user!.id, user!.email, user!   .name);
    const userComfirm = await prisma.emailStatus.findFirst({ where: { email: user!.email } });
    const response = NextResponse.json({
        error: false,
        id: user!.id,
        name: user!.name,
        email: user!.email,
        isComfirm: userComfirm?.status === "TRUE" ? true : false
    })
    response.cookies.set({
        name: "rememberToken",
        value: jwtToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'strict'
    })
    return response;
}
