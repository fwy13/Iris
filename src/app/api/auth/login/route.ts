import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ReCreateToken } from "@/utils/ReCreateToken";

// async function checkCaptcha(token: string): Promise<boolean> {
//     const formData = new FormData();
//     formData.append("secret", process.env.TURNSTILE_SECRET);
//     formData.append("response", token);
//     const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
//     const result = await fetch(url, {
//         body: formData,
//         method: "POST",
//     }).then(res => res.json());
//     return result.success;
// }

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: true, msg: "Vui lọc nhập đủ thông tin!" });
    // const isCheck = await checkCaptcha(token);
    // if (!isCheck) return NextResponse.json({ error: true, msg: "Sai CAPTCHA!" });
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