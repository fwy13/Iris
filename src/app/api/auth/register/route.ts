import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";
import jwt from "jsonwebtoken"
import { prisma } from "@/db/prisma";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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

async function sendCodeVerifyEmail(email: string) {
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: process.env.NODE_ENV === 'production' ? 465 : 587,
        secure: process.env.NODE_ENV === 'production',
        auth: {
            user: process.env.EMAIL_USER,

            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Xác minh Email',
        html: `
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333; text-align: center;">Xác minh Emai cho Roxy</h1>
            <div style="background-color: #e6e6e6; padding: 15px; border: 1px solid #eee; border-radius: 5px; margin-bottom: 20px;">
                <h2 style="font-size: 1.2em; color: #333; margin: 0;">Mã xác minh của bạn là: ${verificationCode}</h2>
            </div>
            <p style="font-size: 1em; color: #777;">Nếu bạn không yêu cầu xác minh email này, vui lòng bỏ qua email này. Liên kết này sẽ hết hạn sau một khoảng thời gian nhất định!</p>
            <p style="color: #555;">Cảm ơn vì đã sử dụng dịch vụ. Trân Trọng, Roxy!</p>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        await prisma.emailStatus.create({
            data: {
                code: Number(verificationCode),
                email: email,
            }
        })
    } catch (error) {
        console.error('Lỗi gửi email:', error);
    }
}


export async function POST(req: NextRequest) {
    const { email, password, fullName, tokenCaptcha } = await req.json();
    if (!email || !password || !fullName || !tokenCaptcha) return NextResponse.json({ error: true, msg: "Vui lòng nhập đủ thông tin!" });
    // const isCheck = await checkCaptcha(tokenCaptcha);
    // if (!isCheck) return NextResponse.json({ error: true, msg: "Sai CAPTCHA!" });

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if (user) return NextResponse.json({ error: true, msg: "Email đã tồn tại!" });
    const uuid = new ShortUniqueId({ length: 10 }).rnd()
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const token = await jwt.sign({ email: email, id: uuid, name: fullName }, process.env.JWT_SECRET!, { expiresIn: "30d" });
    const data = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            name: fullName,
            id: uuid,
            token: token
        }
    });
    if (!data) return NextResponse.json({ error: true, msg: "Có lỗi khi đăng ký!" });
    await sendCodeVerifyEmail(email);
    const response = NextResponse.json({
        error: false, data: {
            token: token,
            id: uuid,
            email: email,
            name: fullName
        }
    })
    response.cookies.set({
        name: "rememberToken",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'strict'
    });
    return response;
}