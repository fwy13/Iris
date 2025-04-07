import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ReCreateToken } from "@/utils/ReCreateToken";

async function checkCaptcha(token: string): Promise<boolean> {
    const params = new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET,
        response: token
    });
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: params
    }).then(res => res.json());
    return res.success;
}

export async function POST(req: NextRequest) {
    const { email, password, token } = await req.json();
    if (!email || !password || !token) return NextResponse.json({ error: true, msg: "Vui lọc nhập đủ thông tin!" });
    const isCheck = await checkCaptcha(token);
    if (!isCheck) return NextResponse.json({ error: true, msg: "Sai CAPTCHA!" });
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });
    if (!user) return NextResponse.json({ error: true, msg: "Email không đúng. Vui lòng kiểm tra lại!" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ error: true, msg: "Sai mật khẩu. Vui lòng nhập lại!" });
    }
    const userComfirm = await prisma.emailStatus.findFirst({
        where: {
            email: user.email
        }
    })
    const jwtToken = await ReCreateToken(user.id, user.email, user.name);
    const response = NextResponse.json({
        error: false,
        data: {
            token: jwtToken,
            id: user.id,
            email: user.email,
            name: user.name,
            isComfirm: userComfirm?.status === "TRUE" ? true : false
        }
    });
    response.cookies.set({
        name: "rememberToken",
        value: jwtToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'strict'
    });

    return response;
}